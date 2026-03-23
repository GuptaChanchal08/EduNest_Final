# EduNest LMS — Fixes Applied (v7 — March 2026)

## Summary
6 bugs identified from test case audit and fixed in this build.

---

## Bug #21 — Admin Role Dropdown Security Issue (TC#69, TC#70)
**File:** `src/components/core/Dashboard/AdminPanel/AdminDashboard.jsx`

**Problem:** Role dropdown included "Admin" as a selectable option, allowing any admin to
promote any user (including themselves) to Admin. No protection prevented self-demotion either.

**Fix:**
- Admin users now display a static "Admin" badge — no dropdown shown
- Non-admin users get a dropdown with only "Student" and "Instructor" options
- The logged-in admin's own row shows a disabled static label (no editable dropdown)
- Delete button is also hidden for Admin rows and for the current admin's own row

---

## Bug #22 — Announcement Notification "View" Link → 404 (TC#53, TC#66)
**File:** `server/controllers/Announcement.js`

**Problem:** When an instructor sends an announcement, each student gets a notification with
`link: /view-course/${courseId}`. This URL requires a full section/sub-section path to load,
so clicking "View →" in the Notifications panel always 404'd.

**Fix:** Changed notification link to `/dashboard/announcements` — now clicking "View →"
correctly routes the student to their Announcements dashboard page.

---

## Bug #23 — ManageBlogs: Cannot Delete or Open Blog Posts (TC#74)
**File:** `src/components/core/Dashboard/AdminPanel/ManageBlogs.jsx`

**Problem:** Blog cards in the Admin Manage Blogs panel had no delete button and no link
to open the post. The backend `DELETE /blog/deleteBlog` endpoint existed but was never called.

**Fix:**
- Added `handleDelete()` function calling `DELETE /blog/deleteBlog` with `Authorization` header
- Added "View Post" button linking to `/blog/:id` (opens in new tab)
- Added "Delete" button with loading state and confirmation dialog
- Cards now have a proper action bar at the bottom

---

## Bug #24 — Catalog Page 404 for "UI/UX" Category (TC#24)
**Files:** `src/pages/Catalog.jsx`, `src/components/Common/Navbar.jsx`

**Problem:** Category slug generation used `.split(" ").join("-").toLowerCase()`, which for a
category named "UI/UX Design" produces the slug `ui/ux-design`. The `/` in the URL is
interpreted by React Router as a path separator, causing a 404.

**Fix:** Added `.replace(/\//g, "-")` before the split/join in all 4 Navbar occurrences and
the Catalog match — "UI/UX Design" now correctly becomes `ui-ux-design`.

---

## Bug #25 — Email Accepts Invalid Domains (@gmail.co, @gmail.) (noted in test doc)
**File:** `src/components/core/Auth/SignupForm.jsx`

**Problem:** The signup form used `type="email"` which is too permissive — browsers accept
addresses like `user@gmail.co` or `user@gmail.` without a valid TLD.

**Fix:** Added regex validation `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$` in `handleOnSubmit`.
Any email without a TLD of at least 2 characters now shows:
"Please enter a valid email address (e.g. name@example.com)"

---

## Bug #26 — Student Announcements Dashboard Page Was Blank (TC#53)
**Files:**
- `src/components/core/Dashboard/Announcements.jsx` (rewritten)
- `server/controllers/Announcement.js` (new endpoint added)
- `server/routes/Announcement.js` (new route registered)
- `src/services/apis.js` (new `STUDENT_ALL_API` added)
- `src/components/core/Dashboard/Instructor.jsx` (updated import)
- `src/components/core/ViewCourse/VideoDetails.jsx` (updated import)

**Problem:** The `Announcements` component required a `courseId` prop to fetch announcements.
When rendered at the `dashboard/announcements` route (no courseId), `useEffect` never fired
and students saw a permanently blank page.

**Fix:**
- Added `GET /announcements/student-all` backend endpoint — fetches all announcements
  across all courses a student is enrolled in, with read/unread status and course info
- Rewrote the default export as `StudentAnnouncementsPage` — a proper full-page dashboard
  that calls the new endpoint, shows course name links, read/unread indicators, and
  per-announcement mark-as-read buttons
- Split the original inline component into a named export `InlineCourseAnnouncements`
  (used by VideoDetails and Instructor dashboard — behaviour unchanged)
- Updated all consuming files to use the correct named/default import

---

*EduNest LMS v7 — All known open bugs resolved*
