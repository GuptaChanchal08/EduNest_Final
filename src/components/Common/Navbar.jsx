import { useEffect, useState, useRef, useCallback } from "react"
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  FiShoppingCart, FiMenu, FiX, FiChevronDown, FiSearch,
  FiBell, FiHeart, FiBook, FiUser, FiSettings, FiLogOut,
  FiTrendingUp, FiAward, FiMessageSquare, FiEdit
} from "react-icons/fi"
import { VscDashboard } from "react-icons/vsc"
import { apiConnector } from "../../services/apiConnector"
import { categories, notificationEndpoints } from "../../services/apis"
import { logout } from "../../services/operations/authAPI"
import { setNotifications, markAllRead } from "../../slices/notificationSlice"
import useOnClickOutside from "../../hooks/useOnClickOutside"

// ─── Notification Bell ────────────────────────────────────────────────────────
function NotificationBell() {
  const dispatch = useDispatch()
  const { token } = useSelector(s => s.auth)
  const { notifications, unreadCount } = useSelector(s => s.notification)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useOnClickOutside(ref, () => setOpen(false))

  const fetchNotifications = useCallback(async () => {
    if (!token) return
    try {
      const BASE = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1"
      const res = await apiConnector("GET", BASE + "/notifications", null, {
        Authorization: `Bearer ${token}`,
      })
      if (res?.data?.success) dispatch(setNotifications(res.data.data))
    } catch {}
  }, [token, dispatch])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // poll every 30s
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const handleMarkAllRead = async () => {
    try {
      const BASE = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1"
      await apiConnector("POST", BASE + "/notifications/mark-all-read", null, {
        Authorization: `Bearer ${token}`,
      })
      dispatch(markAllRead())
    } catch {}
  }

  const typeIcon = {
    enrollment: "🎓",
    announcement: "📢",
    course_review: "⭐",
    course_published: "🚀",
    welcome: "👋",
    payment: "💳",
    blog_comment: "💬",
  }

  const timeAgo = (d) => {
    const diff = Date.now() - new Date(d)
    const m = Math.floor(diff / 60000)
    if (m < 1) return "just now"
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(p => !p); if (!open) fetchNotifications() }}
        className="relative p-2 rounded-lg text-richblack-300 hover:text-white hover:bg-richblack-800 transition-all"
      >
        <FiBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-richblack-800 border border-richblack-700 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-[1000] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-richblack-700">
            <h3 className="font-bold text-richblack-5 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead}
                className="text-xs text-yellow-50 hover:text-yellow-200 font-medium transition-colors">
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <FiBell className="text-3xl text-richblack-600 mx-auto mb-2" />
                <p className="text-richblack-400 text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 15).map(n => (
                <Link
                  key={n._id}
                  to={n.link || "#"}
                  onClick={() => setOpen(false)}
                  className={`flex gap-3 px-4 py-3 hover:bg-richblack-700/50 transition-all border-b border-richblack-700/30 last:border-0 ${!n.isRead ? "bg-yellow-50/3" : ""}`}
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">{typeIcon[n.type] || "🔔"}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${n.isRead ? "text-richblack-200" : "text-richblack-5"}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-richblack-400 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-richblack-600 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.isRead && <span className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0 mt-1.5" />}
                </Link>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-richblack-700 text-center">
              <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}
                className="text-xs text-yellow-50 hover:text-yellow-200 font-medium">
                View all notifications →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Profile Dropdown ─────────────────────────────────────────────────────────
