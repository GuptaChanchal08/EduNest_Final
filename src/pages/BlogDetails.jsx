import React, { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import ReactMarkdown from "react-markdown"
import { FiCalendar, FiClock, FiUser, FiArrowLeft, FiMessageSquare, FiHeart, FiEye, FiTrash2, FiShare2 } from "react-icons/fi"
import { getBlogDetails, addComment, toggleLike, deleteComment } from "../services/operations/blogAPI"
import Footer from "../components/Common/Footer"
import toast from "react-hot-toast"

function calculateReadTime(content) {
  if (!content) return "1 min read"
  const words = content.split(/\s/g).length
  return `${Math.ceil(words / 200)} min read`
}

const categoryColors = {
  "Web Dev": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Data Science": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Career": "bg-green-500/20 text-green-300 border-green-500/30",
  "Tutorials": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "News": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
}

export default function BlogDetails() {
  const { blogId } = useParams()
  const navigate = useNavigate()
  const { token } = useSelector((s) => s.auth)
  const { user } = useSelector((s) => s.profile)
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => { fetchBlog() }, [blogId])

  const fetchBlog = async () => {
    setLoading(true)
    const result = await getBlogDetails(blogId)
    if (result) {
      setBlog(result)
      setLikeCount(result.likes?.length || 0)
      if (user && result.likes?.includes(user._id)) setLiked(true)
    }
    setLoading(false)
  }

  const onCommentSubmit = async (data) => {
    if (!token) { toast.error("Please log in to comment"); return }
    setSubmitting(true)
    const result = await addComment({ blogId, content: data.comment }, token)
    if (result) { setBlog(result); reset() }
    setSubmitting(false)
  }

  const handleLike = async () => {
    if (!token) { toast.error("Please log in to like this post"); return }
    const result = await toggleLike(blogId, token)
    if (result !== null) {
      setLiked(result.liked)
      setLikeCount(result.likeCount)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!token) return
    const result = await deleteComment({ blogId, commentId }, token)
    if (result) setBlog(result)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard!")
  }

  if (loading) return (
    <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-richblack-900">
      <div className="spinner" />
    </div>
  )

  if (!blog) return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-richblack-900 text-richblack-5 gap-4">
      <p className="text-5xl">🔍</p>
      <h1 className="text-3xl font-bold">Blog Not Found</h1>
      <Link to="/blog" className="text-yellow-50 hover:underline flex items-center gap-2">
        <FiArrowLeft /> Back to Blogs
      </Link>
    </div>
  )

  const isAuthorOrAdmin = user && (blog.author?._id === user._id || user.accountType === "Admin")

  return (
    <div className="bg-richblack-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-4">
        <Link to="/blog" className="inline-flex items-center gap-2 text-richblack-400 hover:text-yellow-50 text-sm mb-8 transition-colors">
          <FiArrowLeft /> Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border mb-4 inline-block ${categoryColors[blog.category] || "bg-yellow-50/10 text-yellow-50 border-yellow-50/20"}`}>
            {blog.category}
          </span>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 mb-4">
              {blog.tags.map(tag => (
                <span key={tag} className="text-xs bg-richblack-700 text-richblack-300 px-2.5 py-1 rounded-full">#{tag}</span>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-richblack-400 text-sm border-b border-richblack-800 pb-8">
            <Link to={`/`} className="flex items-center gap-2 hover:text-yellow-50 transition-colors">
              <img
                src={blog.author?.image || `https://ui-avatars.com/api/?name=${blog.author?.firstName}+${blog.author?.lastName}&background=FFD700&color=000`}
                alt="author"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-richblack-700"
              />
              <span className="font-medium text-richblack-200">{blog.author?.firstName} {blog.author?.lastName}</span>
              {blog.author?.accountType && (
                <span className="text-xs bg-richblack-700 px-2 py-0.5 rounded-full">{blog.author.accountType}</span>
              )}
            </Link>
            <span className="flex items-center gap-1.5"><FiCalendar size={13} /> {new Date(blog.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="flex items-center gap-1.5"><FiClock size={13} /> {calculateReadTime(blog.content)}</span>
            <span className="flex items-center gap-1.5"><FiEye size={13} /> {blog.views || 0} views</span>
          </div>
        </header>

        {/* Thumbnail */}
        {blog.thumbnail && (
          <div className="w-full h-[360px] mb-12 rounded-2xl overflow-hidden border border-richblack-800 shadow-2xl">
            <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none text-richblack-100 mb-12
          prose-headings:text-white prose-headings:font-bold
          prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
          prose-p:leading-relaxed prose-p:text-richblack-200
          prose-a:text-yellow-50 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white
          prose-code:text-yellow-50 prose-code:bg-richblack-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-pre:bg-richblack-800 prose-pre:border prose-pre:border-richblack-700 prose-pre:rounded-xl
          prose-blockquote:border-l-yellow-50 prose-blockquote:text-richblack-300
          prose-table:text-richblack-200 prose-th:text-richblack-100 prose-td:text-richblack-300
          prose-li:text-richblack-200 prose-li:marker:text-yellow-50
          prose-img:rounded-xl prose-img:mx-auto
        ">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>

        {/* Like, Share, Edit Actions */}
        <div className="flex items-center justify-between py-6 border-t border-b border-richblack-800 mb-12">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                liked
                  ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                  : "bg-richblack-800 text-richblack-300 border border-richblack-700 hover:text-red-400 hover:border-red-500/30"
              }`}
            >
              <FiHeart className={liked ? "fill-current" : ""} /> {likeCount} {likeCount === 1 ? "Like" : "Likes"}
            </button>
            <span className="flex items-center gap-2 text-richblack-400 text-sm">
              <FiMessageSquare /> {blog.comments?.length || 0} Comments
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-richblack-800 border border-richblack-700 text-richblack-300 hover:text-yellow-50 hover:border-yellow-50/30 transition-all">
              <FiShare2 /> Share
            </button>
            {isAuthorOrAdmin && (
              <Link to="/dashboard/my-blogs"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-yellow-50/10 border border-yellow-50/20 text-yellow-50 hover:bg-yellow-50/20 transition-all">
                Edit Post
              </Link>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <FiMessageSquare className="text-yellow-50" />
            Comments ({blog.comments?.length || 0})
          </h3>

          {token ? (
            <form onSubmit={handleSubmit(onCommentSubmit)} className="mb-10 bg-richblack-800 p-5 rounded-2xl border border-richblack-700">
              <div className="flex gap-3">
                <img src={user?.image || `https://ui-avatars.com/api/?name=${user?.firstName}`} alt=""
                  className="w-10 h-10 rounded-full flex-shrink-0 object-cover" />
                <div className="flex-1">
                  <textarea
                    {...register("comment", { required: true })}
                    rows={3}
                    placeholder="Share your thoughts..."
                    className="w-full bg-richblack-900 border border-richblack-700 rounded-xl p-3 text-sm text-richblack-5 placeholder-richblack-500 focus:border-yellow-50 outline-none resize-none"
                  />
                  {errors.comment && <p className="text-xs text-pink-200 mt-1">Comment cannot be empty</p>}
                  <div className="flex justify-end mt-2">
                    <button type="submit" disabled={submitting}
                      className="bg-yellow-50 text-richblack-900 font-bold px-5 py-2 rounded-lg text-sm hover:bg-yellow-100 transition-all disabled:opacity-50">
                      {submitting ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-richblack-800 p-6 rounded-2xl border border-richblack-700 text-center mb-10">
              <p className="text-richblack-300 mb-3">Join the discussion — <strong className="text-white">log in to comment</strong></p>
              <Link to={`/login`}>
                <button className="bg-yellow-50 text-richblack-900 font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-100 transition-all">
                  Log In to Comment
                </button>
              </Link>
            </div>
          )}

          <div className="space-y-4">
            {blog.comments && [...blog.comments].reverse().map(comment => {
              const canDelete = user && (comment.user?._id === user._id || user.accountType === "Admin")
              return (
                <div key={comment._id} className="flex gap-3 p-4 rounded-xl bg-richblack-800/50 border border-richblack-700/50 group">
                  <img
                    src={comment.user?.image || `https://ui-avatars.com/api/?name=${comment.user?.firstName}+${comment.user?.lastName}&background=444&color=fff`}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-richblack-100 text-sm">{comment.user?.firstName} {comment.user?.lastName}</span>
                        <span className="text-xs text-richblack-500">{new Date(comment.createdAt).toLocaleDateString("en-IN")}</span>
                      </div>
                      {canDelete && (
                        <button onClick={() => handleDeleteComment(comment._id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-richblack-500 hover:text-pink-300 transition-all">
                          <FiTrash2 size={13} />
                        </button>
                      )}
                    </div>
                    <p className="text-richblack-300 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              )
            })}
            {(!blog.comments || blog.comments.length === 0) && (
              <p className="text-center text-richblack-500 py-10">No comments yet. Start the conversation!</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
