const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

async function testGmail() {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    // Just verify connection
    await transporter.verify();
    console.log("SMTP Connection successful!");
  } catch (e) {
    console.error("SMTP Connection FAILED:", e.message);
  }
}
testGmail();
