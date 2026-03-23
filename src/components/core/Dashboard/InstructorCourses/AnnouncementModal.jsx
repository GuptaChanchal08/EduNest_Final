import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import { useSelector } from "react-redux"

import IconBtn from "../../../Common/IconBtn"
import { createAnnouncement } from "../../../../services/operations/announcementAPI"

export default function AnnouncementModal({ modalData, setModalData }) {
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    const result = await createAnnouncement(
      {
        courseId: modalData.courseId,
        title: data.title,
        message: data.message,
      },
      token
    )
    if (result) {
      setModalData(null)
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            Send Announcement
          </p>
          <button onClick={() => setModalData(null)}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="mb-4 text-sm text-richblack-300">
            Send an announcement to all students enrolled in {" "}
            <span className="font-bold text-richblack-5">
              {modalData?.courseName}
            </span>.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
            <div className="mb-4">
              <label className="text-sm text-richblack-5 w-full">
                Announcement Title <sup className="text-pink-200">*</sup>
                <input
                  type="text"
                  placeholder="e.g. Welcome to the course!"
                  className="form-style mt-2 w-full"
                  {...register("title", { required: true })}
                />
              </label>
              {errors.title && (
                <span className="text-sm text-pink-200">
                  Please enter a title
                </span>
              )}
            </div>

            {/* Message */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-richblack-5 w-full">
                Message <sup className="text-pink-200">*</sup>
                <textarea
                  placeholder="Type your message here..."
                  className="form-style min-h-[130px] w-full mt-2"
                  {...register("message", { required: true })}
                />
              </label>
              {errors.message && (
                <span className="text-sm text-pink-200">
                  Please enter your message
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-8 flex items-center justify-end gap-x-2">
              <button
                disabled={loading}
                onClick={() => setModalData(null)}
                className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                type="button"
              >
                Cancel
              </button>
              <IconBtn
                disabled={loading}
                type="submit"
                text={loading ? "Sending..." : "Send Announcement"}
                customClasses={"bg-yellow-50 text-black"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
