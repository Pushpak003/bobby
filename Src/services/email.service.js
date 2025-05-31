const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email to user after successful registration/payment
 * @param {string} to - recipient email
 * @param {string} name - user name
 */
const sendEmail = async (to, name) => {
  const mailOptions = {
    from: `"MaxNet Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🎉 Registration Successful - Welcome to MaxNet!",
    html: `
      <h3>Hello ${name},</h3>
      <p>Thank you for registering with us. Your payment has been received successfully.</p>
      <p>Welcome aboard! We're glad to have you.</p>
      <br>
      <strong>MaxNet Team</strong>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    throw err;
  }
};

module.exports = {
  sendEmail,
};
