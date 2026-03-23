import React, { useEffect, useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  FiArrowRight, FiPlay, FiUsers, FiBook, FiStar, FiGlobe,
  FiAward, FiCheckCircle, FiSearch, FiTrendingUp, FiZap,
  FiShield, FiHeadphones, FiGift
} from "react-icons/fi"
import Footer from "../components/Common/Footer"
import ReviewSlider from "../components/Common/ReviewSlider"
import CourseGrid from "../components/core/HomePage/CourseGrid"
import { apiConnector } from "../services/apiConnector"
import { homeEndpoints, categories } from "../services/apis"

const CATEGORY_ICONS = {
  default: "💡", "web development": "💻", "data science": "📊",
  "machine learning": "🤖", "design": "🎨", "business": "📈",
  "marketing": "📣", "photography": "📷", "music": "🎵",
  "finance": "💰", "health": "💪", "language": "🌍",
}

export default function Home() {
  const { user } = useSelector(s => s.profile)
  const { token } = useSelector(s => s.auth)
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [latestCourses, setLatestCourses] = useState([])
  const [featuredCourses, setFeaturedCourses] = useState([])
  const [freeCourses, setFreeCourses] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [loadingLatest, setLoadingLatest] = useState(true)
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const heroRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestRes, featuredRes, catsRes] = await Promise.all([
          apiConnector("GET", homeEndpoints.GET_LATEST_COURSES),
          apiConnector("GET", homeEndpoints.GET_FEATURED_COURSES),
          apiConnector("GET", categories.CATEGORIES_API),
        ])
        if (latestRes.data.success) {
          const all = latestRes.data.data
          setLatestCourses(all)
          setFreeCourses(all.filter(c => c.price === 0).slice(0, 4))
        }
        if (featuredRes.data.success) setFeaturedCourses(featuredRes.data.data)
        if (catsRes.data.success) setAllCategories(catsRes.data.data || [])
      } catch (e) { console.error(e) } finally {
        setLoadingLatest(false); setLoadingFeatured(false)
      }
    }
    fetchData()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  // Stats computed from real data
  const totalStudents = featuredCourses.reduce((a, c) => a + (c.totalStudents || 0), 0)
  const totalCourses = latestCourses.length

  return (
    <div className="bg-richblack-900 min-h-screen">

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative overflow-hidden">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-richblack-900 via-richblack-800 to-richblack-900" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Left: Text */}
            <div className="flex-1 flex flex-col items-start gap-6 text-left">
              {/* Pill badge */}
              {totalCourses > 0 && (
                <div className="flex items-center gap-2 bg-richblack-800 border border-richblack-600 rounded-full px-4 py-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-richblack-300">{totalCourses} courses available now</span>
                </div>
              )}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                Learn. Build.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
                  Succeed.
                </span>
              </h1>

              <p className="text-richblack-300 text-lg leading-relaxed max-w-lg">
                Master in-demand skills with expert-led courses. Whether you're starting from scratch
                or leveling up your career — we have the course for you.
              </p>

              {/* Search bar */}
              <form onSubmit={handleSearch} className="w-full max-w-lg">
                <div className="flex items-center bg-white rounded-2xl overflow-hidden shadow-2xl shadow-black/30 p-1.5">
                  <div className="flex items-center gap-3 flex-1 pl-3">
                    <FiSearch className="text-richblack-700 flex-shrink-0 text-lg" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="What do you want to learn?"
                      className="flex-1 bg-transparent text-richblack-900 placeholder-richblack-500 outline-none text-sm py-2"
                    />
                  </div>
                  <button type="submit"
                    className="bg-yellow-400 hover:bg-yellow-500 text-richblack-900 font-bold px-6 py-3 rounded-xl transition-all text-sm flex-shrink-0">
                    Search
                  </button>
                </div>
              </form>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                {token ? (
                  <Link to="/dashboard/enrolled-courses">
                    <button className="bg-yellow-50 text-richblack-900 font-bold px-7 py-3.5 rounded-xl hover:bg-yellow-100 transition-all text-sm shadow-lg shadow-yellow-500/20">
                      My Learning →
                    </button>
                  </Link>
                ) : (
                  <Link to="/signup">
                    <button className="bg-yellow-50 text-richblack-900 font-bold px-7 py-3.5 rounded-xl hover:bg-yellow-100 transition-all text-sm shadow-lg shadow-yellow-500/20">
                      Start Learning Free →
                    </button>
                  </Link>
                )}
                <Link to="/catalog/web-development">
                  <button className="border border-richblack-600 text-white font-medium px-7 py-3.5 rounded-xl hover:bg-richblack-800 transition-all text-sm">
                    Browse Courses
                  </button>
                </Link>
              </div>

              {/* Social proof */}
              {totalStudents > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["A","B","C","D"].map((l,i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-richblack-900 flex items-center justify-center text-xs font-bold ${["bg-yellow-500","bg-blue-500","bg-green-500","bg-purple-500"][i]}`}>
                        {l}
                      </div>
                    ))}
                  </div>
                  <p className="text-richblack-400 text-sm">
                    <span className="text-white font-semibold">{totalStudents.toLocaleString("en-IN")}+</span> students enrolled
                  </p>
                </div>
              )}
            </div>

            {/* Right: Featured course preview card */}
            {featuredCourses[0] && (
              <div className="flex-shrink-0 w-full lg:w-80">
                <Link to={`/courses/${featuredCourses[0]._id}`}
                  className="block bg-richblack-800 rounded-2xl overflow-hidden border border-richblack-700 hover:border-yellow-50/30 shadow-2xl transition-all hover:-translate-y-1 group">
                  <div className="relative">
                    <img src={featuredCourses[0].thumbnail} alt="" className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-yellow-50 rounded-full p-4"><FiPlay className="text-2xl ml-0.5 text-richblack-900" /></div>
                    </div>
                    <div className="absolute top-3 left-3 bg-yellow-400 text-richblack-900 text-xs font-bold px-2 py-1 rounded">⭐ Top Pick</div>
                  </div>
                  <div className="p-5 space-y-2">
                    <p className="text-richblack-5 font-semibold text-sm line-clamp-2">{featuredCourses[0].courseName}</p>
                    <p className="text-richblack-400 text-xs">{featuredCourses[0].instructor?.firstName} {featuredCourses[0].instructor?.lastName}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <FiStar className="text-yellow-400 fill-yellow-400 text-xs" />
                        <span className="text-yellow-400 text-sm font-bold">{featuredCourses[0].avgRating}</span>
                        <span className="text-richblack-500 text-xs">({featuredCourses[0].totalReviews})</span>
                      </div>
                      <span className="text-richblack-5 font-bold">
                        {featuredCourses[0].price === 0 ? "Free" : `₹${featuredCourses[0].price}`}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      {allCategories.length > 0 && (
        <section className="border-y border-richblack-800 py-8 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-3 min-w-max">
              {allCategories.slice(0, 10).map(cat => {
                const icon = CATEGORY_ICONS[cat.name?.toLowerCase()] || CATEGORY_ICONS.default
                const slug = cat.name?.split(" ").join("-").toLowerCase()
                return (
                  <Link key={cat._id} to={`/catalog/${slug}`}
                    className="flex items-center gap-2 bg-richblack-800 hover:bg-richblack-700 border border-richblack-700 hover:border-yellow-50/30 text-richblack-200 hover:text-yellow-50 rounded-xl px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap">
                    <span>{icon}</span>
                    {cat.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== FEATURED COURSES ===== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <CourseGrid
            title="🏆 Featured Courses"
            subtitle="Hand-picked top courses based on student demand and ratings"
            courses={featuredCourses}
            loading={loadingFeatured}
            showWishlist={true}
          />
        </div>
      </section>

      {/* ===== WHY CHOOSE US — Value Props ===== */}
      <section className="bg-richblack-800/50 py-16 border-y border-richblack-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">Why students choose EduNest</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <FiZap className="text-yellow-400" />, title: "Learn at Your Pace", desc: "Access your courses 24/7 on any device. Pause, rewind, replay anytime." },
              { icon: <FiShield className="text-green-400" />, title: "Certificate on Completion", desc: "Earn a shareable certificate once you finish a course. Add it to LinkedIn." },
              { icon: <FiTrendingUp className="text-blue-400" />, title: "Real-World Projects", desc: "Practice with hands-on projects and quizzes that reinforce your learning." },
              { icon: <FiHeadphones className="text-purple-400" />, title: "Q&A Support", desc: "Ask questions under any lecture. Get answers from instructors and peers." },
              { icon: <FiGift className="text-pink-400" />, title: "Free Courses Available", desc: "Start learning with zero cost. Hundreds of free courses in every category." },
              { icon: <FiUsers className="text-orange-400" />, title: "Active Community", desc: "Join thousands of learners. Discuss, collaborate, and grow together." },
            ].map((f, i) => (
              <div key={i} className="flex gap-4 bg-richblack-800 border border-richblack-700 hover:border-richblack-600 rounded-2xl p-5 group transition-all hover:-translate-y-0.5">
                <div className="w-11 h-11 bg-richblack-700 group-hover:scale-110 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-richblack-5 font-semibold text-sm mb-1">{f.title}</h3>
                  <p className="text-richblack-400 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LATEST COURSES ===== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <CourseGrid
            title="🆕 Newest Courses"
            subtitle="Just added by our instructors — be among the first to enroll"
            courses={latestCourses.slice(0, 8)}
            loading={loadingLatest}
            showWishlist={true}
            viewAllLink="/search"
          />
        </div>
      </section>

      {/* ===== FREE COURSES STRIP ===== */}
      {freeCourses.length > 0 && (
        <section className="py-12 bg-gradient-to-r from-green-900/20 to-richblack-900 border-y border-green-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">FREE</span>
              <h2 className="text-xl font-bold text-white">Start for Free Today</h2>
            </div>
            <CourseGrid courses={freeCourses} showWishlist={true} />
          </div>
        </section>
      )}

      {/* ===== LOGGED-IN: CONTINUE LEARNING ===== */}
      {token && user && (
        <section className="py-12 bg-richblack-800/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Welcome back, {user.firstName}! 👋</h2>
                <p className="text-richblack-400 text-sm mt-1">Continue where you left off</p>
              </div>
              <Link to="/dashboard/enrolled-courses"
                className="text-yellow-50 hover:text-yellow-200 text-sm font-medium flex items-center gap-1">
                My Learning →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "My Courses", link: "/dashboard/enrolled-courses", icon: "📚", color: "from-blue-900/40 to-blue-800/20 border-blue-800/40" },
                { label: "Wishlist", link: "/dashboard/wishlist", icon: "❤️", color: "from-red-900/40 to-red-800/20 border-red-800/40" },
                { label: "Certificates", link: "/dashboard/certificates", icon: "🏆", color: "from-yellow-900/40 to-yellow-800/20 border-yellow-800/40" },
                { label: "My Notes", link: "/dashboard/notes", icon: "📝", color: "from-green-900/40 to-green-800/20 border-green-800/40" },
              ].map((item, i) => (
                <Link key={i} to={item.link}
                  className={`bg-gradient-to-br ${item.color} border rounded-xl p-5 text-center hover:scale-105 transition-all`}>
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-richblack-200 text-sm font-medium">{item.label}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== REVIEWS ===== */}
      <section className="py-16 bg-richblack-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">What Our Students Say</h2>
          <p className="text-richblack-400 mb-10">Real reviews from real learners</p>
          <ReviewSlider />
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-richblack-900 mb-4">
            {token ? "Keep learning. Keep growing." : "Your next skill is one click away."}
          </h2>
          <p className="text-richblack-800 text-lg mb-8">
            {token
              ? "Explore new courses and add more skills to your profile."
              : "Join thousands of students. No credit card required."}
          </p>
          <Link to={token ? "/search" : "/signup"}>
            <button className="bg-richblack-900 text-white font-bold px-10 py-4 rounded-xl hover:bg-richblack-800 transition-all text-base shadow-xl">
              {token ? "Explore Courses →" : "Create Free Account →"}
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
