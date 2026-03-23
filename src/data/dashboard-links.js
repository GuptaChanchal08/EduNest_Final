import { ACCOUNT_TYPE } from "../utils/constants"

export const sidebarLinks = [
  { id: 1,  name: "My Profile",        path: "/dashboard/my-profile",       icon: "VscAccount" },
  { id: 2,  name: "Dashboard",         path: "/dashboard/instructor",        type: ACCOUNT_TYPE.INSTRUCTOR, icon: "VscDashboard" },
  { id: 3,  name: "My Courses",        path: "/dashboard/my-courses",        type: ACCOUNT_TYPE.INSTRUCTOR, icon: "VscVm" },
  { id: 4,  name: "Add Course",        path: "/dashboard/add-course",        type: ACCOUNT_TYPE.INSTRUCTOR, icon: "VscAdd" },
  { id: 5,  name: "Enrolled Courses",  path: "/dashboard/enrolled-courses",  type: ACCOUNT_TYPE.STUDENT,    icon: "VscMortarBoard" },
  { id: 6,  name: "Announcements",     path: "/dashboard/announcements",     type: ACCOUNT_TYPE.STUDENT,    icon: "VscMegaphone" },
  { id: 7,  name: "Cart",             path: "/dashboard/cart",              type: ACCOUNT_TYPE.STUDENT,    icon: "VscArchive" },
  { id: 9,  name: "Wishlist",         path: "/dashboard/wishlist",          type: ACCOUNT_TYPE.STUDENT,    icon: "VscHeart" },
  { id: 10, name: "My Blogs",         path: "/dashboard/my-blogs",          icon: "VscBook" },
  { id: 12, name: "Notifications",    path: "/dashboard/notifications",     icon: "VscBell" },
]

export const adminLinks = [
  { id: 8,  name: "Admin Panel",   path: "/dashboard/admin",        type: "Admin", icon: "VscSettingsGear" },
  { id: 11, name: "Manage Blogs",  path: "/dashboard/manage-blogs", type: "Admin", icon: "VscEdit" },
]
