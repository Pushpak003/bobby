const twilio = require("twilio");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Send WhatsApp message to user
 * @param {string} phone - recipient phone in E.164 format (e.g., +919876543210)
 * @param {string} name - user name
 */
const sendWhatsApp = async (phone, name) => {
  const messageBody = `👋 Hello ${name},\n\n✅ Your payment has been received and your registration is successful.\n\nWelcome to MaxNet! 🎉`;

  try {
    await client.messages.create({
      from: process.env.TWILIO_PHONE,  // e.g., "whatsapp:+14155238886"
      to: `whatsapp:${phone}`,
      body: messageBody,
    });

    console.log(`📲 WhatsApp message sent to ${phone}`);
  } catch (err) {
    console.error("❌ WhatsApp sending failed:", err);
    throw err;
  }
};

module.exports = {
  sendWhatsApp,
};
