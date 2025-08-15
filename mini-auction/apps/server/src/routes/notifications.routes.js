import { Router } from 'express';
import { Notification } from '../models/index.js';
import { requireAuth } from '../auth.js';

const r = Router();

r.get('/', requireAuth, async (req, res) => {
  const list = await Notification.findAll({ where: { userId: req.user.id }, order: [['createdAt','DESC']] });
  res.json(list);
});

export default r;
