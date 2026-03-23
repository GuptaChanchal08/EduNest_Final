# EduNest — Deployment Guide

## Quick Start (Local)

### 1. Backend
```bash
cd server
npm install
# .env is already populated with real credentials
npm run dev
# → http://localhost:4000
```

### 2. Seed Data
```
GET http://localhost:4000/api/v1/seed        # creates users + courses
GET http://localhost:4000/api/v1/seed/blogs  # creates 15 blog posts
```

### 3. Frontend
```bash
# From project root
npm install
npm start
# → http://localhost:3000
```

### Demo Accounts
| Role       | Email                    | Password   |
|------------|--------------------------|------------|
| Admin      | admin@edunest.com        | Admin@1234 |
| Instructor | instructor@edunest.com   | Demo@1234  |
| Student    | student@edunest.com      | Demo@1234  |

---

## Production Deployment

### Backend → Render.com (Free)
1. Push repo to GitHub
2. Create new Web Service on Render
3. Root directory: `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all env vars from `server/.env`
7. Change `FRONTEND_URL` to your Vercel URL

### Frontend → Vercel (Free)
1. Connect GitHub repo to Vercel
2. Framework: Create React App
3. Build command: `npm run build`
4. Output directory: `build`
5. Add env vars:
   - `REACT_APP_BASE_URL` = your Render backend URL + `/api/v1`
   - `REACT_APP_RAZORPAY_KEY` = your Razorpay key

### After Deploy
- Update `server/.env` → `FRONTEND_URL=https://your-app.vercel.app`
- Update `CORS` in `server/index.js` → add your Vercel domain to `allowedOrigins`

---

## Production Checklist
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use Razorpay Live keys (not test keys) for real payments
- [ ] Set `NODE_ENV=production` on Render
- [ ] Enable MongoDB Atlas IP allowlist (or allow 0.0.0.0/0 for Render)
- [ ] Test email delivery (Gmail app password must be active)
- [ ] Run both seed endpoints after first deploy

