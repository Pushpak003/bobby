// src/test/email.test.js
require("dotenv").config(); // Load .env vars
const { sendEmail } = require("../services/email.service");


async function testEmailService() {
  try {
    const to = "hariomvirkhare02@gmail.com"; // <-- yaha tu apna email daal
    const subject = "🎉 Test Email from Backend";
    const html = `
      <h2>Hi Rockstar Developer 👨‍💻</h2>
      <p>This is a <strong>test email</strong> from your Nodemailer service.</p>
      <p>Keep building amazing things! 🚀</p>
    `;

    await sendEmail(to, subject, html);
    console.log("✅ Test Email sent successfully.");
  } catch (err) {
    console.error("❌ Email Test Failed:", err.message);
  }
}

testEmailService();
