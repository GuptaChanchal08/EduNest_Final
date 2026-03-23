import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { announcementEndpoints } from "../apis"

const { CREATE_API, GET_API, READ_API, DELETE_API } = announcementEndpoints

export const createAnnouncement = async (data, token) => {
  let result = null
  const toastId = toast.loading("Sending announcement...")
  try {
    const response = await apiConnector("POST", CREATE_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could not send announcement")
    }
    toast.success("Announcement sent successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("CREATE ANNOUNCEMENT API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const getCourseAnnouncements = async (courseId, token) => {
  let result = []
  try {
    const response = await apiConnector("GET", GET_API, null, {
        Authorization: `Bearer ${token}`,
      },
      { courseId }
    )
    if (!response?.data?.success) {
      throw new Error("Could not get announcements")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("GET ANNOUNCEMENT API ERROR............", error)
  }
  return result
}
