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
    <div className={`flex items-center gap-2 overflow-x-auto pb-1 max-w-full ${className}`}>
      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-xs font-mono font-black shrink-0 mr-1 hidden sm:flex">
        <Code2 className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
        <span>Language:</span>
      </div>

      {options.map((lang) => {
        const isSelected = selectedLanguage === lang.id

        return (
          <button
            key={lang.id}
            type="button"
            onClick={() => onSelectLanguage(lang.id)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 border-2 active:scale-95 ${
              isSelected
                ? 'bg-[#005F02] text-white border-[#005F02] shadow-xs'
                : 'bg-white dark:bg-[#161B22] border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-[#005F02] dark:hover:border-emerald-500 shadow-3xs'
            }`}
          >
            <span
              className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded-lg border-2 ${
                isSelected
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-slate-100 dark:bg-[#0E1318] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
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
