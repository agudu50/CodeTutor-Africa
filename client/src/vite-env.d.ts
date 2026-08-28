/// <reference types="vite/client" />

declare module 'lucide-react' {
  import React from 'react'

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number
    color?: string
    strokeWidth?: string | number
    className?: string
  }

  export type LucideIcon = React.FC<LucideProps>

  export const Zap: LucideIcon
  export const Bug: LucideIcon
  export const HelpCircle: LucideIcon
  export const Shuffle: LucideIcon
  export const Plus: LucideIcon
  export const RotateCcw: LucideIcon
  export const Search: LucideIcon
  export const CheckCircle2: LucideIcon
  export const Gamepad2: LucideIcon
  export const Clock: LucideIcon
  export const Settings: LucideIcon
  export const Layers: LucideIcon
  export const ListFilter: LucideIcon
  export const ChevronDown: LucideIcon
  export const ChevronRight: LucideIcon
  export const ChevronLeft: LucideIcon
  export const ChevronUp: LucideIcon
  export const Trash2: LucideIcon
  export const Trash: LucideIcon
  export const Edit: LucideIcon
  export const Edit2: LucideIcon
  export const Edit3: LucideIcon
  export const Pencil: LucideIcon
  export const X: LucideIcon
  export const Trophy: LucideIcon
  export const Flame: LucideIcon
  export const Volume2: LucideIcon
  export const VolumeX: LucideIcon
  export const Wifi: LucideIcon
  export const WifiOff: LucideIcon
  export const Code2: LucideIcon
  export const Sparkles: LucideIcon
  export const ArrowRight: LucideIcon
  export const ArrowLeft: LucideIcon
  export const BookOpen: LucideIcon
  export const ShieldCheck: LucideIcon
  export const AlertTriangle: LucideIcon
  export const AlertCircle: LucideIcon
  export const Check: LucideIcon
  export const Copy: LucideIcon
  export const Bot: LucideIcon
  export const Cpu: LucideIcon
  export const Target: LucideIcon
  export const Shield: LucideIcon
  export const BarChart3: LucideIcon
  export const MessageSquare: LucideIcon
  export const GraduationCap: LucideIcon
  export const Database: LucideIcon

  const anyIcon: LucideIcon
  export default anyIcon
}
