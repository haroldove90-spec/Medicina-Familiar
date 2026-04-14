import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowRight,
  Plus,
  AlertCircle,
  Search,
  Edit2,
  Trash2,
  Eye,
  Stethoscope,
  TrendingUp,
  CreditCard,
  Receipt,
  UserRound
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Input } from '@/src/components/ui/input';
import { Patient, storage } from '@/src/lib/storage';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setPatients(storage.getPatients());
    setAppointments(storage.getAppointments());
    setPayments(storage.getPayments());
    setAuditLogs(storage.getAuditLogs().slice(0, 4));
    setLoading(false);
  }, []);

  const todayTotal = payments
    .filter(p => p.date === new Date().toISOString().split('T')[0])
    .reduce((acc, curr) => acc + curr.total, 0);

  const stats = [
    { label: 'Pacientes', value: patients.length.toString(), icon: <Users size={20} />, color: 'text-[#047E29]', bg: 'bg-[#EBFBCA]' },
    { label: 'Citas Hoy', value: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length.toString(), icon: <CalendarIcon size={20} />, color: 'text-[#CDCC34]', bg: 'bg-[#CDCC34]/10' },
    { label: 'Ingresos Hoy', value: `$${todayTotal.toLocaleString('es-MX')}`, icon: <Receipt size={20} />, color: 'text-[#047E29]', bg: 'bg-[#EBFBCA]' },
    { label: 'Pendientes', value: appointments.filter(a => a.status === 'Pendiente').length.toString(), icon: <AlertCircle size={20} />, color: 'text-[#FC0000]', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-10">
      {/* Centered Logo Section */}
      <div className="flex flex-col items-center justify-center py-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-3xl shadow-xl border border-[#E2E8F0] mb-6"
        >
          <img 
            src="https://appdesignproyectos.com/neo.png" 
            alt="Neomedic Logo" 
            className="w-32 h-32 object-contain"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <h2 className="text-3xl font-bold text-[#282829] tracking-tight">Neomedic Premium</h2>
        <p className="text-[#64748B] font-medium">Sistema Integral de Gestión Médica • Dr. Mario Mendoza</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6 flex items-center gap-5 bg-[#EBFBCA]">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner bg-white", stat.color)}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-[#282829]">{stat.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Access Modules */}
        <Card className="border-[#E2E8F0] shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Stethoscope size={20} className="text-[#047E29]" />
              Módulos del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-2 gap-4">
            {[
              { label: 'Expedientes', path: '/expedientes', icon: <UserRound size={18} />, desc: 'Historias clínicas NOM-024' },
              { label: 'Agenda', path: '/agenda', icon: <CalendarIcon size={18} />, desc: 'Control de citas y horarios' },
              { label: 'Cargos', path: '/cargos', icon: <CreditCard size={18} />, desc: 'Registro de servicios' },
              { label: 'Cobros', path: '/cobros', icon: <Receipt size={18} />, desc: 'Caja y recibos' },
            ].map((module, i) => (
              <button 
                key={i}
                onClick={() => navigate(module.path)}
                className="flex flex-col items-start p-4 rounded-xl border border-[#E2E8F0] hover:border-[#047E29] hover:bg-[#EBFBCA] transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] group-hover:bg-[#047E29] group-hover:text-white flex items-center justify-center text-[#047E29] mb-3 transition-colors">
                  {module.icon}
                </div>
                <p className="font-bold text-sm text-[#282829]">{module.label}</p>
                <p className="text-[11px] text-[#64748B] mt-1">{module.desc}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity / Audit Log Summary */}
        <Card className="border-[#E2E8F0] shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp size={20} className="text-[#047E29]" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#E2E8F0]">
              {auditLogs.length > 0 ? (
                auditLogs.map((log, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#047E29]"></div>
                      <div>
                        <p className="text-sm font-bold text-[#282829]">{log.action}</p>
                        <p className="text-[11px] text-[#64748B]">{log.details}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[#64748B] text-sm italic">
                  No hay actividad reciente registrada.
                </div>
              )}
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/audit')}
              className="w-full rounded-none border-t border-[#E2E8F0] text-xs font-bold text-[#047E29] h-12 hover:bg-[#EBFBCA]"
            >
              Ver Bitácora Completa
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
