import nodemailer from "nodemailer";

const createTransporter = () => {
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    }
  });
};

export const sendOtpEmail = async (to, otpCode) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn("OTP email not sent because EMAIL_USER/EMAIL_PASS are not configured.");
    return false;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: "CRM Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Your OTP for password reset is:</p>
        <h1 style="letter-spacing: 4px;">${otpCode}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      </div>
    `
  });

  return true;
};
