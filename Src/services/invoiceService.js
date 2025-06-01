const ejs = require('ejs');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

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
  await page.pdf({ path: filePath, format: 'A4', printBackground: true });
  await browser.close();

  return filePath;
};

module.exports = {
  generateInvoicePDF,
};
