import React, { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import Footer from "../components/Common/Footer"
import { FiClock, FiUser, FiArrowRight, FiSearch, FiHeart, FiMessageSquare, FiEdit } from "react-icons/fi"
import { getAllBlogs } from "../services/operations/blogAPI"

const CATEGORIES = ["All", "Web Dev", "Data Science", "Career", "Tutorials", "News", "Mobile Dev", "Cloud", "DevOps", "Design", "Other"]

const categoryColors = {
  "Web Dev": "bg-blue-500/20 text-blue-300",
  "Data Science": "bg-purple-500/20 text-purple-300",
  "Career": "bg-green-500/20 text-green-300",
  "Tutorials": "bg-orange-500/20 text-orange-300",
  "News": "bg-yellow-500/20 text-yellow-300",
  "Mobile Dev": "bg-cyan-500/20 text-cyan-300",
  "Cloud": "bg-sky-500/20 text-sky-300",
  "DevOps": "bg-red-500/20 text-red-300",
  "Design": "bg-pink-500/20 text-pink-300",
  "Other": "bg-richblack-500/20 text-richblack-300",
}

function calcReadTime(content) {
  if (!content) return "1 min"
  return `${Math.ceil(content.split(/\s/g).length / 200)} min read`
}

function BlogCard({ post }) {
  return (
    <Link to={`/blog/${post._id}`}>
      <article className="bg-richblack-800 border border-richblack-700 hover:border-yellow-50/30 rounded-2xl overflow-hidden group transition-all hover:-translate-y-1 cursor-pointer h-full flex flex-col">
        <div className="overflow-hidden h-48 flex-shrink-0 bg-richblack-700">
          <img
            src={post.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=70"}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category] || categoryColors["Other"]}`}>
              {post.category}
            </span>
            <span className="text-xs text-richblack-500 flex items-center gap-1"><FiClock size={11} />{calcReadTime(post.content)}</span>
          </div>
          <h3 className="text-white font-bold text-base mt-2 mb-2 line-clamp-2 group-hover:text-yellow-50 transition-colors leading-snug">
            {post.title}
          </h3>
          <p className="text-richblack-400 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">{post.excerpt}</p>
          <div className="flex items-center justify-between text-richblack-500 text-xs pt-2 border-t border-richblack-700/50">
            <span className="flex items-center gap-1.5">
              <img
                src={post.author?.image || `https://ui-avatars.com/api/?name=${post.author?.firstName}&size=24&background=FFD700&color=000`}
                alt=""
                className="w-5 h-5 rounded-full object-cover"
              />
              {post.author?.firstName} {post.author?.lastName}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><FiHeart size={11} />{post.likes?.length || 0}</span>
              <span className="flex items-center gap-1"><FiMessageSquare size={11} />{post.comments?.length || 0}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default function Blog() {
  const { token } = useSelector((s) => s.auth)
  const [activeCategory, setActiveCategory] = useState("All")
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const params = {}
    if (activeCategory !== "All") params.category = activeCategory
    if (search) params.search = search
    const result = await getAllBlogs(params)
    setPosts(result)
    setLoading(false)
  }, [activeCategory, search])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setActiveCategory("All")
  }

  const clearSearch = () => { setSearch(""); setSearchInput("") }

  const featured = !search && activeCategory === "All" && posts.length > 0 ? posts[0] : null
  const gridPosts = featured ? posts.slice(1) : posts

  return (
    <div className="bg-richblack-900 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-richblack-800 to-richblack-900 py-16 border-b border-richblack-800">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-yellow-50 font-semibold text-xs uppercase tracking-widest mb-3">EduNest Blog</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Learn, Build, Grow</h1>
          <p className="text-richblack-400 max-w-xl mx-auto mb-8 text-base">
            Tutorials, career tips, industry news, and insights from the EduNest community.
          </p>
          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-lg mx-auto bg-richblack-800 border border-richblack-700 rounded-2xl px-4 py-3 focus-within:border-yellow-50/50 transition-all">
            <FiSearch className="text-richblack-400 flex-shrink-0" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search articles, topics, tags..."
              className="bg-transparent text-white placeholder-richblack-500 text-sm outline-none flex-1"
            />
            {search && (
              <button type="button" onClick={clearSearch} className="text-xs text-richblack-400 hover:text-white">Clear</button>
            )}
            <button type="submit" className="bg-yellow-50 text-richblack-900 font-bold text-xs px-4 py-1.5 rounded-xl hover:bg-yellow-100 transition-all">
              Search
            </button>
          </form>
          {search && (
            <p className="text-richblack-400 text-sm mt-3">Results for "<span className="text-yellow-50">{search}</span>" — {posts.length} posts found</p>
          )}
        </div>
      </section>

      {/* Featured Post */}
      {featured && (
        <section className="py-10">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-yellow-50 font-semibold text-xs uppercase tracking-widest mb-5">✨ Featured Post</p>
            <Link to={`/blog/${featured._id}`}>
              <div className="bg-richblack-800 border border-richblack-700 rounded-3xl overflow-hidden hover:border-yellow-50/30 transition-all group">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="overflow-hidden h-64 lg:h-auto">
                    <img
                      src={featured.thumbnail || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=700&q=80"}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full w-fit mb-4 ${categoryColors[featured.category] || categoryColors["Other"]}`}>
                      {featured.category}
                    </span>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-yellow-50 transition-colors leading-tight">
                      {featured.title}
                    </h2>
                    <p className="text-richblack-400 leading-relaxed mb-5 line-clamp-3 text-sm">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-richblack-500 text-xs mb-6">
                      <span className="flex items-center gap-1.5">
                        <img src={featured.author?.image || `https://ui-avatars.com/api/?name=${featured.author?.firstName}&size=20`} alt="" className="w-5 h-5 rounded-full" />
                        {featured.author?.firstName} {featured.author?.lastName}
                      </span>
                      <span className="flex items-center gap-1"><FiClock size={11} />{calcReadTime(featured.content)}</span>
                      <span className="flex items-center gap-1"><FiHeart size={11} />{featured.likes?.length || 0}</span>
                    </div>
                    <span className="flex items-center gap-2 text-yellow-50 font-semibold text-sm group-hover:gap-3 transition-all w-fit">
                      Read Article <FiArrowRight />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-10 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Category Filter */}
          {!search && (
            <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-1">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-yellow-50 text-richblack-900 shadow-md"
                      : "bg-richblack-800 text-richblack-300 hover:bg-richblack-700 hover:text-white border border-richblack-700"
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Write a Blog CTA */}
          {token && (
            <div className="flex justify-end mb-6">
              <Link to="/dashboard/my-blogs"
                className="flex items-center gap-2 text-sm font-medium text-yellow-50 bg-yellow-50/10 border border-yellow-50/20 px-4 py-2 rounded-xl hover:bg-yellow-50/20 transition-all">
                <FiEdit size={14} /> Write a Blog
              </Link>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-richblack-800 rounded-2xl animate-pulse border border-richblack-700" />
              ))}
            </div>
          ) : gridPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map(post => <BlogCard key={post._id} post={post} />)}
            </div>
          ) : (
            <div className="text-center py-20 bg-richblack-800/50 rounded-2xl border border-richblack-700">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-richblack-300 font-medium">No posts found</p>
              <p className="text-richblack-500 text-sm mt-1">
                {search ? "Try a different search term" : "No posts in this category yet"}
              </p>
              {!search && (
                <div className="mt-4 text-xs text-richblack-600 bg-richblack-800 rounded-xl px-4 py-3 inline-block">
                  💡 Tip: Visit <span className="text-yellow-50 font-mono">http://localhost:4000/api/v1/seed/blogs</span> in your browser to load 15 demo posts
                </div>
              )}
              {token && (
                <Link to="/dashboard/my-blogs">
                  <button className="mt-4 bg-yellow-50 text-richblack-900 font-bold px-5 py-2 rounded-xl text-sm hover:bg-yellow-100 transition-all">
                    Be the first to write one
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
