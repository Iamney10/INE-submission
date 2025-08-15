import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export function generateInvoicePDF({ seller, buyer, auction, amount }) {
  const doc = new PDFDocument({ margin: 50 });
  const stream = new Readable({ read(){} });
  const chunks = [];
  doc.on('data', (c) => chunks.push(c));
  doc.on('end', () => {
    const buf = Buffer.concat(chunks);
    stream.push(buf);
    stream.push(null);
  });

  doc.fontSize(20).text('Invoice', { align: 'center' }).moveDown();
  doc.fontSize(12).text(`Auction: ${auction.itemName} (#${auction.id})`);
  doc.text(`Seller: ${seller.email}`);
  doc.text(`Buyer: ${buyer.email}`);
  doc.text(`Amount: ₹${amount}`);
  doc.moveDown().text(`Description: ${auction.description || '-'}`);
  doc.end();

  return new Promise((resolve) => {
    const bufs = [];
    stream.on('data', d => bufs.push(d));
    stream.on('end', () => resolve(Buffer.concat(bufs)));
  });
}
