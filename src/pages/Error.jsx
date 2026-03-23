import { Link, useNavigate } from "react-router-dom"
import { FiArrowLeft, FiHome, FiSearch } from "react-icons/fi"

function Error() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-richblack-900 px-6 text-center">
      {/* Big 404 */}
      <div className="relative mb-8">
        <p className="text-[150px] md:text-[200px] font-black text-richblack-800 leading-none select-none">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-yellow-50/10 rounded-2xl flex items-center justify-center">
            <FiSearch className="text-yellow-50 text-4xl" />
          </div>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Page Not Found
      </h1>
      <p className="text-richblack-400 text-lg max-w-md mb-10 leading-relaxed">
        Looks like you've wandered into uncharted territory. The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-richblack-800 border border-richblack-700 text-richblack-200 hover:text-white hover:bg-richblack-700 font-semibold px-6 py-3 rounded-xl transition-all"
        >
          <FiArrowLeft /> Go Back
        </button>
        <Link to="/">
          <button className="flex items-center gap-2 bg-yellow-50 text-richblack-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-100 transition-all shadow-lg shadow-yellow-500/20">
            <FiHome /> Back to Home
          </button>
        </Link>
      </div>

      {/* Popular Links */}
      <div className="mt-12">
        <p className="text-richblack-500 text-sm mb-4">Or explore these popular pages</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { label: "Browse Courses", to: "/catalog/web-development" },
            { label: "About Us", to: "/about" },
            { label: "Contact", to: "/contact" },
            { label: "Login", to: "/login" },
          ].map(link => (
            <Link key={link.to} to={link.to}
              className="bg-richblack-800 border border-richblack-700 hover:border-yellow-50/30 text-richblack-300 hover:text-yellow-50 px-4 py-2 rounded-xl text-sm transition-all">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Error