const twilio = require("twilio");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Validate environment variables
const requiredEnvVars = ["TWILIO_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE"];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Send WhatsApp message to user
 * @param {string} phone - recipient phone in E.164 format (e.g., +919876543210)
 * @param {string} name - user name
 * @param {string} [invoiceUrl] - path to invoice PDF file
 */
const sendWhatsApp = async (phone, name, invoiceUrl) => {
  try {
    // Format phone number
    if (!phone.match(/^\+\d{12}$/)) {
      throw new Error(`Invalid phone number format: ${phone}`);
    }

    // Remove 'whatsapp:' prefix if it exists
    const twilioPhone = process.env.TWILIO_PHONE.replace("whatsapp:", "");

    console.log(`📱 Preparing to send WhatsApp to: ${phone}`);
    console.log(`📞 Using Twilio phone: ${twilioPhone}`);

    // Send initial message
    const messageBody = `👋 Hello ${name},\n\n✅ Your payment has been received and your registration is successful.\n\nWelcome to MaxNet! 🎉`;

    const message = await client.messages.create({
      from: `whatsapp:${twilioPhone}`,
      to: `whatsapp:${phone}`,
      body: messageBody,
    });

    console.log(`📲 Initial WhatsApp message sent (SID: ${message.sid})`);

    // If invoice exists, send it as second message
    if (invoiceUrl) {
      console.log(`📄 Invoice path provided: ${invoiceUrl}`);

      console.log("📎 Sending invoice via WhatsApp...");

      // For Twilio WhatsApp, you need a publicly accessible URL
      // You have a few options:

      // Option 1: If you have EXPRESS_PUBLIC_URL set up to serve static files

      if (invoiceUrl) {
        console.log(`📄 Invoice URL provided: ${invoiceUrl}`);

        await client.messages.create({
          from: `whatsapp:${twilioPhone}`,
          to: `whatsapp:${phone}`,
          body: `📄 Thank you ${name}, your invoice is ready:\n${invoiceUrl}`,
        });

        console.log("✅ Invoice sent via WhatsApp with Cloudinary link");
      }

      // Option 2: Upload to cloud storage and get public URL
      else {
        // For now, just send a message that invoice is attached to email
        await client.messages.create({
          from: `whatsapp:${twilioPhone}`,
          to: `whatsapp:${phone}`,
          body: `📄 Your invoice has been sent to your email address. Please check your inbox!Your invoice is here:\n${invoiceUrl}`,
        });

        console.log("✅ Invoice notification sent via WhatsApp");
      }
    }

    return message;
  } catch (err) {
    console.error("❌ WhatsApp sending failed:", err);

    // Log more details for debugging
    if (err.code) {
      console.error(`Error code: ${err.code}`);
    }
    if (err.moreInfo) {
      console.error(`More info: ${err.moreInfo}`);
    }

    throw err;
  }
};

/**
 * Test function to check Twilio configuration
 */
const testTwilioConfig = () => {
  console.log("🔧 Testing Twilio Configuration:");
  console.log("TWILIO_SID:", process.env.TWILIO_SID ? "✅ Set" : "❌ Missing");
  console.log(
    "TWILIO_AUTH_TOKEN:",
    process.env.TWILIO_AUTH_TOKEN ? "✅ Set" : "❌ Missing"
  );
  console.log("TWILIO_PHONE:", process.env.TWILIO_PHONE || "❌ Missing");
  console.log(
    "EXPRESS_PUBLIC_URL:",
    process.env.EXPRESS_PUBLIC_URL || "❌ Not set (optional)"
  );
};

module.exports = {
  sendWhatsApp,
  testTwilioConfig,
};
