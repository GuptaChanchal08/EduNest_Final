// Import the required modules
const express = require("express")
const router = express.Router()
const {
  capturePayment,
  // verifySignature,
  verifyPayment,
  sendPaymentSuccessEmail,
  enrollFree,
} = require("../controllers/payments")
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")
router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayment", auth, isStudent, verifyPayment)
router.post("/enrollFree", auth, isStudent, enrollFree)
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent,
  sendPaymentSuccessEmail
)
// router.post("/verifySignature", verifySignature)

module.exports = router
