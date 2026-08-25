import React, { useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNavigation } from './MobileNavigation'
import { ConnectivityBanner } from './ConnectivityBanner'

export const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  const handleOpenMobileNav = useCallback(() => {
    setMobileNavOpen(true)
  }, [])

  const handleCloseMobileNav = useCallback(() => {
    setMobileNavOpen(false)
  }, [])

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sidebar for Desktop / Tablet */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* Mobile Drawer */}
      <MobileNavigation
        isOpen={mobileNavOpen}
        onClose={handleCloseMobileNav}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Topbar onOpenMobileNav={handleOpenMobileNav} />
        <ConnectivityBanner />
        <main className="flex-1 flex flex-col overflow-y-auto min-w-0 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
