import React from "react"
import Footer from "../components/Common/Footer"
import { FiShield, FiLock, FiEye, FiTrash2 } from "react-icons/fi"

const sections = [
  {
    icon: <FiShield />,
    title: "Information We Collect",
    content: `We collect information you provide directly: name, email, payment details, profile picture, and course progress data. We also collect usage data — pages visited, videos watched, quiz scores — to improve your experience. Technical data such as IP address, browser type, and device info is collected automatically.`
  },
  {
    icon: <FiLock />,
    title: "How We Use Your Information",
    content: `Your data powers your learning experience: personalizing course recommendations, tracking progress, issuing certificates, processing payments securely via Razorpay, and communicating important updates. We never sell your personal data to third parties.`
  },
  {
    icon: <FiEye />,
    title: "Information Sharing",
    content: `We share data only with trusted service providers (Cloudinary for media, Razorpay for payments, SendGrid for emails) bound by strict confidentiality agreements. We may disclose information when required by law or to protect the safety of our users and platform.`
  },
  {
    icon: <FiTrash2 />,
    title: "Your Rights & Data Deletion",
    content: `You have the right to access, correct, or delete your personal data at any time. You can manage most settings from your Dashboard → Settings page. To request complete data deletion, email us at privacy@edunest.com. We process deletion requests within 30 days.`
  },
]

export default function PrivacyPolicy() {
  return (
    <div className="bg-richblack-900 min-h-screen">
      <section className="bg-gradient-to-b from-richblack-800 to-richblack-900 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-yellow-50 font-semibold text-sm uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-richblack-400 text-lg">Last updated: January 2025</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="bg-richblack-800 border border-yellow-50/20 rounded-2xl p-6">
            <p className="text-richblack-200 leading-relaxed">
              At EduNest, we are committed to protecting your privacy. This Policy explains how we collect, use, and safeguard your information when you use our platform. By using EduNest, you agree to the practices described here.
            </p>
          </div>

          {sections.map((section, i) => (
            <div key={i} className="bg-richblack-800 border border-richblack-700 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-yellow-50/10 rounded-xl flex items-center justify-center text-yellow-50 text-xl">
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
              </div>
              <p className="text-richblack-300 leading-relaxed">{section.content}</p>
            </div>
          ))}

          <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-4">Contact Us About Privacy</h2>
            <p className="text-richblack-300 leading-relaxed">
              If you have questions about this Privacy Policy or how we handle your data, please contact our Privacy Team at{" "}
              <a href="mailto:privacy@edunest.com" className="text-yellow-50 hover:underline">privacy@edunest.com</a>
              {" "}or write to us at EduNest Privacy Team, Mumbai, Maharashtra, India.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
