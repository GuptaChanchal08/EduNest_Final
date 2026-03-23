# EduNest — All Bugs Fixed (v6)

## Demo Accounts (after running /api/v1/seed)
| Role       | Email                     | Password    |
|------------|---------------------------|-------------|
| Admin      | admin@edunest.com         | Admin@1234  |
| Instructor | instructor@edunest.com    | Demo@1234   |
| Student    | student@edunest.com       | Demo@1234   |

> **First time setup:** GET http://localhost:4000/api/v1/seed  
> **Create admin only:** GET http://localhost:4000/api/v1/seed/create-admin

---

## Bugs Fixed in This Version

### 1. Re-signup after account deletion fails
- **Root cause:** Deleted user's OTP records remained in DB. `sendotp` rejected signup because it found stale OTP.  
- **Fix:** `deleteAccount` now cleans up OTP records AND responds only after all deletions complete.

### 2. Wrong OTP on verify-email redirected to /signup with no toast
- **Fix:** Wrong OTP now keeps user on `/verify-email` with a specific error toast.

### 3. Signup — passAlert (password < 8) persisted after mismatch error
- **Fix:** `passAlert` is cleared when passwords mismatch, and cleared when password is valid.

### 4. Resend OTP shows double toasts (fail + success)
- **Fix:** All stale toasts are dismissed before sending a new OTP.

### 5. Login error — generic "Login Failed" instead of specific reason
- **Fix:** Shows exact server error (e.g., "User is not registered", "Password is incorrect").

### 6. Admin panel accessible to non-admin users
- **Fix:** Route guard added in `App.jsx`. Non-admins are redirected to `/dashboard/my-profile`.

### 7. Instructor routes accessible to students (and vice versa)
- **Fix:** All instructor routes (`/add-course`, `/my-courses`, `/instructor`) and student routes (`/cart`, `/enrolled-courses`, `/wishlist`) are now role-gated.

### 8. Reviews not shown in Course Details page
- **Fix 1:** `getCourseDetails` now populates `ratingAndReviews.user` (name, image).  
- **Fix 2:** A "Student Reviews" section was added to `CourseDetails.jsx`.

### 9. Free courses (price = 0) couldn't be enrolled directly
- **Fix:** Added `enrollFreeCourse()` in frontend and `POST /api/v1/payment/enrollFree` on backend.

### 10. Payment success email shows wrong amount (e.g. ₹4.99 instead of ₹499)
- **Root cause:** Server divided amount by 100 before passing to template, then template divided again.  
- **Fix:** Removed double-division from email template.

### 11. Profile save didn't redirect back to dashboard
- **Fix:** `EditProfile` now navigates to `/dashboard/my-profile` after successful save.

### 12. Comment reply profile picture was full-size
- **Root cause:** Dynamic Tailwind classes (`w-${size}`) are purged at build time.  
- **Fix:** Avatar component now uses inline `style` instead of dynamic class.

### 13. Catalog page error when category has no courses
- **Fix:** Backend now returns 200 with empty array instead of 404 for empty categories.

### 14. Review submission error showed "request failed" instead of real message
- **Fix:** `createRating` now surfaces the actual server error (e.g., "Course already reviewed").

### 15. Admin, Student, Instructor demo accounts missing from seed
- **Fix:** Seed now creates `admin@edunest.com`, `student@edunest.com`, `instructor@edunest.com`.

### 16. Certificate print lost styling
- **Fix:** Print window now auto-triggers after font load with a `window.onload` script instead of a raw `setTimeout`.

### 17. Email templates had hardcoded "© 2025"
- **Fix:** All 5 email templates updated to "© 2026".

### 18. Signup `passAlert` didn't clear on valid password before mismatch check
- **Fix:** `setPassAlert("")` called before the mismatch return path.

---

## How to Run

### Backend
```bash
cd server
npm install
node index.js          # or: npm run dev
```

### Frontend
```bash
cd ..     # project root
npm install
npm start
```

### Seed data + create admin
```
GET http://localhost:4000/api/v1/seed
GET http://localhost:4000/api/v1/seed/create-admin
```
