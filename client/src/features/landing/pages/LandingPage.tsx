import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui'
import { useTheme } from '@/app/providers/ThemeProvider'
import {
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Shield,
  HardDrive,
  Globe,
  Menu,
  X,
} from 'lucide-react'

import { HeroSection } from '../components/HeroSection'
import { TerminalSection } from '../components/TerminalSection'
import { RealitiesSection } from '../components/RealitiesSection'
import { WorkspaceSection } from '../components/WorkspaceSection'
import { HardwareSpecsSection } from '../components/HardwareSpecsSection'
import { FaqSection } from '../components/FaqSection'
import { CtaSection } from '../components/CtaSection'
import { BackToTopButton } from '../components/BackToTopButton'

export const LandingPage: React.FC = () => {
  const { isDark, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white relative">
      {/* ═══════════════════════════════════════════════════════════════
          NAVIGATION HEADER
          ═══════════════════════════════════════════════════════════════ */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between backdrop-blur-md transition-colors duration-300">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-base shrink-0 border border-brand-500 shadow-xs"
          >
            <Sparkles className="w-5 h-5 text-accent-300" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              CodeTutor <span className="text-brand-600 dark:text-brand-400 font-extrabold">Africa</span>
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>100% Offline AI</span>
            </div>
          </div>
        </Link>

        {/* Center links on desktop */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          {[
            { href: '#terminal-demo', label: 'Live Demo' },
            { href: '#why-offline', label: 'Why Offline?' },
            { href: '#features', label: 'AI Workspace' },
            { href: '#architecture', label: 'Laptop Specs' },
            { href: '#faq', label: 'FAQ' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400 text-slate-700 dark:text-slate-200 transition-all font-medium"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions: Theme Toggle + Auth Buttons + Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors shadow-xs"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </motion.button>

          {/* Desktop Auth CTA */}
          <div className="hidden sm:flex items-center gap-2">
            <Link to="/signin">
              <Button variant="ghost" size="sm" className="font-semibold text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                Sign In
              </Button>
            </Link>

            <Link to="/signup">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="primary" size="sm" className="font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white shadow-xs px-3.5">
                  Get Started Free
                </Button>
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="md:hidden absolute top-16 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-5 shadow-xl space-y-4 z-50 overflow-hidden"
            >
              <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-200 font-sans">
                {[
                  { href: '#terminal-demo', label: 'Live Demo' },
                  { href: '#why-offline', label: 'Why Offline?' },
                  { href: '#features', label: 'AI Workspace' },
                  { href: '#architecture', label: 'Laptop Specs' },
                  { href: '#faq', label: 'FAQ' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors font-medium flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full justify-center font-semibold text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full justify-center font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Modular Content Area */}
      <main className="flex-1 relative z-10">
        <HeroSection />
        <TerminalSection />
        <RealitiesSection />
        <WorkspaceSection />
        <HardwareSpecsSection />
        <FaqSection />
        <CtaSection />
      </main>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 px-4 md:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Top footer row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-slate-200 dark:border-slate-800">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-base border border-brand-500">
                <Sparkles className="w-5 h-5 text-accent-300" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  CodeTutor <span className="text-brand-600 dark:text-brand-400">Africa</span>
                </span>
                <p className="text-[10px] text-slate-400 font-mono">Offline AI-Powered Coding Education</p>
              </div>
            </div>

            {/* Links grid */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs text-slate-500">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Platform</span>
                <div className="flex flex-col gap-1.5">
                  <Link to="/dashboard" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Dashboard</Link>
                  <Link to="/tutor" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">AI Tutor</Link>
                  <Link to="/practice" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Code Practice</Link>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Learn</span>
                <div className="flex flex-col gap-1.5">
                  <Link to="/learning" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Courses</Link>
                  <Link to="/debugger" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Debugger</Link>
                  <Link to="/progress" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Progress</Link>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account</span>
                <div className="flex flex-col gap-1.5">
                  <Link to="/signin" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Sign In</Link>
                  <Link to="/signup" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Create Account</Link>
                  <Link to="/settings" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Settings</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom copyright row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-[11px] text-slate-400">
            <span>© 2026 CodeTutor Africa. Built with ❤ for African Coders, Schools & Self-Learners.</span>
            <div className="flex items-center gap-4 font-mono text-[10px]">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-500" /> 100% Local
              </span>
              <span className="flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-brand-500" /> On-Device AI
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-sky-500" /> No Cloud
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      <BackToTopButton />
    </div>
  )
}

export default LandingPage
