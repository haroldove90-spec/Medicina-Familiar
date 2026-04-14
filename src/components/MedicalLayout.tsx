import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserRound, 
  FileText, 
  History, 
  LogOut, 
  Stethoscope,
  Search,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ to, icon, label, active }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-white/10 text-white shadow-sm" 
        : "text-white/70 hover:text-white hover:bg-white/5"
    )}
  >
    <span className={cn(
      "transition-transform duration-200 group-hover:scale-110",
      active ? "text-[#CDCC34]" : "text-white/50 group-hover:text-white"
    )}>
      {icon}
    </span>
    <span className="text-sm font-semibold tracking-tight">{label}</span>
  </Link>
);

export default function MedicalLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  const currentDate = new Date().toLocaleDateString('es-MX', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-[#282829] overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-[240px] bg-[#047E29] border-r border-[#036621] flex-col p-6 text-white shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-white p-1.5 rounded-lg">
            <img 
              src="https://appdesignproyectos.com/neo.png" 
              alt="Logo" 
              className="w-8 h-8 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-tight">Dr. Mario</h1>
            <p className="text-[10px] font-bold text-[#CDCC34] uppercase tracking-widest">Mendoza</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem 
            to="/" 
            icon={<LayoutDashboard size={18} />} 
            label="Dashboard" 
            active={location.pathname === '/'} 
          />
          <NavItem 
            to="/patients" 
            icon={<UserRound size={18} />} 
            label="Pacientes" 
            active={location.pathname.startsWith('/patients')} 
          />
          <NavItem 
            to="/notes" 
            icon={<FileText size={18} />} 
            label="Expediente (NOM-024)" 
            active={location.pathname.startsWith('/notes')} 
          />
          <NavItem 
            to="/audit" 
            icon={<History size={18} />} 
            label="Audit Log" 
            active={location.pathname === '/audit'} 
          />
        </nav>

        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#047E29] font-bold text-xs">
              MM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Dr. Mario Mendoza</p>
              <p className="text-[11px] text-white/60 truncate">Médico Especialista</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-white/70 hover:text-[#FC0000] hover:bg-white/10 px-4 py-2 h-auto"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </Button>
          <div className="mt-4 px-2 py-1 bg-[#CDCC34]/20 border border-[#CDCC34]/30 rounded text-[10px] text-[#EBFBCA] font-bold text-center">
            NOM-024 / COFEPRIS Compliant
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-[#047E29] flex flex-col p-6 text-white">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg">
                <img src="https://appdesignproyectos.com/neo.png" alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <h1 className="text-lg font-bold text-white">Dr. Mario Mendoza</h1>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 space-y-2">
            <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" active={location.pathname === '/'} />
            <NavItem to="/patients" icon={<UserRound size={20} />} label="Pacientes" active={location.pathname.startsWith('/patients')} />
            <NavItem to="/notes" icon={<FileText size={20} />} label="Expediente" active={location.pathname.startsWith('/notes')} />
            <NavItem to="/audit" icon={<History size={20} />} label="Audit Log" active={location.pathname === '/audit'} />
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button className="lg:hidden p-2 text-[#64748B]" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-2.5 text-[#64748B]" size={16} />
              <input 
                placeholder="Buscar paciente o diagnóstico..." 
                className="w-full pl-10 h-10 border border-[#E2E8F0] rounded-xl text-sm bg-[#F8FAFC] focus:ring-2 focus:ring-[#047E29] outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-xs font-bold text-[#282829] uppercase tracking-wider">{currentDate}</p>
              <p className="text-[10px] text-[#64748B]">Consultorio Activo</p>
            </div>
            <div className="w-px h-8 bg-[#E2E8F0] hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#EBFBCA] flex items-center justify-center text-[#047E29]">
                <Bell size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
