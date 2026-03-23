import React from "react"
import { Link } from "react-router-dom"
import { FiTwitter, FiInstagram, FiLinkedin, FiYoutube, FiGithub, FiMail } from "react-icons/fi"

const footerSections = [
  {
    title: "Learn",
    links: [
      { label: "Web Development", path: "/catalog/web-development" },
      { label: "Data Science", path: "/catalog/data-science" },
      { label: "Mobile Development", path: "/catalog/mobile-development" },
      { label: "UI/UX Design", path: "/catalog/ui-ux-design" },
      { label: "All Courses", path: "/catalog/web-development" },
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Us", path: "/about" },
      { label: "Careers", path: "/careers" },
      { label: "Blog", path: "/blog" },
      { label: "Teach on EduNest", path: "/teach" },
      { label: "Contact Us", path: "/contact" },
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Help Center", path: "/contact" },
      { label: "Privacy Policy", path: "/privacy-policy" },
      { label: "Terms of Service", path: "/terms-of-service" },
      { label: "Cookie Policy", path: "/privacy-policy" },
      { label: "Refund Policy", path: "/contact" },
    ]
  },
]

const socialLinks = [
  { icon: <FiTwitter />, href: "https://twitter.com", label: "Twitter" },
  { icon: <FiInstagram />, href: "https://instagram.com", label: "Instagram" },
  { icon: <FiLinkedin />, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: <FiYoutube />, href: "https://youtube.com", label: "YouTube" },
  { icon: <FiGithub />, href: "https://github.com", label: "GitHub" },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-richblack-800 border-t border-richblack-700">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-richblack-900 font-black text-xl shadow-lg">
                E
              </div>
              <span className="text-white font-bold text-2xl">
                Edu<span className="text-yellow-400">Nest</span>
              </span>
            </Link>
            <p className="text-richblack-400 leading-relaxed max-w-sm">
              Empowering learners worldwide with expert-led courses, hands-on projects, 
              and a thriving community. Start your journey today.
            </p>
            <div>
              <p className="text-richblack-5 font-semibold mb-3 text-sm">Stay updated</p>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-richblack-700 border border-richblack-600 rounded-xl px-3 py-2.5">
                  <FiMail className="text-richblack-400 text-sm flex-shrink-0" />
                  <input placeholder="Enter your email"
                    className="bg-transparent text-richblack-200 placeholder-richblack-500 text-sm outline-none w-full" />
                </div>
                <button className="bg-yellow-50 text-richblack-900 font-bold px-4 py-2.5 rounded-xl hover:bg-yellow-100 transition-all text-sm whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              {socialLinks.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                  className="w-9 h-9 bg-richblack-700 hover:bg-yellow-50 hover:text-richblack-900 text-richblack-300 rounded-lg flex items-center justify-center transition-all">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {footerSections.map(section => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-richblack-5 font-semibold text-sm uppercase tracking-wider">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-richblack-400 hover:text-yellow-50 text-sm transition-all">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-richblack-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-richblack-500 text-sm">© {year} EduNest. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-richblack-500 hover:text-richblack-300 text-sm transition-all">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-richblack-500 hover:text-richblack-300 text-sm transition-all">Terms of Use</Link>
            <Link to="/privacy-policy" className="text-richblack-500 hover:text-richblack-300 text-sm transition-all">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
