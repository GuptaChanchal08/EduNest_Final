import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud, FiX, FiFile, FiCheck } from "react-icons/fi"
import { Player } from "video-react"
import "video-react/dist/video-react.css"

export default function Upload({
  name, label, register, unregister, setValue, errors,
  video = false, viewData = null, editData = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(viewData || editData || "")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const hiddenInputRef = useRef(null)

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    previewFile(file)
    setSelectedFile(file)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png", ".webp"] }
      : { "video/*": [".mp4", ".webm", ".mov", ".avi"] },
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    noClick: true, // we handle click ourselves so the hidden input opens
  })

  // Handle click — open native file browser
  const handleBrowseClick = (e) => {
    e.stopPropagation()
    hiddenInputRef.current?.click()
  }

  const handleHiddenInputChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    previewFile(file)
    setSelectedFile(file)
  }

  const previewFile = (file) => {
    // For video, create blob URL (faster than base64)
    if (video) {
      const url = URL.createObjectURL(file)
      setPreviewSource(url)
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => setPreviewSource(reader.result)
  }

  const handleCancel = () => {
    setPreviewSource("")
    setSelectedFile(null)
    setValue(name, null)
    if (hiddenInputRef.current) hiddenInputRef.current.value = ""
  }

  useEffect(() => {
    register(name, { required: !viewData })
    return () => {
      if (unregister) unregister(name)
    }
  }, [register, unregister, name, viewData])

  useEffect(() => {
    setValue(name, selectedFile)
  }, [selectedFile, setValue])

  const formatFileSize = (bytes) => {
    if (!bytes) return ""
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-richblack-5">
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>

      {/* Hidden real file input */}
      <input
        ref={hiddenInputRef}
        type="file"
        accept={video ? "video/mp4,video/webm,video/mov,video/avi" : "image/jpeg,image/jpg,image/png,image/webp"}
        onChange={handleHiddenInputChange}
        className="hidden"
      />

      {previewSource ? (
        /* Preview State */
        <div className="rounded-xl border border-richblack-600 bg-richblack-700 overflow-hidden">
          {!video ? (
            <img src={previewSource} alt="Preview" className="h-full w-full object-cover max-h-[300px]" />
          ) : (
            <Player aspectRatio="16:9" playsInline src={previewSource} />
          )}

          {/* File info bar */}
          {selectedFile && (
            <div className="flex items-center justify-between px-4 py-3 bg-richblack-800 border-t border-richblack-600">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <FiCheck className="text-green-400 text-sm" />
                </div>
                <div>
                  <p className="text-richblack-5 text-sm font-medium truncate max-w-[250px]">{selectedFile.name}</p>
                  <p className="text-richblack-400 text-xs">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              {!viewData && (
                <button type="button" onClick={handleCancel}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-3 py-1.5 rounded-lg transition-all">
                  <FiX size={12} /> Remove
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Drop Zone */
        <div
          {...getRootProps()}
          className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ${
            isDragActive || isDragging
              ? "border-yellow-50 bg-yellow-50/5 scale-[1.01]"
              : "border-richblack-600 bg-richblack-700 hover:border-richblack-400 hover:bg-richblack-600/50"
          }`}
          onClick={handleBrowseClick}
        >
          <input {...getInputProps()} />

          {/* Upload icon */}
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragActive ? "bg-yellow-50/20" : "bg-richblack-600"}`}>
            <FiUploadCloud className={`text-3xl transition-all ${isDragActive ? "text-yellow-50 scale-110" : "text-richblack-300"}`} />
          </div>

          {/* Text */}
          <p className="text-sm text-richblack-200 text-center px-6">
            {isDragActive ? (
              <span className="text-yellow-50 font-semibold">Drop it here!</span>
            ) : (
              <>
                Drag & drop {video ? "a video" : "an image"} here, or{" "}
                <span className="text-yellow-50 font-semibold underline underline-offset-2 hover:text-yellow-200 transition-all">
                  click to browse
                </span>
              </>
            )}
          </p>

          {/* Accepted formats */}
          <p className="mt-3 text-xs text-richblack-500">
            {video
              ? "MP4, WebM, MOV, AVI supported · No size limit shown here"
              : "JPG, PNG, WebP · Recommended 16:9 ratio"}
          </p>

          {video && (
            <div className="mt-4 flex items-center gap-2 bg-yellow-50/10 border border-yellow-50/20 rounded-lg px-4 py-2">
              <span className="text-yellow-50 text-xs font-medium">💡 Tip:</span>
              <span className="text-richblack-300 text-xs">Large videos take time to upload to Cloudinary. Consider YouTube embed for faster setup.</span>
            </div>
          )}
        </div>
      )}

      {errors[name] && (
        <span className="text-xs text-pink-200 flex items-center gap-1">
          <FiX size={12} /> {label} is required
        </span>
      )}
    </div>
  )
}
