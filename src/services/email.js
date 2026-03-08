const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html
  });
}

const ipCooldown = new Map();
const TEN_MINUTES = 10 * 60 * 1000;

async function sendEmailViaBridge({ to, subject, text, html, ip }) {
  const now = Date.now();

  const lastSend = ipCooldown.get(ip);
  if (lastSend && now - lastSend < TEN_MINUTES) {
    throw new Error("Troppi invii da questo IP. Attendi 10 minuti.");
  }

  const fetch = (await import("node-fetch")).default;

  const res = await fetch(process.env.EMAIL_BRIDGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.EMAIL_BRIDGE_SECRET}`
    },
    body: JSON.stringify({ to, subject, text, html })
  });

  if (!res.ok) throw new Error("Errore invio email via bridge");

  ipCooldown.set(ip, now);
}
module.exports = { sendEmail, sendEmailViaBridge };