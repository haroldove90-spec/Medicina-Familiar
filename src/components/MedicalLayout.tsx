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
  Bell,
  Calendar,
  Users,
  Library,
  CreditCard,
  Receipt,
  Plus,
  FolderOpen,
  Printer,
  Trash2,
  Eye
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
        ? "bg-[#CDCC34] text-[#047E29] shadow-md" 
        : "text-white/70 hover:text-white hover:bg-white/5"
    )}
  >
    <span className={cn(
      "transition-transform duration-200 group-hover:scale-110",
      active ? "text-[#047E29]" : "text-white/50 group-hover:text-white"
    )}>
      {icon}
    </span>
    <span className="text-sm font-bold tracking-tight">{label}</span>
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
      <aside className="hidden lg:flex w-[260px] bg-[#047E29] border-r border-[#036621] flex-col p-6 text-white shrink-0 shadow-2xl z-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-white p-1.5 rounded-xl shadow-lg">
            <img 
              src="https://appdesignproyectos.com/neo.png" 
              alt="Logo" 
              className="w-10 h-10 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">Dr. Mario</h1>
            <p className="text-[11px] font-bold text-[#CDCC34] uppercase tracking-widest">Mendoza</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
          <NavItem 
            to="/" 
            icon={<LayoutDashboard size={18} />} 
            label="Dashboard" 
            active={location.pathname === '/'} 
          />
          <NavItem 
            to="/expedientes" 
            icon={<UserRound size={18} />} 
            label="Expedientes (NOM-024)" 
            active={location.pathname.startsWith('/expedientes')} 
          />
          <NavItem 
            to="/agenda" 
            icon={<Calendar size={18} />} 
            label="Agenda de Citas" 
            active={location.pathname.startsWith('/agenda')} 
          />
          <NavItem 
            to="/medicos" 
            icon={<Users size={18} />} 
            label="Médicos" 
            active={location.pathname.startsWith('/medicos')} 
          />
          <NavItem 
            to="/biblioteca" 
            icon={<Library size={18} />} 
            label="Biblioteca" 
            active={location.pathname.startsWith('/biblioteca')} 
          />
          <NavItem 
            to="/cargos" 
            icon={<CreditCard size={18} />} 
            label="Cargos" 
            active={location.pathname.startsWith('/cargos')} 
          />
          <NavItem 
            to="/cobros" 
            icon={<Receipt size={18} />} 
            label="Cobros" 
            active={location.pathname.startsWith('/cobros')} 
          />
          <NavItem 
            to="/audit" 
            icon={<History size={18} />} 
            label="Bitácora de Auditoría" 
            active={location.pathname === '/audit'} 
          />
        </nav>

        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#047E29] font-bold text-xs shadow-md">
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
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[300px] max-w-[80%] bg-[#047E29] flex flex-col p-6 text-white overflow-y-auto shadow-2xl lg:hidden">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-lg">
                  <img src="https://appdesignproyectos.com/neo.png" alt="Logo" className="w-8 h-8 object-contain" />
                </div>
                <h1 className="text-lg font-bold text-white">Dr. Mario</h1>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 space-y-2">
              <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" active={location.pathname === '/'} />
              <NavItem to="/expedientes" icon={<UserRound size={20} />} label="Expedientes" active={location.pathname.startsWith('/expedientes')} />
              <NavItem to="/agenda" icon={<Calendar size={20} />} label="Agenda" active={location.pathname.startsWith('/agenda')} />
              <NavItem to="/medicos" icon={<Users size={20} />} label="Médicos" active={location.pathname.startsWith('/medicos')} />
              <NavItem to="/biblioteca" icon={<Library size={20} />} label="Biblioteca" active={location.pathname.startsWith('/biblioteca')} />
              <NavItem to="/cargos" icon={<CreditCard size={20} />} label="Cargos" active={location.pathname.startsWith('/cargos')} />
              <NavItem to="/cobros" icon={<Receipt size={20} />} label="Cobros" active={location.pathname.startsWith('/cobros')} />
              <NavItem to="/audit" icon={<History size={20} />} label="Audit Log" active={location.pathname === '/audit'} />
            </nav>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8FAFC]">
        {/* Header / Top Bar */}
        <header className="h-20 bg-white border-b border-[#E2E8F0] flex flex-col shrink-0 shadow-sm z-10">
          <div className="flex-1 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4 flex-1">
              <button className="lg:hidden p-2 text-[#64748B]" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={20} />
              </button>
              
              {/* Cinta de Herramientas (Quick Access) */}
              <div className="hidden md:flex items-center gap-2">
                <Button size="sm" className="bg-[#047E29] hover:bg-[#036621] text-white gap-1.5 h-9 rounded-lg px-4 shadow-sm">
                  <Plus size={16} /> Nuevo
                </Button>
                <Button size="sm" variant="outline" className="border-[#E2E8F0] text-[#282829] gap-1.5 h-9 rounded-lg px-4 hover:bg-[#F8FAFC]">
                  <FolderOpen size={16} /> Abrir
                </Button>
                <Button size="sm" variant="outline" className="border-[#E2E8F0] text-[#282829] gap-1.5 h-9 rounded-lg px-4 hover:bg-[#F8FAFC]">
                  <Printer size={16} /> Imprimir
                </Button>
                <Button size="sm" variant="outline" className="border-[#E2E8F0] text-[#282829] gap-1.5 h-9 rounded-lg px-4 hover:bg-[#F8FAFC]">
                  <Eye size={16} /> Vista Previa
                </Button>
                <Button size="sm" className="bg-[#FC0000] hover:bg-[#D00000] text-white gap-1.5 h-9 rounded-lg px-4 shadow-sm">
                  <Trash2 size={16} /> Eliminar
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-6">
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-xs font-bold text-[#282829] uppercase tracking-wider">{currentDate}</p>
                <p className="text-[10px] text-[#64748B] font-medium">Consultorio Activo</p>
              </div>
              <div className="w-px h-8 bg-[#E2E8F0] hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#EBFBCA] flex items-center justify-center text-[#047E29] shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <Bell size={20} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#F8FAFC]/50">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
