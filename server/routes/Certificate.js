const express = require("express")
const router = express.Router()
const { auth } = require("../middleware/auth")
const { checkCertificateEligibility, generateCertificate } = require("../controllers/Certificate")
router.get("/check", auth, checkCertificateEligibility)
router.post("/generate", auth, generateCertificate)
module.exports = router
