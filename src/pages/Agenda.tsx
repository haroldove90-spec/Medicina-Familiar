import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { cn } from '@/src/lib/utils';

export default function Agenda() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const monthName = currentDate.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });

  const appointments = [
    { id: 1, patient: 'Juan Pérez', time: '09:00 AM', type: 'Consulta', day: 15 },
    { id: 2, patient: 'María García', time: '11:30 AM', type: 'Seguimiento', day: 15 },
    { id: 3, patient: 'Carlos López', time: '04:00 PM', type: 'Resultados', day: 16 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#282829]">Agenda de Citas</h2>
          <p className="text-[#64748B] text-sm">Organiza y gestiona las consultas de tus pacientes.</p>
        </div>
        <Button className="bg-[#047E29] hover:bg-[#036621] gap-2">
          <Plus size={18} /> Nueva Cita
        </Button>
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
                const dayAppointments = appointments.filter(a => a.day === day);
                return (
                  <div key={day} className="border-r border-b border-[#E2E8F0] p-2 hover:bg-[#EBFBCA]/20 transition-colors group cursor-pointer relative">
                    <span className="text-xs font-bold text-[#64748B] group-hover:text-[#047E29]">{day}</span>
                    <div className="mt-1 space-y-1">
                      {dayAppointments.map(apt => (
                        <div key={apt.id} className="text-[9px] bg-[#047E29] text-white p-1 rounded truncate font-medium">
                          {apt.time} - {apt.patient}
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
              {appointments.filter(a => a.day === 15).map(apt => (
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
                    <span className="text-[13px] font-semibold text-[#282829]">{apt.patient}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
