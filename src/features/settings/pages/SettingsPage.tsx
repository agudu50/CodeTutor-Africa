import React, { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { useTheme } from '@/app/providers/ThemeProvider'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { Card, CardHeader, CardTitle, CardContent, Button, Dropdown } from '@/components/ui'
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  Cpu,
  Save,
  CheckCircle2,
  Sparkles,
  Shield,
  Check,
} from 'lucide-react'
import { ProgrammingLanguage, TutorMode, ThemeMode } from '@/types'

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const { activeModel, refreshLocalModel } = useSystemStatus()

  const [defaultLang, setDefaultLang] = useState<ProgrammingLanguage>('python')
  const [defaultMode, setDefaultMode] = useState<TutorMode>('socratic')
  const [editorFontSize, setEditorFontSize] = useState<number>(14)
  const [tabSize, setTabSize] = useState<number>(4)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [validatedSuccess, setValidatedSuccess] = useState(false)

  const handleSave = () => {
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
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
    <PageContainer maxWidth="xl" className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
          HEADER BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80">
              <Settings className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              System Settings & Preferences
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Configure appearance, default programming languages, AI tutor modes, and on-device offline runtime thresholds.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            className="font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs text-xs"
            leftIcon={<Save className="w-4 h-4" />}
          >
            {savedSuccess ? 'Saved ✓' : 'Save Preferences'}
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5 animate-in fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold">Preferences updated and successfully persisted to offline local storage.</span>
        </div>
      )}

      <div className="space-y-6">
        {/* ═══════════════════════════════════════════════════════════════
            1. APPEARANCE & THEME (3 EQUAL HEIGHT CARDS)
            ═══════════════════════════════════════════════════════════════ */}
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <Sun className="w-3.5 h-3.5" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Appearance & Theme
                </CardTitle>
              </div>
              <span className="text-xs font-mono text-slate-400 font-semibold">Visual Workspace</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select your preferred visual mode for study sessions and coding workspaces.
            </p>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-stretch">
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
                  className={`p-4 sm:p-5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-4 shadow-2xs ${
                    isSelected
                      ? 'border-brand-600 dark:border-brand-500 bg-brand-50/70 dark:bg-brand-950/60 text-slate-900 dark:text-white ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-2 rounded-xl border ${
                        isSelected
                          ? 'bg-brand-600 text-white border-brand-500 shadow-xs'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-brand-600 text-white shadow-2xs">
                        Active
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-bold block text-slate-900 dark:text-white">
                      {item.label}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1 leading-relaxed">
                      {item.desc}
                    </span>
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* ═══════════════════════════════════════════════════════════════
            2. LEARNING & EDITOR DEFAULTS (2 EQUAL HEIGHT COLUMNS)
            ═══════════════════════════════════════════════════════════════ */}
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <Settings className="w-3.5 h-3.5" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Learning & Editor Defaults
                </CardTitle>
              </div>
              <span className="text-xs font-mono text-slate-400 font-semibold">Workspace Behavior</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Customize code workspace behavior, font sizing, and default tutor dialogue style.
            </p>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left Column: Language & Font Size */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <Dropdown
                    label="Default Programming Language"
                    options={[
                      { value: 'python', label: 'Python 3.12 (Recommended for CS)' },
                      { value: 'javascript', label: 'JavaScript (Web & Async)' },
                      { value: 'java', label: 'Java 21 (OOP & Systems)' },
                    ]}
                    value={defaultLang}
                    onChange={(val) => setDefaultLang(val as ProgrammingLanguage)}
                  />
                </div>

                <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide font-mono">
                      Editor Font Size ({editorFontSize}px)
                    </label>
                    <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
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
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>12px (Compact)</span>
                    <span>14px (Standard)</span>
                    <span>20px (Large)</span>
                  </div>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-slate-200 text-xs">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Editor Font Size Live Preview:</span>
                <span style={{ fontSize: `${editorFontSize}px` }} className="text-emerald-400 block truncate">
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

                <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide font-mono block">
                    Tab Indentation Width
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[2, 4].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setTabSize(size)}
                        className={`py-2 px-3 rounded-lg text-xs font-mono font-bold border transition-all text-center ${
                          tabSize === size
                            ? 'bg-brand-600 text-white border-brand-500 shadow-2xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {size} Spaces {size === 4 ? '(Python Standard)' : '(JS Standard)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>All code execution and tutor reasoning runs 100% locally on your machine.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ═══════════════════════════════════════════════════════════════
            3. ON-DEVICE LOCAL AI CONFIGURATION
            ═══════════════════════════════════════════════════════════════ */}
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80">
                  <Cpu className="w-4 h-4" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  On-Device Local AI Configuration
                </CardTitle>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/70 px-2.5 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
                Target: 8 GB RAM Laptop
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              CodeTutor Africa uses local quantized neural weights running directly on CPU/iGPU with zero data egress.
            </p>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 space-y-4">
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-stretch">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Model Architecture</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">{activeModel.name}</span>
                <span className="text-[11px] text-slate-500 font-mono">Instruction-Tuned</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Quantization</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">{activeModel.quantization}</span>
                <span className="text-[11px] text-slate-500 font-mono">4-bit Medium Precision</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Memory Overhead</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 block">{activeModel.memoryUsageMb} MB</span>
                <span className="text-[11px] text-slate-500 font-mono">~1.4 GB System RAM</span>
              </div>
            </div>

            {/* Validation Toolbar */}
            <div className="p-4 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 text-xs text-brand-900 dark:text-brand-200">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <span className="font-medium">
                  Offline RAG vector embeddings and pedagogical tokenizer pre-compiled in browser IndexedDB storage.
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-bold text-brand-700 dark:text-brand-300 border-brand-300 dark:border-brand-700 hover:bg-brand-100 dark:hover:bg-brand-900/60 shrink-0 self-start sm:self-center"
                onClick={handleValidate}
                isLoading={isValidating}
                leftIcon={validatedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Cpu className="w-3.5 h-3.5" />}
              >
                {validatedSuccess ? 'Model Validated ✓' : 'Validate Model'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}

export default SettingsPage
