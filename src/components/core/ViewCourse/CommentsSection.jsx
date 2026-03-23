import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { FiHeart, FiMessageSquare, FiMoreVertical, FiEdit2, FiTrash2, FiMapPin, FiSend, FiChevronDown, FiChevronUp } from "react-icons/fi"
import { apiConnector } from "../../../services/apiConnector"
import { commentEndpoints } from "../../../services/apis"

const {
  GET_COMMENTS_API, ADD_COMMENT_API, EDIT_COMMENT_API,
  DELETE_COMMENT_API, LIKE_COMMENT_API, PIN_COMMENT_API,
} = commentEndpoints

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

function Avatar({ user, size = 8 }) {
  const src = user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`
  return <img src={src} alt="" style={{width: size*4+"px", height: size*4+"px"}} className="rounded-full object-cover flex-shrink-0" />
}

function CommentBubble({ comment, courseId, subsectionId, token, user, onRefresh, depth = 0 }) {
  const [showReplies, setShowReplies] = useState(false)
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [editText, setEditText] = useState(comment.text)
  const [menuOpen, setMenuOpen] = useState(false)
  const [liked, setLiked] = useState(comment.likes?.some(l => l.toString() === user?._id || l === user?._id))
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0)
  const [submitting, setSubmitting] = useState(false)
  const menuRef = useRef(null)

  const isOwner = comment.user?._id === user?._id || comment.user === user?._id
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const close = (e) => { if (!menuRef.current?.contains(e.target)) setMenuOpen(false) }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  const handleLike = async () => {
    try {
      const res = await apiConnector("POST", LIKE_COMMENT_API, { commentId: comment._id }, headers)
      if (res.data.success) { setLiked(res.data.liked); setLikeCount(res.data.likeCount) }
    } catch { toast.error("Failed to like") }
  }

  const handleReply = async () => {
    if (!replyText.trim()) return
    setSubmitting(true)
    try {
      await apiConnector("POST", ADD_COMMENT_API, { courseId, subsectionId, text: replyText, parentId: comment._id }, headers)
      setReplyText(""); setReplyOpen(false); setShowReplies(true)
      onRefresh()
    } catch { toast.error("Failed to post reply") }
    setSubmitting(false)
  }

  const handleEdit = async () => {
    if (!editText.trim()) return
    try {
      await apiConnector("POST", EDIT_COMMENT_API, { commentId: comment._id, text: editText }, headers)
      setEditMode(false); onRefresh()
    } catch { toast.error("Failed to edit") }
  }

  const handleDelete = async () => {
    if (!window.confirm("Delete this comment?")) return
    try {
      await apiConnector("POST", DELETE_COMMENT_API, { commentId: comment._id }, headers)
      onRefresh(); toast.success("Comment deleted")
    } catch { toast.error("Failed to delete") }
  }

  return (
    <div className={`flex gap-3 ${depth > 0 ? "pl-8 mt-2" : "mt-4"}`}>
      <Avatar user={comment.user} size={depth > 0 ? 7 : 8} />
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-richblack-5">
            {comment.user?.firstName} {comment.user?.lastName}
          </span>
          {comment.isInstructorReply && (
            <span className="text-xs bg-yellow-50/20 text-yellow-50 px-2 py-0.5 rounded-full font-medium">Instructor</span>
          )}
          {comment.isPinned && (
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1"><FiMapPin size={10} /> Pinned</span>
          )}
          <span className="text-xs text-richblack-500">{timeAgo(comment.createdAt)}</span>
          {comment.isEdited && <span className="text-xs text-richblack-600">(edited)</span>}
          {comment.timestamp > 0 && (
            <span className="text-xs bg-richblack-700 text-richblack-400 px-2 py-0.5 rounded font-mono">
              {Math.floor(comment.timestamp / 60)}:{String(Math.floor(comment.timestamp % 60)).padStart(2, "0")}
            </span>
          )}
        </div>

        {/* Body */}
        {editMode ? (
          <div className="mt-2 flex gap-2">
            <textarea value={editText} onChange={e => setEditText(e.target.value)}
              className="flex-1 bg-richblack-700 border border-richblack-600 text-richblack-5 rounded-xl px-3 py-2 text-sm resize-none outline-none focus:border-yellow-50 transition-all"
              rows={2} />
            <div className="flex flex-col gap-1">
              <button onClick={handleEdit} className="text-xs bg-yellow-50 text-richblack-900 px-3 py-1.5 rounded-lg font-semibold hover:bg-yellow-100">Save</button>
              <button onClick={() => setEditMode(false)} className="text-xs text-richblack-400 hover:text-richblack-200">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-sm text-richblack-200 leading-relaxed break-words">{comment.text}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-2">
          <button onClick={handleLike} className={`flex items-center gap-1 text-xs transition-all ${liked ? "text-red-400" : "text-richblack-500 hover:text-red-400"}`}>
            <FiHeart size={12} className={liked ? "fill-current" : ""} /> {likeCount > 0 && likeCount}
          </button>
          {depth === 0 && (
            <button onClick={() => setReplyOpen(r => !r)} className="flex items-center gap-1 text-xs text-richblack-500 hover:text-richblack-300 transition-all">
              <FiMessageSquare size={12} /> Reply
            </button>
          )}
          {comment.replies?.length > 0 && depth === 0 && (
            <button onClick={() => setShowReplies(r => !r)} className="flex items-center gap-1 text-xs text-yellow-50/70 hover:text-yellow-50 transition-all">
              {showReplies ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
              {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
            </button>
          )}

          {/* 3-dot menu */}
          {isOwner && (
            <div className="relative ml-auto" ref={menuRef}>
              <button onClick={() => setMenuOpen(m => !m)} className="text-richblack-600 hover:text-richblack-400 p-1 rounded">
                <FiMoreVertical size={14} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-6 bg-richblack-800 border border-richblack-700 rounded-xl shadow-xl z-10 min-w-[120px] overflow-hidden">
                  <button onClick={() => { setEditMode(true); setMenuOpen(false) }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-richblack-200 hover:bg-richblack-700 transition-all">
                    <FiEdit2 size={12} /> Edit
                  </button>
                  <button onClick={handleDelete}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-red-400 hover:bg-richblack-700 transition-all">
                    <FiTrash2 size={12} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reply input */}
        {replyOpen && (
          <div className="mt-3 flex gap-2">
            <Avatar user={user} size={6} />
            <div className="flex-1 flex gap-2">
              <input value={replyText} onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleReply()}
                placeholder="Write a reply..."
                className="flex-1 bg-richblack-700 border border-richblack-600 text-richblack-5 placeholder-richblack-500 rounded-xl px-3 py-2 text-sm outline-none focus:border-yellow-50 transition-all" />
              <button onClick={handleReply} disabled={submitting || !replyText.trim()}
                className="text-yellow-50 hover:text-yellow-200 disabled:opacity-40 transition-all">
                <FiSend size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Replies */}
        {showReplies && comment.replies?.map(reply => (
          <CommentBubble key={reply._id} comment={reply} courseId={courseId} subsectionId={subsectionId}
            token={token} user={user} onRefresh={onRefresh} depth={depth + 1} />
        ))}
      </div>
    </div>
  )
}

export default function CommentsSection({ courseId, subsectionId }) {
  const { token } = useSelector(s => s.auth)
  const { user } = useSelector(s => s.profile)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [sort, setSort] = useState("newest") // newest | oldest | popular

  const headers = { Authorization: `Bearer ${token}` }

  const fetchComments = async () => {
    if (!courseId) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ courseId })
      if (subsectionId) params.append("subsectionId", subsectionId)
      const res = await apiConnector("GET", `${GET_COMMENTS_API}?${params}`, null, headers)
      if (res.data.success) setComments(res.data.data || [])
    } catch { /* silently fail */ }
    setLoading(false)
  }

  useEffect(() => { fetchComments() }, [courseId, subsectionId])

  const handleSubmit = async () => {
    if (!text.trim()) return
    setSubmitting(true)
    try {
      await apiConnector("POST", ADD_COMMENT_API, { courseId, subsectionId, text }, headers)
      setText(""); fetchComments()
    } catch { toast.error("Failed to post comment") }
    setSubmitting(false)
  }

  const sorted = [...comments].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return b.isPinned - a.isPinned
    if (sort === "popular") return b.likeCount - a.likeCount
    if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt)
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  return (
    <div className="mt-6 border-t border-richblack-700 pt-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-richblack-5 flex items-center gap-2">
          <FiMessageSquare className="text-yellow-50" />
          Comments & Q&A
          {comments.length > 0 && <span className="text-sm text-richblack-400">({comments.length})</span>}
        </h3>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="bg-richblack-700 border border-richblack-600 text-richblack-300 text-xs rounded-lg px-3 py-1.5 outline-none cursor-pointer">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most Liked</option>
        </select>
      </div>

      {/* Compose */}
      <div className="flex gap-3 mb-6">
        <Avatar user={user} size={9} />
        <div className="flex-1">
          <textarea value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit() }}
            placeholder="Ask a question or leave a comment... (Ctrl+Enter to post)"
            rows={3}
            className="w-full bg-richblack-700 border border-richblack-600 text-richblack-5 placeholder-richblack-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-50 transition-all resize-none" />
          <div className="flex justify-end mt-2">
            <button onClick={handleSubmit} disabled={submitting || !text.trim()}
              className="flex items-center gap-2 bg-yellow-50 text-richblack-900 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-yellow-100 disabled:opacity-50 transition-all">
              <FiSend size={14} /> {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-yellow-50 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-10 text-richblack-500">
          <FiMessageSquare className="mx-auto text-3xl mb-2 opacity-40" />
          <p className="text-sm">No comments yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-1 divide-y divide-richblack-800">
          {sorted.map(comment => (
            <CommentBubble key={comment._id} comment={comment} courseId={courseId}
              subsectionId={subsectionId} token={token} user={user} onRefresh={fetchComments} />
          ))}
        </div>
      )}
    </div>
  )
}
