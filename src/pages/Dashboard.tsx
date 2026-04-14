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
  Eye
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
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    const data = storage.getPatients();
    setPatients(data);
    setLoading(false);
  };

  const handleDeletePatient = (id: string, name: string) => {
    if (window.confirm(`¿Está seguro de eliminar al paciente ${name}? Esta acción no se puede deshacer.`)) {
      storage.deletePatient(id);
      loadPatients();
      toast.success('Paciente eliminado correctamente');
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.lastDiagnosis && p.lastDiagnosis.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const appointments = [
    { id: 1, patient: 'Juan Pérez', time: '09:00 AM', type: 'Consulta General', status: 'Confirmada' },
    { id: 2, patient: 'María García', time: '10:30 AM', type: 'Seguimiento', status: 'En espera' },
    { id: 3, patient: 'Carlos López', time: '12:00 PM', type: 'Resultados', status: 'Pendiente' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#282829] tracking-tight">Panel de Control</h2>
          <p className="text-[#64748B] text-sm mt-1">Bienvenido de nuevo, Dr. Mario Mendoza.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => navigate('/notes')}
            className="bg-[#047E29] hover:bg-[#036621] gap-2 px-6 rounded-lg text-sm font-semibold shadow-md"
          >
            <Plus size={18} />
            Nueva Consulta
          </Button>
        </div>
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
                  index === 0 && "bg-[#EBFBCA] border-l-4 border-l-[#047E29]"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-[13px] text-[#282829]">{apt.patient}</p>
                  <span className="text-[10px] font-bold text-[#64748B]">{apt.time}</span>
                </div>
                <p className="text-[11px] text-[#64748B]">{apt.type}</p>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full rounded-none border-t border-[#E2E8F0] text-[11px] font-bold text-[#047E29] uppercase tracking-wider h-10 hover:bg-[#EBFBCA]">
            Ver Agenda Completa
          </Button>
        </Card>

        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Pacientes', value: patients.length.toString(), icon: <Users size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Citas Hoy', value: '12', icon: <CalendarIcon size={20} />, color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { label: 'Pendientes', value: '3', icon: <AlertCircle size={20} />, color: 'text-red-600', bg: 'bg-red-50' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="border-[#E2E8F0] shadow-none rounded-xl p-5 flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#282829]">{stat.value}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Patients */}
          <Card className="border-[#E2E8F0] shadow-none rounded-xl overflow-hidden">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-sm font-bold">Gestión de Pacientes</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 text-[#64748B]" size={14} />
                <Input 
                  placeholder="Buscar por nombre..." 
                  className="pl-9 h-9 text-xs border-[#E2E8F0] rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-[#E2E8F0] bg-[#F8FAFC]">
                      <TableHead className="text-[10px] uppercase tracking-widest font-bold text-[#64748B] h-10 px-4">Paciente</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest font-bold text-[#64748B] h-10 px-4">Última Visita</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest font-bold text-[#64748B] h-10 px-4">Diagnóstico</TableHead>
                      <TableHead className="text-right text-[10px] uppercase tracking-widest font-bold text-[#64748B] h-10 px-4">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <TableRow key={patient.id} className="border-[#E2E8F0] hover:bg-[#EBFBCA] transition-colors group">
                          <TableCell className="px-4 py-3">
                            <div>
                              <p className="font-bold text-[13px] text-[#282829]">{patient.name}</p>
                              <p className="text-[11px] text-[#64748B]">{patient.age} años • {patient.gender}</p>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-[12px] text-[#64748B]">{patient.lastVisit}</TableCell>
                          <TableCell className="px-4 py-3">
                            <Badge variant="outline" className="bg-white text-[#047E29] border-[#CDCC34] text-[10px]">
                              {patient.lastDiagnosis || 'Sin registro'}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-[#047E29] hover:bg-[#047E29]/10"
                                onClick={() => navigate('/notes')}
                              >
                                <Eye size={14} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-[#FC0000] hover:bg-[#FC0000]/10"
                                onClick={() => handleDeletePatient(patient.id, patient.name)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center text-[#64748B] text-sm italic">
                          No se encontraron pacientes que coincidan con la búsqueda.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
