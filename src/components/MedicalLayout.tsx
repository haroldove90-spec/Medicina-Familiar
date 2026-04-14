import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  Eye,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../lib/storage';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  key?: string | number;
}

const NavItem = ({ to, icon, label, active, onClick, className }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
      active 
        ? "bg-[#CDCC34] text-[#047E29] shadow-md" 
        : "text-white/70 hover:text-white hover:bg-white/5",
      className
    )}
  >
    <span className={cn(
      "transition-transform duration-200 group-hover:scale-110",
      active ? "text-[#047E29]" : "text-white/50 group-hover:text-white"
    )}>
      {icon}
    </span>
    <span className="text-sm font-bold tracking-tight">{label}</span>
    {active && (
      <motion.div 
        layoutId="activeNav"
        className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
      />
    )}
  </button>
);

export default function MedicalLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, role, setRole, logout } = useAuth();

  const currentDate = new Date().toLocaleDateString('es-MX', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/', roles: ['ADMIN', 'MEDICO', 'RECEPCION'] },
    { icon: <UserRound size={20} />, label: 'Expedientes', path: '/expedientes', roles: ['ADMIN', 'MEDICO'] },
    { icon: <Calendar size={20} />, label: 'Agenda', path: '/agenda', roles: ['ADMIN', 'MEDICO', 'RECEPCION', 'PACIENTE'] },
    { icon: <Users size={20} />, label: 'Médicos', path: '/medicos', roles: ['ADMIN'] },
    { icon: <Library size={20} />, label: 'Biblioteca', path: '/biblioteca', roles: ['ADMIN', 'MEDICO'] },
    { icon: <CreditCard size={20} />, label: 'Cargos', path: '/cargos', roles: ['ADMIN', 'RECEPCION'] },
    { icon: <Receipt size={20} />, label: 'Cobros', path: '/cobros', roles: ['ADMIN', 'RECEPCION'] },
    { icon: <History size={20} />, label: 'Audit Log', path: '/audit', roles: ['ADMIN'] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(role));

  const roleLabels: Record<UserRole, string> = {
    ADMIN: 'Administrador',
    MEDICO: 'Médico',
    RECEPCION: 'Recepción',
    PACIENTE: 'Paciente'
  };

  const roleColors: Record<UserRole, string> = {
    ADMIN: 'bg-[#CDCC34] text-[#047E29]',
    MEDICO: 'bg-white text-[#047E29]',
    RECEPCION: 'bg-[#EBFBCA] text-[#047E29]',
    PACIENTE: 'bg-white/20 text-white'
  };

  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;
      if (inactiveTime > 5 * 60 * 1000 && !showLogoutWarning) { // 5 minutes
        setShowLogoutWarning(true);
      }
    }, 10000);

    const handleActivity = () => {
      setLastActivity(Date.now());
      if (showLogoutWarning) setShowLogoutWarning(false);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [lastActivity, showLogoutWarning]);

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-[#282829] overflow-hidden">
      {/* Auto-Logout Warning */}
      <AnimatePresence>
        {showLogoutWarning && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] bg-[#FC0000] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-white/20"
          >
            <ShieldCheck size={20} className="animate-pulse" />
            <div className="text-xs font-bold">
              <p className="uppercase tracking-wider">Aviso de Seguridad</p>
              <p className="opacity-90 font-medium">Sesión inactiva. Se cerrará automáticamente pronto por protección de datos.</p>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white hover:bg-white/20 h-8 text-[10px] font-bold"
              onClick={() => {
                setLastActivity(Date.now());
                setShowLogoutWarning(false);
              }}
            >
              MANTENER SESIÓN
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Role Selector for Development */}
      <div className="fixed bottom-4 right-4 z-[100] bg-white p-3 rounded-2xl shadow-2xl border border-[#E2E8F0] flex flex-col gap-2">
        <span className="text-[10px] font-bold text-[#64748B] uppercase text-center">Simular Rol (Dev)</span>
        <div className="flex gap-1">
          {(['ADMIN', 'MEDICO', 'RECEPCION', 'PACIENTE'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                "px-2 py-1 rounded text-[10px] font-bold transition-all",
                role === r 
                  ? "bg-[#047E29] text-white shadow-md scale-105" 
                  : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#EBFBCA]"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

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
          {filteredMenuItems.map((item) => (
            <NavItem 
              key={item.path}
              to={item.path} 
              icon={item.icon} 
              label={item.label} 
              active={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))} 
              onClick={() => navigate(item.path)}
            />
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#047E29] font-bold text-sm shadow-md">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <div className={cn("inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider mt-0.5", roleColors[role])}>
                {roleLabels[role]}
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-white/70 hover:text-[#FC0000] hover:bg-white/10 px-4 py-2 h-auto"
            onClick={logout}
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </Button>
          <div className="mt-4 px-2 py-1 bg-[#CDCC34]/20 border border-[#CDCC34]/30 rounded text-[10px] text-[#EBFBCA] font-bold text-center">
            NOM-024 / COFEPRIS Compliant
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-[300px] max-w-[80%] bg-[#047E29] flex flex-col p-6 text-white overflow-y-auto shadow-2xl lg:hidden"
            >
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
                {filteredMenuItems.map((item) => (
                  <NavItem 
                    key={item.path}
                    to={item.path} 
                    icon={item.icon} 
                    label={item.label} 
                    active={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))} 
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }} 
                  />
                ))}
              </nav>
              <div className="mt-auto pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#047E29] font-bold">
                    {user?.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                    <p className="text-[10px] font-bold text-[#CDCC34] uppercase">{roleLabels[role]}</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8FAFC]">
        {/* Header / Top Bar */}
        <header className="h-auto min-h-[5rem] lg:h-20 bg-white border-b border-[#E2E8F0] flex flex-col shrink-0 shadow-sm z-10 py-2 lg:py-0">
          <div className="flex-1 flex flex-wrap items-center justify-between px-4 lg:px-8 gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button className="lg:hidden p-2 text-[#64748B] shrink-0" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={20} />
              </button>
              
              {/* Cinta de Herramientas (Quick Access) */}
              <div className="hidden md:flex flex-wrap items-center gap-2">
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

            <div className="flex items-center gap-3 lg:gap-6 shrink-0">
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
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8 bg-[#F8FAFC]/50">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
