import React, { useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown } from 'lucide-react'
import { LightSectionBackground } from './LightSectionBackground'
import { SectionReveal } from './SectionReveal'
import { StepConnector } from './StepConnector'

const faqs = [
  {
    q: 'How does CodeTutor Africa work without internet on a normal laptop?',
    a: 'We built a compact AI model that lives directly on your computer. It reads your code and explains concepts using your laptop\'s own processor—meaning zero internet connection and zero mobile data bundles are ever needed.',
  },
  {
    q: 'Do I need to pay for subscriptions or mobile data?',
    a: 'No. CodeTutor Africa is completely free forever. There are no monthly fees, hidden subscriptions, or mobile data bundles required to practice coding, fix errors, or get help from the AI tutor.',
  },
  {
    q: 'Who can use CodeTutor Africa and what languages can I learn?',
    a: 'It is made for everyone—complete beginners, high school coding clubs, self-taught learners, polytechnic, and university students. You can learn Python, JavaScript, and Java through simple, step-by-step lessons.',
  },
  {
    q: 'Can I use it during power cuts or while traveling?',
    a: 'Yes! Because every lesson and tool is saved directly on your laptop, you can open your computer and practice anywhere—at home, on the bus, in school, or during power outages.',
  },
]

export const FaqSection: React.FC = memo(() => {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 sm:py-28 px-4 md:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      <LightSectionBackground
        symbols={['FAQ', '0 Fees', 'All Learners', '100% Private']}
        accentPosition="top-right"
      />
      <div className="max-w-4xl mx-auto space-y-10">
        <SectionReveal>
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 font-mono shadow-xs">
              <BookOpen className="w-3.5 h-3.5" />
              Step 05 • Common Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>
        </SectionReveal>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <SectionReveal key={index} delay={index * 0.04}>
                <div
                  className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                    isOpen
                      ? 'border-brand-300 dark:border-brand-700 shadow-md bg-white dark:bg-slate-900'
                      : 'border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-500' : 'text-slate-400'}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pl-12 sm:pl-16 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </SectionReveal>
            )
          })}
        </div>

        {/* Journey Connector */}
        <StepConnector nextLabel="Final Step: Start Learning Free Today" targetId="cta" stepNumber="06" />
      </div>
    </section>
  )
})

FaqSection.displayName = 'FaqSection'
