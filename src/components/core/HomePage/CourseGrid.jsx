import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FiStar, FiUsers, FiHeart, FiPlay, FiClock } from "react-icons/fi"
import { useSelector, useDispatch } from "react-redux"
import { apiConnector } from "../../../services/apiConnector"
import { wishlistEndpoints } from "../../../services/apis"

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-richblack-600 fill-richblack-600"}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function CourseCardLarge({ course, showWishlist = false }) {
  const { token } = useSelector(s => s.auth)
  const { user } = useSelector(s => s.profile)
  const [wishlisted, setWishlisted] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  useEffect(() => {
    if (user?.wishlist) {
      setWishlisted(user.wishlist.includes(course._id))
    }
  }, [user, course._id])

  const handleWishlist = async (e) => {
    e.preventDefault(); e.stopPropagation()
    if (!token) return
    setWishlistLoading(true)
    try {
      const res = await apiConnector("POST", wishlistEndpoints.TOGGLE_API, { courseId: course._id }, { Authorization: `Bearer ${token}` })
      if (res.data.success) setWishlisted(res.data.added)
    } catch {}
    setWishlistLoading(false)
  }

  const rating = parseFloat(course.avgRating) || 0
  const isNew = (Date.now() - new Date(course.createdAt)) < 30 * 24 * 60 * 60 * 1000
  const isBestseller = course.totalStudents > 50

  return (
    <Link to={`/courses/${course._id}`} className="group block">
      <div className="bg-richblack-800 rounded-2xl overflow-hidden border border-richblack-700 hover:border-yellow-50/30 hover:shadow-xl hover:shadow-black/40 transition-all duration-300 hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative overflow-hidden">
          <img
            src={course.thumbnail || "/default-course.jpg"}
            alt={course.courseName}
            className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-yellow-50 text-richblack-900 rounded-full p-4 shadow-xl">
              <FiPlay className="text-2xl ml-0.5" />
            </div>
          </div>
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isBestseller && <span className="bg-yellow-400 text-richblack-900 text-[10px] font-bold px-2 py-1 rounded">Bestseller</span>}
            {isNew && !isBestseller && <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded">New</span>}
          </div>
          {/* Wishlist */}
          {showWishlist && token && (
            <button onClick={handleWishlist} disabled={wishlistLoading}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-lg ${wishlisted ? "bg-red-500 text-white" : "bg-black/60 text-white hover:bg-red-500"}`}>
              <FiHeart className={wishlisted ? "fill-current" : ""} size={14} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2.5">
          <h3 className="text-richblack-5 font-semibold text-sm leading-snug line-clamp-2 group-hover:text-yellow-50 transition-colors">
            {course.courseName}
          </h3>
          <p className="text-richblack-400 text-xs">
            {course.instructor?.firstName} {course.instructor?.lastName}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-bold text-sm">{rating > 0 ? rating : "New"}</span>
            <StarRating rating={rating} />
            <span className="text-richblack-500 text-xs">({course.totalReviews})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-richblack-5 font-bold text-base">
              {course.price === 0 ? "Free" : `₹${course.price?.toLocaleString("en-IN")}`}
            </span>
            <span className="text-richblack-500 text-xs flex items-center gap-1">
              <FiUsers size={11} /> {course.totalStudents?.toLocaleString("en-IN") || 0}
            </span>
          </div>
          {course.category && (
            <span className="inline-block text-xs bg-richblack-700 text-richblack-300 px-2 py-0.5 rounded-full">
              {course.category?.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export function CourseCardHorizontal({ course }) {
  const rating = parseFloat(course.avgRating) || 0
  return (
    <Link to={`/courses/${course._id}`} className="group flex gap-4 bg-richblack-800 hover:bg-richblack-700 border border-richblack-700 hover:border-yellow-50/20 rounded-xl p-3 transition-all">
      <img src={course.thumbnail} alt={course.courseName} className="w-28 h-20 object-cover rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="text-richblack-5 text-sm font-medium line-clamp-2 group-hover:text-yellow-50 transition-colors">{course.courseName}</h3>
        <p className="text-richblack-500 text-xs">{course.instructor?.firstName} {course.instructor?.lastName}</p>
        <div className="flex items-center gap-1.5">
          <span className="text-yellow-400 text-xs font-bold">{rating > 0 ? rating : "—"}</span>
          <StarRating rating={rating} />
        </div>
        <p className="text-richblack-5 text-sm font-bold">{course.price === 0 ? "Free" : `₹${course.price}`}</p>
      </div>
    </Link>
  )
}

export default function CourseGrid({ title, subtitle, courses, loading, showWishlist = true, viewAllLink }) {
  if (loading) {
    return (
      <div>
        {title && <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{title}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-richblack-800 rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-richblack-700" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-richblack-700 rounded w-3/4" />
                <div className="h-3 bg-richblack-700 rounded w-1/2" />
                <div className="h-3 bg-richblack-700 rounded w-1/3" />
                <div className="h-5 bg-richblack-700 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!courses?.length) return null

  return (
    <div>
      {(title || viewAllLink) && (
        <div className="flex items-end justify-between mb-6">
          <div>
            {title && <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>}
            {subtitle && <p className="text-richblack-400 mt-1">{subtitle}</p>}
          </div>
          {viewAllLink && (
            <Link to={viewAllLink} className="text-yellow-50 hover:text-yellow-200 text-sm font-medium flex items-center gap-1 transition-all">
              View all <span>→</span>
            </Link>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {courses.map(course => (
          <CourseCardLarge key={course._id} course={course} showWishlist={showWishlist} />
        ))}
      </div>
    </div>
  )
}
