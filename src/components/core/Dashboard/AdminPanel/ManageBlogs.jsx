import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { FiPlus, FiTrash2, FiExternalLink } from "react-icons/fi"
import { useSelector } from "react-redux"
import { createBlog, getAllBlogs } from "../../../../services/operations/blogAPI"
import { apiConnector } from "../../../../services/apiConnector"
import { toast } from "react-hot-toast"
import IconBtn from "../../../Common/IconBtn"

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1"

export default function ManageBlogs() {
  const { token } = useSelector((state) => state.auth)
  const [blogs, setBlogs] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => { fetchBlogs() }, [])

  const fetchBlogs = async () => {
    const result = await getAllBlogs()
    if (result) setBlogs(result)
  }

  const handleDelete = async (blogId, title) => {
    if (!window.confirm(`Delete blog "${title}"? This cannot be undone.`)) return
    setDeleting(blogId)
    try {
      const res = await apiConnector("DELETE", `${BASE_URL}/blog/deleteBlog`, { blogId }, {
        Authorization: `Bearer ${token}`,
      })
      if (res?.data?.success) {
        toast.success("Blog deleted")
        setBlogs(prev => prev.filter(b => b._id !== blogId))
      } else {
        toast.error("Failed to delete blog")
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to delete blog")
    }
    setDeleting(null)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("category", data.category)
    formData.append("content", data.content)
    if (data.thumbnail[0]) formData.append("thumbnail", data.thumbnail[0])
    const result = await createBlog(formData, token)
    if (result) { setIsAdding(false); reset(); fetchBlogs() }
    setLoading(false)
  }

  return (
    <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">Manage Blogs</h1>
        {!isAdding && (
          <IconBtn text="Add Blog Post" onclick={() => setIsAdding(true)}>
            <FiPlus />
          </IconBtn>
        )}
      </div>

      {isAdding ? (
        <div className="rounded-xl border border-richblack-800 bg-richblack-900 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="text-sm text-richblack-5">Blog Title <sup className="text-pink-200">*</sup></label>
              <input {...register("title", { required: true })}
                className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 mt-2"
                placeholder="Enter blog title" />
              {errors.title && <span className="text-xs text-pink-200">Title is required</span>}
            </div>
            <div>
              <label className="text-sm text-richblack-5">Category <sup className="text-pink-200">*</sup></label>
              <select {...register("category", { required: true })}
                className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 mt-2">
                <option value="">Select Category</option>
                <option value="Web Dev">Web Dev</option>
                <option value="Data Science">Data Science</option>
                <option value="Career">Career</option>
                <option value="Tutorials">Tutorials</option>
                <option value="News">News</option>
              </select>
              {errors.category && <span className="text-xs text-pink-200">Category is required</span>}
            </div>
            <div>
              <label className="text-sm text-richblack-5">Thumbnail Image</label>
              <input type="file" accept="image/*" {...register("thumbnail")}
                className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 mt-2 cursor-pointer" />
            </div>
            <div>
              <label className="text-sm text-richblack-5">Content (Markdown Supported) <sup className="text-pink-200">*</sup></label>
              <textarea {...register("content", { required: true })} rows={10}
                className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 mt-2 font-mono"
                placeholder="Write your blog post content here..." />
              {errors.content && <span className="text-xs text-pink-200">Content is required</span>}
            </div>
            <div className="flex gap-4 border-t border-richblack-800 pt-6">
              <button type="button" onClick={() => setIsAdding(false)}
                className="rounded-md bg-richblack-700 px-6 py-2 text-richblack-5 hover:bg-richblack-600 font-semibold">
                Cancel
              </button>
              <IconBtn disabled={loading} text={loading ? "Publishing..." : "Publish Blog"} />
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.length === 0 ? (
            <p className="text-richblack-300 col-span-3 text-center py-10">No blogs published yet.</p>
          ) : (
            blogs.map((blog) => (
              <div key={blog._id} className="rounded-xl border border-richblack-700 bg-richblack-800 overflow-hidden flex flex-col">
                {blog.thumbnail && (
                  <img src={blog.thumbnail} alt={blog.title} className="w-full h-44 object-cover" />
                )}
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs text-yellow-50 bg-yellow-50/10 px-2 py-1 rounded-full w-fit">{blog.category}</span>
                  <h3 className="text-base font-bold text-richblack-5 mt-3 line-clamp-2">{blog.title}</h3>
                  <p className="text-sm text-richblack-300 mt-2 line-clamp-2 flex-1">{blog.excerpt}</p>
                  <p className="text-xs text-richblack-500 mt-3">By {blog.author?.firstName} {blog.author?.lastName}</p>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-richblack-700">
                    <Link to={`/blog/${blog._id}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-yellow-50 bg-yellow-50/10 hover:bg-yellow-50/20 border border-yellow-50/20 px-3 py-1.5 rounded-lg transition-all font-medium">
                      <FiExternalLink size={12} /> View Post
                    </Link>
                    <button onClick={() => handleDelete(blog._id, blog.title)}
                      disabled={deleting === blog._id}
                      className="flex items-center gap-1.5 text-xs text-red-400 bg-red-400/10 hover:bg-red-400/20 border border-red-400/20 px-3 py-1.5 rounded-lg transition-all font-medium disabled:opacity-50 ml-auto">
                      <FiTrash2 size={12} />
                      {deleting === blog._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
