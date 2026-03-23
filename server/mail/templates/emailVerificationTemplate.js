exports.otpTemplate = (otp) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>OTP Verification - EduNest</title>
    <style>
      body { background:#000814; font-family:Arial,sans-serif; color:#fff; margin:0; padding:0; }
      .container { max-width:600px; margin:0 auto; padding:40px 20px; text-align:center; }
      .logo { font-size:28px; font-weight:800; color:#FFD60A; margin-bottom:30px; }
      .card { background:#161D29; border-radius:12px; padding:40px; border:1px solid #2C333F; }
      .otp { font-size:48px; font-weight:800; color:#FFD60A; letter-spacing:12px; margin:24px 0; }
      .text { color:#AFB2BF; font-size:15px; line-height:1.6; }
      .footer { margin-top:24px; color:#585D69; font-size:12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">EduNest</div>
      <div class="card">
        <h2 style="color:#F1F2FF;margin-bottom:8px;">Verify Your Email</h2>
        <p class="text">Use the OTP below to complete your registration. It expires in <strong>5 minutes</strong>.</p>
        <div class="otp">${otp}</div>
        <p class="text">If you did not request this, please ignore this email.</p>
      </div>
      <div class="footer">© 2026 EduNest. All rights reserved.</div>
    </div>
  </body>
  </html>`;
};
