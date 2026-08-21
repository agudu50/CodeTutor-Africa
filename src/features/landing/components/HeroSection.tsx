import React, { useState, useEffect, memo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { Button } from '@/components/ui'
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Laptop,
  Shield,
  Zap,
  Globe,
} from 'lucide-react'

const slides = [
  {
    image: '/images/students_collaboration.jpg',
    tag: 'Collaborative Study & Coding Clubs',
    caption: 'African learners and creators mastering code together without internet dependencies',
  },
  {
    image: '/images/student_focus.jpg',
    tag: 'Individual Deep Practice',
    caption: 'Quiet, focused problem solving at home, libraries, and workshops on standard laptops',
  },
  {
    image: '/images/terminal_student_offline.jpg',
    tag: 'Hands-On Coding Practice',
    caption: 'Building real-world projects on everyday laptops with fast, instant AI help',
  },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

export const HeroSection: React.FC = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-advance hero slideshow
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  return (
    <section
      className="relative min-h-[540px] sm:min-h-[600px] flex items-center justify-center px-4 md:px-8 overflow-hidden bg-slate-950"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Animated Background Slides */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={slides[currentSlide].image}
            alt={slides[currentSlide].caption}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            decoding="async"
            fetchPriority={currentSlide === 0 ? 'high' : 'low'}
            className="w-full h-full object-cover object-center"
          />
        </AnimatePresence>

        {/* Solid Flat Dark Overlay */}
        <div className="absolute inset-0 bg-slate-950 opacity-65" />
      </div>

      {/* Slide navigation controls */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/90 text-white border border-slate-700 hover:bg-slate-800 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/90 text-white border border-slate-700 hover:bg-slate-800 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>

      {/* Slide Tag */}
      <div className="absolute top-6 left-6 sm:left-12 z-20 hidden sm:block">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 text-[11px] font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          {slides[currentSlide].tag}
        </span>
      </div>

      {/* Slide Dots */}
      <div className="absolute bottom-6 right-6 sm:right-12 z-20 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentSlide === idx ? 'w-10 bg-brand-500' : 'w-2.5 bg-slate-600 hover:bg-slate-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Hero Foreground Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5 py-16 sm:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-7"
        >
          {/* Pill Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-block"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-brand-500 text-brand-300 text-xs font-semibold shadow-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              No Internet Needed • 100% Free AI Tutor for Any Laptop
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] drop-shadow-lg"
          >
            Master Programming & Coding.{' '}
            <br className="hidden sm:block" />
            Anytime. <span className="text-brand-400 font-black">Offline.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md"
          >
            A friendly, patient coding tutor built for beginners, students, and self-learners across Africa. Learn Python, JavaScript, and Java with an AI mentor that lives directly on your laptop—no internet connection, mobile data bundles, or fees needed.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4 pt-3"
          >
            <Link to="/signup">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="primary"
                  size="lg"
                  className="font-bold shadow-lg h-13 px-8 bg-brand-600 hover:bg-brand-500 border border-brand-400 text-base"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Start Learning Free
                </Button>
              </motion.div>
            </Link>
            <Link to="/dashboard">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="secondary"
                  size="lg"
                  className="font-semibold h-13 px-8 bg-slate-900 text-white hover:bg-slate-800 border border-slate-600 text-base"
                  leftIcon={<Laptop className="w-4 h-4" />}
                >
                  Launch Workspace
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-[11px] text-slate-400 font-mono"
          >
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> 100% Private & Free
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Instant AI Answers
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-400" /> Works Without Wi-Fi
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
})

HeroSection.displayName = 'HeroSection'
