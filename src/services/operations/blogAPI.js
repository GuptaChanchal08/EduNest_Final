import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1"

export const blogEndpoints = {
  GET_ALL_BLOGS_API:    BASE_URL + "/blog/getAllBlogs",
  GET_BLOG_DETAILS_API: BASE_URL + "/blog/getBlogDetails/",
  CREATE_BLOG_API:      BASE_URL + "/blog/createBlog",
  EDIT_BLOG_API:        BASE_URL + "/blog/editBlog",
  DELETE_BLOG_API:      BASE_URL + "/blog/deleteBlog",
  ADD_COMMENT_API:      BASE_URL + "/blog/addComment",
  DELETE_COMMENT_API:   BASE_URL + "/blog/deleteComment",
  TOGGLE_LIKE_API:      BASE_URL + "/blog/toggleLike",
  MY_BLOGS_API:         BASE_URL + "/blog/myBlogs",
}

export const getAllBlogs = async (params = {}) => {
  let result = []
  try {
    // Remove empty keys so they don't get sent as empty query params
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== "" && v !== undefined && v !== null)
    )
    const response = await apiConnector(
      "GET",
      blogEndpoints.GET_ALL_BLOGS_API,
      null,
      null,
      Object.keys(cleanParams).length > 0 ? cleanParams : null
    )
    if (!response?.data?.success) throw new Error(response?.data?.message || "Could not fetch blogs")
    result = response.data.data
  } catch (error) {
    console.error("getAllBlogs error:", error?.response?.data || error.message)
    toast.error("Could not load blogs — check console for details")
  }
  return result
}

export const getBlogDetails = async (blogId) => {
  let result = null
  try {
    const response = await apiConnector("GET", blogEndpoints.GET_BLOG_DETAILS_API + blogId)
    if (!response?.data?.success) throw new Error("Could not fetch blog")
    result = response.data.data
  } catch (error) {
    console.error("getBlogDetails error:", error?.response?.data || error.message)
    toast.error("Could not load blog post")
  }
  return result
}

export const createBlog = async (data, token) => {
  let result = null
  const toastId = toast.loading("Publishing...")
  try {
    const response = await apiConnector("POST", blogEndpoints.CREATE_BLOG_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) throw new Error(response?.data?.message || "Could not publish")
    toast.success("Blog published!")
    result = response.data.data
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message || "Publish failed")
  }
  toast.dismiss(toastId)
  return result
}

export const addComment = async (data, token) => {
  let result = null
  const toastId = toast.loading("Posting comment...")
  try {
    const response = await apiConnector("POST", blogEndpoints.ADD_COMMENT_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) throw new Error(response?.data?.message)
    toast.success("Comment posted!")
    result = response.data.data
  } catch (error) {
    toast.error(error?.response?.data?.message || "Could not post comment")
  }
  toast.dismiss(toastId)
  return result
}

export const toggleLike = async (blogId, token) => {
  let result = null
  try {
    const response = await apiConnector("POST", blogEndpoints.TOGGLE_LIKE_API, { blogId }, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) throw new Error()
    result = response.data.data
  } catch (error) {
    toast.error("Could not update like")
  }
  return result
}

export const deleteComment = async (data, token) => {
  let result = null
  try {
    const response = await apiConnector("DELETE", blogEndpoints.DELETE_COMMENT_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) throw new Error()
    toast.success("Comment deleted")
    result = response.data.data
  } catch {
    toast.error("Could not delete comment")
  }
  return result
}
