const bcrypt = require("bcryptjs")
const User = require("../models/User")
const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
const { otpTemplate } = require("../mail/templates/emailVerificationTemplate")
const Profile = require("../models/Profile")
require("dotenv").config()

// Send OTP For Email Verification
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body

    // Check if user already exists
    const checkUserPresent = await User.findOne({ email })
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is Already Registered",
      })
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    console.log("Generated OTP:", otp, "for email:", email)

    // Delete any existing OTPs for this email first to avoid duplicate key issues
    await OTP.deleteMany({ email }).catch(() => {})

    // Save OTP to DB
    const otpDoc = new OTP({ email, otp })
    await otpDoc.save()

    // Send email
    const mailResult = await mailSender(
      email,
      "Your OTP for EduNest Registration",
      otpTemplate(otp)
    )

    // mailSender returns error.message (a string) on failure
    if (typeof mailResult === "string") {
      console.error("OTP email FAILED:", mailResult)
      await OTP.deleteMany({ email }).catch(() => {})
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please verify your email address and try again.",
      })
    }

    console.log("OTP email sent successfully:", mailResult.response)
    return res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    })
  } catch (error) {
    console.error("SENDOTP ERROR:", error)
    return res.status(500).json({
      success: false,
      message: "Could not send OTP. Please try again.",
      error: error.message,
    })
  }
}

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body

    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match.",
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      })
    }

    // Find most recent OTP
    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
    console.log("Recent OTP record:", recentOtp)

    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP.",
      })
    }

    if (otp !== recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid. Please try again.",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    })

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      approved: true,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    })

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    })
  } catch (error) {
    console.error("SIGNUP ERROR:", error)
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    })
  }
}

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill up all required fields",
      })
    }

    const user = await User.findOne({ email }).populate("additionalDetails")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered. Please sign up first.",
      })
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, accountType: user.accountType },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      )

      user.token = token
      user.password = undefined

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User login successful",
      })
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      })
    }
  } catch (error) {
    console.error("LOGIN ERROR:", error)
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    })
  }
}

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id)
    const { oldPassword, newPassword } = req.body

    const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password)
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "The old password is incorrect",
      })
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

    try {
      await mailSender(
        updatedUser.email,
        "Password Updated - EduNest",
        passwordUpdated(updatedUser.email, `${updatedUser.firstName} ${updatedUser.lastName}`)
      )
    } catch (emailError) {
      console.error("Password update email error:", emailError)
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
    })
  }
}
