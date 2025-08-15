import { Router } from 'express';
import { Auction, Bid, User, CounterOffer } from '../models/index.js';
import { auctionSchema } from '../utils/validators.js';
import { requireAuth } from '../auth.js';
import { redis, highestBidKey } from '../redis.js';
import { endsAt, isLive } from '../utils/time.js';

export default function auctionsRoutes(socketBus) {
  const r = Router();

  r.post('/', requireAuth, async (req, res) => {
    const parsed = auctionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
    const a = await Auction.create({ ...parsed.data, sellerId: req.user.id });
    await redis.set(highestBidKey(a.id), JSON.stringify({ amount: a.startingPrice, bidderId: null }));
    res.json(a);
  });

  r.get('/', async (_req, res) => {
    const list = await Auction.findAll({ order: [['createdAt','DESC']], include: [{ model: User, as: 'seller', attributes: ['id','email'] }] });
    res.json(list);
  });

  r.get('/:id', async (req, res) => {
    const a = await Auction.findByPk(req.params.id, { include: [{ model: User, as: 'seller', attributes: ['id','email'] }] });
    if (!a) return res.status(404).json({ error: 'Not found' });
    const hb = await redis.get(highestBidKey(a.id));
    res.json({ auction: a, highest: hb ? JSON.parse(hb) : null, endsAt: endsAt(a) });
  });

  // Seller decision endpoints
  r.post('/:id/accept', requireAuth, async (req, res) => {
    const a = await Auction.findByPk(req.params.id);
    if (!a || a.sellerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    a.sellerDecision = 'accepted'; a.status = 'closed'; await a.save();
    socketBus.emitAuction(a.id, 'seller-decision', { decision: 'accepted' });
    res.json(a);
  });

  r.post('/:id/reject', requireAuth, async (req, res) => {
    const a = await Auction.findByPk(req.params.id);
    if (!a || a.sellerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    a.sellerDecision = 'rejected'; a.status = 'closed'; await a.save();
    socketBus.emitAuction(a.id, 'seller-decision', { decision: 'rejected' });
    res.json(a);
  });

  r.post('/:id/counter', requireAuth, async (req, res) => {
    const a = await Auction.findByPk(req.params.id);
    if (!a || a.sellerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    const { price, buyerId } = req.body;
    const co = await CounterOffer.create({ price, auctionId: a.id, sellerId: req.user.id, buyerId });
    a.sellerDecision = 'countered'; await a.save();
    socketBus.emitAuction(a.id, 'counter-offer', { price, buyerId, auctionId: a.id });
    res.json(co);
  });

  return r;
}
