import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus,
  Mail,
  Phone,
  Stethoscope,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Doctor, storage } from '@/src/lib/storage';

export default function Medicos() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    setDoctors(storage.getDoctors());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#282829]">Directorio de Médicos</h2>
          <p className="text-[#64748B] text-sm">Gestiona el equipo de especialistas y colaboradores.</p>
        </div>
        <Button className="bg-[#047E29] hover:bg-[#036621] gap-2">
          <Plus size={18} /> Agregar Médico
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
            <CardHeader className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#047E29] flex items-center justify-center text-white font-bold text-lg">
                {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-bold truncate">{doctor.name}</CardTitle>
                <Badge variant="outline" className="text-[10px] text-[#047E29] border-[#047E29] bg-white">
                  {doctor.specialty}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical size={16} />
              </Button>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#64748B]">
                <Stethoscope size={16} className="text-[#CDCC34]" />
                <span className="font-medium">Cédula: {doctor.cedula}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#64748B]">
                <Phone size={16} className="text-[#CDCC34]" />
                <span>{doctor.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#64748B]">
                <Mail size={16} className="text-[#CDCC34]" />
                <span className="truncate">{doctor.email}</span>
              </div>
            </CardContent>
            <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex gap-2">
              <Button variant="outline" className="flex-1 h-9 text-xs font-bold border-[#E2E8F0]">Ver Perfil</Button>
              <Button variant="outline" className="flex-1 h-9 text-xs font-bold border-[#E2E8F0]">Mensaje</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
