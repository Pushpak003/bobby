const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  handleWebhook
} = require("../controllers/payment.controller");

router.post("/initiate-payment", initiatePayment);
router.post("/payment-webhook", express.json({ type: "application/json" }), handleWebhook);

module.exports = router;
