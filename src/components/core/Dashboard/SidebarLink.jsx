import * as Icons from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"
import { resetCourseState } from "../../../slices/courseSlice"

export default function SidebarLink({ link, iconName }) {
  const Icon = Icons[iconName]
  const location = useLocation()
  const dispatch = useDispatch()
  const { unreadCount } = useSelector(s => s.notification)

  const isActive = matchPath({ path: link.path }, location.pathname)
  const isNotifications = link.path === "/dashboard/notifications"

  return (
    <NavLink
      to={link.path}
      onClick={() => dispatch(resetCourseState())}
      className={`relative px-6 py-2.5 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-yellow-50/10 text-yellow-50"
          : "text-richblack-300 hover:bg-richblack-700 hover:text-richblack-100"
      }`}
    >
      {/* Active indicator */}
      <span className={`absolute left-0 top-0 h-full w-[3px] bg-yellow-50 rounded-r-full transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`} />
      <div className="flex items-center gap-3">
        {Icon && <Icon className="text-lg flex-shrink-0" />}
        <span>{link.name}</span>
        {/* Notification badge */}
        {isNotifications && unreadCount > 0 && (
          <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>
    </NavLink>
  )
}
