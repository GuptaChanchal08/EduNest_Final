import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiHeart, FiMessageSquare, FiCalendar } from "react-icons/fi"
import { getAllBlogs } from "../../../services/operations/blogAPI"
import { apiConnector } from "../../../services/apiConnector"
import { blogEndpoints } from "../../../services/operations/blogAPI"
import toast from "react-hot-toast"
import IconBtn from "../../Common/IconBtn"
import ConfirmationModal from "../../Common/ConfirmationModal"

const BLOG_CATEGORIES = ["Web Dev", "Data Science", "Career", "Tutorials", "News", "Mobile Dev", "Cloud", "DevOps", "Design", "Other"]

export default function MyBlogs() {
  const { token } = useSelector((s) => s.auth)
  const { user } = useSelector((s) => s.profile)
  const navigate = useNavigate()
  const [myBlogs, setMyBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [confirmModal, setConfirmModal] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [form, setForm] = useState({ title: "", category: "", content: "", tags: "", excerpt: "" })
  const [thumbnail, setThumbnail] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => { fetchMyBlogs() }, [token])

  const BASE = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1"

  const fetchMyBlogs = async () => {
    setLoading(true)
    try {
      const res = await apiConnector("GET", BASE + "/blog/myBlogs", null, {
        Authorization: `Bearer ${token}`,
      })
      if (res?.data?.success) setMyBlogs(res.data.data)
    } catch (e) { toast.error("Could not load your blogs") }
    setLoading(false)
  }

  const handleThumbnail = (e) => {
    const f = e.target.files[0]
    if (f) { setThumbnail(f); setPreview(URL.createObjectURL(f)) }
  }

  const resetForm = () => {
    setForm({ title: "", category: "", content: "", tags: "", excerpt: "" })
    setThumbnail(null); setPreview(null)
    setIsCreating(false); setEditingBlog(null)
  }

  const openEdit = (blog) => {
    setForm({
      title: blog.title,
      category: blog.category,
      content: blog.content,
      tags: (blog.tags || []).join(", "),
      excerpt: blog.excerpt || "",
    })
    setPreview(blog.thumbnail || null)
    setThumbnail(null)
    setEditingBlog(blog)
    setIsCreating(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.category || !form.content) {
      toast.error("Title, category and content are required"); return
    }
    setSubmitting(true)
    const fd = new FormData()
    fd.append("title", form.title)
    fd.append("category", form.category)
    fd.append("content", form.content)
    fd.append("excerpt", form.excerpt)
    fd.append("tags", JSON.stringify(form.tags.split(",").map(t => t.trim()).filter(Boolean)))
    if (thumbnail) fd.append("thumbnail", thumbnail)

    try {
      if (editingBlog) {
        fd.append("blogId", editingBlog._id)
        const res = await apiConnector("POST", BASE + "/blog/editBlog", fd, {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        })
        if (res?.data?.success) { toast.success("Blog updated!"); resetForm(); fetchMyBlogs() }
        else throw new Error(res?.data?.message)
      } else {
        const res = await apiConnector("POST", BASE + "/blog/createBlog", fd, {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        })
        if (res?.data?.success) { toast.success("Blog published!"); resetForm(); fetchMyBlogs() }
        else throw new Error(res?.data?.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Something went wrong")
    }
    setSubmitting(false)
  }

  const handleDelete = (blogId) => {
    setConfirmModal({
      text1: "Delete Blog?",
      text2: "This action is permanent and cannot be undone.",
      btn1Text: "Delete",
      btn2Text: "Cancel",
      btn1Handler: async () => {
        try {
          const res = await apiConnector("DELETE", BASE + "/blog/deleteBlog", { blogId }, {
            Authorization: `Bearer ${token}`,
          })
          if (res?.data?.success) { toast.success("Blog deleted"); fetchMyBlogs() }
        } catch { toast.error("Could not delete blog") }
        setConfirmModal(null)
      },
      btn2Handler: () => setConfirmModal(null),
    })
  }

  const showForm = isCreating || editingBlog

  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-richblack-5">My Blogs</h1>
          <p className="text-richblack-400 mt-1 text-sm">{myBlogs.length} {myBlogs.length === 1 ? "post" : "posts"} published</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setIsCreating(true); setEditingBlog(null); resetForm(); setIsCreating(true) }}
            className="flex items-center gap-2 bg-yellow-50 text-richblack-900 font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-100 transition-all shadow-md"
          >
            <FiPlus /> Write New Blog
          </button>
        )}
      </div>

      {/* Blog Form */}
      {showForm && (
        <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-bold text-richblack-5 mb-6">
            {editingBlog ? "Edit Blog Post" : "Write a New Blog Post"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-richblack-200 mb-1.5 font-medium">Title <sup className="text-pink-200">*</sup></label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Write a compelling title..."
                  className="w-full bg-richblack-700 border border-richblack-600 rounded-lg px-4 py-2.5 text-richblack-5 placeholder-richblack-400 focus:border-yellow-50 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-richblack-200 mb-1.5 font-medium">Category <sup className="text-pink-200">*</sup></label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full bg-richblack-700 border border-richblack-600 rounded-lg px-4 py-2.5 text-richblack-5 focus:border-yellow-50 outline-none text-sm"
                >
                  <option value="">Select a category</option>
                  {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-richblack-200 mb-1.5 font-medium">Tags <span className="text-richblack-400 font-normal">(comma separated)</span></label>
              <input
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="React, JavaScript, Tutorial"
                className="w-full bg-richblack-700 border border-richblack-600 rounded-lg px-4 py-2.5 text-richblack-5 placeholder-richblack-400 focus:border-yellow-50 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-richblack-200 mb-1.5 font-medium">Short Excerpt <span className="text-richblack-400 font-normal">(auto-generated if empty)</span></label>
              <input
                value={form.excerpt}
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                placeholder="A one-sentence summary of your post..."
                className="w-full bg-richblack-700 border border-richblack-600 rounded-lg px-4 py-2.5 text-richblack-5 placeholder-richblack-400 focus:border-yellow-50 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-richblack-200 mb-1.5 font-medium">Thumbnail Image</label>
              <input type="file" accept="image/*" onChange={handleThumbnail}
                className="block text-sm text-richblack-300 file:mr-3 file:rounded-lg file:border-0 file:bg-yellow-50/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-yellow-50 hover:file:bg-yellow-50/20 cursor-pointer" />
              {preview && (
                <img src={preview} alt="preview" className="mt-3 h-36 w-64 object-cover rounded-lg border border-richblack-600" />
              )}
            </div>

            <div>
              <label className="block text-sm text-richblack-200 mb-1.5 font-medium">Content <sup className="text-pink-200">*</sup> <span className="text-richblack-400 font-normal">(Markdown supported)</span></label>
              <textarea
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                rows={14}
                placeholder={`## Your Heading\n\nWrite your blog content here. Markdown is fully supported!\n\n- Bullet points\n- **Bold text**\n- \`inline code\`\n\n\`\`\`javascript\n// Code blocks too!\nconst hello = 'world';\n\`\`\``}
                className="w-full bg-richblack-700 border border-richblack-600 rounded-lg px-4 py-3 text-richblack-5 placeholder-richblack-500 focus:border-yellow-50 outline-none text-sm font-mono resize-y"
              />
              <p className="text-xs text-richblack-500 mt-1">{form.content.length} characters · ~{Math.ceil(form.content.split(/\s/g).length / 200)} min read</p>
            </div>

            <div className="flex gap-3 pt-2 border-t border-richblack-700">
              <button type="button" onClick={resetForm}
                className="px-5 py-2.5 rounded-xl border border-richblack-600 text-richblack-300 hover:bg-richblack-700 font-medium text-sm transition-all">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-yellow-50 text-richblack-900 font-bold text-sm hover:bg-yellow-100 transition-all disabled:opacity-50">
                {submitting ? "Publishing..." : editingBlog ? "Save Changes" : "Publish Blog"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blog List */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="spinner" /></div>
      ) : myBlogs.length === 0 ? (
        <div className="text-center py-20 bg-richblack-800 rounded-2xl border border-richblack-700">
          <p className="text-6xl mb-4">✍️</p>
          <h3 className="text-richblack-200 font-semibold text-lg mb-2">No blogs yet</h3>
          <p className="text-richblack-400 text-sm mb-6">Share your knowledge with the EduNest community</p>
          <button onClick={() => setIsCreating(true)}
            className="bg-yellow-50 text-richblack-900 font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-100 transition-all">
            Write Your First Blog
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myBlogs.map(blog => (
            <div key={blog._id}
              className="flex gap-4 bg-richblack-800 border border-richblack-700 rounded-2xl p-4 hover:border-richblack-600 transition-all">
              <img
                src={blog.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&q=60`}
                alt={blog.title}
                className="w-28 h-20 object-cover rounded-xl flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-yellow-50 bg-yellow-50/10 px-2 py-0.5 rounded-full">
                      {blog.category}
                    </span>
                    <h3 className="text-richblack-5 font-semibold text-base mt-1.5 line-clamp-1">{blog.title}</h3>
                    <p className="text-richblack-400 text-xs mt-1 line-clamp-1">{blog.excerpt}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link to={`/blog/${blog._id}`} target="_blank"
                      className="p-2 rounded-lg border border-richblack-600 text-richblack-300 hover:text-yellow-50 hover:border-yellow-50/30 transition-all" title="View">
                      <FiEye size={14} />
                    </Link>
                    <button onClick={() => openEdit(blog)}
                      className="p-2 rounded-lg border border-richblack-600 text-richblack-300 hover:text-yellow-50 hover:border-yellow-50/30 transition-all" title="Edit">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(blog._id)}
                      className="p-2 rounded-lg border border-richblack-600 text-richblack-300 hover:text-pink-200 hover:border-pink-200/30 transition-all" title="Delete">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-richblack-500 text-xs">
                  <span className="flex items-center gap-1"><FiCalendar size={11} /> {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span className="flex items-center gap-1"><FiHeart size={11} /> {blog.likes?.length || 0}</span>
                  <span className="flex items-center gap-1"><FiMessageSquare size={11} /> {blog.comments?.length || 0}</span>
                  <span className="flex items-center gap-1"><FiEye size={11} /> {blog.views || 0} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmModal && <ConfirmationModal modalData={confirmModal} />}
    </div>
  )
}
