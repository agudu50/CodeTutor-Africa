import React, { useState, memo } from 'react'
import {
  Play,
  ArrowRight,
  Shield,
} from 'lucide-react'

interface VideoLessonPlayerProps {
  videoUrl: string
  title?: string
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export const VideoLessonPlayer: React.FC<VideoLessonPlayerProps> = memo(({
  videoUrl,
  title,
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoId = extractYouTubeId(videoUrl)
  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
    : videoUrl

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 overflow-hidden shadow-md space-y-0">
      {/* Video Viewport Container (16:9 Aspect Ratio) */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
        {videoId && isPlaying ? (
          <iframe
            src={embedUrl}
            title={title || 'Lesson Video Tutorial'}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : videoId ? (
          /* Custom Pre-play Thumbnail Cover with Play Button */
          <div className="relative w-full h-full group flex items-center justify-center">
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt={title || 'Video Cover'}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-95 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

            {/* Play Button Trigger */}
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="absolute z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center shadow-2xl transition-transform transform group-hover:scale-110 cursor-pointer ring-4 ring-white/20"
              aria-label="Play Lesson Video"
            >
              <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white ml-0.5" />
            </button>

            {/* Bottom Title Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-mono">
              <span className="font-bold truncate max-w-md drop-shadow-md">
                {title || 'Video Tutorial'}
              </span>
              <span className="px-2 py-0.5 rounded bg-brand-600/90 text-white text-[10px] font-bold uppercase drop-shadow-xs">
                YouTube HD
              </span>
            </div>
          </div>
        ) : (
          /* Generic Video URL Fallback */
          <div className="text-center p-6 text-slate-300 space-y-3">
            <Play className="w-10 h-10 mx-auto text-brand-400 opacity-80" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Interactive Video Tutorial</h4>
              <p className="text-xs text-slate-400 font-mono">{videoUrl}</p>
            </div>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 transition-colors"
            >
              <span>Open External Video Stream</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Video Bar Telemetry & Connectivity Note */}
      <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-300">
          <Play className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          <span>Integrated Video Lesson Player</span>
        </span>

        <span className="flex items-center gap-1.5 text-emerald-400 text-[10px]">
          <Shield className="w-3 h-3 shrink-0" />
          <span>Accompanying Code & Notes Saved Offline</span>
        </span>
      </div>
    </div>
  )
})

VideoLessonPlayer.displayName = 'VideoLessonPlayer'
