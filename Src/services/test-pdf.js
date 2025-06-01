const { generateInvoicePDF } = require('../services/invoiceService');

const testUser = {
  name: 'Rohit Sharma',
  email: 'rohit@example.com',
  phone: '+919876543210',
  amount: 500
};

(async () => {
  try {
    const filePath = await generateInvoicePDF(testUser);
    console.log('✅ PDF generated at:', filePath);
  } catch (err) {
    console.error('❌ PDF generation failed:', err);
  }
})();
