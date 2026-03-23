import { useEffect } from "react"
import "./App.css"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"

import Navbar from "./components/Common/Navbar"
import OpenRoute from "./components/core/Auth/OpenRoute"
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import AddCourse from "./components/core/Dashboard/AddCourse"
import AdminDashboard from "./components/core/Dashboard/AdminPanel/AdminDashboard"
import ManageBlogs from "./components/core/Dashboard/AdminPanel/ManageBlogs"
import MyBlogs from "./components/core/Dashboard/MyBlogs"
import Notifications from "./components/core/Dashboard/Notifications"
import Announcements from "./components/core/Dashboard/Announcements"
import Cart from "./components/core/Dashboard/Cart"
import EditCourse from "./components/core/Dashboard/EditCourse"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses"
import Wishlist from "./components/core/Dashboard/Wishlist"
import Instructor from "./components/core/Dashboard/Instructor"
import MyCourses from "./components/core/Dashboard/MyCourses"
import MyProfile from "./components/core/Dashboard/MyProfile"
import Settings from "./components/core/Dashboard/Settings"
import VideoDetails from "./components/core/ViewCourse/VideoDetails"
import About from "./pages/About"
import Catalog from "./pages/Catalog"
import Contact from "./pages/Contact"
import CourseDetails from "./pages/CourseDetails"
import Dashboard from "./pages/Dashboard"
import Error from "./pages/Error"
import ForgotPassword from "./pages/ForgotPassword"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import UpdatePassword from "./pages/UpdatePassword"
import VerifyEmail from "./pages/VerifyEmail"
import ViewCourse from "./pages/ViewCourse"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermsOfService from "./pages/TermsOfService"
import Blog from "./pages/Blog"
import BlogDetails from "./pages/BlogDetails"
import Careers from "./pages/Careers"
import Teach from "./pages/Teach"
import SearchResults from "./pages/SearchResults"
import { getUserDetails } from "./services/operations/profileAPI"
import { ACCOUNT_TYPE } from "./utils/constants"

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      <Navbar />
      <div className="flex-1 pt-[65px]">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:blogId" element={<BlogDetails />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/teach" element={<Teach />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="courses/:courseId" element={<CourseDetails />} />
          <Route path="catalog/:catalogName" element={<Catalog />} />

          {/* Open Routes - for non-logged-in users */}
          <Route path="login" element={<OpenRoute><Login /></OpenRoute>} />
          <Route path="forgot-password" element={<OpenRoute><ForgotPassword /></OpenRoute>} />
          <Route path="update-password/:id" element={<OpenRoute><UpdatePassword /></OpenRoute>} />
          <Route path="signup" element={<OpenRoute><Signup /></OpenRoute>} />
          <Route path="verify-email" element={<OpenRoute><VerifyEmail /></OpenRoute>} />

          {/* Private Routes - Dashboard */}
          <Route element={<PrivateRoute><Dashboard /></PrivateRoute>}>
            <Route path="dashboard/my-profile" element={<MyProfile />} />
            <Route path="dashboard/settings" element={<Settings />} />
            <Route path="dashboard/Settings" element={<Settings />} />

            {/* Admin Routes */}
            <Route path="dashboard/admin" element={
              user?.accountType === ACCOUNT_TYPE.ADMIN
                ? <AdminDashboard />
                : <Navigate to="/dashboard/my-profile" replace />
            } />
            <Route path="dashboard/my-blogs" element={<MyBlogs />} />
            <Route path="dashboard/notifications" element={<Notifications />} />
            <Route path="dashboard/announcements" element={
              user?.accountType === "Student" ? <Announcements /> : <Navigate to="/dashboard/my-profile" replace />
            } />
            <Route path="dashboard/manage-blogs" element={
              user?.accountType === ACCOUNT_TYPE.ADMIN
                ? <ManageBlogs />
                : <Navigate to="/dashboard/my-profile" replace />
            } />

            {/* Instructor Routes */}
            <Route path="dashboard/instructor" element={
              user?.accountType === "Instructor" ? <Instructor /> : <Navigate to="/dashboard/my-profile" replace />
            } />
            <Route path="dashboard/my-courses" element={
              user?.accountType === "Instructor" ? <MyCourses /> : <Navigate to="/dashboard/my-profile" replace />
            } />
            <Route path="dashboard/add-course" element={
              user?.accountType === "Instructor" ? <AddCourse /> : <Navigate to="/dashboard/my-profile" replace />
            } />
            <Route path="dashboard/edit-course/:courseId" element={
              user?.accountType === "Instructor" ? <EditCourse /> : <Navigate to="/dashboard/my-profile" replace />
            } />

            {/* Student Routes */}
            <Route path="dashboard/enrolled-courses" element={
              user?.accountType === "Student" ? <EnrolledCourses /> : <Navigate to="/dashboard/my-profile" replace />
            } />
            <Route path="dashboard/cart" element={
              user?.accountType === "Student" ? <Cart /> : <Navigate to="/dashboard/my-profile" replace />
            } />
            <Route path="dashboard/wishlist" element={
              user?.accountType === "Student" ? <Wishlist /> : <Navigate to="/dashboard/my-profile" replace />
            } />
          </Route>

          {/* View Course */}
          <Route element={<PrivateRoute><ViewCourse /></PrivateRoute>}>
            <Route
              path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
              element={<VideoDetails />}
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
