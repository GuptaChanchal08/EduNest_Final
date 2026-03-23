# EduNest LMS — Bug Fixes Applied (Final Delivery Build)

> Version: Final Client Handover Build  
> Date: March 2026  
> All fixes based on EduNest_Test_Cases_Final.docx audit

---

## Summary

| # | Area | Issue | Files Changed | Test Case |
|---|------|-------|---------------|-----------|
| 1 | Admin Panel | Role dropdown allowed setting users to Admin; no protection for own account | AdminDashboard.jsx | TC#69, TC#70 |
| 2 | Notifications | Announcement "View" link pointed to incomplete route → 404 | server/controllers/Announcement.js | TC#53, TC#66 |
| 3 | Admin Panel | ManageBlogs had no Delete button and no way to open a blog | AdminPanel/ManageBlogs.jsx | TC#74 |
| 4 | Catalog | Category slug broke for names containing "/" (e.g. "UI/UX Design") → 404 | Catalog.jsx, Navbar.jsx (4 spots) | TC#24 |
| 5 | Auth | Email validation accepted invalid TLDs like @gmail.co or @gmail. | SignupForm.jsx | Doc note |
| 6 | Announcements | Student dashboard announcements page was blank (missing courseId) | Announcements.jsx, server/controllers/Announcement.js, server/routes/Announcement.js, services/apis.js, Instructor.jsx, VideoDetails.jsx | TC#53, TC#54 |

---

## Detailed Fix Notes

### Fix 1 — Admin Role Dropdown Security (AdminDashboard.jsx)
- **Before:** Dropdown listed `["Student", "Instructor", "Admin"]` — anyone could be promoted to Admin by an existing admin, and admins could demote themselves
- **After:**
  - Admin rows now show a read-only badge — cannot be changed via dropdown
  - Non-admin rows only show `["Student", "Instructor"]` — no Admin option in dropdown
  - The logged-in admin's own row is also protected (shows static label, no dropdown, no delete button)
  - Delete button is hidden for Admin rows and for the logged-in admin's own row

### Fix 2 — Announcement Notification Link (server/controllers/Announcement.js)
- **Before:** `link: /view-course/${courseId}` — this URL is incomplete (requires sectionId + subSectionId) so clicking "View →" in notifications always 404'd
- **After:** `link: /dashboard/announcements` — correctly navigates the student to their announcements dashboard

### Fix 3 — ManageBlogs (AdminPanel/ManageBlogs.jsx)
- **Before:** Blog cards rendered with no actions — no way to delete a blog, no way to open/view it
- **After:**
  - Each card now has a **"View Post"** button (opens blog in new tab via `Link to="/blog/:id"`)
  - Each card now has a **"Delete"** button that calls `DELETE /blog/deleteBlog` with the admin's token, removes from list on success
  - Loading/disabled state during deletion prevents double-clicks

### Fix 4 — Catalog Slug for Special Characters (Catalog.jsx + Navbar.jsx)
- **Before:** `.split(" ").join("-").toLowerCase()` — a category named "UI/UX Design" produced the URL `/catalog/ui/ux-design` where `/` was treated as a route separator, resulting in a 404
- **After:** Added `.replace(/\//g, "-")` before splitting on spaces — produces `/catalog/ui-ux-design`, which correctly matches the route

### Fix 5 — Email Validation (SignupForm.jsx)
- **Before:** Only `type="email"` HTML validation, which accepts `user@domain.c` or `user@gmail.` (no minimum TLD length)
- **After:** Added JavaScript regex validation `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` that requires at least a 2-character TLD — fires before OTP is sent, shows toast error

### Fix 6 — Student Announcements Dashboard (multiple files)
- **Before:** The `Announcements` component required a `courseId` prop. When rendered at `dashboard/announcements` (student route) with no prop, `useEffect` was gated on `if (courseId)` so it never fetched — resulting in a permanently blank page
- **After:**
  - Added backend endpoint `GET /announcements/student-all` that fetches all announcements across all courses the logged-in student is enrolled in (joins via `user.courses`)
  - Rewrote `Announcements.jsx` with two exports:
    - Default export `StudentAnnouncementsPage` — full-page dashboard view for students, calls `/student-all`, groups by course, supports mark-as-read
    - Named export `InlineCourseAnnouncements` — the original inline panel used inside `ViewCourse` and `Instructor` dashboard (unchanged behavior)
  - Updated `Instructor.jsx` and `VideoDetails.jsx` to use the named `InlineCourseAnnouncements` export
  - Added `STUDENT_ALL_API` to `services/apis.js`
  - Registered new route in `server/routes/Announcement.js`

---

*All previous bugs (#1–#20 from BUGS_FIXED_v6.md) remain intact. This file documents the 6 additional fixes applied during final QA.*
