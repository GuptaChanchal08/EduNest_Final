const express = require("express")
const router = express.Router()
const { auth } = require("../middleware/auth")
const { saveNote, getNotes, deleteNote } = require("../controllers/StudentNote")
router.post("/save", auth, saveNote)
router.get("/", auth, getNotes)
router.post("/delete", auth, deleteNote)
module.exports = router
