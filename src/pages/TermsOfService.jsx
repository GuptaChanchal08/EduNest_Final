import React from "react"
import Footer from "../components/Common/Footer"

const terms = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing or using EduNest, you agree to be bound by these Terms of Service. If you disagree with any part, you may not access the platform. These terms apply to all visitors, students, instructors, and other users."
  },
  {
    title: "2. User Accounts",
    content: "You must provide accurate, complete information when creating an account. You are responsible for maintaining the confidentiality of your password and for all activities under your account. Notify us immediately of any unauthorized use at support@edunest.com."
  },
  {
    title: "3. Course Enrollment & Payments",
    content: "Course prices are listed in Indian Rupees (INR). Payments are processed securely via Razorpay. Upon successful payment, you receive lifetime access to the enrolled course content including future updates to that course."
  },
  {
    title: "4. Refund Policy",
    content: "We offer a 7-day refund policy from the date of purchase. To request a refund, contact support@edunest.com within 7 days. Refunds are not available if you have completed more than 50% of the course content. Certificates cannot be revoked after issuance."
  },
  {
    title: "5. Instructor Terms",
    content: "Instructors retain ownership of their course content. By publishing on EduNest, you grant us a non-exclusive license to distribute your content on our platform. You agree to provide accurate course information and keep content up-to-date."
  },
  {
    title: "6. Prohibited Conduct",
    content: "You may not share account credentials, distribute course content outside the platform, use automated tools to scrape content, harass other users, or upload malicious content. Violations may result in immediate account termination without refund."
  },
  {
    title: "7. Intellectual Property",
    content: "EduNest's name, logo, platform design, and proprietary content are protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without express written permission."
  },
  {
    title: "8. Limitation of Liability",
    content: "EduNest provides the platform 'as is'. We are not liable for indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you paid in the last 12 months."
  },
]

export default function TermsOfService() {
  return (
    <div className="bg-richblack-900 min-h-screen">
      <section className="bg-gradient-to-b from-richblack-800 to-richblack-900 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-yellow-50 font-semibold text-sm uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-richblack-400 text-lg">Last updated: January 2025</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-richblack-800 border border-yellow-50/20 rounded-2xl p-6 mb-8">
            <p className="text-richblack-200 leading-relaxed">
              Please read these Terms of Service carefully before using EduNest. These terms constitute a legally binding agreement between you and EduNest regarding your use of our learning management platform.
            </p>
          </div>

          <div className="space-y-6">
            {terms.map((term, i) => (
              <div key={i} className="bg-richblack-800 border border-richblack-700 rounded-2xl p-8">
                <h2 className="text-lg font-bold text-white mb-3">{term.title}</h2>
                <p className="text-richblack-300 leading-relaxed">{term.content}</p>
              </div>
            ))}
          </div>

          <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-8 mt-6">
            <h2 className="text-lg font-bold text-white mb-3">Questions?</h2>
            <p className="text-richblack-300">
              For questions about these terms, contact us at{" "}
              <a href="mailto:legal@edunest.com" className="text-yellow-50 hover:underline">legal@edunest.com</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
