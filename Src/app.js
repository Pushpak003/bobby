const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
// Add this middleware before routes
app.use("/api/payment-webhook", express.raw({ type: "application/json" }));

// Your existing middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/invoices", express.static(path.join(__dirname, "public/invoices")));
// Routes
app.use("/api", require("./routes/payment.routes"));

module.exports = app;
