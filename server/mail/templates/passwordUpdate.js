exports.passwordUpdated = (email, name) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Password Updated - EduNest</title>
    <style>
      body { background:#000814; font-family:Arial,sans-serif; color:#fff; margin:0; padding:0; }
      .container { max-width:600px; margin:0 auto; padding:40px 20px; text-align:center; }
      .logo { font-size:28px; font-weight:800; color:#FFD60A; margin-bottom:30px; }
      .card { background:#161D29; border-radius:12px; padding:40px; border:1px solid #2C333F; }
      .text { color:#AFB2BF; font-size:15px; line-height:1.6; }
      .footer { margin-top:24px; color:#585D69; font-size:12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">EduNest</div>
      <div class="card">
        <h2 style="color:#F1F2FF;">🔐 Password Updated</h2>
        <p class="text">Hi <strong>${name}</strong>,</p>
        <p class="text">Your password for <strong>${email}</strong> has been updated successfully.</p>
        <p class="text">If you did not make this change, please contact us immediately at <a href="mailto:support@edunest.com" style="color:#FFD60A;">support@edunest.com</a></p>
      </div>
      <div class="footer">© 2026 EduNest. All rights reserved.</div>
    </div>
  </body>
  </html>`;
};
