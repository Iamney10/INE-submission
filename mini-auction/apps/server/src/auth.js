import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET } from './config.js';
import { User } from './models/index.js';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function authMiddleware(req, _res, next) {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
  if (!token) return next();
  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch {}
  next();
}

export async function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

export async function register(email, password) {
  const exists = await User.findOne({ where: { email } });
  if (exists) throw new Error('Email already used');
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash: hash, role: 'user' });
  return { user, token: signToken({ id: user.id, email, role: user.role }) };
}

export async function login(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error('Invalid credentials');
  return { user, token: signToken({ id: user.id, email, role: user.role }) };
}
