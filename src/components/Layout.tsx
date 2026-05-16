import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#0A0B0E]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
