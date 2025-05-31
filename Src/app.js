const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use("/api", require("./routes/payment.routes"));

module.exports = app;
