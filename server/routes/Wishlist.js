const express = require("express")
const router = express.Router()
const { auth } = require("../middleware/auth")
const { toggleWishlist, getWishlist } = require("../controllers/Wishlist")
router.post("/toggle", auth, toggleWishlist)
router.get("/", auth, getWishlist)
module.exports = router
