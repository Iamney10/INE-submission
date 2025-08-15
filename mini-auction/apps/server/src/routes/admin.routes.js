import { Router } from 'express';
import { Auction, Bid, User } from '../models/index.js';
import { requireAuth } from '../auth.js';

const r = Router();

r.use(requireAuth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
});

r.get('/auctions', async (_req, res) => {
  const list = await Auction.findAll({ include: [User] });
  res.json(list);
});

r.post('/auctions/:id/start', async (req, res) => {
  const a = await Auction.findByPk(req.params.id);
  if (!a) return res.status(404).json({ error: 'Not found' });
  a.status = 'live'; await a.save();
  res.json(a);
});

r.post('/auctions/:id/reset', async (req, res) => {
  const a = await Auction.findByPk(req.params.id);
  if (!a) return res.status(404).json({ error: 'Not found' });
  a.status = 'scheduled'; await a.save();
  res.json(a);
});

export default r;
