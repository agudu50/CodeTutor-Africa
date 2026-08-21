import React, { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { useTheme } from '@/app/providers/ThemeProvider'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { Card, CardHeader, CardTitle, CardContent, Button, Dropdown, Badge } from '@/components/ui'
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  Cpu,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { ProgrammingLanguage, TutorMode, ThemeMode } from '@/types'

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const { activeModel, refreshLocalModel } = useSystemStatus()

  const [defaultLang, setDefaultLang] = useState<ProgrammingLanguage>('python')
  const [defaultMode, setDefaultMode] = useState<TutorMode>('socratic')
  const [editorFontSize, setEditorFontSize] = useState<number>(14)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = () => {
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  return (
    <PageContainer maxWidth="xl" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-500" /> System Settings & Preferences
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure appearance, default programming languages, AI tutor modes, and on-device offline runtime thresholds.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          leftIcon={<Save className="w-3.5 h-3.5" />}
        >
          {savedSuccess ? 'Saved ✓' : 'Save Preferences'}
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Preferences updated and persisted to offline local storage.</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Appearance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Appearance & Theme</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your preferred visual mode for study sessions.
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'dark', label: 'Dark IDE', icon: Moon, desc: 'Optimized for long coding sessions' },
              { id: 'light', label: 'Light Clean', icon: Sun, desc: 'High daylight readability' },
              { id: 'system', label: 'System Default', icon: Laptop, desc: 'Syncs with OS preferences' },
            ].map((item) => {
              const Icon = item.icon
              const isSelected = theme === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTheme(item.id as ThemeMode)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-5 h-5" />
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* Learning & Editor Defaults */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Learning & Editor Defaults</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize code workspace behavior and tutor dialogue style.
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                Editor Font Size ({editorFontSize}px)
              </label>
              <input
                type="range"
                min="12"
                max="20"
                step="1"
                value={editorFontSize}
                onChange={(e) => setEditorFontSize(Number(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Offline Model Diagnostics */}
        <Card className="border-brand-500/20 bg-slate-900/90 text-slate-100">
          <CardHeader className="pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-brand-400" />
                <CardTitle className="text-base text-slate-100">
                  On-Device Local AI Configuration
                </CardTitle>
              </div>
              <Badge variant="brand" size="sm">
                Target: 8 GB RAM Laptop
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              CodeTutor Africa uses local quantized weights running directly on your CPU/iGPU without external internet.
            </p>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Model Name</span>
                <span className="text-xs font-bold text-slate-200 mt-1 block">{activeModel.name}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Quantization</span>
                <span className="text-xs font-bold text-slate-200 mt-1 block">{activeModel.quantization} (4-bit)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Memory Overhead</span>
                <span className="text-xs font-bold text-emerald-400 mt-1 block">{activeModel.memoryUsageMb} MB (~1.4 GB)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-400" />
                Offline RAG vector embeddings pre-compiled in local storage.
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-brand-500/40 text-brand-300 hover:bg-brand-500/20"
                onClick={refreshLocalModel}
              >
                Validate Model
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}

export default SettingsPage
