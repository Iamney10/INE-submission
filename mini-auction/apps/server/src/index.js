import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { PORT } from './config.js';
import { sequelize, User, Auction } from './models/index.js';
import { initSocket } from './socket.js';
import { authMiddleware, requireAuth, signToken } from './auth.js';
import { redis, highestBidKey } from './redis.js';
import { endsAt, isLive } from './utils/time.js';
import { generateInvoicePDF } from './pdf.js';
import { sendEmail } from './email.js';

import authRoutes from './routes/auth.routes.js';
import auctionsRoutes from './routes/auctions.routes.js';
import bidsRoutes from './routes/bids.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();
const server = http.createServer(app);
const { emitAuction, emitUser } = initSocket(server, ['http://localhost:5173', process.env.PUBLIC_URL].filter(Boolean));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionsRoutes({ emitAuction, emitUser }));
app.use('/api/bids', bidsRoutes({ emitAuction, emitUser }));
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin', adminRoutes);

// serve built frontend (copied during Docker build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webDist = path.join(__dirname, '../dist-web');
app.use(express.static(webDist));
app.get('*', (_req, res) => res.sendFile(path.join(webDist, 'index.html')));

// lifecycle: schedule status updates & end auctions
async function tickAuctions() {
  const all = await Auction.findAll();
  const now = new Date();
  for (const a of all) {
    // go live
    if (a.status === 'scheduled' && now >= new Date(a.goLiveAt)) {
      a.status = 'live'; await a.save(); emitAuction(a.id, 'auction-live', { auctionId: a.id });
    }
    // end
    if (a.status === 'live' && now >= endsAt(a)) {
      a.status = 'ended'; await a.save();
      const hb = JSON.parse((await redis.get(highestBidKey(a.id))) || 'null');
      emitAuction(a.id, 'auction-ended', { auctionId: a.id, highest: hb });
    }
  }
}
setInterval(() => tickAuctions().catch(console.error), 2000);

// hook: when seller/buyer finalizes acceptance, email + invoice
app.post('/api/auctions/:id/finalize', requireAuth, async (req, res) => {
  const a = await Auction.findByPk(req.params.id);
  if (!a) return res.status(404).json({ error: 'Not found' });
  const hb = JSON.parse((await redis.get(highestBidKey(a.id))) || 'null');
  if (!hb || !hb.bidderId) return res.status(400).json({ error: 'No winner' });

  const seller = await User.findByPk(a.sellerId);
  const buyer = await User.findByPk(hb.bidderId);

  // PDF + email
  const pdf = await generateInvoicePDF({ seller, buyer, auction: a, amount: hb.amount });
  const att = [{ content: pdf.toString('base64'), type: 'application/pdf', filename: `invoice-auction-${a.id}.pdf`, disposition: 'attachment' }];

  await sendEmail({ to: seller.email, subject: 'Auction Sold - Invoice', text: 'Invoice attached', attachments: att });
  await sendEmail({ to: buyer.email, subject: 'Purchase Confirmed - Invoice', text: 'Invoice attached', attachments: att });

  emitUser(seller.id, 'transaction-confirmed', { auctionId: a.id });
  emitUser(buyer.id, 'transaction-confirmed', { auctionId: a.id });

  res.json({ ok: true });
});

// start
(async () => {
  await sequelize.authenticate();
  await sequelize.sync(); // simple for assignment
  server.listen(PORT, () => console.log(`Server on :${PORT}`));
})();
