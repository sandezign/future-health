import { Link, useLocation } from 'react-router-dom';
import { Activity, MessageSquare, Users, Search, Palette } from 'lucide-react';
import { ROUTES } from '../../../shared/config/routes';

export function Header() {
  const location = useLocation();

  const navItems = [
    { label: 'Population Triage', path: ROUTES.DASHBOARD, icon: Users },
    { label: 'WhatsApp Outreach', path: ROUTES.SIMULATOR, icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-6">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/25 group-hover:bg-indigo-700 transition-all">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  RENAL<span className="text-indigo-600">-PULSE</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  KDIGO 2024
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-none mt-0.5">
                Upstream Cardiorenal Interception Engine
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Global Search Pill */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient, eGFR slope, or lab marker..."
              className="w-full h-10 rounded-full border border-slate-200 bg-slate-50/80 pl-9 pr-12 text-xs text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-slate-500 shadow-2xs">
              ⌘K
            </div>
          </div>
        </div>

        {/* Right Navigation & Status Controls */}
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <a
              href="/design-system.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 transition-all ml-1"
              title="Open UI Design Foundation & Component Showcase"
            >
              <Palette className="h-3.5 w-3.5 text-indigo-500" />
              <span>Design System</span>
            </a>
          </nav>

          <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-slate-200">
            {/* Live Engine Status Indicator */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-medium text-slate-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>KDIGO 2024 Engine Active</span>
            </div>

            {/* Doctor Avatar Profile */}
            <div className="flex items-center gap-2 pl-1" title="Dr. Specialist (Primary Care Physician)">
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                DR
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
