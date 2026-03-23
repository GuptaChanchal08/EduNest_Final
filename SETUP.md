# EduNest LMS — Complete Setup Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account + cluster ready
- Gmail account with 2FA enabled
- Cloudinary account
- Razorpay account
- Vercel account (for deployment later)

---

## STEP 1: Set up Server (Backend) Environment

Navigate into the `server` folder and create your `.env` file:

```bash
cd server
cp .env.example .env
```

Now open `server/.env` and fill in every value:

| Variable | Where to get it |
|---|---|
| `MONGODB_URL` | Atlas → Connect → Drivers → copy string, replace `<password>` |
| `JWT_SECRET` | Any random string, e.g. `edunest_secret_2025_abcxyz` |
| `MAIL_HOST` | `smtp.gmail.com` (leave as is) |
| `MAIL_USER` | Your Gmail address |
| `MAIL_PASS` | Gmail App Password (**not** your real password — see below) |
| `CLOUD_NAME` | Cloudinary Dashboard → Cloud Name |
| `API_KEY` | Cloudinary Dashboard → API Key |
| `API_SECRET` | Cloudinary Dashboard → API Secret |
| `RAZORPAY_KEY` | Razorpay → Settings → API Keys → Key ID |
| `RAZORPAY_SECRET` | Razorpay → Settings → API Keys → Key Secret |
| `FRONTEND_URL` | `http://localhost:3000` (for local) |

### How to get Gmail App Password:
1. Go to myaccount.google.com
2. Security → Enable 2-Step Verification (if not already)
3. Security → Search "App passwords"
4. Select app: Mail, device: Other → type "EduNest"
5. Click Generate → Copy the 16-character password
6. Paste it as `MAIL_PASS` (remove spaces)

---

## STEP 2: Set up Frontend Environment

In the root project folder:

```bash
cp .env.example .env
```

Fill in `REACT_APP_BASE_URL` and `REACT_APP_RAZORPAY_KEY`.

---

## STEP 3: Install Dependencies

```bash
# From root folder (frontend)
npm install

# Backend
cd server
npm install
cd ..
```

---

## STEP 4: Add MongoDB Atlas Network Access

1. MongoDB Atlas → Network Access → Add IP Address
2. Enter `0.0.0.0/0` → Confirm (allows all IPs for development)

---

## STEP 5: Run Both Servers

Open **two separate terminals**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
You should see:
```
EduNest server running on port 4000
DB Connection Success
Cloudinary connected
```

**Terminal 2 — Frontend:**
```bash
npm start
```
Opens at `http://localhost:3000`

---

## STEP 6: Create Admin + Categories (One-time setup)

The app needs at least one Category before courses can be created.

1. Register as any user at `http://localhost:3000/signup`
2. In MongoDB Atlas → Browse Collections → `users` collection
3. Find your user → change `accountType` to `"Admin"`
4. Log in again → you now have admin access
5. Go to your Atlas DB → create a document in `categories` collection:
```json
{ "name": "Web Development", "description": "Frontend and backend web development", "courses": [] }
```
Repeat for other categories you want (Data Science, Mobile Apps, etc.)

---

## STEP 7: Test the Full Flow

1. **Register** as Student (OTP will be sent to your email)
2. **Verify OTP** → account created
3. **Login** as Instructor → Create a course → add sections & videos
4. **Publish** the course
5. **Login** as Student → Browse → Add to Cart → Checkout (Razorpay test payment)
6. **Check email** → enrollment confirmation received
7. **Watch** videos → mark progress

---

## Test Razorpay Payment (Test Mode)

Use these test card details:
- Card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- Name: Any name

---

## Deployment to Vercel (after local works)

See the DEPLOY.md file for step-by-step Vercel deployment instructions.
