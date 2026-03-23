import React from "react"
import { Link } from "react-router-dom"
import Footer from "../components/Common/Footer"
import { FiDollarSign, FiUsers, FiBook, FiStar, FiCheckCircle, FiArrowRight } from "react-icons/fi"

const reasons = [
  { icon: <FiDollarSign />, title: "Earn Revenue", desc: "Earn money every time a student enrolls in your course. Top instructors earn ₹1,00,000+ monthly." },
  { icon: <FiUsers />, title: "Reach Thousands", desc: "EduNest's growing community of 10,000+ learners is waiting for your expertise." },
  { icon: <FiBook />, title: "Easy Course Builder", desc: "Our intuitive course builder makes it simple to upload videos, add quizzes, and organize content." },
  { icon: <FiStar />, title: "Build Your Brand", desc: "Publish under your name, collect reviews, and become a recognized expert in your field." },
]

const steps = [
  { step: "01", title: "Create Your Account", desc: "Sign up as an Instructor — it's completely free. Fill in your professional details and bio." },
  { step: "02", title: "Plan Your Course", desc: "Define your curriculum. What will students learn? What prerequisites do they need?" },
  { step: "03", title: "Create Content", desc: "Record video lessons, write notes, create quizzes, and upload assignments." },
  { step: "04", title: "Publish & Earn", desc: "Submit for review. Once approved, your course goes live and you start earning." },
]

const faqs = [
  { q: "How much can I earn?", a: "Earnings depend on course quality, pricing, and enrollment. Top instructors earn ₹50,000–₹2,00,000 per month. EduNest takes a 30% platform fee; you keep 70%." },
  { q: "What equipment do I need?", a: "A decent microphone and screen recording software are enough to start. We provide guides on creating professional-quality content on a budget." },
  { q: "How long does approval take?", a: "Our review team typically approves courses within 3-5 business days. We'll provide feedback if any changes are needed." },
  { q: "Can I update my courses?", a: "Yes! You can add new lessons, update content, and improve your course at any time. Students automatically get access to updates." },
]

export default function Teach() {
  return (
    <div className="bg-richblack-900 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-richblack-800 to-richblack-900 py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-yellow-50 font-semibold text-sm uppercase tracking-widest mb-4">Become an Instructor</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Share Your Knowledge,<br />
            <span className="text-yellow-400">Earn Real Income</span>
          </h1>
          <p className="text-richblack-300 text-xl max-w-2xl mx-auto mb-10">
            Join 200+ expert instructors teaching on EduNest. Help thousands of students while building a sustainable income from your expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <button className="bg-yellow-50 text-richblack-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-100 transition-all text-lg shadow-lg shadow-yellow-500/20">
                Start Teaching Today →
              </button>
            </Link>
            <Link to="/contact">
              <button className="border border-richblack-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-richblack-800 transition-all text-lg">
                Talk to Our Team
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-10 mt-16 text-center">
            {[
              { value: "200+", label: "Active Instructors" },
              { value: "₹1Cr+", label: "Paid to Instructors" },
              { value: "10,000+", label: "Students Reached" },
              { value: "4.8★", label: "Avg Instructor Rating" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-bold text-yellow-50">{stat.value}</p>
                <p className="text-richblack-400 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Teach */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-3">Why Teach on EduNest?</h2>
          <p className="text-richblack-400 text-center mb-12">Everything you need to build a successful teaching career</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((r, i) => (
              <div key={i} className="bg-richblack-800 border border-richblack-700 hover:border-yellow-50/30 rounded-2xl p-6 group transition-all">
                <div className="w-12 h-12 bg-yellow-50/10 group-hover:bg-yellow-50/20 rounded-xl flex items-center justify-center text-yellow-50 text-xl mb-4 transition-all">
                  {r.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{r.title}</h3>
                <p className="text-richblack-400 text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-richblack-800">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-3">How It Works</h2>
          <p className="text-richblack-400 text-center mb-12">From sign-up to first paycheck in 4 simple steps</p>
          <div className="space-y-6">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-6 bg-richblack-900 border border-richblack-700 rounded-2xl p-6">
                <div className="w-14 h-14 bg-yellow-50/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-50 font-black text-lg">{s.step}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">{s.title}</h3>
                  <p className="text-richblack-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Common Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-richblack-800 border border-richblack-700 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="text-yellow-50 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold mb-2">{faq.q}</p>
                    <p className="text-richblack-300 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-richblack-900 mb-4">Ready to Start Teaching?</h2>
          <p className="text-richblack-700 text-lg mb-8">Join our instructor community and start making an impact today.</p>
          <Link to="/signup">
            <button className="bg-richblack-900 text-white font-bold px-10 py-4 rounded-xl hover:bg-richblack-800 transition-all text-lg">
              Create Instructor Account →
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
