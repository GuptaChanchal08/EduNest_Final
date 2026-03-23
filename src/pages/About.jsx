import React from "react"
import Footer from "../components/Common/Footer"
import { FiTarget, FiHeart, FiTrendingUp, FiUsers } from "react-icons/fi"
import HighlightText from "../components/core/HomePage/HighlightText"
import LearningGrid from "../components/core/AboutPage/LearningGrid"
import ContactFormSection from "../components/core/AboutPage/ContactFormSection"
import ReviewSlider from "../components/Common/ReviewSlider"

const stats = [
  { value: "10,000+", label: "Students Enrolled" },
  { value: "200+", label: "Courses Available" },
  { value: "50+", label: "Expert Instructors" },
  { value: "4.8★", label: "Average Rating" },
]

const values = [
  { icon: <FiTarget />, title: "Our Mission", desc: "To make quality education accessible to everyone, everywhere. We believe learning should have no boundaries — no location, no background, no financial barrier." },
  { icon: <FiHeart />, title: "Our Vision", desc: "A world where every person has the skills they need to build a better future for themselves and their communities through the power of education." },
  { icon: <FiTrendingUp />, title: "Our Approach", desc: "We combine expert instruction, hands-on projects, and a supportive community to create a learning experience that truly prepares you for the real world." },
  { icon: <FiUsers />, title: "Our Community", desc: "Over 10,000 learners from 50+ countries are part of the EduNest family. We grow together, support each other, and celebrate every milestone." },
]

export default function About() {
  return (
    <div className="bg-richblack-900 min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-b from-richblack-800 to-richblack-900 py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-yellow-50 font-semibold text-sm uppercase tracking-widest mb-4">About EduNest</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Empowering Learners to
            <br />
            <HighlightText text="Build Remarkable Careers" />
          </h1>
          <p className="text-richblack-300 text-lg max-w-3xl mx-auto leading-relaxed">
            EduNest was founded with a simple but powerful idea — that the right education, 
            delivered the right way, can change lives. We've helped thousands of students 
            go from complete beginners to confident professionals.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-richblack-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center bg-richblack-800 border border-richblack-700 rounded-2xl p-8">
                <p className="text-4xl font-bold text-yellow-50 mb-2">{s.value}</p>
                <p className="text-richblack-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Story */}
      <section className="py-20 bg-richblack-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-yellow-50 font-semibold uppercase tracking-widest text-sm mb-4">Our Story</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Built for Learners,<br />by Learners
              </h2>
              <div className="space-y-4 text-richblack-300 leading-relaxed">
                <p>
                  EduNest started as a small project with a big dream: to create an online learning platform 
                  that truly puts students first. We noticed that most platforms were either too expensive, 
                  too generic, or too disconnected from what employers actually need.
                </p>
                <p>
                  So we built something different. A platform where every course is taught by real practitioners, 
                  where you build actual projects, and where a supportive community helps you stay motivated 
                  through your entire learning journey.
                </p>
                <p>
                  Today, EduNest serves learners from over 50 countries — from students taking their first 
                  coding steps to professionals looking to level up their skills. Our mission hasn't changed: 
                  make great education accessible to everyone.
                </p>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
                alt="EduNest team"
                className="rounded-2xl shadow-2xl w-full object-cover h-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-richblack-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Drives Us</h2>
            <p className="text-richblack-400 max-w-xl mx-auto">The principles that guide everything we do at EduNest</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-richblack-800 border border-richblack-700 hover:border-yellow-50/30 rounded-2xl p-8 group transition-all">
                <div className="w-12 h-12 bg-yellow-50/10 group-hover:bg-yellow-50/20 rounded-xl flex items-center justify-center text-yellow-50 text-xl mb-5 transition-all">
                  {v.icon}
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{v.title}</h3>
                <p className="text-richblack-300 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Grid */}
      <section className="py-20 bg-richblack-800">
        <div className="max-w-6xl mx-auto px-6">
          <LearningGrid />
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-richblack-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Student Success Stories</h2>
          <p className="text-richblack-400 mb-12">Hear from our community of learners</p>
          <ReviewSlider />
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-richblack-800">
        <div className="max-w-6xl mx-auto px-6">
          <ContactFormSection />
        </div>
      </section>

      <Footer />
    </div>
  )
}
