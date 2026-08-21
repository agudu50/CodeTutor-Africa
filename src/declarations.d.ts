declare module 'lucide-react' {
  import React from 'react'

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number
    color?: string
    strokeWidth?: string | number
    absoluteStrokeWidth?: boolean
    className?: string
  }

  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >

  export const AlertCircle: LucideIcon
  export const AlertTriangle: LucideIcon
  export const ArrowRight: LucideIcon
  export const BarChart3: LucideIcon
  export const BatteryCharging: LucideIcon
  export const BookOpen: LucideIcon
  export const BookOpenCheck: LucideIcon
  export const Bot: LucideIcon
  export const Bug: LucideIcon
  export const Check: LucideIcon
  export const CheckCircle: LucideIcon
  export const CheckCircle2: LucideIcon
  export const ChevronDown: LucideIcon
  export const ChevronLeft: LucideIcon
  export const ChevronRight: LucideIcon
  export const Circle: LucideIcon
  export const Clock: LucideIcon
  export const Code2: LucideIcon
  export const Copy: LucideIcon
  export const CornerDownLeft: LucideIcon
  export const Cpu: LucideIcon
  export const DollarSign: LucideIcon
  export const Eye: LucideIcon
  export const EyeOff: LucideIcon
  export const Flame: LucideIcon
  export const GraduationCap: LucideIcon
  export const HardDrive: LucideIcon
  export const HelpCircle: LucideIcon
  export const Laptop: LucideIcon
  export const LayoutDashboard: LucideIcon
  export const Lightbulb: LucideIcon
  export const Loader2: LucideIcon
  export const Lock: LucideIcon
  export const Mail: LucideIcon
  export const Menu: LucideIcon
  export const MessageSquare: LucideIcon
  export const Moon: LucideIcon
  export const Play: LucideIcon
  export const Plus: LucideIcon
  export const Quote: LucideIcon
  export const RefreshCw: LucideIcon
  export const RotateCcw: LucideIcon
  export const Save: LucideIcon
  export const School: LucideIcon
  export const Search: LucideIcon
  export const Settings: LucideIcon
  export const ShieldCheck: LucideIcon
  export const Sparkles: LucideIcon
  export const Sun: LucideIcon
  export const Target: LucideIcon
  export const Terminal: LucideIcon
  export const Trophy: LucideIcon
  export const User: LucideIcon
  export const UserCheck: LucideIcon
  export const Users: LucideIcon
  export const Wifi: LucideIcon
  export const WifiOff: LucideIcon
  export const X: LucideIcon
  export const XCircle: LucideIcon
  export const Zap: LucideIcon

  export const icons: Record<string, LucideIcon>
  const LucideReact: Record<string, LucideIcon>
  export default LucideReact
}
