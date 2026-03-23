import { useEffect, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { FiCheckCircle, FiCircle, FiVideo, FiYoutube, FiFileText, FiHelpCircle } from "react-icons/fi"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import IconBtn from "../../Common/IconBtn"

// Icon for each content type
function ContentTypeIcon({ type }) {
  const cls = "text-xs flex-shrink-0"
  if (type === "youtube") return <FiYoutube className={cls + " text-red-400"} />
  if (type === "notes") return <FiFileText className={cls + " text-blue-400"} />
  if (type === "quiz") return <FiHelpCircle className={cls + " text-purple-400"} />
  return <FiVideo className={cls + " text-richblack-400"} />
}

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("")
  const [videoBarActive, setVideoBarActive] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { courseId, sectionId, subSectionId } = useParams()
  const { courseSectionData, courseEntireData, totalNoOfLectures, completedLectures } = useSelector((state) => state.viewCourse)

  useEffect(() => {
    if (!courseSectionData.length) return
    const si = courseSectionData.findIndex((d) => d._id === sectionId)
    const ssi = courseSectionData[si]?.subSection?.findIndex((d) => d._id === subSectionId)
    setActiveStatus(courseSectionData[si]?._id)
    setVideoBarActive(courseSectionData[si]?.subSection[ssi]?._id)
  }, [courseSectionData, courseEntireData, location.pathname])

  const progressPercent = totalNoOfLectures > 0
    ? Math.round((completedLectures.length / totalNoOfLectures) * 100)
    : 0

  // Section completion: all subsections done?
  const isSectionComplete = (section) =>
    section.subSection.every((s) => completedLectures.includes(s._id))

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-[300px] max-w-[320px] flex-col border-r border-richblack-700 bg-richblack-800">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-richblack-700 px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/dashboard/enrolled-courses")}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-richblack-700 hover:bg-richblack-600 text-richblack-200 transition-all" title="Back">
            <IoIosArrowBack size={18} />
          </button>
          <IconBtn text="Add Review" customClasses="text-xs" onclick={() => setReviewModal(true)} />
        </div>

        {/* Course name */}
        <p className="text-sm font-semibold text-richblack-5 line-clamp-2">{courseEntireData?.courseName}</p>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-richblack-400 mb-1.5">
            <span>{completedLectures.length} of {totalNoOfLectures} completed</span>
            <span className={`font-bold ${progressPercent === 100 ? "text-green-400" : "text-yellow-50"}`}>
              {progressPercent}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-richblack-600 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressPercent === 100 ? "bg-green-400" : "bg-yellow-50"}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {progressPercent === 100 && (
            <p className="text-green-400 text-xs font-semibold mt-1.5 flex items-center gap-1">
              <FiCheckCircle /> Course Complete! 🎉
            </p>
          )}
        </div>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto">
        {courseSectionData.map((section, idx) => {
          const isOpen = activeStatus === section._id
          const sectionDone = isSectionComplete(section)
          const sectionCompleted = section.subSection.filter((s) => completedLectures.includes(s._id)).length

          return (
            <div key={idx} className="border-b border-richblack-700 last:border-0">
              {/* Section Header */}
              <button
                onClick={() => setActiveStatus(isOpen ? "" : section._id)}
                className="flex w-full items-center justify-between px-4 py-3 hover:bg-richblack-700/50 transition-all text-left"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {sectionDone
                    ? <FiCheckCircle className="text-green-400 flex-shrink-0 text-sm" />
                    : <FiCircle className="text-richblack-500 flex-shrink-0 text-sm" />
                  }
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-richblack-5 truncate">{section.sectionName}</p>
                    <p className="text-xs text-richblack-500">{sectionCompleted}/{section.subSection.length}</p>
                  </div>
                </div>
                <BsChevronDown className={`text-richblack-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Sub-sections */}
              {isOpen && (
                <div className="bg-richblack-900/30">
                  {section.subSection.map((topic, ti) => {
                    const isActive = videoBarActive === topic._id
                    const isDone = completedLectures.includes(topic._id)
                    return (
                      <button
                        key={ti}
                        onClick={() => {
                          navigate(`/view-course/${courseEntireData?._id}/section/${section._id}/sub-section/${topic._id}`)
                          setVideoBarActive(topic._id)
                        }}
                        className={`flex w-full items-center gap-3 px-5 py-3 text-left transition-all ${
                          isActive ? "bg-yellow-50/15 border-r-2 border-yellow-50" : "hover:bg-richblack-700/30"
                        }`}
                      >
                        {/* Completion indicator */}
                        {isDone
                          ? <FiCheckCircle className="text-green-400 flex-shrink-0 text-sm" />
                          : <FiCircle className="text-richblack-500 flex-shrink-0 text-sm" />
                        }
                        {/* Content type icon */}
                        <ContentTypeIcon type={topic.contentType} />
                        {/* Title */}
                        <span className={`text-xs leading-tight flex-1 min-w-0 ${isActive ? "text-yellow-50 font-medium" : isDone ? "text-richblack-300" : "text-richblack-200"}`}>
                          {topic.title}
                        </span>
                        {/* Type badge */}
                        {topic.contentType && topic.contentType !== "video" && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${
                            topic.contentType === "youtube" ? "bg-red-500/20 text-red-400"
                            : topic.contentType === "quiz" ? "bg-purple-500/20 text-purple-400"
                            : "bg-blue-500/20 text-blue-400"
                          }`}>
                            {topic.contentType === "youtube" ? "YT" : topic.contentType === "quiz" ? "Quiz" : "Note"}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
