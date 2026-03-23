const express = require("express")
const router = express.Router()
const { auth } = require("../middleware/auth")
const { getComments, addComment, editComment, deleteComment, toggleLike, togglePin } = require("../controllers/Comment")

router.get("/", auth, getComments)
router.post("/add", auth, addComment)
router.post("/edit", auth, editComment)
router.post("/delete", auth, deleteComment)
router.post("/like", auth, toggleLike)
router.post("/pin", auth, togglePin)

module.exports = router
