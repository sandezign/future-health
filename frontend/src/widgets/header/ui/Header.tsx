import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, MessageSquare, BarChart3, Users } from 'lucide-react';
import { Badge } from '../../../shared/ui/badge';
import { ROUTES } from '../../../shared/config/routes';

export function Header() {
  const location = useLocation();

  const navItems = [
    { label: 'Population Triage', path: ROUTES.DASHBOARD, icon: Users },
    { label: 'WhatsApp Outreach Simulator', path: ROUTES.SIMULATOR, icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  RENAL<span className="text-emerald-600">-PULSE</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  v0.1 MVP
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-tight">
                Cardiorenal Upstream Interception Engine
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Future Health Challenge
            </span>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700">Track 2: Population Health</span>
            </div>
          </div>
          <Badge variant="green" className="py-1 px-3">
            <BarChart3 className="h-3.5 w-3.5" />
            Sense to Predict
          </Badge>
        </div>
      </div>
    </header>
  );
}
