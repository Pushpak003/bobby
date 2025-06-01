const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  handleWebhook
} = require("../controllers/payment.controller");

router.post("/initiate-payment", initiatePayment);

// Use raw body parser for webhook to preserve original body for signature verification
router.post("/payment-webhook", 
  express.raw({ type: "application/json" }), 
  handleWebhook
);

module.exports = router;