import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  User,
  FileSpreadsheet,
  FileText,
  Save,
  X,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { cn } from '@/src/lib/utils';
import { Appointment, storage, Patient } from '@/src/lib/storage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

import { useAuth } from '../contexts/AuthContext';
import AccessDenied from '../components/AccessDenied';

export default function Agenda() {
  const { role } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    patientId: '',
    patientName: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'Consulta',
    status: 'Pendiente'
  });
  
  useEffect(() => {
    loadData();
  }, []);

  if (role === 'PACIENTE') {
    return <AccessDenied moduleName="Agenda" requiredRole="Personal Médico / Administrativo" />;
  }

  const loadData = () => {
    setAppointments(storage.getAppointments());
    setPatients(storage.getPatients());
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const monthName = currentDate.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === newAppointment.patientId);
    
    const appointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: newAppointment.patientId || 'manual',
      patientName: patient?.name || newAppointment.patientName || 'Paciente Nuevo',
      date: newAppointment.date || new Date().toISOString().split('T')[0],
      time: newAppointment.time || '09:00',
      type: newAppointment.type || 'Consulta',
      status: (newAppointment.status as any) || 'Pendiente'
    };

    storage.saveAppointment(appointment);
    loadData();
    setIsModalOpen(false);
    toast.success('Cita agendada correctamente');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.addImage('https://appdesignproyectos.com/neo.png', 'PNG', 10, 10, 20, 20);
    doc.setFontSize(18);
    doc.setTextColor(4, 126, 41);
    doc.text('Dr. Mario Mendoza', 35, 20);
    doc.setFontSize(10);
    doc.text(`AGENDA DE CITAS - ${monthName.toUpperCase()}`, 35, 26);
    
    autoTable(doc, {
      startY: 35,
      head: [['Fecha', 'Hora', 'Paciente', 'Tipo', 'Estado']],
      body: appointments
        .filter(a => a.date.startsWith(currentDate.toISOString().slice(0, 7)))
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(a => [a.date, a.time, a.patientName, a.type, a.status]),
      theme: 'grid',
      headStyles: { fillColor: [4, 126, 41] }
    });
    doc.save(`Agenda_${monthName.replace(' ', '_')}.pdf`);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(appointments);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Agenda');
    XLSX.writeFile(wb, 'Agenda_Citas.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#282829]">Agenda de Citas</h2>
          <p className="text-[#64748B] text-sm">Organiza y gestiona las consultas de tus pacientes.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button onClick={exportToExcel} variant="outline" className="flex-1 sm:flex-none gap-2 border-[#E2E8F0] h-9 text-xs">
            <FileSpreadsheet size={16} /> Excel
          </Button>
          <Button onClick={exportToPDF} variant="outline" className="flex-1 sm:flex-none gap-2 border-[#E2E8F0] h-9 text-xs">
            <FileText size={16} /> PDF
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="flex-1 sm:flex-none bg-[#047E29] hover:bg-[#036621] text-white gap-2 shadow-md h-9 text-xs">
            <Plus size={16} /> Nueva Cita
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2 border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold capitalize">{monthName}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
                <ChevronLeft size={16} />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b border-[#E2E8F0]">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                <div key={day} className="py-2 text-center text-[10px] font-bold text-[#64748B] uppercase tracking-widest bg-[#F8FAFC]">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 h-[500px]">
              {blanks.map(i => (
                <div key={`blank-${i}`} className="border-r border-b border-[#E2E8F0] bg-[#F8FAFC]/50"></div>
              ))}
              {days.map(day => {
                const dayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayAppointments = appointments.filter(a => a.date === dayStr);
                return (
                  <div key={day} className="border-r border-b border-[#E2E8F0] p-2 hover:bg-[#EBFBCA]/20 transition-colors group cursor-pointer relative">
                    <span className="text-xs font-bold text-[#64748B] group-hover:text-[#047E29]">{day}</span>
                    <div className="mt-1 space-y-1">
                      {dayAppointments.map(apt => (
                        <div key={apt.id} className="text-[9px] bg-[#047E29] text-white p-1 rounded truncate font-medium">
                          {apt.time} - {apt.patientName}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Day Details */}
        <div className="space-y-6">
          <Card className="border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden bg-white">
            <CardHeader className="p-4 border-b border-[#E2E8F0] bg-[#EBFBCA]">
              <CardTitle className="text-sm font-bold text-[#047E29]">Citas del Día</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length > 0 ? (
                appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).map(apt => (
                  <div key={apt.id} className="p-3 border border-[#E2E8F0] rounded-lg hover:border-[#047E29] transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#047E29]" />
                        <span className="text-xs font-bold">{apt.time}</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] uppercase font-bold text-[#CDCC34] border-[#CDCC34]">
                        {apt.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-[#64748B]" />
                      <span className="text-[13px] font-semibold text-[#282829]">{apt.patientName}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-[#64748B] text-xs italic">
                  No hay citas para hoy.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Appointment Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#047E29]">Agendar Nueva Cita</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveAppointment} className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#64748B]">Paciente</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#047E29]"
                value={newAppointment.patientId}
                onChange={(e) => setNewAppointment(prev => ({...prev, patientId: e.target.value}))}
                required
              >
                <option value="">Seleccionar Paciente</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-[#64748B]">Fecha</Label>
                <Input 
                  type="date"
                  required
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment(prev => ({...prev, date: e.target.value}))}
                  className="border-[#E2E8F0]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-[#64748B]">Hora</Label>
                <Input 
                  type="time"
                  required
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment(prev => ({...prev, time: e.target.value}))}
                  className="border-[#E2E8F0]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#64748B]">Tipo de Cita</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#047E29]"
                value={newAppointment.type}
                onChange={(e) => setNewAppointment(prev => ({...prev, type: e.target.value}))}
              >
                <option value="Consulta">Consulta General</option>
                <option value="Seguimiento">Seguimiento</option>
                <option value="Resultados">Entrega de Resultados</option>
                <option value="Urgencia">Urgencia</option>
              </select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-[#047E29] hover:bg-[#036621] text-white gap-2">
                <Save size={18} /> Confirmar Cita
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
