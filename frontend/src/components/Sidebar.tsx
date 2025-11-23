import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaHome,
  FaExchangeAlt,
  FaWallet,
  FaLightbulb,
  FaBell,
  FaLink,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const navItems = [
  { title: 'Dashboard', path: '/dashboard', icon: FaHome },
  { title: 'Transactions', path: '/transactions', icon: FaExchangeAlt },
  { title: 'Budgets', path: '/budgets', icon: FaWallet },
  { title: 'Insights', path: '/insights', icon: FaLightbulb },
  { title: 'Notifications', path: '/notifications', icon: FaBell },
  { title: 'Linked Accounts', path: '/linked-accounts', icon: FaLink },
  { title: 'Profile', path: '/profile', icon: FaUser },
  { title: 'Expert Advice', path: '/expert-advice', icon: FaUser },
  { title: 'Habits', path: '/behavioral-analysis', icon: FaUser },
  { title: 'Financial Coach', path: '/financial-coach', icon: FaUser },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ width: collapsed ? 64 : 256 }}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col z-40"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <MdDashboard className="text-primary text-2xl" />
            <span className="font-bold text-xl text-primary">FinAdapt</span>
          </div>
        )}
        {collapsed && <MdDashboard className="text-primary text-2xl" />}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`
                }
                title={collapsed ? item.title : undefined}
              >
                <item.icon className="text-lg flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-foreground"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
