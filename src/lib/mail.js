const nodemailer = require("nodemailer");

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "jaqueline.yundt@ethereal.email",
    pass: "p7yMXAsAxJnRtNx8U2",
  },
});

const APP_URL = process.env.APP_URL || "http://localhost:3000";

async function sendVerificationEmail(email, verificationToken) {
  const verificationUrl = `${APP_URL}/verify-email?token=${verificationToken}`;
  await transporter.sendMail({
    from: "noreply@example.com",
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking the link: ${verificationUrl}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Verify your email</h2>
        <p>Thanks for signing up! Please verify your email address by clicking the button below.</p>
        <a
          href="${verificationUrl}"
          style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; margin: 16px 0;"
        >
          Verify Email
        </a>
        <p style="color: #666; font-size: 14px;">
          Or copy and paste this link into your browser:<br/>
          <a href="${verificationUrl}">${verificationUrl}</a>
        </p>
        <p style="color: #999; font-size: 12px;">
          If you did not sign up for ChatApp, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export { transporter, sendVerificationEmail };
