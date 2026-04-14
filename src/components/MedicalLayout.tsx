import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserRound, 
  FileText, 
  History, 
  LogOut, 
  Stethoscope,
  Search
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
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
      active 
        ? "bg-blue-50 text-blue-600 font-medium" 
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    )}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </Link>
);

export default function MedicalLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
      {/* Sidebar */}
      <aside className="w-[240px] bg-white border-r border-[#E2E8F0] flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 bg-[#2563EB] rounded-md flex items-center justify-center text-white">
            <Stethoscope size={18} />
          </div>
          <h1 className="text-xl font-bold text-[#2563EB] tracking-tight">MediSync</h1>
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

        <div className="mt-auto pt-4 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#CBD5E1] flex items-center justify-center text-white font-bold text-xs">
              HO
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1E293B] truncate">Dr. Harold Ove</p>
              <p className="text-[11px] text-[#64748B] truncate">Medicina General • ID 45920</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-[#64748B] hover:text-[#EF4444] hover:bg-red-50 px-4 py-2 h-auto"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </Button>
          <div className="mt-4 px-2 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[10px] text-[#64748B] font-medium text-center">
            NOM-024 / COFEPRIS Compliant
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-2 rounded-full w-[320px]">
            <Search size={16} className="text-[#64748B]" />
            <input 
              type="text" 
              placeholder="Buscar paciente por nombre o CURP..." 
              className="bg-transparent border-none outline-none text-[13px] w-full text-[#1E293B] placeholder:text-[#64748B]"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">Hoy</p>
              <p className="text-sm font-semibold text-[#1E293B]">{new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
