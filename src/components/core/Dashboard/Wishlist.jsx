import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi"
import { toast } from "react-hot-toast"
import { apiConnector } from "../../../services/apiConnector"
import { wishlistEndpoints } from "../../../services/apis"
import { CourseCardLarge } from "../../core/HomePage/CourseGrid"

export default function Wishlist() {
  const { token } = useSelector(s => s.auth)
  const [wishlist, setWishlist] = useState(null)
  const headers = { Authorization: `Bearer ${token}` }

  const fetchWishlist = async () => {
    try {
      const res = await apiConnector("GET", wishlistEndpoints.GET_API, null, headers)
      if (res.data.success) setWishlist(res.data.data)
    } catch { setWishlist([]) }
  }

  useEffect(() => { fetchWishlist() }, [token])

  const handleRemove = async (courseId) => {
    try {
      await apiConnector("POST", wishlistEndpoints.TOGGLE_API, { courseId }, headers)
      setWishlist(w => w.filter(c => c._id !== courseId))
      toast.success("Removed from wishlist")
    } catch { toast.error("Failed to remove") }
  }

  if (!wishlist) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1,2,3].map(i => (
          <div key={i} className="bg-richblack-800 rounded-xl overflow-hidden animate-pulse">
            <div className="h-40 bg-richblack-700" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-richblack-700 rounded w-3/4" />
              <div className="h-3 bg-richblack-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-richblack-5 flex items-center gap-2">
          <FiHeart className="text-red-400" /> Wishlist
        </h1>
        <p className="text-richblack-400">{wishlist.length} {wishlist.length === 1 ? "course" : "courses"}</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-richblack-400 bg-richblack-800 rounded-xl border border-richblack-700">
          <FiHeart className="text-5xl" />
          <p className="text-xl font-medium">Your wishlist is empty</p>
          <p className="text-sm text-center">Save courses you want to take later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {wishlist.map(course => (
            <div key={course._id} className="relative group">
              <CourseCardLarge course={course} showWishlist={false} />
              <button onClick={() => handleRemove(course._id)}
                className="absolute top-3 right-3 w-8 h-8 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10">
                <FiTrash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
