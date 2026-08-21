import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface StepConnectorProps {
  nextLabel: string
  targetId: string
  stepNumber: string
}

export const StepConnector: React.FC<StepConnectorProps> = memo(({
  nextLabel,
  targetId,
  stepNumber,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center pt-8 pb-4"
    >
      <a
        href={`#${targetId}`}
        className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-500 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-[10px] font-bold font-mono flex items-center justify-center border border-brand-200 dark:border-brand-800">
          {stepNumber}
        </span>
        <span>{nextLabel}</span>
        <ArrowRight className="w-3.5 h-3.5 text-brand-500 group-hover:translate-x-1 transition-transform" />
      </a>
    </motion.div>
  )
})

StepConnector.displayName = 'StepConnector'
