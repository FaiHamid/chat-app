import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
    tls: {
    rejectUnauthorized: false 
  }
});

export const send = (email, subject, html) => {
  return transporter.sendMail({
    to: email,
    subject,
    html, 
  });
}

export const sendActionToken = (email, activationToken) => {
  const activationHref = `${process.env.CLIENT_HOST}/activate/${activationToken}`
  
  const html  = `
    <h1>Activate your account</h1>
    <a href=${activationHref}>${activationHref}</a>
    `;
    const subject = 'Activate account';
  return send(email, subject, html);

}