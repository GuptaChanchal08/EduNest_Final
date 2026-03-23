# 🧪 EduNest — Complete Testing Guide

## ⚡ Quick Start (Run the App)

### 1. Start Backend
```bash
cd edunest-v2/server
npm install
node index.js
# → Server running on http://localhost:4000
```

### 2. Start Frontend
```bash
cd edunest-v2   # (root, where package.json is)
npm install
npm start
# → App opens at http://localhost:3000
```

---

## 🔐 TEST 1: Authentication

### 1.1 Student Sign Up
1. Go to `http://localhost:3000/signup`
2. Select **Student** tab
3. Fill: First Name, Last Name, Email, Password (min 8 chars), Confirm Password
4. Click **Create Account**
5. ✅ OTP sent to email → Enter 6-digit OTP on verify-email page
6. ✅ Redirected to home page logged in

### 1.2 Instructor Sign Up
1. Go to `/signup`, select **Instructor** tab
2. Fill all fields + choose Instructor
3. ✅ Same OTP flow

### 1.3 Admin Account
- Seed via: `POST http://localhost:4000/api/v1/seed/all`
- Or manually set `accountType: "Admin"` in MongoDB for a user

### 1.4 Login
1. Go to `/login`
2. Enter credentials → click **Sign In**
3. ✅ Redirected to `/dashboard/my-profile`

### 1.5 Forgot Password
1. Click "Forgot Password" on login page
2. Enter email → ✅ Reset link sent
3. Click link in email → `/update-password/:id`
4. Enter new password → ✅ Redirected to login

---

## 📚 TEST 2: Course Flow (Instructor)

### 2.1 Create a Course
1. Login as **Instructor**
2. Go to `/dashboard/add-course`
3. **Step 1 – Course Info:**
   - Course Name: "Complete React Course"
   - Description, Price (e.g. 999), Category (select from dropdown)
   - Upload a thumbnail image
   - Add tags, What You'll Learn, Requirements
   - Click **Next**
4. **Step 2 – Course Builder:**
   - Click **+ Add Section** → Name it "Getting Started"
   - Click **+ Add Lecture** → Upload a video, add title & description
   - Repeat for more lectures
   - Click **Next**
5. **Step 3 – Publish:**
   - Review course
   - Click **Save & Publish** → ✅ Course published
   - ✅ Visible in Instructor Dashboard

### 2.2 Edit a Course
1. Go to `/dashboard/my-courses`
2. Click **Edit** on any course
3. Modify details → Save
4. ✅ Changes reflected

---

## 🎓 TEST 3: Student Enrollment

### 3.1 Browse & Enroll
1. Login as **Student**
2. Browse catalog at `/catalog/web-development`
3. Click a course → Course Details page opens
4. Click **Buy Now** or **Add to Cart**
5. Go to `/dashboard/cart`
6. Click **Buy Now** → Razorpay payment modal opens
7. Use test card: `4111 1111 1111 1111` / Expiry: `12/26` / CVV: `123`
8. ✅ Enrollment confirmed → Course appears in `/dashboard/enrolled-courses`

### 3.2 Watch Course
1. Go to `/dashboard/enrolled-courses`
2. Click **Continue Learning** on an enrolled course
3. ✅ Video player opens at `/view-course/:courseId/section/:sectionId/sub-section/:subSectionId`
4. Watch video, mark as complete
5. ✅ Progress bar updates

### 3.3 Rate & Review
1. After watching some content, click **Add Review**
2. Give a star rating + written review
3. ✅ Review shows on course details page

---

## 👤 TEST 4: Profile & Settings

### 4.1 Update Profile
1. Go to `/dashboard/my-profile`
2. Click **Edit Profile** or `/dashboard/settings`
3. Change display picture, bio, contact number
4. Click **Save** → ✅ Changes saved

### 4.2 Change Password
1. Go to `/dashboard/settings`
2. Click **Change Password**
3. Enter old password + new password → Save
4. ✅ Logout and login with new password

