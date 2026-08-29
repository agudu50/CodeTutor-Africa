import React, { useState, useMemo } from 'react'
import {
  AdminUserRecord,
  AuditLogEntry,
  UserStatsSummary,
  AuditLogCategory,
  AuditLogStatus,
} from '@/types/admin-analytics'
import { adminAnalyticsService } from '@/services/admin/admin-analytics.service'
import { WEST_AFRICAN_COUNTRIES } from '@/features/leaderboard/data/mockLeaderboardData'
import { Card, CardHeader, CardContent, Button } from '@/components/ui'
import {
  Users,
  User,
  AlertCircle,
  Search,
  Flame,
  Globe,
  Zap,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Laptop,
  Cpu,
  HardDrive,
  Database,
  Code2,
  UserCheck,
} from 'lucide-react'

interface UserAnalyticsDeskViewProps {
  users: AdminUserRecord[]
  auditLogs: AuditLogEntry[]
  onDataChanged: () => void
}

export const UserAnalyticsDeskView: React.FC<UserAnalyticsDeskViewProps> = ({
  users,
  auditLogs,
  onDataChanged,
}) => {
  const [subView, setSubView] = useState<'users' | 'audit' | 'regional'>('users')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [selectedLogStatus, setSelectedLogStatus] = useState<string>('ALL')
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null)

  const stats: UserStatsSummary = useMemo(() => {
    return adminAnalyticsService.getUserStats()
  }, [users])

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCountry = selectedCountry === 'ALL' || u.countryCode === selectedCountry

      const matchesStatus =
        selectedStatus === 'ALL' ||
        (selectedStatus === 'active' &&
          (u.status === 'active_now' || u.status === 'active_today' || u.status === 'active_this_week')) ||
        (selectedStatus === 'inactive' && (u.status === 'idle' || u.status === 'inactive')) ||
        u.status === selectedStatus

      return matchesSearch && matchesCountry && matchesStatus
    })
  }, [users, searchQuery, selectedCountry, selectedStatus])

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === 'ALL' || log.category === selectedCategory
      const matchesStatus = selectedLogStatus === 'ALL' || log.status === selectedLogStatus

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [auditLogs, searchQuery, selectedCategory, selectedLogStatus])

  const handleToggleStatus = (userId: string, userName: string) => {
    const updated = adminAnalyticsService.toggleUserStatus(userId)
    if (updated) {
      onDataChanged()
      setActionSuccessMsg(`Status updated for ${userName}. Audit trail recorded.`)
      setTimeout(() => setActionSuccessMsg(null), 3000)
    }
  }

  const handleExportCsv = () => {
    const csv = adminAnalyticsService.exportAuditLogsAsCsv()
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `codetutor_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportJson = () => {
    const json = adminAnalyticsService.exportAuditLogsAsJson()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `codetutor_audit_logs_${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active_now':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            Active Now
          </span>
        )
      case 'active_today':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/50 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            Active Today
          </span>
        )
      case 'active_this_week':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
            Active this Week
          </span>
        )
      case 'idle':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            Idle (&gt;7d)
          </span>
        )
      case 'inactive':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            Inactive (&gt;30d)
          </span>
        )
    }
  }

  const getLogStatusIcon = (status: AuditLogStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
      case 'info':
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-sky-500 shrink-0" />
    }
  }

  const getCategoryBadge = (category: AuditLogCategory) => {
    const map: Record<AuditLogCategory, { label: string; cls: string }> = {
      curriculum: { label: 'Curriculum', cls: 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border-brand-200' },
      learning: { label: 'Lesson', cls: 'bg-emerald-50 dark:bg-emerald-950/60 text-[#005F02] dark:text-emerald-300 border-emerald-200' },
      practice: { label: 'Practice', cls: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200' },
      arcade: { label: 'Arcade', cls: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200' },
      tutor: { label: 'AI Tutor', cls: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200' },
      system: { label: 'System Sync', cls: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200' },
      security: { label: 'Security', cls: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200' },
    }
    const item = map[category] || map.system
    return (
      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${item.cls}`}>
        {item.label}
      </span>
    )
  }

  const getDeviceIcon = (mode: string) => {
    switch (mode) {
      case 'offline_pwa':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
            <Cpu className="w-3 h-3 text-emerald-600" />
            <span>Offline PWA</span>
          </span>
        )
      case 'desktop_app':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-brand-700 dark:text-brand-400">
            <Laptop className="w-3 h-3 text-brand-600" />
            <span>Desktop App</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-600 dark:text-slate-400">
            <Globe className="w-3 h-3 text-slate-400" />
            <span>Web Browser</span>
          </span>
        )
    }
  }

  return (
    <div className="space-y-4">
      {/* Action Toast Feedback */}
      {actionSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          ANALYTICS KPI HIGHLIGHT ROW
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Users */}
        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-wider">
            Total Learners
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {stats.totalUsers}
            </span>
            <Users className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
            {stats.offlinePwaUsersPercent}% Offline Engine ready
          </span>
        </div>

        {/* Active Now & Today */}
        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-wider">
            Active Now / Today
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#005F02] dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              {stats.activeNow}
              <span className="text-xs font-normal text-slate-400 dark:text-slate-500">/ {stats.activeToday}</span>
            </span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
            {stats.activeThisWeek} active this week
          </span>
        </div>

        {/* Inactive / At Risk Users */}
        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-wider">
            Idle / Inactive Learners
          </span>
          <div className="flex items-baseline justify-between">
            <span className={`text-xl sm:text-2xl font-bold font-mono ${stats.inactiveUsers > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
              {stats.inactiveUsers}
            </span>
            <User className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
            Requires study catch-up
          </span>
        </div>

        {/* Audit Trails Count */}
        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-wider">
            Audit Trails Logged
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold font-mono text-brand-600 dark:text-brand-400">
              {auditLogs.length}
            </span>
            <HardDrive className="w-4 h-4 text-brand-500" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
            100% Immutable logs
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SUB-VIEW CONTROLS & ACTIONS
          ═══════════════════════════════════════════════════════════════ */}
      <Card className="border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-xs rounded-2xl sm:rounded-3xl overflow-hidden">
        <CardHeader className="p-3.5 sm:p-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Sub-tabs pills */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-fit">
              <button
                type="button"
                onClick={() => setSubView('users')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subView === 'users'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>Learner Management</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {users.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSubView('audit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subView === 'audit'
                    ? 'bg-white dark:bg-slate-900 text-[#005F02] dark:text-emerald-400 shadow-2xs font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
                <span>Audit Logs & Security</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                  {auditLogs.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSubView('regional')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subView === 'regional'
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-2xs font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-cyan-500" />
                <span>West Africa Regions</span>
              </button>
            </div>

            {/* Actions for current view */}
            {subView === 'audit' && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCsv}
                  className="h-8 text-xs font-bold border-slate-200 dark:border-slate-700 justify-center"
                  leftIcon={<Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                >
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportJson}
                  className="h-8 text-xs font-bold border-slate-200 dark:border-slate-700 justify-center"
                  leftIcon={<Code2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
                >
                  Export JSON
                </Button>
              </div>
            )}
          </div>

          {/* Search and Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  subView === 'users'
                    ? 'Search learners by name, email, username...'
                    : 'Search audit logs by actor, action, target, details...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {subView === 'users' && (
              <>
                <div className="sm:col-span-3">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    {WEST_AFRICAN_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="ALL">All Activity Statuses</option>
                    <option value="active">All Active Learners</option>
                    <option value="active_now">Active Now</option>
                    <option value="active_today">Active Today</option>
                    <option value="active_this_week">Active This Week</option>
                    <option value="inactive">Idle & Inactive Only</option>
                  </select>
                </div>
              </>
            )}

            {subView === 'audit' && (
              <>
                <div className="sm:col-span-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="curriculum">Curriculum Changes</option>
                    <option value="practice">Practice Submissions</option>
                    <option value="learning">Lesson Activity</option>
                    <option value="tutor">AI Tutor Dialogues</option>
                    <option value="arcade">Arcade Games</option>
                    <option value="security">Security & Auth</option>
                    <option value="system">System Sync</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={selectedLogStatus}
                    onChange={(e) => setSelectedLogStatus(e.target.value)}
                    className="w-full py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="ALL">All Event Outcomes</option>
                    <option value="success">Success Only</option>
                    <option value="info">Info / Normal</option>
                    <option value="warning">Warnings</option>
                    <option value="error">Errors</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* ═══════════════════════════════════════════════════════════════
              SUBVIEW 1: USERS & LEARNER MANAGEMENT TABLE
              ═══════════════════════════════════════════════════════════════ */}
          {subView === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-4 font-semibold">Learner Profile</th>
                    <th className="py-3 px-4 font-semibold">Nation / Region</th>
                    <th className="py-3 px-4 font-semibold">Activity Status</th>
                    <th className="py-3 px-4 font-semibold">XP & Streak</th>
                    <th className="py-3 px-4 font-semibold">Progress Metrics</th>
                    <th className="py-3 px-4 font-semibold">Client Engine</th>
                    <th className="py-3 px-4 font-semibold text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-sans">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                        No learners matched your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-950/40 transition-colors"
                      >
                        {/* Learner Name & Role */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-3xs">
                              {user.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 dark:text-white truncate">
                                  {user.name}
                                </span>
                                {user.role === 'admin' && (
                                  <span className="px-1.5 py-0.2 rounded bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 font-mono text-[9px] font-bold">
                                    ADMIN
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate font-mono">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Country */}
                        <td className="py-3 px-4 font-mono">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[10px]">
                            <Globe className="w-2.5 h-2.5 text-brand-500" />
                            {user.countryName} ({user.countryCode})
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">{getStatusBadge(user.status)}</td>

                        {/* XP & Streak */}
                        <td className="py-3 px-4 font-mono">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {user.totalXp.toLocaleString()} XP
                            </span>
                            <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 text-[11px] font-bold">
                              <Flame className="w-3 h-3 fill-current" />
                              {user.streakDays}d
                            </span>
                          </div>
                        </td>

                        {/* Progress Metrics */}
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {user.problemsSolved}
                            </span>{' '}
                            drills •{' '}
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {user.lessonsCompleted}
                            </span>{' '}
                            lessons
                          </div>
                        </td>

                        {/* Engine Mode */}
                        <td className="py-3 px-4">{getDeviceIcon(user.deviceMode)}</td>

                        {/* Action */}
                        <td className="py-3 px-4 text-right">
                          {user.role !== 'admin' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(user.id, user.name)}
                              className={`h-7 px-2.5 text-[11px] font-bold ${
                                user.status === 'inactive' || user.status === 'idle'
                                  ? 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60'
                                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60'
                              }`}
                            >
                              {user.status === 'inactive' || user.status === 'idle' ? (
                                <>
                                  <UserCheck className="w-3 h-3 mr-1" />
                                  Reactivate
                                </>
                              ) : (
                                <>
                                  <User className="w-3 h-3 mr-1" />
                                  Mark Idle
                                </>
                              )}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              SUBVIEW 2: AUDIT LOGS & SECURITY TRAILS
              ═══════════════════════════════════════════════════════════════ */}
          {subView === 'audit' && (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                  No audit logs matched your query.
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 sm:p-4 hover:bg-slate-50/70 dark:hover:bg-slate-950/50 transition-colors space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getLogStatusIcon(log.status)}
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {log.action}
                        </span>
                        {getCategoryBadge(log.category)}
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                        <span>{log.ipAddress}</span>
                        <span>•</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()} ({new Date(log.timestamp).toLocaleDateString()})</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs">
                      <div>
                        <span className="font-semibold text-brand-700 dark:text-brand-300">
                          {log.actorName}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 ml-1.5">
                          on <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{log.target}</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800/60 font-mono">
                      {log.details}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              SUBVIEW 3: WEST AFRICAN REGIONAL DISTRIBUTION
              ═══════════════════════════════════════════════════════════════ */}
          {subView === 'regional' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {WEST_AFRICAN_COUNTRIES.filter((c) => c.code !== 'ALL').map((c) => {
                  const count = users.filter((u) => u.countryCode === c.code).length
                  const activeCount = users.filter(
                    (u) =>
                      u.countryCode === c.code &&
                      (u.status === 'active_now' || u.status === 'active_today' || u.status === 'active_this_week')
                  ).length

                  return (
                    <div
                      key={c.code}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-brand-600" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {c.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {c.code}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between font-mono text-xs">
                        <span className="text-slate-500">Learners:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{count} registered</span>
                      </div>

                      <div className="flex items-baseline justify-between font-mono text-xs">
                        <span className="text-slate-500">Active Status:</span>
                        <span className="font-bold text-[#005F02] dark:text-emerald-400">
                          {activeCount} active
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
