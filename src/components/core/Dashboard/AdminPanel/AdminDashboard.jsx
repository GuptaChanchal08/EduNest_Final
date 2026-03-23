import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { apiConnector } from "../../../../services/apiConnector"
import { FiUsers, FiBook, FiTag, FiTrash2, FiBarChart2, FiPlus, FiRefreshCw, FiDollarSign } from "react-icons/fi"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import toast from "react-hot-toast"

const _BASE = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1"
const ADMIN_BASE = _BASE + "/admin"
const COURSE_BASE = _BASE + "/course"

export default function AdminDashboard() {
  const { token } = useSelector((state) => state.auth)
  const { user: currentUser } = useSelector((state) => state.profile)
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [newCatName, setNewCatName] = useState("")
  const [newCatDesc, setNewCatDesc] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchUser, setSearchUser] = useState("")
  const [searchCourse, setSearchCourse] = useState("")

  const headers = { Authorization: `Bearer ${token}` }

  const fetchStats = useCallback(async () => {
    try {
      const res = await apiConnector("GET", `${ADMIN_BASE}/stats`, null, headers)
      if (res.data.success) setStats(res.data.data)
    } catch (e) { console.error("Stats error:", e) }
  }, [token])

  const fetchUsers = useCallback(async () => {
    try {
      const res = await apiConnector("GET", `${ADMIN_BASE}/users`, null, headers)
      if (res.data.success) setUsers(res.data.data || [])
    } catch (e) { console.error("Users error:", e) }
  }, [token])

  const fetchCourses = useCallback(async () => {
    try {
      const res = await apiConnector("GET", `${ADMIN_BASE}/courses`, null, headers)
      if (res.data.success) setCourses(res.data.data || [])
    } catch (e) { console.error("Courses error:", e) }
  }, [token])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await apiConnector("GET", `${COURSE_BASE}/showAllCategories`)
      if (res.data.success) setCategories(res.data.data || [])
    } catch (e) { console.error("Categories error:", e) }
  }, [])

  const refreshAll = useCallback(() => {
    fetchStats(); fetchUsers(); fetchCourses(); fetchCategories()
  }, [fetchStats, fetchUsers, fetchCourses, fetchCategories])

  useEffect(() => { refreshAll() }, [refreshAll])

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return
    try {
      await apiConnector("POST", `${ADMIN_BASE}/delete-user`, { userId: id }, headers)
      toast.success("User deleted")
      fetchUsers(); fetchStats()
    } catch (e) { toast.error("Failed to delete user") }
  }

  const deleteCourse = async (id, name) => {
    if (!window.confirm(`Delete course "${name}"? This cannot be undone.`)) return
    try {
      await apiConnector("POST", `${ADMIN_BASE}/delete-course`, { courseId: id }, headers)
      toast.success("Course deleted")
      fetchCourses(); fetchStats()
    } catch (e) { toast.error("Failed to delete course") }
  }

  const changeRole = async (id, accountType) => {
    try {
      await apiConnector("POST", `${ADMIN_BASE}/change-role`, { userId: id, accountType }, headers)
      toast.success("Role updated")
      fetchUsers()
    } catch (e) { toast.error("Failed to update role") }
  }

  const addCategory = async () => {
    if (!newCatName.trim()) return toast.error("Enter a category name")
    if (!newCatDesc.trim()) return toast.error("Enter a category description")
    setLoading(true)
    try {
      await apiConnector("POST", `${ADMIN_BASE}/add-category`,
        { name: newCatName.trim(), description: newCatDesc.trim() }, headers)
      toast.success(`Category "${newCatName}" created!`)
      setNewCatName(""); setNewCatDesc("")
      fetchCategories(); fetchStats()
    } catch (e) { toast.error("Failed to create category") }
    setLoading(false)
  }

  const deleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return
    try {
      await apiConnector("POST", `${ADMIN_BASE}/delete-category`, { categoryId: id }, headers)
      toast.success("Category deleted")
      fetchCategories(); fetchStats()
    } catch (e) { toast.error("Failed to delete category") }
  }

  const StatCard = ({ icon, label, value, color, sub }) => (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg`}>
      <div className="text-3xl mb-3 opacity-80">{icon}</div>
      <p className="text-4xl font-bold">{value ?? "..."}</p>
      <p className="text-sm opacity-80 mt-1">{label}</p>
      {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
    </div>
  )

  const tabs = [
    { key: "overview", label: "Overview", icon: <FiBarChart2 /> },
    { key: "users", label: `Users (${users.length})`, icon: <FiUsers /> },
    { key: "courses", label: `Courses (${courses.length})`, icon: <FiBook /> },
    { key: "categories", label: `Categories (${categories.length})`, icon: <FiTag /> },
  ]

  const filteredUsers = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchUser.toLowerCase())
  )

  const filteredCourses = courses.filter(c =>
    `${c.courseName} ${c.instructor?.firstName} ${c.instructor?.lastName}`.toLowerCase().includes(searchCourse.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 glass p-6 rounded-2xl mb-8 border-l-4 border-l-yellow-50">
        <div>
          <h1 className="text-3xl font-bold text-richblack-5 tracking-tight">Admin Overview</h1>
          <p className="text-richblack-300 text-sm mt-1">Platform intelligence and control center</p>
        </div>
        <button onClick={refreshAll}
          className="flex items-center gap-2 bg-richblack-800/80 hover:bg-richblack-700 text-richblack-50 px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-richblack-700 hover:border-richblack-500">
          <FiRefreshCw className="active:animate-spin" /> Refresh Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap bg-richblack-800 p-1 rounded-xl w-fit border border-richblack-700">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.key ? "bg-yellow-50 text-richblack-900" : "text-richblack-300 hover:text-richblack-100"}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<FiUsers />} label="Total Users" value={stats?.totalUsers || (users.length > 0 ? users.length : 0)} color="from-blue-600 to-blue-900" sub={`${stats?.totalStudents || 0} students · ${stats?.totalInstructors || 0} inst. · ${stats?.totalAdmins || (users.length ? 1 : 0)} admin`} />
            <StatCard icon={<FiBook />} label="Total Courses" value={stats?.totalCourses} color="from-purple-600 to-purple-900" sub={`${stats?.publishedCourses || 0} published · ${stats?.draftCourses || 0} drafts`} />
            <StatCard icon={<FiTag />} label="Categories" value={stats?.totalCategories} color="from-caribbeangreen-600 to-caribbeangreen-900" />
            <StatCard icon={<FiDollarSign />} label="Est. Revenue" value={`₹${stats?.totalRevenue?.toLocaleString("en-IN") || 0}`} color="from-yellow-600 to-yellow-900" sub="Gross value of enrollments" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart: Platform Breakdown */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-richblack-5 font-semibold text-lg mb-6">User Demographics</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Students", value: stats?.totalStudents || 0 },
                        { name: "Instructors", value: stats?.totalInstructors || 0 },
                        { name: "Admins", value: stats?.totalAdmins || 1 }
                      ]}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#47A5C5" />
                      <Cell fill="#AFB2BF" />
                      <Cell fill="#FFD60A" />
                    </Pie>
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#161D29', borderColor: '#2C333F', borderRadius: '8px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#47A5C5]"></div><span className="text-sm text-richblack-300">Students</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#AFB2BF]"></div><span className="text-sm text-richblack-300">Instructors</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#FFD60A]"></div><span className="text-sm text-richblack-300">Admins</span></div>
              </div>
            </div>

            {/* Chart: Revenue or Courses */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-richblack-5 font-semibold text-lg mb-6">Course Metrics</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Published', courses: stats?.publishedCourses || 0 },
                      { name: 'Drafts', courses: stats?.draftCourses || 0 }
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#838894" tick={{ fill: '#838894' }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#838894" tick={{ fill: '#838894' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#161D29', borderColor: '#2C333F', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="courses" fill="#FFD60A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-6 animate-fadeIn">
          <input
            value={searchUser}
            onChange={e => setSearchUser(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full max-w-md glass border border-richblack-700 text-richblack-5 placeholder-richblack-400 rounded-xl px-4 py-3 outline-none focus:border-yellow-50 transition-all text-sm shadow-inner"
          />
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-richblack-700">
                  <tr>
                    {["User", "Email", "Joined", "Role", "Actions"].map(h => (
                      <th key={h} className="text-left text-richblack-300 font-semibold px-5 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-richblack-700">
                  {filteredUsers.map(u => (
                    <tr key={u._id} className="hover:bg-richblack-700/50 transition-all">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={u.image || `https://api.dicebear.com/5.x/initials/svg?seed=${u.firstName} ${u.lastName}`}
                            alt="" className="w-9 h-9 rounded-full object-cover" />
                          <span className="text-richblack-5 font-medium">{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-richblack-300">{u.email}</td>
                      <td className="px-5 py-4 text-richblack-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-5 py-4">
                        {u.accountType === "Admin" ? (
                          <span className="text-xs px-3 py-1.5 bg-yellow-50/10 text-yellow-50 border border-yellow-50/20 rounded-lg font-medium">
                            Admin
                          </span>
                        ) : u._id === currentUser?._id ? (
                          <span className="text-xs px-3 py-1.5 bg-richblack-700 text-richblack-400 border border-richblack-600 rounded-lg">
                            {u.accountType}
                          </span>
                        ) : (
                          <select value={u.accountType}
                            onChange={e => changeRole(u._id, e.target.value)}
                            className="bg-richblack-700 text-richblack-200 border border-richblack-600 rounded-lg px-3 py-1.5 text-xs cursor-pointer">
                            {["Student", "Instructor"].map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {u.accountType !== "Admin" && u._id !== currentUser?._id ? (
                          <button onClick={() => deleteUser(u._id, `${u.firstName} ${u.lastName}`)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-all"
                            title="Delete user">
                            <FiTrash2 />
                          </button>
                        ) : (
                          <span className="text-richblack-700 p-2 block"><FiTrash2 /></span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={5} className="text-center text-richblack-400 py-12">
                      {searchUser ? "No users match your search" : "No users found"}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === "courses" && (
        <div className="space-y-6 animate-fadeIn">
          <input
            value={searchCourse}
            onChange={e => setSearchCourse(e.target.value)}
            placeholder="Search courses by name or instructor..."
            className="w-full max-w-md glass border border-richblack-700 text-richblack-5 placeholder-richblack-400 rounded-xl px-4 py-3 outline-none focus:border-yellow-50 transition-all text-sm shadow-inner"
          />
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-richblack-700">
                  <tr>
                    {["Course", "Instructor", "Price", "Students", "Category", "Status", "Actions"].map(h => (
                      <th key={h} className="text-left text-richblack-300 font-semibold px-5 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-richblack-700">
                  {filteredCourses.map(c => (
                    <tr key={c._id} className="hover:bg-richblack-700/50 transition-all">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {c.thumbnail && <img src={c.thumbnail} alt="" className="w-14 h-9 rounded object-cover" />}
                          <span className="text-richblack-5 font-medium max-w-[180px] truncate">{c.courseName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-richblack-300">
                        {c.instructor?.firstName} {c.instructor?.lastName}
                      </td>
                      <td className="px-5 py-4 text-yellow-50 font-medium">₹{c.price?.toLocaleString("en-IN") || "Free"}</td>
                      <td className="px-5 py-4 text-richblack-300">{c.studentsEnroled?.length || 0}</td>
                      <td className="px-5 py-4 text-richblack-400">{c.category?.name || "—"}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${c.status === "Published" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => deleteCourse(c._id, c.courseName)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-all"
                          title="Delete course">
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredCourses.length === 0 && (
                    <tr><td colSpan={7} className="text-center text-richblack-400 py-12">
                      {searchCourse ? "No courses match your search" : "No courses found"}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-richblack-5 font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="bg-yellow-50/20 text-yellow-50 p-1.5 rounded-lg"><FiPlus /></span> 
              Add New Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                placeholder="Category name (e.g. Web Development)"
                className="bg-richblack-700 border border-richblack-600 text-richblack-5 placeholder-richblack-400 rounded-xl px-4 py-3 outline-none focus:border-yellow-50 transition-all"
              />
              <input
                value={newCatDesc}
                onChange={e => setNewCatDesc(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addCategory()}
                placeholder="Short description"
                className="bg-richblack-700 border border-richblack-600 text-richblack-5 placeholder-richblack-400 rounded-xl px-4 py-3 outline-none focus:border-yellow-50 transition-all"
              />
            </div>
            <button onClick={addCategory} disabled={loading}
              className="bg-yellow-50 text-richblack-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-100 transition-all disabled:opacity-60">
              {loading ? "Adding..." : "Add Category"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat._id} className="bg-richblack-800 border border-richblack-700 rounded-xl p-5 flex items-center justify-between group hover:border-richblack-600 transition-all">
                <div>
                  <p className="text-richblack-5 font-semibold">{cat.name}</p>
                  <p className="text-richblack-400 text-xs mt-1">{cat.description || "No description"}</p>
                  <p className="text-richblack-500 text-xs mt-1">{cat.courses?.length || 0} courses</p>
                </div>
                <button onClick={() => deleteCategory(cat._id, cat.name)}
                  className="text-richblack-500 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                  <FiTrash2 />
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="col-span-3 text-center text-richblack-400 py-12 bg-richblack-800 rounded-2xl border border-richblack-700">
                No categories yet. Add your first one above!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
