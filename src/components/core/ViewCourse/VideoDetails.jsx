import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { toast } from "react-hot-toast"
import ReactMarkdown from "react-markdown"

import { FiCheckCircle, FiArrowRight, FiArrowLeft, FiRefreshCw, FiFileText, FiHelpCircle, FiYoutube, FiVideo } from "react-icons/fi"
import VideoPlayer from "./VideoPlayer"
import CommentsSection from "./CommentsSection"
import StudentNotes from "./StudentNotes"
import { InlineCourseAnnouncements as Announcements } from "../Dashboard/Announcements"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { apiConnector } from "../../../services/apiConnector"
import { courseEndpoints } from "../../../services/apis"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../Common/IconBtn"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } = useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState(null)
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizResult, setQuizResult] = useState(null)
  const [quizLoading, setQuizLoading] = useState(false)

  useEffect(() => {
    if (!courseSectionData.length) return
    if (!courseId && !sectionId && !subSectionId) {
      navigate("/dashboard/enrolled-courses"); return
    }
    const filteredData = courseSectionData.find((s) => s._id === sectionId)
    const filteredVideoData = filteredData?.subSection?.find((d) => d._id === subSectionId)
    setVideoData(filteredVideoData || null)
    setPreviewSource(courseEntireData.thumbnail)
    setVideoEnded(false)
    setQuizAnswers({})
    setQuizSubmitted(false)
    setQuizResult(null)
  }, [courseSectionData, courseEntireData, location.pathname])

  const isAlreadyCompleted = completedLectures.includes(subSectionId)

  const isFirstVideo = () => {
    const si = courseSectionData.findIndex((d) => d._id === sectionId)
    const ssi = courseSectionData[si]?.subSection?.findIndex((d) => d._id === subSectionId)
    return si === 0 && ssi === 0
  }

  const isLastVideo = () => {
    const si = courseSectionData.findIndex((d) => d._id === sectionId)
    const ssi = courseSectionData[si]?.subSection?.findIndex((d) => d._id === subSectionId)
    return si === courseSectionData.length - 1 && ssi === courseSectionData[si].subSection.length - 1
  }

  const goToNextVideo = () => {
    const si = courseSectionData.findIndex((d) => d._id === sectionId)
    const ssi = courseSectionData[si].subSection.findIndex((d) => d._id === subSectionId)
    if (ssi < courseSectionData[si].subSection.length - 1) {
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${courseSectionData[si].subSection[ssi + 1]._id}`)
    } else if (si < courseSectionData.length - 1) {
      navigate(`/view-course/${courseId}/section/${courseSectionData[si + 1]._id}/sub-section/${courseSectionData[si + 1].subSection[0]._id}`)
    }
  }

  const goToPrevVideo = () => {
    const si = courseSectionData.findIndex((d) => d._id === sectionId)
    const ssi = courseSectionData[si].subSection.findIndex((d) => d._id === subSectionId)
    if (ssi > 0) {
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${courseSectionData[si].subSection[ssi - 1]._id}`)
    } else if (si > 0) {
      const prevSec = courseSectionData[si - 1]
      navigate(`/view-course/${courseId}/section/${prevSec._id}/sub-section/${prevSec.subSection[prevSec.subSection.length - 1]._id}`)
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete({ courseId, subsectionId: subSectionId }, token)
    if (res) dispatch(updateCompletedLectures(subSectionId))
    setLoading(false)
  }

  // Quiz submission
  const handleQuizSubmit = async () => {
    const questions = videoData?.quiz?.questions || []
    if (Object.keys(quizAnswers).length < questions.length) {
      toast.error("Please answer all questions before submitting")
      return
    }
    setQuizLoading(true)
    try {
      const answers = questions.map((_, i) => quizAnswers[i] ?? -1)
      const res = await apiConnector("POST", courseEndpoints.SUBMIT_QUIZ_API,
        { courseId, subsectionId: subSectionId, answers },
        { Authorization: `Bearer ${token}` }
      )
      if (res.data.success) {
        setQuizResult(res.data)
        setQuizSubmitted(true)
        if (res.data.passed) {
          dispatch(updateCompletedLectures(subSectionId))
          toast.success(`Quiz passed! Score: ${res.data.score}%`)
        } else {
          toast.error(`Score: ${res.data.score}% — Need ${res.data.passingScore}% to pass`)
        }
      }
    } catch (e) {
      toast.error("Failed to submit quiz")
    }
    setQuizLoading(false)
  }

  const contentType = videoData?.contentType || "video"

  // YouTube video ID helper
  const getYoutubeId = () => {
    if (videoData?.youtubeVideoId) return videoData.youtubeVideoId
    const url = videoData?.videoUrl || ""
    const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/)
    return m ? m[1] : null
  }

  const NavButtons = ({ className = "" }) => (
    <div className={`flex gap-3 ${className}`}>
      {!isFirstVideo() && (
        <button onClick={goToPrevVideo} disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-richblack-700 hover:bg-richblack-600 px-4 py-2 text-sm text-richblack-200 transition-all">
          <FiArrowLeft /> Previous
        </button>
      )}
      {!isLastVideo() && (
        <button onClick={goToNextVideo} disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 px-4 py-2 text-sm text-richblack-900 font-semibold transition-all">
          Next <FiArrowRight />
        </button>
      )}
    </div>
  )

  return (
    <div className="flex flex-col gap-6 text-white pb-10">

      {/* ===================== VIDEO ===================== */}
      {contentType === "video" && (
        <div className="space-y-4">
          {!videoData ? (
            <img src={previewSource} alt="Preview" className="h-full w-full rounded-xl object-cover" />
          ) : (
            <VideoPlayer
              src={videoData.videoUrl}
              thumbnail={previewSource}
              onEnded={() => setVideoEnded(true)}
            />
          )}
          {videoEnded && (
            <div className="flex items-center gap-3 flex-wrap bg-richblack-800 rounded-xl p-4 border border-richblack-700">
              {!isAlreadyCompleted ? (
                <button onClick={handleLectureCompletion} disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-yellow-50 text-richblack-900 px-5 py-2.5 font-bold hover:bg-yellow-100 transition-all">
                  <FiCheckCircle /> {loading ? "Saving..." : "Mark as Complete"}
                </button>
              ) : (
                <span className="flex items-center gap-2 text-green-400 font-semibold"><FiCheckCircle /> Completed</span>
              )}
              <NavButtons />
            </div>
          )}
        </div>
      )}

      {/* ===================== YOUTUBE ===================== */}
      {contentType === "youtube" && (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden aspect-video bg-black">
            {getYoutubeId() ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYoutubeId()}?rel=0&modestbranding=1`}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title={videoData?.title}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-richblack-400">Invalid YouTube video</div>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {!isAlreadyCompleted ? (
              <button onClick={handleLectureCompletion} disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-yellow-50 text-richblack-900 px-5 py-2.5 font-bold hover:bg-yellow-100 transition-all">
                <FiCheckCircle /> {loading ? "Saving..." : "Mark as Watched"}
              </button>
            ) : (
              <span className="flex items-center gap-2 text-green-400 font-semibold"><FiCheckCircle /> Completed</span>
            )}
            <NavButtons />
          </div>
        </div>
      )}

      {/* ===================== NOTES / ARTICLE ===================== */}
      {contentType === "notes" && (
        <div className="space-y-4">
          <div className="rounded-xl bg-richblack-800 border border-richblack-700 p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-richblack-700">
              <FiFileText className="text-yellow-50" />
              <span className="text-yellow-50 font-semibold text-sm">Reading Material</span>
            </div>
            <div className="prose prose-invert prose-sm max-w-none text-richblack-100 leading-relaxed">
              <ReactMarkdown>{videoData?.notes || "No content available."}</ReactMarkdown>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {!isAlreadyCompleted ? (
              <button onClick={handleLectureCompletion} disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-yellow-50 text-richblack-900 px-5 py-2.5 font-bold hover:bg-yellow-100 transition-all">
                <FiCheckCircle /> {loading ? "Saving..." : "Mark as Read"}
              </button>
            ) : (
              <span className="flex items-center gap-2 text-green-400 font-semibold"><FiCheckCircle /> Completed</span>
            )}
            <NavButtons />
          </div>
        </div>
      )}

      {/* ===================== QUIZ ===================== */}
      {contentType === "quiz" && (
        <div className="space-y-4">
          <div className="rounded-xl bg-richblack-800 border border-richblack-700 p-6">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-richblack-700">
              <div className="flex items-center gap-2">
                <FiHelpCircle className="text-yellow-50" />
                <span className="text-yellow-50 font-semibold">Quiz</span>
              </div>
              <span className="text-xs text-richblack-400">
                Passing: {videoData?.quiz?.passingScore || 60}% · {videoData?.quiz?.questions?.length || 0} questions
              </span>
            </div>

            {!quizSubmitted ? (
              <div className="space-y-6">
                {videoData?.quiz?.questions?.map((q, qi) => (
                  <div key={qi} className="space-y-3">
                    <p className="text-richblack-5 font-medium">
                      <span className="text-yellow-50 mr-2">{qi + 1}.</span>{q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <label key={oi} className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${quizAnswers[qi] === oi ? "border-yellow-50 bg-yellow-50/10" : "border-richblack-600 hover:border-richblack-400"}`}>
                          <input type="radio" name={`q-${qi}`} value={oi} checked={quizAnswers[qi] === oi}
                            onChange={() => setQuizAnswers({ ...quizAnswers, [qi]: oi })}
                            className="accent-yellow-400" />
                          <span className="text-richblack-200 text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <button onClick={handleQuizSubmit} disabled={quizLoading}
                  className="w-full rounded-xl bg-yellow-50 text-richblack-900 font-bold py-3 hover:bg-yellow-100 transition-all disabled:opacity-60">
                  {quizLoading ? "Submitting..." : "Submit Quiz"}
                </button>
              </div>
            ) : (
              /* Quiz Results */
              <div className="space-y-4">
                <div className={`rounded-xl p-5 text-center ${quizResult?.passed ? "bg-green-500/20 border border-green-500/40" : "bg-red-500/20 border border-red-500/40"}`}>
                  <p className={`text-4xl font-bold ${quizResult?.passed ? "text-green-400" : "text-red-400"}`}>
                    {quizResult?.score}%
                  </p>
                  <p className={`text-lg font-semibold mt-1 ${quizResult?.passed ? "text-green-400" : "text-red-400"}`}>
                    {quizResult?.passed ? "🎉 Passed!" : "❌ Not Passed"}
                  </p>
                  <p className="text-richblack-300 text-sm mt-1">
                    {quizResult?.correct}/{quizResult?.total} correct · Need {quizResult?.passingScore}% to pass
                  </p>
                </div>

                {/* Detailed results */}
                <div className="space-y-3">
                  {quizResult?.results?.map((r, i) => (
                    <div key={i} className={`rounded-xl border p-4 ${r.isCorrect ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"}`}>
                      <p className="text-richblack-5 text-sm font-medium mb-2">
                        <span className={r.isCorrect ? "text-green-400" : "text-red-400"}>{r.isCorrect ? "✓" : "✗"}</span>{" "}
                        {videoData?.quiz?.questions[i]?.question}
                      </p>
                      {!r.isCorrect && (
                        <p className="text-xs text-richblack-400">
                          Your answer: <span className="text-red-400">{videoData?.quiz?.questions[i]?.options[r.yourAnswer]}</span>
                          {" · "}Correct: <span className="text-green-400">{videoData?.quiz?.questions[i]?.options[r.correctAnswer]}</span>
                        </p>
                      )}
                      {r.explanation && <p className="text-xs text-richblack-400 mt-1 italic">{r.explanation}</p>}
                    </div>
                  ))}
                </div>

                {!quizResult?.passed && (
                  <button onClick={() => { setQuizSubmitted(false); setQuizResult(null); setQuizAnswers({}) }}
                    className="flex items-center gap-2 text-yellow-50 hover:text-yellow-200 text-sm font-medium transition-all">
                    <FiRefreshCw /> Retry Quiz
                  </button>
                )}
              </div>
            )}
          </div>
          {isAlreadyCompleted && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-2 text-green-400 font-semibold"><FiCheckCircle /> Completed</span>
              <NavButtons />
            </div>
          )}
          {!isAlreadyCompleted && quizResult?.passed && <NavButtons />}
        </div>
      )}

      {/* ===================== TITLE & DESCRIPTION ===================== */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          {contentType === "video" && <FiVideo className="text-richblack-400" />}
          {contentType === "youtube" && <FiYoutube className="text-red-400" />}
          {contentType === "notes" && <FiFileText className="text-blue-400" />}
          {contentType === "quiz" && <FiHelpCircle className="text-purple-400" />}
          <h1 className="text-2xl font-semibold">{videoData?.title}</h1>
          {isAlreadyCompleted && <FiCheckCircle className="text-green-400 text-xl" />}
        </div>
        {videoData?.description && <p className="text-richblack-300 pt-2">{videoData.description}</p>}
      </div>

      {/* ===================== ANNOUNCEMENTS ===================== */}
      {courseId && (
        <Announcements courseId={courseId} isInstructor={false} />
      )}

      {/* ===================== STUDENT NOTES ===================== */}
      {courseId && (
        <StudentNotes
          courseId={courseId}
          subsectionId={subSectionId}
          currentTimestamp={0}
        />
      )}

      {/* ===================== COMMENTS / Q&A ===================== */}
      {courseId && (
        <CommentsSection
          courseId={courseId}
          subsectionId={subSectionId}
        />
      )}
    </div>
  )
}

export default VideoDetails
