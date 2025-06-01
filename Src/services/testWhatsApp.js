const path = require("path");
const dotenv = require("dotenv");
const { sendWhatsApp } = require("./whatsapp.service");

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function testWhatsApp() {
  try {
    // Verify environment variables are loaded
    if (
      !process.env.TWILIO_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.TWILIO_PHONE
    ) {
      throw new Error("Missing required Twilio environment variables");
    }

    // Log environment variables (sanitized)
    console.log(
      "🔑 Twilio SID:",
      process.env.TWILIO_SID ? "✓ Present" : "❌ Missing"
    );
    console.log(
      "🔐 Twilio Auth:",
      process.env.TWILIO_AUTH_TOKEN ? "✓ Present" : "❌ Missing"
    );
    console.log("📱 Twilio Phone:", process.env.TWILIO_PHONE);

    const phone = "+916261598793"; // Your test phone number
    const name = "Aman";

    console.log("📤 Sending test message...");
    const result = await sendWhatsApp(phone, name );
    console.log("✅ Test passed:", result.sid);
  } catch (err) {
    console.error("❌ Test failed:", err.message);
    process.exit(1);
  }
}

testWhatsApp();
