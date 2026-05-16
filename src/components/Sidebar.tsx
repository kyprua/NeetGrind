import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  List,
  Shuffle,
  BarChart2,
  Code2,
} from 'lucide-react'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { to: '/problems', label: 'Problems', icon: <List size={16} /> },
  { to: '/generate', label: 'Generate', icon: <Shuffle size={16} /> },
  { to: '/stats', label: 'Stats', icon: <BarChart2 size={16} /> },
]

const Sidebar: React.FC = () => {
  return (
    <aside className="w-56 min-h-screen bg-[#111318] border-r border-[#1E2128] flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-[#1E2128]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#4A9EFF] rounded-sm flex items-center justify-center">
            <Code2 size={14} className="text-[#0A0B0E]" />
          </div>
          <div>
            <div className="text-[#E8EAF0] font-semibold text-sm tracking-wide">NeetGrind</div>
            <div className="text-[#5A6070] text-[10px] tracking-widest uppercase">150 Problems</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm mb-0.5 transition-colors ${
                isActive
                  ? 'bg-[#1A3A5C] text-[#4A9EFF]'
                  : 'text-[#9BA3B0] hover:bg-[#161820] hover:text-[#E8EAF0]'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#1E2128]">
        <div className="text-[#5A6070] text-[10px] uppercase tracking-widest">NeetCode 150</div>
      </div>
    </aside>
  )
}

export default Sidebar
