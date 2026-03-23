const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1"


// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
}

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
}

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
  ENROLL_FREE_COURSE_API: BASE_URL + "/payment/enrollFree",
}

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  COURSE_CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL + "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
  SUBMIT_QUIZ_API: BASE_URL + "/course/submitQuiz",
  GET_PROGRESS_API: BASE_URL + "/course/getProgressPercentage",
}

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
}

// CATAGORIES API
export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllCategories",
}

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails",
}
// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
}

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
}

// COMMENTS & Q&A
export const commentEndpoints = {
  GET_COMMENTS_API: BASE_URL + "/comments",
  ADD_COMMENT_API: BASE_URL + "/comments/add",
  EDIT_COMMENT_API: BASE_URL + "/comments/edit",
  DELETE_COMMENT_API: BASE_URL + "/comments/delete",
  LIKE_COMMENT_API: BASE_URL + "/comments/like",
  PIN_COMMENT_API: BASE_URL + "/comments/pin",
}

// HOMEPAGE DYNAMIC
export const homeEndpoints = {
  GET_LATEST_COURSES: BASE_URL + "/course/getLatestCourses",
  GET_FEATURED_COURSES: BASE_URL + "/course/getFeaturedCourses",
  SEARCH_COURSES: BASE_URL + "/course/search",
}

// ANNOUNCEMENTS
export const announcementEndpoints = {
  CREATE_API: BASE_URL + "/announcements/create",
  GET_API: BASE_URL + "/announcements",
  STUDENT_ALL_API: BASE_URL + "/announcements/student-all",
  READ_API: BASE_URL + "/announcements/read",
  DELETE_API: BASE_URL + "/announcements/delete",
}

// STUDENT NOTES
export const notesEndpoints = {
  SAVE_API: BASE_URL + "/notes/save",
  GET_API: BASE_URL + "/notes",
  DELETE_API: BASE_URL + "/notes/delete",
}

// WISHLIST
export const wishlistEndpoints = {
  TOGGLE_API: BASE_URL + "/wishlist/toggle",
  GET_API: BASE_URL + "/wishlist",
}

// NOTIFICATIONS
const BASE_URL_NOTIF = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1"
export const notificationEndpoints = {
  GET_NOTIFICATIONS_API:    BASE_URL_NOTIF + "/notifications",
  MARK_READ_API:            BASE_URL_NOTIF + "/notifications/mark-read",
  MARK_ALL_READ_API:        BASE_URL_NOTIF + "/notifications/mark-all-read",
}
