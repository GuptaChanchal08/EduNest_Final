import { useState } from "react"
import { VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { sidebarLinks, adminLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from "../../Common/ConfirmationModal"
import SidebarLink from "./SidebarLink"

export default function Sidebar() {
  const { user, loading: profileLoading } = useSelector(s => s.profile)
  const { loading: authLoading } = useSelector(s => s.auth)
  const { unreadCount } = useSelector(s => s.notification)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirmationModal, setConfirmationModal] = useState(null)

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r border-richblack-700 bg-richblack-800">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] mt-[3.5rem] min-w-[220px] flex-col border-r border-richblack-700 bg-richblack-800">
        {/* User mini-card */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-richblack-700 bg-richblack-700/30">
          <img src={user?.image} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-richblack-600" />
          <div className="min-w-0">
            <p className="text-richblack-5 font-semibold text-sm truncate">{user?.firstName} {user?.lastName}</p>
            <p className={`text-xs font-medium ${
              user?.accountType === "Admin" ? "text-red-400" :
              user?.accountType === "Instructor" ? "text-purple-400" : "text-blue-400"
            }`}>{user?.accountType}</p>
          </div>
          {/* Unread notification badge */}
          {unreadCount > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Nav links */}
        <div className="flex flex-col flex-1 py-4 overflow-y-auto">
          {sidebarLinks.map(link => {
            if (link.type && user?.accountType !== link.type) return null
            return <SidebarLink key={link.id} link={link} iconName={link.icon} />
          })}

          {user?.accountType === "Admin" && (
            <>
              <div className="mx-4 my-2 h-px bg-richblack-700" />
              <p className="text-richblack-500 text-xs font-semibold px-6 py-1 uppercase tracking-wider">Admin</p>
              {adminLinks.map(link => (
                <SidebarLink key={link.id} link={link} iconName={link.icon} />
              ))}
            </>
          )}
        </div>

        {/* Bottom */}
        <div className="border-t border-richblack-700 py-2">
          <SidebarLink link={{ name: "Settings", path: "/dashboard/settings" }} iconName="VscSettingsGear" />
          <button
            onClick={() => setConfirmationModal({
              text1: "Are you sure?",
              text2: "You will be logged out.",
              btn1Text: "Logout",
              btn2Text: "Cancel",
              btn1Handler: () => dispatch(logout(navigate)),
              btn2Handler: () => setConfirmationModal(null),
            })}
            className="flex items-center gap-x-2 px-6 py-2 text-sm text-richblack-300 hover:bg-richblack-700 hover:text-richblack-100 w-full transition-all"
          >
            <VscSignOut className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
