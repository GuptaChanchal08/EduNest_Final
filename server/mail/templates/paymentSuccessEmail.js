exports.paymentSuccessEmail = (name, amount, orderId, paymentId) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Payment Successful - EduNest</title>
    <style>
      body { background:#000814; font-family:Arial,sans-serif; color:#fff; margin:0; padding:0; }
      .container { max-width:600px; margin:0 auto; padding:40px 20px; text-align:center; }
      .logo { font-size:28px; font-weight:800; color:#FFD60A; margin-bottom:30px; }
      .card { background:#161D29; border-radius:12px; padding:40px; border:1px solid #2C333F; }
      .amount { font-size:40px; font-weight:800; color:#06D6A0; margin:16px 0; }
      .text { color:#AFB2BF; font-size:15px; line-height:1.6; }
      .detail { background:#2C333F; border-radius:8px; padding:12px 20px; margin:8px 0; text-align:left; font-size:14px; }
      .footer { margin-top:24px; color:#585D69; font-size:12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">EduNest</div>
      <div class="card">
        <h2 style="color:#F1F2FF;">✅ Payment Successful</h2>
        <p class="text">Dear <strong>${name}</strong>, your payment has been received.</p>
        <div class="amount">₹${amount}</div>
        <div class="detail"><strong>Order ID:</strong> ${orderId}</div>
        <div class="detail"><strong>Payment ID:</strong> ${paymentId}</div>
        <p class="text" style="margin-top:20px;">You can now access your course from the dashboard.</p>
      </div>
      <div class="footer">© 2026 EduNest. All rights reserved.</div>
    </div>
  </body>
  </html>`;
};
