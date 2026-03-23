import React from "react"
import Footer from "../components/Common/Footer"
import ContactDetails from "../components/core/ContactUsPage/ContactDetails"
import ContactUsForm from "../components/core/ContactUsPage/ContactUsForm"

export default function Contact() {
  return (
    <div className="bg-richblack-900 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-richblack-800 to-richblack-900 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-yellow-50 font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">We'd Love to Hear From You</h1>
          <p className="text-richblack-400 text-lg">Have questions about courses, partnerships, or need support? We're here to help.</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <ContactDetails />
            <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-richblack-5 mb-2">Send a Message</h2>
              <p className="text-richblack-400 text-sm mb-8">We usually respond within 24 hours</p>
              <ContactUsForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-richblack-800">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How do I enroll in a course?", a: "Create a free account, browse our catalog, and click 'Enroll Now' on any course. You can pay securely with Razorpay." },
              { q: "Can I get a refund?", a: "Yes, we offer a 7-day refund policy for all courses. Contact us within 7 days of purchase and we'll process your refund." },
              { q: "How long do I have access to a course?", a: "Once enrolled, you get lifetime access to the course content including all future updates." },
              { q: "Are certificates provided?", a: "Yes! You'll receive a certificate of completion after finishing all course modules." },
              { q: "Can I become an instructor?", a: "Absolutely! Sign up as an Instructor and start creating courses. Our team will review your content before publishing." },
            ].map((faq, i) => (
              <div key={i} className="bg-richblack-700 border border-richblack-600 rounded-xl p-6">
                <p className="text-richblack-5 font-semibold mb-2">{faq.q}</p>
                <p className="text-richblack-300 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
