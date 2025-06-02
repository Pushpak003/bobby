const ejs = require('ejs');
const puppeteer = require('puppeteer');
const path = require('path');
const getStream = require("get-stream");
const fs = require('fs');
const { rejects } = require('assert');
const cloudinary = require("cloudinary").v2;


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateInvoicePDF = async (user) => {
  const timestamp = Date.now();
  const filename = `invoice-${user.name}-${timestamp}.pdf`;
  const outputDir = path.join(__dirname, '../invoices');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const filePath = path.join(outputDir, filename);

  // Prepare HTML with data
  const templatePath = path.join(__dirname, '../templates/invoice.ejs');
  const html = await ejs.renderFile(templatePath, {
    user,
    date: new Date().toLocaleString(),
    logoPath: path.join(__dirname, '../assets/logo.png'),
    sealPath: path.join(__dirname, '../assets/signature.png'),
  });

  // Launch browser and create PDF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
   // Convert to buffer
   const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
   await browser.close();
  
  // Upload to Cloudinary from buffer
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "invoices",
        public_id: `invoice-${user.name}-${Date.now()}`,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url); // <-- FINAL URL
      }
    );

    const bufferStream = require("stream").PassThrough();
    bufferStream.end(pdfBuffer);
    bufferStream.pipe(stream);
  });
};

module.exports = {
  generateInvoicePDF,
};
