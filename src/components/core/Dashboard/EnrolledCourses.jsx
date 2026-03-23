import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FiBook, FiClock, FiPlay, FiAward } from "react-icons/fi"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import CertificateViewer from "./CertificateViewer"

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const [certCourse, setCertCourse] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getUserEnrolledCourses(token)
        setEnrolledCourses(res)
      } catch (e) {
        console.log("Could not fetch enrolled courses")
      }
    })()
  }, [token])

  if (certCourse) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setCertCourse(null)} className="text-richblack-400 hover:text-richblack-200 text-sm">← Back to My Learning</button>
          <h1 className="text-xl font-bold text-richblack-5">{certCourse.courseName}</h1>
        </div>
        <CertificateViewer courseId={certCourse._id} courseName={certCourse.courseName} />
      </div>
    )
  }

  if (!enrolledCourses) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
          <div key={i} className="bg-richblack-800 rounded-xl overflow-hidden animate-pulse">
            <div className="h-40 bg-richblack-700"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-richblack-700 rounded w-3/4"></div>
              <div className="h-3 bg-richblack-700 rounded w-1/2"></div>
              <div className="h-2 bg-richblack-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-richblack-5">My Learning</h1>
        <p className="text-richblack-300">{enrolledCourses.length} course{enrolledCourses.length !== 1 ? "s" : ""} enrolled</p>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-richblack-400 bg-richblack-800 rounded-xl border border-richblack-700">
          <FiBook className="text-5xl" />
          <p className="text-xl font-medium">No courses enrolled yet</p>
          <p className="text-sm">Browse our catalog and start learning today!</p>
          <button onClick={() => navigate("/catalog/web-development")}
            className="bg-yellow-50 text-richblack-900 font-bold px-6 py-2 rounded-lg hover:bg-yellow-100 transition-all">
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => {
            const progress = course.progressPercentage || 0
            return (
              <div key={course._id} className="bg-richblack-800 rounded-xl overflow-hidden border border-richblack-700 hover:border-richblack-500 transition-all group">
                <div className="relative">
                  <img src={course.thumbnail} alt={course.courseName}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => navigate(`/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}
                      className="bg-yellow-50 text-richblack-900 rounded-full p-3 hover:bg-yellow-100 transition-all">
                      <FiPlay className="text-xl" />
                    </button>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <FiClock className="text-xs" />
                    {course.courseContent?.length || 0} sections
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="text-richblack-5 font-semibold text-sm line-clamp-2 leading-snug">
                    {course.courseName}
                  </h3>
                  <p className="text-richblack-400 text-xs">
                    {course.instructor?.firstName} {course.instructor?.lastName}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-richblack-400">
                      <span>Progress</span>
                      <span className="text-yellow-50 font-medium">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-richblack-700 rounded-full h-1.5">
                      <div
                        className="bg-yellow-50 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}
                    className="w-full bg-richblack-700 hover:bg-yellow-50 hover:text-richblack-900 text-richblack-200 text-sm font-medium py-2 rounded-lg transition-all flex items-center justify-center gap-2">
                    <FiPlay className="text-xs" />
                    {progress > 0 ? "Continue Learning" : "Start Learning"}
                  </button>
                  {Math.round(progress) >= 100 && (
                    <button onClick={() => setCertCourse(course)}
                      className="w-full bg-yellow-50/10 hover:bg-yellow-50/20 text-yellow-50 border border-yellow-50/20 text-xs font-medium py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5">
                      <FiAward size={12} /> Get Certificate
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
