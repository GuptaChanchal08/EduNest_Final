# EduNest - Online Learning Platform

A full-stack EdTech platform built with React, Node.js, Express, and MongoDB.

## Features

- OTP-based email verification on signup
- Student, Instructor, and Admin roles
- Course creation with video uploads (Cloudinary)
- Razorpay payment integration
- Cart and checkout system
- Course progress tracking
- Ratings and reviews
- Instructor analytics dashboard
- Admin panel for managing users, courses, and categories
- Password reset via email
- Responsive design with Tailwind CSS

## Tech Stack

**Frontend:** React 18, Redux Toolkit, React Router v6, Tailwind CSS  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Services:** Cloudinary (media), Razorpay (payments), Nodemailer (email)

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Razorpay account (test mode)
- Gmail with App Password enabled

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd edunest-v2

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Environment Setup

Create `server/.env` with:
```
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=edunest
RAZORPAY_KEY=rzp_test_xxxx
RAZORPAY_SECRET=your_razorpay_secret
FRONTEND_URL=http://localhost:3000
PORT=4000
```

Create root `.env` with:
```
REACT_APP_BASE_URL=http://localhost:4000/api/v1
REACT_APP_RAZORPAY_KEY=rzp_test_xxxx
```

### Running the App

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm start
```

Open http://localhost:3000

## License

MIT
