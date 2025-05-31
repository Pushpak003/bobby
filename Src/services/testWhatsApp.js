require("dotenv").config(); 

const { sendWhatsApp } = require("./whatsapp.service");

(async () => {
  try {
    const phone = "+916263176670"; // Apna number likh sandbox ke hisaab se
    const name = "Aman";
    await sendWhatsApp(phone, name);
    console.log("✅ Test passed");
  } catch (err) {
    console.error("❌ Test failed", err);
  }
})();
