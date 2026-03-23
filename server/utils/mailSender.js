const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false, // STARTTLS on port 587
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // avoids cert errors on some hosts
      },
    })
    let info = await transporter.sendMail({
      from: `"EduNest" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    })
    console.log("Email sent:", info.response)
    return info
  } catch (error) {
    console.log("EMAIL ERROR:", error.message)
    return error.message
  }
}

module.exports = mailSender
