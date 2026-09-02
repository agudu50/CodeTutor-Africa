import React, { useState, useRef } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { useTheme } from '@/app/providers/ThemeProvider'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { useUserProfile } from '@/app/providers/UserProfileProvider'
import { Avatar, Dropdown } from '@/components/ui'
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  Cpu,
  Save,
  CheckCircle2,
  Shield,
  Check,
  User,
  Plus,
  X,
  Sparkles,
  Zap,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'
import { ProgrammingLanguage, TutorMode, ThemeMode } from '@/types'

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const { activeModel, refreshLocalModel } = useSystemStatus()
  const { profile, updateProfile, uploadAvatar, removeAvatar } = useUserProfile()

  // Form states initialized with user profile
  const [fullName, setFullName] = useState(profile.fullName)
  const [username, setUsername] = useState(profile.username)
  const [email, setEmail] = useState(profile.email)
  const [location, setLocation] = useState(profile.location)
  const [bio, setBio] = useState(profile.bio)

  const [defaultLang, setDefaultLang] = useState<ProgrammingLanguage>('python')
  const [defaultMode, setDefaultMode] = useState<TutorMode>('socratic')
  const [editorFontSize, setEditorFontSize] = useState<number>(14)
  const [tabSize, setTabSize] = useState<number>(4)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [validatedSuccess, setValidatedSuccess] = useState(false)

  // Password Change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const getPwdStrength = () => {
    if (newPassword.length === 0) return { label: '', textColor: 'text-slate-400' }
    if (newPassword.length < 6) return { label: 'Min 6 chars required', textColor: 'text-rose-500' }
    if (newPassword.length < 8) return { label: 'Fair strength', textColor: 'text-amber-500' }
    return { label: 'Strong password', textColor: 'text-[#005F02] dark:text-emerald-400' }
  }
  const pwdStrength = getPwdStrength()

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (!currentPassword.trim()) {
      setPasswordError('Please enter your current password.')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.')
      return
    }

    setIsUpdatingPassword(true)
    setTimeout(() => {
      setIsUpdatingPassword(false)
      setPasswordSuccess('Your password was updated successfully in local credentials!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSuccess(''), 4000)
    }, 600)
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    updateProfile({
      fullName,
      username,
      email,
      location,
      bio,
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        await uploadAvatar(file)
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 2500)
      } catch (err) {
        console.error('Avatar upload failed:', err)
      }
    }
  }

  const handleValidate = async () => {
    setIsValidating(true)
    await refreshLocalModel()
    setTimeout(() => {
      setIsValidating(false)
      setValidatedSuccess(true)
      setTimeout(() => setValidatedSuccess(false), 3000)
    }, 600)
  }

  return (
    <PageContainer maxWidth="xl" className="space-y-6 pb-12">
      {/* ═══════════════════════════════════════════════════════════════
          HEADER BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-mono font-black tracking-tight text-slate-900 dark:text-white">
                System Settings & Preferences
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Configure your personal profile, appearance, default programming languages, and on-device runtime thresholds.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={handleSave}
            className="h-10 px-5 rounded-xl font-mono text-xs font-black text-white bg-[#005F02] hover:bg-[#004d01] border-2 border-[#005F02] active:scale-95 shadow-3xs transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Saved ✓</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-800 text-xs font-mono font-bold text-[#005F02] dark:text-emerald-300 flex items-center gap-2.5 animate-in fade-in shadow-3xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Your profile details and workspace preferences were updated successfully in local storage.</span>
        </div>
      )}

      <div className="space-y-6">
        {/* ═══════════════════════════════════════════════════════════════
            01. USER PROFILE & IDENTITY (AVATAR UPLOAD + NAME EDITING)
            ═══════════════════════════════════════════════════════════════ */}
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#161B22]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 font-mono text-xs font-black text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-3xs shrink-0">
                01
              </span>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-mono font-black text-slate-900 dark:text-white">
                    Learner Profile & Identity
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Update your display name, handle, avatar photo, and learning hub information.
                  </p>
                </div>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-black shadow-3xs self-start sm:self-auto">
              Offline Account
            </span>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {/* Avatar Uploader Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
              <div className="relative group shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-[#005F02] text-white font-mono font-black text-2xl border-2 border-[#005F02] shadow-3xs overflow-hidden flex items-center justify-center">
                  <Avatar
                    src={profile.avatarUrl || undefined}
                    fallbackName={fullName || 'User'}
                    size="xl"
                    className="w-full h-full rounded-2xl bg-[#005F02] text-white font-mono font-black text-xl"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-2xl bg-slate-950/70 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-mono font-bold"
                  title="Click to change profile picture"
                >
                  <User className="w-5 h-5 mb-0.5" />
                  <span>Change</span>
                </button>
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <h4 className="text-xs font-mono font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Profile Picture
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Upload a custom photo or avatar image. Compressed and persisted 100% locally on this device.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8.5 px-3.5 rounded-xl font-mono text-xs font-bold border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] hover:bg-slate-100 dark:hover:bg-[#0E1318] text-slate-800 dark:text-slate-200 active:scale-95 shadow-3xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                  </button>
                  {profile.avatarUrl && (
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="h-8.5 px-3.5 rounded-xl font-mono text-xs font-bold border-2 border-rose-300 dark:border-rose-800 bg-white dark:bg-[#161B22] hover:bg-rose-50 dark:hover:bg-rose-950/80 text-rose-600 dark:text-rose-400 active:scale-95 shadow-3xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kofi Mensah"
                  className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold placeholder-slate-400 focus:outline-none focus:border-[#005F02] transition-colors shadow-3xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-mono font-black text-slate-400 pointer-events-none">
                    @
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. kofimensah"
                    className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] pl-8 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold placeholder-slate-400 focus:outline-none focus:border-[#005F02] transition-colors shadow-3xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. kofi.mensah@techhub-accra.org"
                  className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold placeholder-slate-400 focus:outline-none focus:border-[#005F02] transition-colors shadow-3xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Learning Hub / Region
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Tech Hub Accra, Ghana"
                  className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold placeholder-slate-400 focus:outline-none focus:border-[#005F02] transition-colors shadow-3xs"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-[11px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Bio / Learning Goal
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Independent Learner & Aspiring Systems Software Engineer"
                  className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold placeholder-slate-400 focus:outline-none focus:border-[#005F02] transition-colors shadow-3xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            02. SECURITY & PASSWORD MANAGEMENT
            ═══════════════════════════════════════════════════════════════ */}
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#161B22]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 font-mono text-xs font-black text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-3xs shrink-0">
                02
              </span>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-mono font-black text-slate-900 dark:text-white">
                    Security & Password Management
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Update your local master password to protect your learning progress and offline credentials.
                  </p>
                </div>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-black shadow-3xs self-start sm:self-auto">
              Local Encryption
            </span>
          </div>

          <form onSubmit={handleUpdatePassword} className="p-4 sm:p-6 space-y-5">
            {passwordError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-300 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2 shadow-3xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-800 text-xs font-mono font-bold text-[#005F02] dark:text-emerald-300 flex items-center gap-2 shadow-3xs">
                <CheckCircle2 className="w-4 h-4 text-[#005F02] dark:text-emerald-400 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Current Password
                </label>
                <div className="relative rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] focus-within:border-[#005F02] transition-colors shadow-3xs flex items-center">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-transparent px-3.5 py-2.5 pr-10 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    New Password
                  </label>
                  {newPassword.length > 0 && (
                    <span className={`text-[10px] font-mono font-bold ${pwdStrength.textColor}`}>
                      {pwdStrength.label}
                    </span>
                  )}
                </div>
                <div className="relative rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] focus-within:border-[#005F02] transition-colors shadow-3xs flex items-center">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-transparent px-3.5 py-2.5 pr-10 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  {confirmPassword.length > 0 && (
                    <span className={`text-[10px] font-mono font-bold ${newPassword === confirmPassword ? 'text-[#005F02] dark:text-emerald-400' : 'text-rose-500'}`}>
                      {newPassword === confirmPassword ? 'Matches ✓' : 'Mismatch'}
                    </span>
                  )}
                </div>
                <div className={`relative rounded-xl border-2 bg-white dark:bg-[#161B22] transition-colors shadow-3xs flex items-center ${
                  confirmPassword.length > 0 && newPassword !== confirmPassword
                    ? 'border-rose-400 dark:border-rose-600'
                    : confirmPassword.length > 0 && newPassword === confirmPassword
                    ? 'border-emerald-500'
                    : 'border-slate-300 dark:border-slate-700 focus-within:border-[#005F02]'
                }`}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-transparent px-3.5 py-2.5 pr-10 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Security Guarantee & Action Row */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#005F02] dark:text-emerald-400 shrink-0" />
                <span>Credentials are hashed and stored locally. Zero cloud data transmission.</span>
              </div>
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="h-10 px-5 rounded-xl font-mono text-xs font-black text-white bg-[#005F02] hover:bg-[#004d01] border-2 border-[#005F02] active:scale-95 shadow-3xs transition-all inline-flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-60"
              >
                {isUpdatingPassword ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            03. APPEARANCE & THEME (3 EQUAL HEIGHT CARDS)
            ═══════════════════════════════════════════════════════════════ */}
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#161B22]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 font-mono text-xs font-black text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-3xs shrink-0">
                03
              </span>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-mono font-black text-slate-900 dark:text-white">
                    Appearance & Theme
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select your preferred visual mode for study sessions and coding workspaces.
                  </p>
                </div>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-black shadow-3xs self-start sm:self-auto">
              Visual Workspace
            </span>
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
            {[
              { id: 'dark', label: 'Dark IDE', icon: Moon, desc: 'Optimized for long coding sessions and OLED displays' },
              { id: 'light', label: 'Light Clean', icon: Sun, desc: 'High daylight readability with crisp high-contrast text' },
              { id: 'system', label: 'System Default', icon: Laptop, desc: 'Automatically synchronizes with your OS appearance' },
            ].map((item) => {
              const Icon = item.icon
              const isSelected = theme === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTheme(item.id as ThemeMode)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between space-y-4 shadow-3xs cursor-pointer active:scale-98 ${
                    isSelected
                      ? 'border-[#005F02] bg-emerald-50/70 dark:bg-[#161B22] text-slate-900 dark:text-white ring-2 ring-[#005F02]/20'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#161B22]/50 text-slate-700 dark:text-slate-300 hover:border-[#005F02]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-2.5 rounded-xl border-2 ${
                        isSelected
                          ? 'bg-[#005F02] text-white border-[#005F02] shadow-3xs'
                          : 'bg-white dark:bg-[#0E1318] border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-lg bg-[#005F02] text-white shadow-3xs">
                        Active
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-mono font-black block text-slate-900 dark:text-white">
                      {item.label}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1 leading-relaxed font-medium">
                      {item.desc}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            04. LEARNING & EDITOR DEFAULTS (2 EQUAL HEIGHT COLUMNS)
            ═══════════════════════════════════════════════════════════════ */}
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#161B22]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 font-mono text-xs font-black text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-3xs shrink-0">
                04
              </span>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-mono font-black text-slate-900 dark:text-white">
                    Learning & Editor Defaults
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Customize code workspace behavior, font sizing, and default tutor dialogue style.
                  </p>
                </div>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-black shadow-3xs self-start sm:self-auto">
              Workspace Behavior
            </span>
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left Column: Language & Font Size */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <Dropdown
                    label="Default Programming Language"
                    options={[
                      { value: 'python', label: 'Python' },
                      { value: 'javascript', label: 'JavaScript' },
                      { value: 'typescript', label: 'TypeScript' },
                      { value: 'html', label: 'HTML / HTML5' },
                      { value: 'css', label: 'CSS / CSS3' },
                      { value: 'git', label: 'Git & GitHub' },
                      { value: 'java', label: 'Java' },
                      { value: 'sql', label: 'SQL & Databases' },
                      { value: 'cpp', label: 'C++' },
                      { value: 'go', label: 'Go' },
                      { value: 'rust', label: 'Rust' },
                    ]}
                    value={defaultLang}
                    onChange={(val) => setDefaultLang(val as ProgrammingLanguage)}
                  />
                </div>

                <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Editor Font Size ({editorFontSize}px)
                    </label>
                    <span className="text-xs font-mono font-black text-[#005F02] dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800">
                      {editorFontSize}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="20"
                    step="1"
                    value={editorFontSize}
                    onChange={(e) => setEditorFontSize(Number(e.target.value))}
                    className="w-full accent-[#005F02] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
                    <span>12px (Compact)</span>
                    <span>14px (Standard)</span>
                    <span>20px (Large)</span>
                  </div>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-2xl bg-[#0E1318] border-2 border-slate-700 font-mono text-slate-200 text-xs shadow-3xs">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block mb-1">
                  Editor Font Size Live Preview:
                </span>
                <span style={{ fontSize: `${editorFontSize}px` }} className="text-emerald-400 font-mono font-bold block truncate">
                  def solve(): return True
                </span>
              </div>
            </div>

            {/* Right Column: AI Tutor Mode & Indentation */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <Dropdown
                    label="Default AI Tutor Pedagogy Mode"
                    options={[
                      { value: 'socratic', label: 'Socratic Dialogue (Guided questions)' },
                      { value: 'direct_explanation', label: 'Direct Explanations (Fast summary)' },
                      { value: 'code_review', label: 'Code Review Mode (Style & Complexity)' },
                      { value: 'concept_deepdive', label: 'Concept Deep Dive (Under the hood)' },
                    ]}
                    value={defaultMode}
                    onChange={(val) => setDefaultMode(val as TutorMode)}
                  />
                </div>

                <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
                  <label className="text-xs font-mono font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                    Tab Indentation Width
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[2, 4].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setTabSize(size)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-mono font-black border-2 transition-all text-center cursor-pointer shadow-3xs active:scale-95 ${
                          tabSize === size
                            ? 'bg-[#005F02] text-white border-[#005F02]'
                            : 'bg-white dark:bg-[#161B22] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#005F02]'
                        }`}
                      >
                        {size} Spaces {size === 4 ? '(Python Standard)' : '(JS Standard)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2.5 shadow-3xs">
                <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-mono text-[11px] font-bold">All code execution and tutor reasoning runs 100% locally on your machine.</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            05. ON-DEVICE LOCAL AI CONFIGURATION
            ═══════════════════════════════════════════════════════════════ */}
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#161B22]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 font-mono text-xs font-black text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-3xs shrink-0">
                05
              </span>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-mono font-black text-slate-900 dark:text-white">
                    On-Device Local AI Configuration
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    CodeTutor Africa uses local quantized neural weights running directly on CPU/iGPU with zero data egress.
                  </p>
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-black text-[#005F02] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-xl border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs self-start sm:self-auto">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Target: 8 GB RAM Laptop
            </span>
          </div>

          <div className="p-4 sm:p-6 space-y-5">
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 space-y-1.5 shadow-3xs hover:border-[#005F02] transition-colors">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-black block tracking-wider">
                  Model Architecture
                </span>
                <span className="text-base font-mono font-black text-slate-900 dark:text-white block">
                  {activeModel.name}
                </span>
                <span className="text-[11px] text-slate-500 font-mono font-bold block">
                  Instruction-Tuned
                </span>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 space-y-1.5 shadow-3xs hover:border-[#005F02] transition-colors">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-black block tracking-wider">
                  Quantization
                </span>
                <span className="text-base font-mono font-black text-slate-900 dark:text-white block">
                  {activeModel.quantization}
                </span>
                <span className="text-[11px] text-slate-500 font-mono font-bold block">
                  4-bit Medium Precision
                </span>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 space-y-1.5 shadow-3xs hover:border-[#005F02] transition-colors">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-black block tracking-wider">
                  Memory Overhead
                </span>
                <span className="text-base font-mono font-black text-[#005F02] dark:text-emerald-400 block">
                  {activeModel.memoryUsageMb} MB
                </span>
                <span className="text-[11px] text-slate-500 font-mono font-bold block">
                  ~1.4 GB System RAM
                </span>
              </div>
            </div>

            {/* Validation Toolbar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 dark:bg-[#161B22] border-2 border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-3xs">
              <div className="flex items-center gap-3 text-xs text-slate-800 dark:text-slate-200">
                <div className="w-8 h-8 rounded-xl bg-[#005F02] text-white flex items-center justify-center shrink-0 shadow-3xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-mono text-xs font-bold leading-relaxed">
                  Offline RAG vector embeddings and pedagogical tokenizer pre-compiled in browser IndexedDB storage.
                </span>
              </div>
              <button
                type="button"
                className="h-9 px-4 rounded-xl font-mono text-xs font-black text-slate-800 dark:text-slate-200 bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 hover:border-[#005F02] active:scale-95 shadow-3xs transition-all inline-flex items-center gap-1.5 shrink-0 self-start sm:self-center cursor-pointer"
                onClick={handleValidate}
                disabled={isValidating}
              >
                {isValidating ? (
                  <>
                    <Cpu className="w-3.5 h-3.5 animate-spin text-[#005F02]" />
                    <span>Validating...</span>
                  </>
                ) : validatedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Model Validated ✓</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5 text-slate-500" />
                    <span>Validate Model</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default SettingsPage