function ProfileDropdown() {
  const { user } = useSelector(s => s.profile)
  const { token } = useSelector(s => s.auth)
  const { totalItems } = useSelector(s => s.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useOnClickOutside(ref, () => setOpen(false))

  if (!user) return null

  const isStudent = user.accountType === "Student"
  const isInstructor = user.accountType === "Instructor"
  const isAdmin = user.accountType === "Admin"

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 p-1 rounded-xl hover:bg-richblack-800 transition-all"
      >
        <img
          src={user.image}
          alt={user.firstName}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-richblack-700 hover:ring-yellow-50/50 transition-all"
        />
        <FiChevronDown className={`text-richblack-400 text-sm transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-richblack-800 border border-richblack-700 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-[1000] overflow-hidden">
          {/* User header */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-richblack-700 bg-gradient-to-r from-richblack-800 to-richblack-700">
            <img src={user.image} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-yellow-50/30" />
            <div className="min-w-0">
              <p className="font-bold text-richblack-5 truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-richblack-400 truncate">{user.email}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                isAdmin ? "bg-red-500/20 text-red-400" :
                isInstructor ? "bg-purple-500/20 text-purple-400" :
                "bg-blue-500/20 text-blue-400"
              }`}>
                {user.accountType}
              </span>
            </div>
          </div>

          {/* Quick stats for students */}
          {isStudent && (
            <div className="grid grid-cols-2 gap-px bg-richblack-700 border-b border-richblack-700">
              <Link to="/dashboard/cart" onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-3 bg-richblack-800 hover:bg-richblack-700 transition-all">
                <FiShoppingCart className="text-yellow-50 text-sm" />
                <div>
                  <p className="text-xs text-richblack-400">Cart</p>
                  <p className="text-sm font-bold text-richblack-5">{totalItems}</p>
                </div>
              </Link>
              <Link to="/dashboard/wishlist" onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-3 bg-richblack-800 hover:bg-richblack-700 transition-all">
                <FiHeart className="text-red-400 text-sm" />
                <div>
                  <p className="text-xs text-richblack-400">Wishlist</p>
                  <p className="text-sm font-bold text-richblack-5">Saved</p>
                </div>
              </Link>
            </div>
          )}

          {/* Nav links */}
          <div className="py-1">
            <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-richblack-200 hover:bg-richblack-700 hover:text-richblack-5 transition-all">
              <VscDashboard className="text-base text-richblack-400" /> Dashboard
            </Link>

            {isStudent && (
              <Link to="/dashboard/enrolled-courses" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-richblack-200 hover:bg-richblack-700 hover:text-richblack-5 transition-all">
                <FiBook className="text-base text-richblack-400" /> My Learning
              </Link>
            )}

            {isInstructor && (
              <>
                <Link to="/dashboard/instructor" onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-richblack-200 hover:bg-richblack-700 hover:text-richblack-5 transition-all">
                  <FiTrendingUp className="text-base text-richblack-400" /> Instructor Dashboard
                </Link>
                <Link to="/dashboard/my-courses" onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-richblack-200 hover:bg-richblack-700 hover:text-richblack-5 transition-all">
                  <FiBook className="text-base text-richblack-400" /> My Courses
                </Link>
              </>
            )}

            {isAdmin && (
              <Link to="/dashboard/admin" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-richblack-700 transition-all">
                <FiSettings className="text-base" /> Admin Panel
              </Link>
            )}

          <div className="border-t border-richblack-700 py-1">
            <Link to="/dashboard/settings" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-richblack-200 hover:bg-richblack-700 hover:text-richblack-5 transition-all">
              <FiSettings className="text-base text-richblack-400" /> Account Settings
            </Link>
          </div>

          <div className="border-t border-richblack-700 py-1">
            <Link to="/dashboard/purchase-history" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-richblack-200 hover:bg-richblack-700 hover:text-richblack-5 transition-all">
              Purchase history
            </Link>
            <Link to="/dashboard/subscriptions" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-richblack-200 hover:bg-richblack-700 hover:text-richblack-5 transition-all">
              Subscriptions
            </Link>
            <Link to="/dashboard/udemy-credits" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-richblack-200 hover:bg-richblack-700 hover:text-richblack-5 transition-all">
              EduNest credits
            </Link>
          </div>

          <div className="border-t border-richblack-700 py-1">
            <Link to="/dashboard/my-blogs" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-richblack-200 hover:bg-richblack-700 hover:text-richblack-5 transition-all">
              <FiEdit className="text-base text-richblack-400" /> My Blogs
            </Link>

            <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-richblack-200 hover:bg-richblack-700 hover:text-richblack-5 transition-all">
              <FiUser className="text-base text-richblack-400" /> Public Profile
            </Link>
          </div>
          </div>

          <div className="border-t border-richblack-700 py-1">
            <Link to="/teach" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-richblack-200 hover:bg-richblack-700 hover:text-richblack-5 transition-all">
              <FiAward className="text-base text-richblack-400" /> Teach on EduNest
            </Link>
            <Link to="/contact" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-richblack-200 hover:bg-richblack-700 hover:text-richblack-5 transition-all">
              <FiMessageSquare className="text-base text-richblack-400" /> Help & Support
            </Link>
          </div>

          <div className="border-t border-richblack-700 py-1">
            <button
              onClick={() => { dispatch(logout(navigate)); setOpen(false) }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-all"
            >
              <FiLogOut className="text-base" /> Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const { token } = useSelector(s => s.auth)
  const { user } = useSelector(s => s.profile)
  const { totalItems } = useSelector(s => s.cart)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [subLinks, setSubLinks] = useState([])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res?.data?.data || [])
      } catch {}
    })()
  }, [])

  const matchRoute = (route) => matchPath({ path: route }, location.pathname)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const isStudent = user?.accountType === "Student"
  const isInstructor = user?.accountType === "Instructor"

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? "bg-richblack-900/98 backdrop-blur-xl shadow-xl" : "bg-richblack-900"
    }`}>

      {/* ── Top bar (secondary nav like Udemy) ─────────────────────────── */}
      <div className="hidden lg:block border-b border-richblack-800">
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between">
          {/* Category quick links */}
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-none">
            {subLinks.slice(0, 8).map(cat => (
              <Link
                key={cat._id}
                to={`/catalog/${cat.name.replace(/\//g, "-").split(" ").join("-").toLowerCase()}`}
                className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all border-b-2 ${
                  matchRoute(`/catalog/${cat.name.replace(/\//g, "-").split(" ").join("-").toLowerCase()}`)
                    ? "text-yellow-50 border-yellow-50"
                    : "text-richblack-300 hover:text-richblack-100 border-transparent hover:border-richblack-500"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
          {/* Right side links */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {!token && (
              <>
                <Link to="/teach" className="text-xs text-richblack-400 hover:text-richblack-200 transition-all">
                  Teach on EduNest
                </Link>
                <Link to="/blog" className="text-xs text-richblack-400 hover:text-richblack-200 transition-all">
                  Blog
                </Link>
              </>
            )}
            {token && isStudent && (
              <Link to="/dashboard/enrolled-courses"
                className="text-xs text-richblack-400 hover:text-yellow-50 transition-all font-medium flex items-center gap-1">
                <FiBook size={11} /> My Learning
              </Link>
            )}
            {token && isInstructor && (
              <Link to="/dashboard/instructor"
                className="text-xs text-richblack-400 hover:text-yellow-50 transition-all font-medium flex items-center gap-1">
                <FiTrendingUp size={11} /> Instructor Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Main bar ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center text-richblack-900 font-black text-base shadow-md shadow-yellow-500/30 group-hover:shadow-yellow-500/50 transition-all">
            E
          </div>
          <span className="text-white font-bold text-lg tracking-tight hidden sm:block">
            Edu<span className="text-yellow-400">Nest</span>
          </span>
        </Link>

        {/* Catalog dropdown — desktop only */}
        <div className="hidden lg:block relative flex-shrink-0"
          onMouseEnter={() => setCatalogOpen(true)}
          onMouseLeave={() => setCatalogOpen(false)}>
          <button className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            matchRoute("/catalog/:catalogName") ? "text-yellow-50" : "text-richblack-300 hover:text-white"
          }`}>
            Explore <FiChevronDown className={`text-xs transition-transform ${catalogOpen ? "rotate-180" : ""}`} />
          </button>
          <div className={`absolute top-full left-0 mt-1 w-56 bg-richblack-800/98 backdrop-blur-xl border border-richblack-700 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-200 ${
            catalogOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"
          }`}>
            {subLinks.map(link => (
              <Link key={link._id}
                to={`/catalog/${link.name.replace(/\//g, "-").split(" ").join("-").toLowerCase()}`}
                onClick={() => setCatalogOpen(false)}
                className="block px-4 py-2.5 text-sm text-richblack-200 hover:bg-richblack-700 hover:text-yellow-50 transition-all">
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Search bar — center, takes remaining space */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden lg:flex items-center gap-2 bg-richblack-800 border border-richblack-600 focus-within:border-yellow-50/50 rounded-full px-4 py-2 transition-all">
          <FiSearch className="text-richblack-400 flex-shrink-0 text-sm" />
          <input
            ref={searchRef}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for anything..."
            className="bg-transparent text-white placeholder-richblack-500 text-sm outline-none flex-1"
          />
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Mobile search */}
          <button
            onClick={() => navigate("/search")}
            className="lg:hidden p-2 rounded-lg text-richblack-300 hover:text-white hover:bg-richblack-800 transition-all">
            <FiSearch className="text-lg" />
          </button>

          {/* Blog — desktop */}
          <Link to="/blog" className="hidden lg:block px-3 py-2 text-sm text-richblack-300 hover:text-white hover:bg-richblack-800 rounded-lg transition-all font-medium">
            Blog
          </Link>

          {token ? (
            <>
              {/* Cart (students only) */}
              {isStudent && (
                <Link to="/dashboard/cart"
                  className="relative p-2 rounded-lg text-richblack-300 hover:text-white hover:bg-richblack-800 transition-all">
                  <FiShoppingCart className="text-xl" />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-yellow-50 text-richblack-900 text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}

              {/* Notifications */}
              <NotificationBell />

              {/* Profile */}
              <ProfileDropdown />
            </>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Link to="/login">
                <button className="text-richblack-300 hover:text-white font-medium text-sm px-4 py-2 rounded-lg border border-richblack-700 hover:border-richblack-500 transition-all">
                  Log In
                </button>
              </Link>
              <Link to="/signup">
                <button className="bg-yellow-50 text-richblack-900 font-bold text-sm px-5 py-2 rounded-lg hover:bg-yellow-100 transition-all shadow-md shadow-yellow-500/20">
                  Sign Up
                </button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-richblack-300 hover:text-white hover:bg-richblack-800 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden bg-richblack-900 border-t border-richblack-700 px-4 pb-6 pt-2 space-y-1">
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-richblack-800 border border-richblack-600 rounded-xl px-3 py-2.5 mb-3">
            <FiSearch className="text-richblack-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="bg-transparent text-white placeholder-richblack-500 text-sm outline-none flex-1"
            />
          </form>

          <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-richblack-200 hover:bg-richblack-800">Home</Link>
          <Link to="/blog" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-richblack-200 hover:bg-richblack-800">Blog</Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-richblack-200 hover:bg-richblack-800">About</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-richblack-200 hover:bg-richblack-800">Contact</Link>
          <Link to="/teach" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-richblack-200 hover:bg-richblack-800">Teach on EduNest</Link>

          <div className="pt-1">
            <p className="text-richblack-500 text-xs font-semibold px-3 py-2 uppercase tracking-wider">Categories</p>
            {subLinks.map(link => (
              <Link key={link._id}
                to={`/catalog/${link.name.replace(/\//g, "-").split(" ").join("-").toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="block px-5 py-2 text-sm rounded-xl text-richblack-300 hover:text-yellow-50 hover:bg-richblack-800 transition-all">
                {link.name}
              </Link>
            ))}
          </div>

          {!token ? (
            <div className="flex gap-3 pt-3 border-t border-richblack-700">
              <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                <button className="w-full border border-richblack-600 text-richblack-200 font-medium py-3 rounded-xl text-sm">Log In</button>
              </Link>
              <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                <button className="w-full bg-yellow-50 text-richblack-900 font-bold py-3 rounded-xl text-sm">Sign Up</button>
              </Link>
            </div>
          ) : (
            <div className="pt-3 border-t border-richblack-700 space-y-1">
              {isStudent && <Link to="/dashboard/enrolled-courses" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-richblack-200 hover:bg-richblack-800 text-sm">My Learning</Link>}
              <Link to="/dashboard/my-profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-richblack-200 hover:bg-richblack-800 text-sm">Dashboard</Link>
              <Link to="/dashboard/settings" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-richblack-200 hover:bg-richblack-800 text-sm">Settings</Link>
              <button onClick={() => { dispatch(logout(navigate)); setMobileOpen(false) }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-400/10 text-sm">
                Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
