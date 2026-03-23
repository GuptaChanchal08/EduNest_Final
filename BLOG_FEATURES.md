# Blog System — What Was Added

## Backend
- `server/models/Blog.js` — upgraded with `likes[]`, `tags[]`, `views`, `status`
- `server/controllers/Blog.js` — full rewrite:
  - `createBlog` — any logged-in user (was admin-only before)
  - `editBlog` — author or admin only
  - `deleteBlog` — author or admin only
  - `toggleLike` — any logged-in user
  - `addComment` — any logged-in user
  - `deleteComment` — comment owner or admin
  - `getMyBlogs` — returns logged-in user's blogs
  - `getAllBlogs` — supports ?category= and ?search= query params
  - `getBlogDetails` — increments view count
- `server/routes/Blog.js` — routes updated to match new controller
- `server/controllers/Seed.js` — `seedBlogs` added (15 rich dummy blogs across all categories)
- `server/routes/Seed.js` — GET /api/v1/seed/blogs

## Frontend
- `src/pages/Blog.jsx` — rebuilt: search bar, category filter, "Write a Blog" CTA, skeleton loading, like/comment counts on cards
- `src/pages/BlogDetails.jsx` — rebuilt: like button, delete comment, share, tags, view count, author badge, better Markdown styling
- `src/components/core/Dashboard/MyBlogs.jsx` — NEW: write/edit/delete blogs from dashboard, stats per blog
- `src/services/operations/blogAPI.js` — all new endpoints added
- `src/data/dashboard-links.js` — "My Blogs" added for ALL user roles (Student, Instructor, Admin)
- `src/components/Common/Navbar.jsx` — "Blog" added to nav links
- `src/App.jsx` — /dashboard/my-blogs route added

## Seeding
After running `GET /api/v1/seed`, run `GET /api/v1/seed/blogs` to populate 15 dummy blog posts.

## Access Rules
| Action           | Guest | Logged-in | Author | Admin |
|------------------|-------|-----------|--------|-------|
| Read blogs       | ✅    | ✅        | ✅     | ✅    |
| Like a blog      | ❌    | ✅        | ✅     | ✅    |
| Comment          | ❌    | ✅        | ✅     | ✅    |
| Create blog      | ❌    | ✅        | ✅     | ✅    |
| Edit blog        | ❌    | ❌        | ✅     | ✅    |
| Delete blog      | ❌    | ❌        | ✅     | ✅    |
| Delete comment   | ❌    | ❌        | own    | ✅    |
