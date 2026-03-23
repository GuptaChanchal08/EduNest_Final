import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { FiFileText, FiPlus, FiSave, FiTrash2, FiEdit2, FiX } from "react-icons/fi"
import { toast } from "react-hot-toast"
import { apiConnector } from "../../../services/apiConnector"
import { notesEndpoints } from "../../../services/apis"

const { SAVE_API, GET_API, DELETE_API } = notesEndpoints

export default function StudentNotes({ courseId, subsectionId, currentTimestamp }) {
  const { token } = useSelector(s => s.auth)
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const headers = { Authorization: `Bearer ${token}` }

  const fetchNotes = async () => {
    try {
      const params = new URLSearchParams({ courseId })
      if (subsectionId) params.append("subsectionId", subsectionId)
      const res = await apiConnector("GET", `${GET_API}?${params}`, null, headers)
      if (res.data.success) setNotes(res.data.data)
    } catch {}
  }

  useEffect(() => { if (courseId) fetchNotes() }, [courseId, subsectionId])

  const handleSave = async () => {
    if (!newNote.trim()) return
    setSaving(true)
    try {
      await apiConnector("POST", SAVE_API, { courseId, subsectionId, content: newNote, timestamp: currentTimestamp || 0 }, headers)
      setNewNote(""); fetchNotes()
      toast.success("Note saved!")
    } catch { toast.error("Failed to save note") }
    setSaving(false)
  }

  const handleEdit = async (noteId) => {
    if (!editContent.trim()) return
    try {
      await apiConnector("POST", SAVE_API, { noteId, content: editContent }, headers)
      setEditingId(null); setEditContent(""); fetchNotes()
    } catch { toast.error("Failed to update note") }
  }

  const handleDelete = async (noteId) => {
    try {
      await apiConnector("POST", DELETE_API, { noteId }, headers)
      setNotes(n => n.filter(note => note._id !== noteId))
      toast.success("Note deleted")
    } catch { toast.error("Failed to delete note") }
  }

  const formatTs = (secs) => {
    if (!secs) return ""
    return `${Math.floor(secs / 60)}:${String(Math.floor(secs % 60)).padStart(2, "0")}`
  }

  return (
    <div className="mt-4 border border-richblack-700 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full px-5 py-4 bg-richblack-800 hover:bg-richblack-700 transition-all">
        <div className="flex items-center gap-2">
          <FiFileText className="text-yellow-50" />
          <span className="text-richblack-5 font-semibold text-sm">My Notes</span>
          {notes.length > 0 && (
            <span className="bg-yellow-50/20 text-yellow-50 text-xs px-2 py-0.5 rounded-full">{notes.length}</span>
          )}
        </div>
        <span className={`text-richblack-400 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div className="bg-richblack-900 p-5 space-y-4">
          {/* Add note */}
          <div className="space-y-2">
            <textarea value={newNote} onChange={e => setNewNote(e.target.value)}
              placeholder="Add a note about this lecture... (personal, never shown to others)"
              rows={3}
              className="w-full bg-richblack-800 border border-richblack-700 focus:border-yellow-50 text-richblack-5 placeholder-richblack-500 rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all" />
            <div className="flex items-center justify-between">
              {currentTimestamp > 0 && (
                <span className="text-richblack-500 text-xs">At {formatTs(currentTimestamp)}</span>
              )}
              <button onClick={handleSave} disabled={saving || !newNote.trim()}
                className="ml-auto flex items-center gap-2 bg-yellow-50 text-richblack-900 font-semibold text-xs px-4 py-2 rounded-lg hover:bg-yellow-100 disabled:opacity-50 transition-all">
                <FiPlus size={12} /> {saving ? "Saving..." : "Add Note"}
              </button>
            </div>
          </div>

          {/* Notes list */}
          {notes.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {notes.map(note => (
                <div key={note._id} className="bg-richblack-800 border border-richblack-700 rounded-xl p-4">
                  {editingId === note._id ? (
                    <div className="space-y-2">
                      <textarea value={editContent} onChange={e => setEditContent(e.target.value)}
                        rows={3} className="w-full bg-richblack-700 border border-richblack-600 text-richblack-5 rounded-lg px-3 py-2 text-sm outline-none resize-none" />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => { setEditingId(null); setEditContent("") }}
                          className="text-xs text-richblack-400 hover:text-richblack-200 px-3 py-1.5">Cancel</button>
                        <button onClick={() => handleEdit(note._id)}
                          className="text-xs bg-yellow-50 text-richblack-900 font-semibold px-3 py-1.5 rounded-lg">Save</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-richblack-200 text-sm leading-relaxed">{note.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        {note.timestamp > 0 && (
                          <span className="text-richblack-600 text-xs font-mono">{formatTs(note.timestamp)}</span>
                        )}
                        <div className="ml-auto flex gap-2">
                          <button onClick={() => { setEditingId(note._id); setEditContent(note.content) }}
                            className="text-richblack-500 hover:text-yellow-50 transition-all">
                            <FiEdit2 size={13} />
                          </button>
                          <button onClick={() => handleDelete(note._id)}
                            className="text-richblack-500 hover:text-red-400 transition-all">
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-richblack-600 text-xs text-center py-4">No notes yet for this lecture</p>
          )}
        </div>
      )}
    </div>
  )
}
