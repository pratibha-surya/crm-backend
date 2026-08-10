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

export const sendOtpEmail = async (to, otpCode, purpose = "REGISTRATION", tempPassword = "") => {
  try {
    const transporter = createTransporter();

    console.log(`\n=================================================`);
    console.log(`🔑 [OTP SERVICE] Email: ${to} | Purpose: ${purpose}`);
    console.log(`👉 Generated OTP Code: ${otpCode}`);
    if (tempPassword) console.log(`👉 Temporary Password: ${tempPassword}`);
    console.log(`=================================================\n`);

    if (!transporter) {
      console.warn("OTP email not sent because EMAIL_USER/EMAIL_PASS are not configured.");
      return false;
    }

    const isReg = purpose === "REGISTRATION";
    const subject = isReg ? "Welcome to CRM Pro - Activate Your Account" : "CRM Pro - Password Reset OTP";
    
    const htmlContent = isReg 
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; color: #1f2937; line-height: 1.6;">
          <h2 style="color: #4f46e5; margin-bottom: 8px;">Welcome to CRM Pro!</h2>
          <p>Hello,</p>
          <p>Your workspace account has been registered successfully. Here are your temporary login details:</p>
          <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Work Email:</strong> ${to}</p>
            ${tempPassword ? `<p style="margin: 0;"><strong>Temporary Password:</strong> <code style="font-size: 14px; background: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${tempPassword}</code></p>` : ''}
          </div>
          <p>Please enter the following activation OTP code on your first login to verify your email address:</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4f46e5; background-color: #eef2ff; border: 1px dashed #c7d2fe; padding: 8px 24px; border-radius: 8px; font-family: monospace;">${otpCode}</span>
          </div>
          <p style="font-size: 11px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 24px;">This code is valid for 10 minutes. For security, please change your password after logging into your dashboard.</p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; color: #1f2937; line-height: 1.6;">
          <h2 style="color: #4f46e5; margin-bottom: 8px;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Use the verification OTP code below to proceed:</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4f46e5; background-color: #eef2ff; border: 1px dashed #c7d2fe; padding: 8px 24px; border-radius: 8px; font-family: monospace;">${otpCode}</span>
          </div>
          <p style="font-size: 11px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 24px;">This code is valid for 10 minutes. If you did not request this, you can safely ignore this email.</p>
        </div>
      `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent
    });

    return true;
  } catch (error) {
    console.error("❌ Failed to send OTP email dynamically via SMTP:", error.message);
    return false;
  }
};
