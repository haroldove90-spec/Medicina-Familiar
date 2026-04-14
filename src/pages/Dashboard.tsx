import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowRight,
  Plus,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Patient } from '@/src/types';
import { motion } from 'motion/react';

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => {
        setPatients(data);
        setLoading(false);
      });
  }, []);

  const appointments = [
    { id: 1, patient: 'Juan Pérez', time: '09:00 AM', type: 'Consulta General', status: 'Confirmada' },
    { id: 2, patient: 'María García', time: '10:30 AM', type: 'Seguimiento', status: 'En espera' },
    { id: 3, patient: 'Carlos López', time: '12:00 PM', type: 'Resultados', status: 'Pendiente' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1E293B] tracking-tight">Panel de Control</h2>
          <p className="text-[#64748B] text-sm mt-1">Bienvenido de nuevo, Dr. Harold.</p>
        </div>
        <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] gap-2 px-6 rounded-lg text-sm font-semibold">
          <Plus size={18} />
          Nueva Cita
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Upcoming Appointments Column */}
        <Card className="border-[#E2E8F0] shadow-none rounded-xl overflow-hidden flex flex-col h-fit">
          <CardHeader className="p-4 border-b border-[#E2E8F0] bg-white">
            <CardTitle className="text-sm font-bold">Próximas Citas</CardTitle>
          </CardHeader>
          <div className="flex flex-col">
            {appointments.map((apt, index) => (
              <div 
                key={apt.id} 
                className={cn(
                  "p-4 border-b border-[#E2E8F0] last:border-none cursor-pointer hover:bg-[#F8FAFC] transition-colors",
                  index === 0 && "bg-[#EFF6FF] border-l-4 border-l-[#2563EB]"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-[13px] text-[#1E293B]">{apt.patient}</p>
                  <span className="text-[10px] font-bold text-[#64748B]">{apt.time}</span>
                </div>
                <p className="text-[11px] text-[#64748B]">{apt.type}</p>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full rounded-none border-t border-[#E2E8F0] text-[11px] font-bold text-[#2563EB] uppercase tracking-wider h-10 hover:bg-[#EFF6FF]">
            Ver Agenda Completa
          </Button>
        </Card>

        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Pacientes', value: '1,284', icon: <Users size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Citas Hoy', value: '12', icon: <CalendarIcon size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Pendientes', value: '3', icon: <AlertCircle size={20} />, color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="border-[#E2E8F0] shadow-none rounded-xl p-5 flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#1E293B]">{stat.value}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Patients */}
          <Card className="border-[#E2E8F0] shadow-none rounded-xl overflow-hidden">
            <CardHeader className="p-4 border-b border-[#E2E8F0]">
              <CardTitle className="text-sm font-bold">Pacientes Recientes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-[#E2E8F0] bg-[#F8FAFC]">
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-[#64748B] h-10 px-4">Paciente</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-[#64748B] h-10 px-4">Última Visita</TableHead>
                    <TableHead className="text-right text-[10px] uppercase tracking-widest font-bold text-[#64748B] h-10 px-4">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id} className="border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors group">
                      <TableCell className="px-4 py-3">
                        <div>
                          <p className="font-bold text-[13px] text-[#1E293B]">{patient.name}</p>
                          <p className="text-[11px] text-[#64748B]">{patient.age} años • {patient.gender}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[12px] text-[#64748B]">{patient.lastVisit}</TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="text-[#2563EB] font-bold text-[11px] uppercase tracking-wider hover:bg-[#EFF6FF]">
                          Expediente
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
