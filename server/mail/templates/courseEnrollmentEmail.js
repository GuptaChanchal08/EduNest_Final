exports.courseEnrollmentEmail = (courseName, name) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Enrollment Confirmed - EduNest</title>
    <style>
      body { background:#000814; font-family:Arial,sans-serif; color:#fff; margin:0; padding:0; }
      .container { max-width:600px; margin:0 auto; padding:40px 20px; text-align:center; }
      .logo { font-size:28px; font-weight:800; color:#FFD60A; margin-bottom:30px; }
      .card { background:#161D29; border-radius:12px; padding:40px; border:1px solid #2C333F; }
      .course { font-size:20px; font-weight:700; color:#FFD60A; margin:16px 0; }
      .text { color:#AFB2BF; font-size:15px; line-height:1.6; }
      .btn { display:inline-block; margin-top:24px; padding:14px 32px; background:#FFD60A; color:#000; border-radius:8px; text-decoration:none; font-weight:700; font-size:15px; }
      .footer { margin-top:24px; color:#585D69; font-size:12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">EduNest</div>
      <div class="card">
        <h2 style="color:#F1F2FF;">🎉 Enrollment Confirmed!</h2>
        <p class="text">Dear <strong>${name}</strong>,</p>
        <p class="text">You have successfully enrolled in:</p>
        <div class="course">"${courseName}"</div>
        <p class="text">Start learning now by clicking the button below.</p>
        <a class="btn" href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/enrolled-courses">Go to My Courses</a>
      </div>
      <div class="footer">© 2026 EduNest. Need help? Email us at support@edunest.com</div>
    </div>
  </body>
  </html>`;
};
