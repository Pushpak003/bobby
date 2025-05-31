const razorpay = require("../Config/razorpay.config");
const pool = require("../config/db");
const crypto = require("crypto");
const { sendEmail } = require("../services/email.service");
const { sendWhatsApp } = require("../services/whatsapp.service");
const dotenv  = require("dotenv");
dotenv.config(); // Load environment variables

// Step 1: Initiate payment
exports.initiatePayment = async (req, res) => {
  const { amount, receipt, notes } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt,
      notes,
    });

    res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Payment initiation failed:", err);
    res.status(500).send("Payment initiation error");
  }
};

// Step 2: Handle Razorpay webhook
exports.handleWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const receivedSignature = req.headers["x-razorpay-signature"];
  const body = JSON.stringify(req.body);

  console.log("🔔 Received webhook event from Razorpay");

  // Validate signature
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (receivedSignature !== expectedSignature) {
    console.warn("❌ Webhook signature mismatch");
    return res.status(400).send("Invalid signature");
  }

  console.log("✅ Signature verified");

  const payment = req.body.payload.payment.entity;

  if (payment.status === "captured") {
    console.log("💰 Payment captured, proceeding to save user...");

    try {
      const userData = payment.notes;

      console.log("📥 Extracted user data from payment notes:", userData);

      // Insert user into DB
      await pool.query(
        `INSERT INTO users (form_number, name, dob, gender, aadhar_no, contact_no, address, city)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          userData.form_number,
          userData.name,
          userData.dob,
          userData.gender,
          userData.aadhar_no,
          userData.contact_no,
          userData.address,
          userData.city,
        ]
      );

      console.log("✅ User inserted into database");

      // Send email
      await sendEmail(userData.email, userData.name);
      console.log("📧 Email sent to:", userData.email);

      // Send WhatsApp
      await sendWhatsApp(userData.contact_no, userData.name);
      console.log("📱 WhatsApp message sent to:", userData.contact_no);

      res.status(200).json({ message: "Webhook processed, user inserted" });
    } catch (err) {
      console.error("❌ Error during DB insert or notification:", err);
      res.status(500).send("DB insert failed");
    }
  } else {
    console.log("⚠️ Payment not captured, ignoring");
    res.status(200).send("Ignored - not captured");
  }
};
