const StudentNote = require("../models/StudentNote")

exports.saveNote = async (req, res) => {
  try {
    const { courseId, subsectionId, content, timestamp, noteId } = req.body
    const userId = req.user.id
    let note
    if (noteId) {
      note = await StudentNote.findOneAndUpdate({ _id: noteId, userId }, { content, timestamp }, { new: true })
    } else {
      note = await StudentNote.create({ userId, courseId, subsectionId, content, timestamp })
    }
    return res.status(200).json({ success: true, data: note })
  } catch (err) { return res.status(500).json({ success: false, message: err.message }) }
}

exports.getNotes = async (req, res) => {
  try {
    const { courseId, subsectionId } = req.query
    const userId = req.user.id
    const filter = { userId, courseId }
    if (subsectionId) filter.subsectionId = subsectionId
    const notes = await StudentNote.find(filter).sort({ createdAt: -1 })
    return res.status(200).json({ success: true, data: notes })
  } catch (err) { return res.status(500).json({ success: false, message: err.message }) }
}

exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.body
    const userId = req.user.id
    await StudentNote.findOneAndDelete({ _id: noteId, userId })
    return res.status(200).json({ success: true })
  } catch (err) { return res.status(500).json({ success: false, message: err.message }) }
}
