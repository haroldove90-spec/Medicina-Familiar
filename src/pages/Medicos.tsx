import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus,
  Mail,
  Phone,
  Stethoscope,
  MoreVertical,
  FileSpreadsheet,
  FileText,
  Save,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Doctor, storage } from '@/src/lib/storage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

import { useAuth } from '../contexts/AuthContext';
import AccessDenied from '../components/AccessDenied';

export default function Medicos() {
  const { role } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState<Partial<Doctor>>({
    name: '',
    specialty: '',
    cedula: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = () => {
    setDoctors(storage.getDoctors());
  };

  if (role !== 'ADMIN') {
    return <AccessDenied moduleName="Médicos" requiredRole="Administrador" />;
  }

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const doctor: Doctor = {
      id: Math.random().toString(36).substr(2, 9),
      name: newDoctor.name || '',
      specialty: newDoctor.specialty || '',
      cedula: newDoctor.cedula || '',
      phone: newDoctor.phone || '',
      email: newDoctor.email || ''
    };

    // Note: storage.ts doesn't have saveDoctor yet, I should add it or use a generic one
    // For now I'll simulate it by updating local state and localStorage directly if needed
    // But better to add it to storage.ts
    const currentDoctors = storage.getDoctors();
    currentDoctors.push(doctor);
    localStorage.setItem('doctors', JSON.stringify(currentDoctors));
    
    loadDoctors();
    setIsModalOpen(false);
    setNewDoctor({ name: '', specialty: '', cedula: '', phone: '', email: '' });
    toast.success('Médico agregado correctamente');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.addImage('https://appdesignproyectos.com/neo.png', 'PNG', 10, 10, 20, 20);
    doc.setFontSize(18);
    doc.setTextColor(4, 126, 41);
    doc.text('Dr. Mario Mendoza', 35, 20);
    doc.setFontSize(10);
    doc.text('DIRECTORIO MÉDICO', 35, 26);
    
    autoTable(doc, {
      startY: 35,
      head: [['Nombre', 'Especialidad', 'Cédula', 'Teléfono', 'Email']],
      body: doctors.map(d => [d.name, d.specialty, d.cedula, d.phone, d.email]),
      theme: 'grid',
      headStyles: { fillColor: [4, 126, 41] }
    });
    doc.save('Directorio_Medico.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(doctors);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Medicos');
    XLSX.writeFile(wb, 'Directorio_Medico.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#282829]">Directorio de Médicos</h2>
          <p className="text-[#64748B] text-sm">Gestiona el equipo de especialistas y colaboradores.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button onClick={exportToExcel} variant="outline" className="flex-1 sm:flex-none gap-2 border-[#E2E8F0] h-9 text-xs">
            <FileSpreadsheet size={16} /> Excel
          </Button>
          <Button onClick={exportToPDF} variant="outline" className="flex-1 sm:flex-none gap-2 border-[#E2E8F0] h-9 text-xs">
            <FileText size={16} /> PDF
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="flex-1 sm:flex-none bg-[#047E29] hover:bg-[#036621] text-white gap-2 shadow-md h-9 text-xs">
            <Plus size={16} /> Agregar Médico
          </Button>
        </div>
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

      {/* New Doctor Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#047E29]">Agregar Nuevo Médico</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveDoctor} className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#64748B]">Nombre Completo</Label>
              <Input 
                required
                value={newDoctor.name}
                onChange={(e) => setNewDoctor(prev => ({...prev, name: e.target.value}))}
                className="border-[#E2E8F0]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#64748B]">Especialidad</Label>
              <Input 
                required
                value={newDoctor.specialty}
                onChange={(e) => setNewDoctor(prev => ({...prev, specialty: e.target.value}))}
                className="border-[#E2E8F0]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#64748B]">Cédula Profesional</Label>
              <Input 
                required
                value={newDoctor.cedula}
                onChange={(e) => setNewDoctor(prev => ({...prev, cedula: e.target.value}))}
                className="border-[#E2E8F0]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-[#64748B]">Teléfono</Label>
                <Input 
                  required
                  value={newDoctor.phone}
                  onChange={(e) => setNewDoctor(prev => ({...prev, phone: e.target.value}))}
                  className="border-[#E2E8F0]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-[#64748B]">Email</Label>
                <Input 
                  type="email"
                  required
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor(prev => ({...prev, email: e.target.value}))}
                  className="border-[#E2E8F0]"
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-[#047E29] hover:bg-[#036621] text-white gap-2">
                <Save size={18} /> Guardar Médico
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