---

## 🛡️ TEST 5: Admin Panel

### 5.1 Access Admin
1. Login with Admin account
2. Go to `/dashboard/admin`
3. ✅ See: Overview stats, Users list, Courses list, Categories

### 5.2 Manage Categories
1. In Admin Panel → Categories tab
2. Add a new category (e.g., "Cloud Computing")
3. ✅ Category appears in Catalog dropdown in navbar

### 5.3 Manage Users
1. Admin Panel → Users tab
2. View all users with their roles
3. Delete a user → ✅ User removed

### 5.4 Manage Courses
1. Admin Panel → Courses tab
2. View all courses across all instructors
3. Delete a course → ✅ Course removed

---

## 🧭 TEST 6: New Pages (Verify No 404s)

Test each URL returns a proper page (not 404):

| URL | Expected |
|-----|----------|
| `/` | Home page |
| `/about` | About page |
| `/contact` | Contact form + FAQ |
| `/catalog/web-development` | Course catalog |
| `/blog` | Blog with articles |
| `/careers` | Job listings |
| `/teach` | Become instructor CTA |
| `/privacy-policy` | Privacy policy |
| `/terms-of-service` | Terms of service |
| `/search?q=react` | Search results |
| `/login` | Login form |
| `/signup` | Signup form |
| `/forgot-password` | Forgot password form |
| `/dashboard/my-profile` | Profile (login required) |
| `/dashboard/enrolled-courses` | Student courses (login required) |
| `/dashboard/instructor` | Instructor dashboard (login required) |
| `/dashboard/admin` | Admin panel (login required) |
| `/xyz-does-not-exist` | Beautiful 404 page |

---

## 🔍 TEST 7: Search Feature

1. Click the 🔍 search icon in the Navbar
2. Type "React" → press Enter
3. ✅ Redirected to `/search?q=React`
4. Browse category links shown in results
5. ✅ No 404 error

---

## 🪲 Common Issues & Fixes

### "Spinner keeps spinning" on catalog
- Backend not running → Start server on port 4000
- Check `.env` in server folder has MongoDB URI

### "OTP not received"
- Check `.env` has valid email credentials (Gmail App Password)
- Check spam folder

### "Payment fails"
- Razorpay test mode: Use test card `4111 1111 1111 1111`
- Check Razorpay test key in `.env`

### "Upload fails / no thumbnail"
- Check Cloudinary credentials in `.env`
- Free Cloudinary tier supports up to 25 GB

### Dark text on dark background
- Force refresh (Ctrl+Shift+R) to clear old CSS cache
- The new `App.css` fixes most contrast issues

---

## 📦 Package Versions (Already Up to Date)

| Package | Version | Notes |
|---------|---------|-------|
| React | 18.3.1 | ✅ Latest stable |
| React Router | 6.24 | ✅ Latest |
| Redux Toolkit | 2.2.5 | ✅ Latest |
| Axios | 1.7.2 | ✅ Latest |
| Tailwind CSS | 3.4.4 | ✅ Latest v3 |
| React Icons | 5.2.1 | ✅ Latest |
| React Hot Toast | 2.4.1 | ✅ Latest |
| Swiper | 11.x | ✅ Latest |

---

## 🚀 What's Fixed in This Update

1. ✅ **Dark text on dark bg** — Global CSS fixes applied
2. ✅ **404 errors** — All routes now unconditional (no conditional route rendering)
3. ✅ **Favicon** — New EduNest branded yellow "E" favicon via SVG data URI
4. ✅ **Missing pages** — Blog, Careers, Teach, Privacy Policy, Terms of Service, Search all added
5. ✅ **Footer links** — All footer links now point to real pages (no dead links)
6. ✅ **Navbar** — Search bar added, "Teach" link added
7. ✅ **Error page** — Beautiful 404 with helpful navigation
8. ✅ **Settings route** — Both `/dashboard/settings` and `/dashboard/Settings` work

---

*Happy Testing! 🎉*
