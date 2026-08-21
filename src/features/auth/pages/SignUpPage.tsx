import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, Input, Dropdown } from '@/components/ui'
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [emailOrId, setEmailOrId] = useState('')
  const [university, setUniversity] = useState('ug')
  const [track, setTrack] = useState('python')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const universityOptions = [
    { value: 'ug', label: 'University of Ghana (Legon)' },
    { value: 'knust', label: 'Kwame Nkrumah University of Science and Technology' },
    { value: 'makerere', label: 'Makerere University (Uganda)' },
    { value: 'ashesi', label: 'Ashesi University' },
    { value: 'unilag', label: 'University of Lagos (Nigeria)' },
    { value: 'uct', label: 'University of Cape Town (South Africa)' },
    { value: 'other', label: 'Other African Higher Institution' },
  ]

  const trackOptions = [
    { value: 'python', label: 'Python (CS Fundamentals & Algorithms)' },
    { value: 'javascript', label: 'JavaScript (Web & Asynchronous Systems)' },
    { value: 'java', label: 'Java (OOP & Software Engineering)' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate('/dashboard')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg shrink-0 border border-brand-500">
            <Sparkles className="w-5 h-5 text-accent-300" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            CodeTutor <span className="text-brand-600 dark:text-brand-400 font-extrabold">Africa</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create student account
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Already have an offline profile?{' '}
          <Link
            to="/signin"
            className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Main Registration Container with Framer Motion */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0"
      >
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ama Serwaa"
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Student Email / University ID"
              type="text"
              required
              value={emailOrId}
              onChange={(e) => setEmailOrId(e.target.value)}
              placeholder="e.g. 10984723 or student@knust.edu.gh"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div>
              <Dropdown
                label="University / Institution"
                options={universityOptions}
                value={university}
                onChange={setUniversity}
              />
            </div>

            <div>
              <Dropdown
                label="Primary Programming Language"
                options={trackOptions}
                value={track}
                onChange={setTrack}
              />
            </div>

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a strong password"
              leftIcon={<Lock className="w-4 h-4" />}
              hint="Your password encrypts your local study records offline."
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full font-bold h-11 mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Offline Account
            </Button>
          </form>

          {/* Guarantee pill */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Offline-First Guarantee:</span>
            </div>
            <p className="leading-normal">
              No internet subscription or recurring cloud fee required. All course materials and AI models run locally on your device.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SignUpPage
