import { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { FiYoutube, FiVideo, FiFileText, FiHelpCircle, FiPlus, FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { createSubSection, createSubSectionJSON, updateSubSection, updateSubSectionJSON } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import IconBtn from "../../../../Common/IconBtn"
import Upload from "../Upload"

const CONTENT_TYPES = [
  { id: "video", label: "Upload Video", icon: <FiVideo />, desc: "Upload MP4 to Cloudinary" },
  { id: "youtube", label: "YouTube Video", icon: <FiYoutube />, desc: "Embed a YouTube video" },
  { id: "quiz", label: "Quiz", icon: <FiHelpCircle />, desc: "Multiple-choice questions" },
  { id: "notes", label: "Notes / Article", icon: <FiFileText />, desc: "Text-based reading material" },
]

export default function SubSectionModal({ modalData, setModalData, add = false, view = false, edit = false }) {
  const { register, handleSubmit, setValue, formState: { errors }, getValues, control, watch, unregister } = useForm({
    defaultValues: {
      contentType: "video",
      questions: [{ question: "", options: ["", "", "", ""], correctAnswerIndex: 0, explanation: "" }],
      passingScore: 60,
    }
  })

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({ control, name: "questions" })

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)
  const contentType = watch("contentType")

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title)
      setValue("lectureDesc", modalData.description)
      const ct = modalData.contentType || "video"
      setValue("contentType", ct)
      if (ct === "video") setValue("lectureVideo", modalData.videoUrl)
      if (ct === "youtube") setValue("youtubeUrl", modalData.youtubeVideoId
        ? `https://www.youtube.com/watch?v=${modalData.youtubeVideoId}`
        : modalData.videoUrl)
      if (ct === "notes") setValue("notes", modalData.notes)
      if (ct === "quiz" && modalData.quiz) {
        setValue("questions", modalData.quiz.questions)
        setValue("passingScore", modalData.quiz.passingScore)
      }
    }
  }, [])

  const isFormUpdated = () => {
    const cv = getValues()
    if (cv.lectureTitle !== modalData.title) return true
    if (cv.lectureDesc !== modalData.description) return true
    const ct = cv.contentType
    if (ct === "youtube" && cv.youtubeUrl) return true
    if (ct === "notes" && cv.notes !== modalData.notes) return true
    if (ct === "quiz") return true
    if (ct === "video" && cv.lectureVideo !== modalData.videoUrl) return true
    return false
  }

  const handleEditSubsection = async () => {
    const currentValues = getValues()
    const ct = currentValues.contentType
    setLoading(true)
    let result = null

    if (ct === "video") {
      // Video: use FormData for file upload
      const formData = new FormData()
      formData.append("sectionId", modalData.sectionId)
      formData.append("subSectionId", modalData._id)
      formData.append("contentType", ct)
      if (currentValues.lectureTitle !== modalData.title) formData.append("title", currentValues.lectureTitle)
      if (currentValues.lectureDesc !== modalData.description) formData.append("description", currentValues.lectureDesc)
      if (currentValues.lectureVideo !== modalData.videoUrl) formData.append("video", currentValues.lectureVideo)
      result = await updateSubSection(formData, token)
    } else {
      // YouTube / Notes / Quiz: use JSON
      const payload = {
        sectionId: modalData.sectionId,
        subSectionId: modalData._id,
        contentType: ct,
        title: currentValues.lectureTitle,
        description: currentValues.lectureDesc || "",
        ...(ct === "youtube" && { youtubeUrl: currentValues.youtubeUrl }),
        ...(ct === "notes" && { notes: currentValues.notes }),
        ...(ct === "quiz" && { quiz: JSON.stringify({ questions: currentValues.questions, passingScore: parseInt(currentValues.passingScore) }) }),
      }
      result = await updateSubSectionJSON(payload, token)
    }

    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      )
      dispatch(setCourse({ ...course, courseContent: updatedCourseContent }))
    }
    setModalData(null)
    setLoading(false)
  }

  const onSubmit = async (data) => {
    if (view) return
    if (edit) { if (isFormUpdated()) await handleEditSubsection(); else { toast.error("No changes made"); setModalData(null) } return }

    setLoading(true)
    let result = null

    if (data.contentType === "video") {
      // Video needs multipart FormData
      if (!data.lectureVideo) { toast.error("Please select a video file"); setLoading(false); return }
      const formData = new FormData()
      formData.append("sectionId", modalData)
      formData.append("title", data.lectureTitle)
      formData.append("description", data.lectureDesc || "")
      formData.append("contentType", "video")
      formData.append("video", data.lectureVideo)
      result = await createSubSection(formData, token)
    } else {
      // YouTube / Notes / Quiz — send as JSON (no file upload needed)
      if (data.contentType === "youtube" && !data.youtubeUrl) {
        toast.error("Please enter a YouTube URL"); setLoading(false); return
      }
      if (data.contentType === "notes" && !data.notes) {
        toast.error("Please enter notes content"); setLoading(false); return
      }
      if (data.contentType === "quiz" && (!data.questions || data.questions.length === 0)) {
        toast.error("Please add at least one question"); setLoading(false); return
      }

      const payload = {
        sectionId: modalData,
        title: data.lectureTitle,
        description: data.lectureDesc || "",
        contentType: data.contentType,
        ...(data.contentType === "youtube" && { youtubeUrl: data.youtubeUrl }),
        ...(data.contentType === "notes" && { notes: data.notes }),
        ...(data.contentType === "quiz" && { quiz: JSON.stringify({ questions: data.questions, passingScore: parseInt(data.passingScore) }) }),
      }
      result = await createSubSectionJSON(payload, token)
    }

    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      )
      dispatch(setCourse({ ...course, courseContent: updatedCourseContent }))
    }
    setModalData(null)
    setLoading(false)
  }

  const inputClass = "w-full rounded-lg bg-richblack-700 border border-richblack-600 text-richblack-5 placeholder-richblack-400 px-3 py-2.5 text-sm outline-none focus:border-yellow-50 transition-all"

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-richblack-900/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-richblack-700 bg-richblack-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl bg-richblack-700 px-6 py-4">
          <p className="text-xl font-semibold text-richblack-5">
            {view ? "View" : add ? "Add" : "Edit"} Lecture
          </p>
          <button onClick={() => !loading && setModalData(null)} className="text-richblack-300 hover:text-richblack-100 transition-all">
            <RxCross2 size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          {/* Content Type Selector */}
          {!view && (
            <div>
              <label className="text-sm text-richblack-300 mb-2 block">Content Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CONTENT_TYPES.map((ct) => (
                  <label key={ct.id} className={`relative flex flex-col items-center gap-1 rounded-xl border-2 p-3 cursor-pointer transition-all ${contentType === ct.id ? "border-yellow-50 bg-yellow-50/10" : "border-richblack-600 hover:border-richblack-400"}`}>
                    <input type="radio" value={ct.id} {...register("contentType")} className="sr-only" />
                    <span className={`text-xl ${contentType === ct.id ? "text-yellow-50" : "text-richblack-400"}`}>{ct.icon}</span>
                    <span className={`text-xs font-medium ${contentType === ct.id ? "text-yellow-50" : "text-richblack-300"}`}>{ct.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Common Fields */}
          <div>
            <label className="text-sm text-richblack-5 mb-1 block">Lecture Title <sup className="text-pink-200">*</sup></label>
            <input placeholder="Enter lecture title" {...register("lectureTitle", { required: true })} disabled={view} className={inputClass} />
            {errors.lectureTitle && <span className="text-xs text-pink-200">Title is required</span>}
          </div>

          <div>
            <label className="text-sm text-richblack-5 mb-1 block">Description</label>
            <textarea placeholder="Brief description of this lecture" {...register("lectureDesc")} disabled={view} rows={2} className={inputClass + " resize-none"} />
          </div>

          {/* === VIDEO UPLOAD === */}
          {contentType === "video" && (
            <Upload name="lectureVideo" label="Lecture Video" register={register} unregister={unregister} setValue={setValue} errors={errors} video={true}
              viewData={view ? modalData.videoUrl : null} editData={edit ? modalData.videoUrl : null} />
          )}

          {/* === YOUTUBE === */}
          {contentType === "youtube" && (
            <div>
              <label className="text-sm text-richblack-5 mb-1 flex items-center gap-2">
                <FiYoutube className="text-red-500" /> YouTube URL or Video ID <sup className="text-pink-200">*</sup>
              </label>
              <input placeholder="https://youtube.com/watch?v=... or video ID" {...register("youtubeUrl", { required: contentType === "youtube" })}
                disabled={view} className={inputClass} />
              {errors.youtubeUrl && <span className="text-xs text-pink-200">YouTube URL is required</span>}
              {/* Live preview */}
              {watch("youtubeUrl") && (() => {
                const url = watch("youtubeUrl")
                const id = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/)?.[1] || (url.length === 11 ? url : null)
                return id ? (
                  <div className="mt-3 rounded-xl overflow-hidden aspect-video">
                    <iframe src={`https://www.youtube.com/embed/${id}`} className="w-full h-full" allowFullScreen title="Preview" />
                  </div>
                ) : null
              })()}
              <p className="text-xs text-richblack-400 mt-1">Paste any YouTube link — full URL, short URL, or just the video ID</p>
            </div>
          )}

          {/* === NOTES / ARTICLE === */}
          {contentType === "notes" && (
            <div>
              <label className="text-sm text-richblack-5 mb-1 flex items-center gap-2">
                <FiFileText /> Notes Content <sup className="text-pink-200">*</sup>
              </label>
              <textarea placeholder="Write your notes here... (Markdown supported)" {...register("notes", { required: contentType === "notes" })}
                disabled={view} rows={10} className={inputClass + " resize-y font-mono text-sm"} />
              {errors.notes && <span className="text-xs text-pink-200">Notes content is required</span>}
              <p className="text-xs text-richblack-400 mt-1">Supports Markdown: **bold**, *italic*, ## headings, - lists, `code`</p>
            </div>
          )}

          {/* === QUIZ === */}
          {contentType === "quiz" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-richblack-5 flex items-center gap-2"><FiHelpCircle /> Quiz Questions</label>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-richblack-300">Passing Score:</label>
                  <input type="number" min={0} max={100} {...register("passingScore")} disabled={view}
                    className="w-16 rounded-lg bg-richblack-700 border border-richblack-600 text-richblack-5 px-2 py-1 text-sm text-center" />
                  <span className="text-xs text-richblack-400">%</span>
                </div>
              </div>

              {questionFields.map((field, qi) => (
                <div key={field.id} className="rounded-xl border border-richblack-600 bg-richblack-700/50 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-yellow-50 bg-yellow-50/20 px-2 py-1 rounded">Q{qi + 1}</span>
                    {!view && questionFields.length > 1 && (
                      <button type="button" onClick={() => removeQuestion(qi)} className="text-red-400 hover:text-red-300 text-sm">
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                  <textarea placeholder="Enter your question..." {...register(`questions.${qi}.question`, { required: true })}
                    disabled={view} rows={2} className={inputClass + " resize-none"} />

                  <div className="space-y-2">
                    <p className="text-xs text-richblack-400">Answer Options (click radio to mark correct)</p>
                    {[0, 1, 2, 3].map((oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <input type="radio" value={oi} disabled={view}
                          {...register(`questions.${qi}.correctAnswerIndex`, { valueAsNumber: true })}
                          className="accent-yellow-400 cursor-pointer" />
                        <input placeholder={`Option ${oi + 1}`} {...register(`questions.${qi}.options.${oi}`, { required: true })}
                          disabled={view} className={inputClass + " flex-1"} />
                      </div>
                    ))}
                  </div>

                  <input placeholder="Explanation (shown after answering)" {...register(`questions.${qi}.explanation`)}
                    disabled={view} className={inputClass} />
                </div>
              ))}

              {!view && (
                <button type="button" onClick={() => appendQuestion({ question: "", options: ["", "", "", ""], correctAnswerIndex: 0, explanation: "" })}
                  className="flex items-center gap-2 text-yellow-50 hover:text-yellow-200 text-sm font-medium transition-all">
                  <FiPlus /> Add Question
                </button>
              )}
            </div>
          )}

          {/* Submit Buttons */}
          {!view && (
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalData(null)} disabled={loading}
                className="rounded-lg bg-richblack-700 px-5 py-2.5 text-sm font-medium text-richblack-200 hover:bg-richblack-600 transition-all">
                Cancel
              </button>
              <IconBtn disabled={loading} text={loading ? "Saving..." : edit ? "Save Changes" : "Add Lecture"} />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
