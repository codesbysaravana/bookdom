// lib/sendEmail.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendEmail = async (subject: string, to: string, html?: string) => {
  const msg = {
    to,
    from: process.env.SENDGRID_SENDER!,
    subject,
    text: subject,
    html: html || `<strong>${subject}</strong>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}: ${subject}`);
  } catch (error: any) {
    console.error('❌ Error sending email:', error.response?.body || error.message);
    throw error;
  }
};
