import React, { useState } from "react"
import Footer from "../components/Common/Footer"
import { FiMapPin, FiClock, FiBriefcase, FiChevronDown, FiHeart } from "react-icons/fi"

const perks = [
  { emoji: "🌍", title: "Remote-First", desc: "Work from anywhere in the world. We have team members across India, Europe, and Southeast Asia." },
  { emoji: "📚", title: "Free Learning", desc: "Unlimited access to all EduNest courses for you and your family. We invest in your growth." },
  { emoji: "💰", title: "Competitive Pay", desc: "Market-rate salaries + equity options. We believe in sharing success with our team." },
  { emoji: "🏥", title: "Health Coverage", desc: "Comprehensive health insurance for you and your dependents from day one." },
  { emoji: "⏰", title: "Flexible Hours", desc: "Results matter more than hours. Set your own schedule and own your time." },
  { emoji: "🚀", title: "Fast Growth", desc: "We're a fast-growing startup. Your impact and career can grow quickly here." },
]

const jobs = [
  { title: "Senior Full Stack Engineer", dept: "Engineering", location: "Remote", type: "Full-time", level: "Senior" },
  { title: "Product Designer (UI/UX)", dept: "Design", location: "Mumbai / Remote", type: "Full-time", level: "Mid" },
  { title: "Content Creator – Web Dev", dept: "Content", location: "Remote", type: "Full-time", level: "Any" },
  { title: "Growth Marketing Manager", dept: "Marketing", location: "Mumbai", type: "Full-time", level: "Mid-Senior" },
  { title: "Customer Success Specialist", dept: "Support", location: "Remote", type: "Full-time", level: "Junior" },
  { title: "DevOps / Cloud Engineer", dept: "Engineering", location: "Remote", type: "Full-time", level: "Senior" },
]

const deptColors = {
  Engineering: "bg-blue-500/20 text-blue-300",
  Design: "bg-pink-500/20 text-pink-300",
  Content: "bg-green-500/20 text-green-300",
  Marketing: "bg-orange-500/20 text-orange-300",
  Support: "bg-purple-500/20 text-purple-300",
}

export default function Careers() {
  const [open, setOpen] = useState(null)

  return (
    <div className="bg-richblack-900 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-richblack-800 to-richblack-900 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-yellow-50 font-semibold text-sm uppercase tracking-widest mb-3">Join Our Team</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Build the Future of <span className="text-yellow-400">Education</span>
          </h1>
          <p className="text-richblack-300 text-lg max-w-2xl mx-auto">
            At EduNest, we're on a mission to make quality education accessible to everyone. 
            Join a passionate team building products that genuinely change lives.
          </p>
          <div className="flex items-center justify-center gap-8 mt-10 text-richblack-400">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">50+</p>
              <p className="text-sm">Team Members</p>
            </div>
            <div className="w-px h-12 bg-richblack-700" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">12</p>
              <p className="text-sm">Countries</p>
            </div>
            <div className="w-px h-12 bg-richblack-700" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">4.9★</p>
              <p className="text-sm">Glassdoor Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-3">Why Work at EduNest?</h2>
          <p className="text-richblack-400 text-center mb-12">We take care of our team so our team can take care of learners</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk, i) => (
              <div key={i} className="bg-richblack-800 border border-richblack-700 rounded-2xl p-6">
                <div className="text-3xl mb-4">{perk.emoji}</div>
                <h3 className="text-white font-bold text-lg mb-2">{perk.title}</h3>
                <p className="text-richblack-400 text-sm leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-richblack-800">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-3">Open Positions</h2>
          <p className="text-richblack-400 text-center mb-12">{jobs.length} roles currently open</p>
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <div key={i} onClick={() => setOpen(open === i ? null : i)}
                className="bg-richblack-900 border border-richblack-700 hover:border-yellow-50/30 rounded-xl overflow-hidden transition-all cursor-pointer">
                <div className="flex items-center justify-between p-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-white font-bold text-lg">{job.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${deptColors[job.dept]}`}>{job.dept}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-richblack-400 text-sm">
                      <span className="flex items-center gap-1"><FiMapPin />{job.location}</span>
                      <span className="flex items-center gap-1"><FiClock />{job.type}</span>
                      <span className="flex items-center gap-1"><FiBriefcase />{job.level}</span>
                    </div>
                  </div>
                  <FiChevronDown className={`text-richblack-400 transition-transform ${open === i ? "rotate-180" : ""}`} />
                </div>
                {open === i && (
                  <div className="px-6 pb-6 border-t border-richblack-700">
                    <p className="text-richblack-300 mt-4 mb-4 text-sm leading-relaxed">
                      We're looking for a talented {job.title} to join our {job.dept} team. 
                      You'll work closely with our core team to build and improve EduNest's platform, 
                      directly impacting thousands of learners worldwide.
                    </p>
                    <button className="bg-yellow-50 text-richblack-900 font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-100 transition-all text-sm">
                      Apply Now →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <FiHeart className="text-red-400 text-4xl mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Don't See Your Role?</h2>
          <p className="text-richblack-400 mb-8">
            We're always interested in meeting exceptional people. Send us your portfolio and tell us how you'd contribute to EduNest's mission.
          </p>
          <a href="mailto:careers@edunest.com">
            <button className="bg-yellow-50 text-richblack-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-100 transition-all">
              Send Open Application
            </button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
