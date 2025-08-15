import sg from '@sendgrid/mail';
import { SENDGRID_API_KEY, FROM_EMAIL } from './config.js';
sg.setApiKey(SENDGRID_API_KEY || '');

export async function sendEmail({ to, subject, text, html, attachments }) {
  if (!SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY missing: email skipped');
    return;
  }
  await sg.send({
    to, from: FROM_EMAIL, subject, text, html, attachments
  });
}
