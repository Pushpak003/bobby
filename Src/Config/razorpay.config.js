const Razorpay = require("razorpay");
require("dotenv").config();

const instance = new Razorpay({
  key_id: "rzp_test_JdwflhkotrhrSP",
  key_secret: "tQFra7V9v8NwBmDWUQS15z9Z",
});

module.exports = instance;
