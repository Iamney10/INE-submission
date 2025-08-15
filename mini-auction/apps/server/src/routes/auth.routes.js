import { Router } from 'express';
import { login, register, signToken } from '../auth.js';

const r = Router();

r.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await register(email, password);
    res.json({ user: { id: user.id, email: user.email }, token });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

r.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await login(email, password);
    res.json({ user: { id: user.id, email: user.email }, token });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

r.get('/me', (req, res) => {
  if (!req.user) return res.json(null);
  res.json(req.user);
});

export default r;
