import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { FiAward, FiDownload, FiShare2, FiLoader } from "react-icons/fi"
import { toast } from "react-hot-toast"
import { apiConnector } from "../../../services/apiConnector"

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1"

export default function CertificateViewer({ courseId, courseName }) {
  const { token } = useSelector(s => s.auth)
  const [eligibility, setEligibility] = useState(null)
  const [certData, setCertData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const certRef = useRef(null)
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const check = async () => {
      try {
        const res = await apiConnector("GET", `${BASE_URL}/certificate/check?courseId=${courseId}`, null, headers)
        if (res.data.success) setEligibility(res.data)
      } catch {} finally { setLoading(false) }
    }
    if (courseId) check()
  }, [courseId])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await apiConnector("POST", `${BASE_URL}/certificate/generate`, { courseId }, headers)
      if (res.data.success) {
        setCertData(res.data.certificateData)
        toast.success("Certificate ready!")
      }
    } catch { toast.error("Failed to generate certificate") }
    setGenerating(false)
  }

  const handlePrint = () => {
    const el = certRef.current
    if (!el) return
    const win = window.open("", "_blank")
    win.document.write(`
      <html><head><title>Certificate - ${certData?.courseName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Libre+Baskerville:ital@0;1&display=swap');
        body { margin: 0; background: white; }
        @media print { body { margin: 0; } @page { margin: 0; size: A4 landscape; } }
      </style>
      </head><body>${el.outerHTML}</body></html>
    `)
    win.document.write('<script>window.onload=function(){setTimeout(function(){window.print();window.close();},1200);}<\/script>')
    win.document.close()
  }

  if (loading) return (
    <div className="flex items-center justify-center py-8">
      <FiLoader className="animate-spin text-yellow-50 text-2xl" />
    </div>
  )

  if (!eligibility) return null

  return (
    <div className="border border-richblack-700 rounded-2xl overflow-hidden">
      <div className="bg-richblack-800 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiAward className={eligibility.eligible ? "text-yellow-400" : "text-richblack-500"} />
          <span className="text-richblack-5 font-semibold text-sm">Certificate of Completion</span>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${eligibility.eligible ? "bg-green-500/20 text-green-400" : "bg-richblack-700 text-richblack-400"}`}>
          {eligibility.eligible ? "Eligible ✓" : `${eligibility.percent}% complete`}
        </span>
      </div>

      <div className="bg-richblack-900 p-5">
        {!eligibility.eligible ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2d2d2d" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EAB308" strokeWidth="3"
                  strokeDasharray={`${eligibility.percent} ${100 - eligibility.percent}`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-yellow-50 font-bold text-xs">
                {eligibility.percent}%
              </span>
            </div>
            <p className="text-richblack-300 text-sm mb-1">Complete the course to earn your certificate</p>
            <p className="text-richblack-500 text-xs">{eligibility.completed}/{eligibility.total} lectures done</p>
          </div>
        ) : certData ? (
          <div className="space-y-4">
            {/* Certificate preview */}
            <div ref={certRef} style={{
              background: "linear-gradient(135deg, #1a1209 0%, #2d1f0a 50%, #1a1209 100%)",
              border: "4px solid #B8860B",
              borderRadius: "12px",
              padding: "40px",
              textAlign: "center",
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#F5F0E8",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Corner ornaments */}
              {["0 0","0 auto","auto 0","auto"].map((m, i) => (
                <div key={i} style={{
                  position: "absolute",
                  top: i < 2 ? "8px" : "auto",
                  bottom: i >= 2 ? "8px" : "auto",
                  left: i % 2 === 0 ? "8px" : "auto",
                  right: i % 2 === 1 ? "8px" : "auto",
                  width: "40px", height: "40px",
                  border: "2px solid #B8860B",
                  borderRadius: i === 0 ? "2px 0 0 0" : i === 1 ? "0 2px 0 0" : i === 2 ? "0 0 0 2px" : "0 0 2px 0",
                  borderRight: i % 2 === 0 ? "none" : "2px solid #B8860B",
                  borderBottom: i < 2 ? "none" : "2px solid #B8860B",
                  borderTop: i >= 2 ? "none" : "2px solid #B8860B",
                  borderLeft: i % 2 === 1 ? "none" : "2px solid #B8860B",
                }} />
              ))}

              <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#B8860B", textTransform: "uppercase", marginBottom: "8px" }}>
                EduNest Learning Platform
              </div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "#FFD700", marginBottom: "4px" }}>
                Certificate of Completion
              </div>
              <div style={{ width: "100px", height: "2px", background: "linear-gradient(to right, transparent, #B8860B, transparent)", margin: "12px auto" }} />
              <div style={{ fontSize: "12px", letterSpacing: "2px", color: "#B8860B", textTransform: "uppercase", marginBottom: "12px" }}>
                This is to certify that
              </div>
              <div style={{ fontSize: "34px", fontWeight: "700", color: "#FFD700", fontStyle: "italic", marginBottom: "12px", fontFamily: "Georgia, serif" }}>
                {certData.studentName}
              </div>
              <div style={{ fontSize: "12px", color: "#C8B88A", marginBottom: "8px" }}>
                has successfully completed the course
              </div>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "#F5F0E8", marginBottom: "20px" }}>
                {certData.courseName}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "24px" }}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "11px", color: "#B8860B", textTransform: "uppercase", letterSpacing: "1px" }}>Date</div>
                  <div style={{ fontSize: "14px", color: "#F5F0E8" }}>{certData.completionDate}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "32px" }}>🏆</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "#B8860B", textTransform: "uppercase", letterSpacing: "1px" }}>Instructor</div>
                  <div style={{ fontSize: "14px", color: "#F5F0E8" }}>{certData.instructorName}</div>
                </div>
              </div>
              <div style={{ fontSize: "9px", color: "#6B5F40", marginTop: "16px" }}>
                Certificate ID: {certData.certificateId}
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <button onClick={handlePrint}
                className="flex items-center gap-2 bg-yellow-50 text-richblack-900 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-yellow-100 transition-all">
                <FiDownload size={14} /> Download / Print
              </button>
              <button onClick={() => { navigator.clipboard.writeText(`I completed "${certData.courseName}" on EduNest! Certificate ID: ${certData.certificateId}`); toast.success("Copied to clipboard!") }}
                className="flex items-center gap-2 border border-richblack-700 text-richblack-200 text-sm px-5 py-2.5 rounded-xl hover:bg-richblack-800 transition-all">
                <FiShare2 size={14} /> Share
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 space-y-3">
            <div className="text-4xl">🎉</div>
            <p className="text-richblack-5 font-semibold">Congratulations! You've completed the course.</p>
            <button onClick={handleGenerate} disabled={generating}
              className="flex items-center gap-2 mx-auto bg-yellow-50 text-richblack-900 font-bold text-sm px-6 py-3 rounded-xl hover:bg-yellow-100 transition-all disabled:opacity-60">
              {generating ? <><FiLoader className="animate-spin" size={14} /> Generating...</> : <><FiAward size={14} /> Get My Certificate</>}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
