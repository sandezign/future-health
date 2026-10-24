import { Link, useLocation } from 'react-router-dom';
import { Activity, MessageSquare, Users, Palette, Dna } from 'lucide-react';
import { ROUTES } from '../../../shared/config/routes';

export function Header() {
  const location = useLocation();
  const isGenoBridge = location.pathname.startsWith('/geno-bridge');

  const renalNavItems = [
    { label: 'Population Triage', path: ROUTES.DASHBOARD, icon: Users },
    { label: 'WhatsApp Outreach', path: ROUTES.SIMULATOR, icon: MessageSquare },
  ];

  const genoNavItems = [
    { label: 'Citizen Mobile Copilot', path: ROUTES.GENO_CITIZEN, icon: Dna },
    { label: 'Counselor Workspace', path: ROUTES.GENO_COUNSELOR, icon: Users },
  ];

  const currentNavItems = isGenoBridge ? genoNavItems : renalNavItems;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Brand Logo & Platform Switcher */}
        <div className="flex items-center gap-4">
          <Link
            to={isGenoBridge ? ROUTES.GENO_COUNSELOR : ROUTES.HOME}
            className="flex items-center gap-2.5 group"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-sm transition-all ${
                isGenoBridge
                  ? 'bg-emerald-600 shadow-emerald-600/25 group-hover:bg-emerald-700'
                  : 'bg-indigo-600 shadow-indigo-600/25 group-hover:bg-indigo-700'
              }`}
            >
              {isGenoBridge ? <Dna className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  {isGenoBridge ? (
                    <>
                      GENO<span className="text-emerald-600">-BRIDGE</span>
                    </>
                  ) : (
                    <>
                      RENAL<span className="text-indigo-600">-PULSE</span>
                    </>
                  )}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isGenoBridge
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                  }`}
                >
                  {isGenoBridge ? 'Fertility / DoH Abu Dhabi' : 'KDIGO 2024'}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-none mt-0.5">
                {isGenoBridge
                  ? 'Preconception Genomic Decision Support'
                  : 'Upstream Cardiorenal Interception Engine'}
              </p>
            </div>
          </Link>

          {/* Platform Toggle Switcher */}
          <div className="hidden sm:flex items-center rounded-full bg-slate-100 p-1 border border-slate-200 text-xs">
            <Link
              to={ROUTES.DASHBOARD}
              className={`px-3 py-1 rounded-full font-medium transition-colors duration-150 ease-out active:scale-[0.98] ${
                !isGenoBridge
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Renal-Pulse
            </Link>
            <Link
              to={ROUTES.GENO_COUNSELOR}
              className={`px-3 py-1 rounded-full font-medium transition-colors duration-150 ease-out active:scale-[0.98] ${
                isGenoBridge
                  ? 'bg-emerald-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Geno-Bridge
            </Link>
          </div>
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-colors duration-150 ease-out active:scale-[0.98] ${
                    isActive
                      ? isGenoBridge
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                        : 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
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
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 transition-colors duration-150 ml-1"
              title="Open UI Design Foundation & Component Showcase"
            >
              <Palette className="h-3.5 w-3.5 text-indigo-500" />
              <span>Design System</span>
            </a>
          </nav>

          <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-slate-200">
            {/* Engine Status Indicator */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-medium text-slate-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ambient-glow absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>{isGenoBridge ? 'ZKP & FHIR Active' : 'KDIGO Active'}</span>
            </div>

            {/* Avatar Profile */}
            <div
              className={`h-8 w-8 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs ${
                isGenoBridge ? 'bg-emerald-700' : 'bg-indigo-600'
              }`}
            >
              {isGenoBridge ? 'GC' : 'DR'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
