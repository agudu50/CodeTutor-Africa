import React from 'react'
import { GAME_LANGUAGES } from '../data/gameData'
import { GameLanguage } from '../types/games.types'
import { Code2 } from 'lucide-react'

interface GameLanguageSelectorProps {
  selectedLanguage: GameLanguage
  onSelectLanguage: (lang: GameLanguage) => void
  className?: string
  availableLanguages?: GameLanguage[]
}

export const GameLanguageSelector: React.FC<GameLanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage,
  className = '',
  availableLanguages,
}) => {
  const options = availableLanguages
    ? GAME_LANGUAGES.filter((l) => l.id === 'all' || availableLanguages.includes(l.id))
    : GAME_LANGUAGES

  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full ${className}`}>
      <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold shrink-0 mr-1 hidden sm:flex">
        <Code2 className="w-3.5 h-3.5" />
        <span>Language:</span>
      </div>

      {options.map((lang) => {
        const isSelected = selectedLanguage === lang.id

        return (
          <button
            key={lang.id}
            type="button"
            onClick={() => onSelectLanguage(lang.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs ${
              isSelected
                ? 'bg-[#005F02] text-white shadow-xs ring-2 ring-emerald-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span
              className={`text-[9px] font-mono font-extrabold px-1 py-0.5 rounded ${
                isSelected
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {lang.iconBadge}
            </span>
            <span>{lang.label}</span>
          </button>
        )
      })}
    </div>
  )
}
