import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { FiUsers, FiBook, FiDollarSign, FiStar, FiPlus, FiEye } from "react-icons/fi"
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../services/operations/profileAPI"
import InstructorChart from "./InstructorDashboard/InstructorChart"
import { InlineCourseAnnouncements as Announcements } from "./Announcements"

export default function Instructor() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState(null)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const instructorApiData = await getInstructorData(token)
      const result = await fetchInstructorCourses(token)
      if (instructorApiData?.length) setInstructorData(instructorApiData)
      if (result) setCourses(result)
      setLoading(false)
    })()
  }, [token])

  const totalAmount = instructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0) || 0
  const totalStudents = instructorData?.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0) || 0
  const publishedCourses = courses.filter(c => c.status === "Published").length

  const stats = [
    { label: "Total Students", value: totalStudents, icon: <FiUsers />, color: "from-blue-500 to-blue-700" },
    { label: "Total Courses", value: courses.length, icon: <FiBook />, color: "from-purple-500 to-purple-700" },
    { label: "Published", value: publishedCourses, icon: <FiEye />, color: "from-green-500 to-green-700" },
    { label: "Total Earnings", value: `₹${totalAmount.toLocaleString()}`, icon: <FiDollarSign />, color: "from-yellow-500 to-yellow-700" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-50"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-richblack-5">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-richblack-300 mt-1">Here's what's happening with your courses</p>
        </div>
        <Link to="/dashboard/add-course">
          <button className="flex items-center gap-2 bg-yellow-50 text-richblack-900 font-bold px-5 py-3 rounded-lg hover:bg-yellow-100 transition-all">
            <FiPlus /> New Course
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-xl p-5 text-white shadow-lg`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl opacity-80">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm opacity-80 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Chart + Recent Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
          <h2 className="text-lg font-semibold text-richblack-5 mb-4">Revenue & Students</h2>
          {courses.length > 0 ? (
            <InstructorChart courses={instructorData} />
          ) : (
            <div className="flex items-center justify-center h-48 text-richblack-400">
              No data yet — create your first course!
            </div>
          )}
        </div>

        {/* Recent Courses */}
        <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-richblack-5">Your Courses</h2>
            <Link to="/dashboard/my-courses" className="text-yellow-50 text-sm hover:underline">View all</Link>
          </div>
          {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-4 text-richblack-400">
              <FiBook className="text-4xl" />
              <p>No courses yet</p>
              <Link to="/dashboard/add-course">
                <button className="bg-yellow-50 text-richblack-900 font-bold px-4 py-2 rounded-lg text-sm">
                  Create First Course
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {courses.slice(0, 5).map((course) => (
                <div key={course._id} className="flex items-center gap-3 p-3 rounded-lg bg-richblack-700 hover:bg-richblack-600 transition-all">
                  <img src={course.thumbnail} alt={course.courseName}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-richblack-5 font-medium text-sm truncate">{course.courseName}</p>
                    <p className="text-richblack-400 text-xs">{course.studentsEnrolled?.length || 0} students</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${course.status === "Published" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {course.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Send Announcement to Students */}
      {courses.length > 0 && (
        <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
          <h2 className="text-lg font-semibold text-richblack-5 mb-2">Send Announcement</h2>
          <p className="text-richblack-400 text-sm mb-4">Notify all enrolled students in a course about updates, new content, or important information.</p>
          <div className="space-y-4">
            {courses.filter(c => c.status === "Published").slice(0, 3).map(course => (
              <Announcements key={course._id} courseId={course._id} isInstructor={true} />
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
        <h2 className="text-lg font-semibold text-richblack-5 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Add Course", icon: <FiPlus />, link: "/dashboard/add-course", color: "bg-yellow-50 text-richblack-900" },
            { label: "My Courses", icon: <FiBook />, link: "/dashboard/my-courses", color: "bg-richblack-700 text-richblack-5" },
            { label: "My Profile", icon: <FiUsers />, link: "/dashboard/my-profile", color: "bg-richblack-700 text-richblack-5" },
            { label: "Settings", icon: <FiStar />, link: "/dashboard/settings", color: "bg-richblack-700 text-richblack-5" },
          ].map((action, i) => (
            <Link key={i} to={action.link}>
              <button className={`w-full flex items-center justify-center gap-2 ${action.color} font-semibold px-4 py-3 rounded-lg hover:opacity-90 transition-all text-sm`}>
                {action.icon} {action.label}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
