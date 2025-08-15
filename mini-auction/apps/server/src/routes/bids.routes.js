import { Router } from 'express';
import { requireAuth } from '../auth.js';
import { Auction, Bid, User } from '../models/index.js';
import { redis, highestBidKey } from '../redis.js';
import { isLive } from '../utils/time.js';

export default function bidsRoutes(socketBus) {
  const r = Router();

  r.post('/', requireAuth, async (req, res) => {
    const { auctionId, amount } = req.body;
    const a = await Auction.findByPk(auctionId);
    if (!a) return res.status(404).json({ error: 'Auction not found' });
    if (!isLive(a)) return res.status(400).json({ error: 'Auction not active' });

    // Redis highest check
    const key = highestBidKey(a.id);
    const hb = JSON.parse((await redis.get(key)) || `{"amount":${a.startingPrice},"bidderId":null}`);
    const minAllowed = hb.amount + a.bidIncrement;
    if (amount < minAllowed) {
      return res.status(400).json({ error: `Bid must be >= ${minAllowed}` });
    }

    // Persist
    const bid = await Bid.create({ auctionId: a.id, bidderId: req.user.id, amount });
    await redis.set(key, JSON.stringify({ amount, bidderId: req.user.id }));

    // Notify rooms
    socketBus.emitAuction(a.id, 'new-bid', { amount, bidderId: req.user.id, auctionId: a.id });

    // Outbid notify
    if (hb.bidderId && hb.bidderId !== req.user.id) {
      socketBus.emitUser(hb.bidderId, 'outbid', { auctionId: a.id, yourPrevBid: hb.amount, newBid: amount });
    }

    res.json({ ok: true, bid });
  });

  // Accept/Reject Counter-offer by buyer
  r.post('/counter/:auctionId/accept', requireAuth, async (req, res) => {
    const { auctionId } = req.params;
    const a = await Auction.findByPk(auctionId);
    if (!a) return res.status(404).json({ error: 'Auction not found' });
    const hb = JSON.parse((await redis.get(highestBidKey(a.id))) || 'null');
    if (!hb || hb.bidderId !== req.user.id) return res.status(403).json({ error: 'Not highest bidder' });

    a.sellerDecision = 'accepted'; a.status = 'closed'; await a.save();
    socketBus.emitAuction(a.id, 'counter-accepted', { auctionId: a.id, price: hb.amount, buyerId: req.user.id });
    res.json({ ok: true });
  });

  r.post('/counter/:auctionId/reject', requireAuth, async (req, res) => {
    const { auctionId } = req.params;
    const a = await Auction.findByPk(auctionId);
    if (!a) return res.status(404).json({ error: 'Auction not found' });
    const hb = JSON.parse((await redis.get(highestBidKey(a.id))) || 'null');
    if (!hb || hb.bidderId !== req.user.id) return res.status(403).json({ error: 'Not highest bidder' });

    a.sellerDecision = 'rejected'; a.status = 'closed'; await a.save();
    socketBus.emitAuction(a.id, 'counter-rejected', { auctionId: a.id, buyerId: req.user.id });
    res.json({ ok: true });
  });

  return r;
}
