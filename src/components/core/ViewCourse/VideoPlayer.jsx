import { useEffect, useRef, useState, useCallback } from "react"
import {
  FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiMinimize,
  FiSkipBack, FiSkipForward, FiSettings, FiCheck
} from "react-icons/fi"

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

function formatTime(secs) {
  if (isNaN(secs)) return "0:00"
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = Math.floor(secs % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  return `${m}:${String(s).padStart(2, "0")}`
}

export default function VideoPlayer({ src, onEnded, thumbnail }) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const progressRef = useRef(null)
  const hideControlsTimer = useRef(null)

  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [buffered, setBuffered] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [showSpeedBadge, setShowSpeedBadge] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (!videoRef.current) return
      // Don't capture if user is typing in an input
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return
      switch (e.key) {
        case " ": case "k": e.preventDefault(); togglePlay(); break
        case "ArrowRight": e.preventDefault(); skip(10); break
        case "ArrowLeft": e.preventDefault(); skip(-10); break
        case "ArrowUp": e.preventDefault(); adjustVolume(0.1); break
        case "ArrowDown": e.preventDefault(); adjustVolume(-0.1); break
        case "m": setMuted(m => { videoRef.current.muted = !m; return !m }); break
        case "f": toggleFullscreen(); break
        case ">": changeSpeed(1); break
        case "<": changeSpeed(-1); break
        default: break
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [playing])

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return
    if (videoRef.current.paused) { videoRef.current.play(); setPlaying(true) }
    else { videoRef.current.pause(); setPlaying(false) }
  }, [])

  const skip = (secs) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + secs))
  }

  const adjustVolume = (delta) => {
    if (!videoRef.current) return
    const newVol = Math.max(0, Math.min(1, volume + delta))
    setVolume(newVol)
    videoRef.current.volume = newVol
    setMuted(newVol === 0)
  }

  const changeSpeed = (dir) => {
    const idx = SPEEDS.indexOf(playbackRate)
    const newIdx = Math.max(0, Math.min(SPEEDS.length - 1, idx + dir))
    const newSpeed = SPEEDS[newIdx]
    setPlaybackRate(newSpeed)
    if (videoRef.current) videoRef.current.playbackRate = newSpeed
    setShowSpeedBadge(true)
    setTimeout(() => setShowSpeedBadge(false), 1500)
  }

  const setSpeed = (speed) => {
    setPlaybackRate(speed)
    if (videoRef.current) videoRef.current.playbackRate = speed
    setShowSettings(false)
    setShowSpeedBadge(true)
    setTimeout(() => setShowSpeedBadge(false), 1500)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => {})
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    const newMuted = !muted
    setMuted(newMuted)
    videoRef.current.muted = newMuted
  }

  // Auto-hide controls
  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    clearTimeout(hideControlsTimer.current)
    if (playing) {
      hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000)
    }
  }, [playing])

  const handleProgressClick = (e) => {
    if (!progressRef.current || !videoRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    videoRef.current.currentTime = pos * duration
  }

  // Video event handlers
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onTime = () => { setCurrentTime(v.currentTime); updateBuffered() }
    const onDur = () => setDuration(v.duration)
    const onPlay = () => setPlaying(true)
    const onPause = () => { setPlaying(false); setShowControls(true) }
    const onEnd = () => { setPlaying(false); setShowControls(true); onEnded?.() }
    v.addEventListener("timeupdate", onTime)
    v.addEventListener("loadedmetadata", onDur)
    v.addEventListener("play", onPlay)
    v.addEventListener("pause", onPause)
    v.addEventListener("ended", onEnd)
    return () => {
      v.removeEventListener("timeupdate", onTime)
      v.removeEventListener("loadedmetadata", onDur)
      v.removeEventListener("play", onPlay)
      v.removeEventListener("pause", onPause)
      v.removeEventListener("ended", onEnd)
    }
  }, [onEnded])

  const updateBuffered = () => {
    const v = videoRef.current
    if (!v || !v.buffered.length) return
    setBuffered(v.buffered.end(v.buffered.length - 1))
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-xl overflow-hidden group select-none"
      style={{ aspectRatio: "16/9" }}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        poster={thumbnail}
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        playsInline
      />

      {/* Speed badge */}
      {showSpeedBadge && (
        <div className="absolute top-4 right-4 bg-black/80 text-white text-sm font-bold px-3 py-1.5 rounded-lg animate-fade-in-out">
          {playbackRate}×
        </div>
      )}

      {/* Center play/pause flash */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* (optional visual flash on play/pause) */}
      </div>

      {/* Controls overlay */}
      <div className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)" }}>

        {/* Progress bar */}
        <div className="px-4 pb-2">
          <div
            ref={progressRef}
            className="relative h-1 hover:h-2 bg-white/20 rounded-full cursor-pointer transition-all duration-150 group/prog"
            onClick={handleProgressClick}
            onMouseMove={(e) => { if (e.buttons === 1) handleProgressClick(e) }}
          >
            {/* Buffered */}
            <div className="absolute inset-y-0 left-0 bg-white/30 rounded-full" style={{ width: `${bufferedPercent}%` }} />
            {/* Played */}
            <div className="absolute inset-y-0 left-0 bg-yellow-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
            {/* Thumb */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover/prog:opacity-100 transition-all shadow-lg"
              style={{ left: `${progress}%` }} />
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center gap-2 px-4 pb-4">
          {/* Play/Pause */}
          <button onClick={togglePlay} className="text-white hover:text-yellow-400 transition-colors p-1">
            {playing ? <FiPause size={20} /> : <FiPlay size={20} />}
          </button>

          {/* Skip back 10s */}
          <button onClick={() => skip(-10)} className="text-white hover:text-yellow-400 transition-colors p-1 text-xs flex flex-col items-center" title="Back 10s (←)">
            <FiSkipBack size={16} />
          </button>

          {/* Skip forward 10s */}
          <button onClick={() => skip(10)} className="text-white hover:text-yellow-400 transition-colors p-1" title="Forward 10s (→)">
            <FiSkipForward size={16} />
          </button>

          {/* Volume */}
          <div className="flex items-center gap-1 group/vol">
            <button onClick={toggleMute} className="text-white hover:text-yellow-400 transition-colors p-1">
              {muted || volume === 0 ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
            </button>
            <input
              type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
              onChange={(e) => { const v = parseFloat(e.target.value); setVolume(v); setMuted(v === 0); if (videoRef.current) videoRef.current.volume = v }}
              className="w-0 group-hover/vol:w-16 overflow-hidden transition-all duration-200 accent-yellow-400 cursor-pointer"
            />
          </div>

          {/* Time */}
          <span className="text-white text-xs font-mono ml-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Speed control */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(s => !s)}
              className="flex items-center gap-1 text-white hover:text-yellow-400 transition-colors text-xs font-bold px-2 py-1 rounded hover:bg-white/10"
              title="Playback speed"
            >
              <FiSettings size={14} />
              <span>{playbackRate}×</span>
            </button>
            {showSettings && (
              <div className="absolute bottom-10 right-0 bg-richblack-800 border border-richblack-600 rounded-xl overflow-hidden shadow-2xl z-50 min-w-[140px]">
                <p className="text-richblack-400 text-xs px-3 py-2 border-b border-richblack-700 font-semibold uppercase tracking-wider">Speed</p>
                {SPEEDS.map(speed => (
                  <button key={speed} onClick={() => setSpeed(speed)}
                    className={`flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-richblack-700 transition-all ${playbackRate === speed ? "text-yellow-50 font-semibold" : "text-richblack-200"}`}>
                    {speed === 1 ? "Normal" : `${speed}×`}
                    {playbackRate === speed && <FiCheck className="text-yellow-50" size={12} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} className="text-white hover:text-yellow-400 transition-colors p-1" title="Fullscreen (F)">
            {fullscreen ? <FiMinimize size={18} /> : <FiMaximize size={18} />}
          </button>
        </div>
      </div>

      {/* Keyboard shortcut hint (shown briefly on load) */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/70 text-white/60 text-xs px-3 py-1.5 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Space: Play/Pause · ←→: Skip 10s · &lt;&gt;: Speed · F: Fullscreen
      </div>
    </div>
  )
}
