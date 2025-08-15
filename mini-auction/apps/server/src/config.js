import 'dotenv/config';

export const PORT = process.env.PORT || 8080;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
export const DATABASE_URL = process.env.DATABASE_URL;
export const REDIS_URL = process.env.REDIS_URL;
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@example.com';
export const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
