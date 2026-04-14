import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search,
  Plus,
  Eye,
  Trash2,
  FileText,
  Save,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Patient, storage } from '@/src/lib/storage';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function Expedientes() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    setPatients(storage.getPatients());
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.addImage('https://appdesignproyectos.com/neo.png', 'PNG', 10, 10, 20, 20);
    doc.setFontSize(18);
    doc.setTextColor(4, 126, 41);
    doc.text('Dr. Mario Mendoza', 35, 20);
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 41);
    doc.text('LISTADO DE EXPEDIENTES CLÍNICOS', 35, 26);
    
    autoTable(doc, {
      startY: 35,
      head: [['Nombre', 'CURP', 'Edad', 'Género', 'Última Visita', 'Diagnóstico']],
      body: patients.map(p => [p.name, p.curp, p.age, p.gender, p.lastVisit, p.lastDiagnosis || 'N/A']),
      theme: 'grid',
      headStyles: { fillColor: [4, 126, 41] }
    });
    doc.save('Expedientes_Clinicos.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(patients);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expedientes');
    XLSX.writeFile(wb, 'Expedientes_Clinicos.xlsx');
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.curp.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingPatient({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      age: 0,
      gender: 'Masculino',
      curp: '',
      lastVisit: new Date().toISOString().split('T')[0],
      lastDiagnosis: ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPatient) {
      storage.savePatient(editingPatient);
      loadPatients();
      setIsModalOpen(false);
      toast.success('Expediente guardado correctamente');
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Está seguro de eliminar el expediente de ${name}?`)) {
      storage.deletePatient(id);
      loadPatients();
      toast.success('Expediente eliminado');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#282829]">Expedientes Clínicos</h2>
          <p className="text-[#64748B] text-sm">Gestión integral bajo normativa NOM-024-SSA3-2012.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportToExcel} variant="outline" className="gap-2 border-[#E2E8F0] hover:bg-[#F8FAFC]">
            <FileSpreadsheet size={18} /> Excel
          </Button>
          <Button onClick={exportToPDF} variant="outline" className="gap-2 border-[#E2E8F0] hover:bg-[#F8FAFC]">
            <FileText size={18} /> PDF
          </Button>
          <Button onClick={handleNew} className="bg-[#047E29] hover:bg-[#036621] text-white gap-2 shadow-md">
            <Plus size={18} /> Nuevo Expediente
          </Button>
        </div>
      </div>

      <Card className="border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden bg-white">
        <CardHeader className="p-4 border-b border-[#E2E8F0] bg-white flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold">Listado de Pacientes</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-[#64748B]" size={14} />
            <Input 
              placeholder="Buscar por nombre o CURP..." 
              className="pl-9 h-9 text-xs border-[#E2E8F0]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8FAFC]">
                <TableHead className="text-[10px] uppercase font-bold text-[#64748B]">Paciente</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-[#64748B]">CURP</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-[#64748B]">Última Visita</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-[#64748B]">Diagnóstico</TableHead>
                <TableHead className="text-right text-[10px] uppercase font-bold text-[#64748B]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-[#EBFBCA]/30 transition-colors cursor-pointer" onClick={() => handleEdit(patient)}>
                  <TableCell className="py-3">
                    <div className="font-bold text-[13px]">{patient.name}</div>
                    <div className="text-[11px] text-[#64748B]">{patient.age} años • {patient.gender}</div>
                  </TableCell>
                  <TableCell className="text-[12px] font-mono">{patient.curp}</TableCell>
                  <TableCell className="text-[12px] text-[#64748B]">{patient.lastVisit}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[#047E29] border-[#CDCC34] text-[10px] bg-white">
                      {patient.lastDiagnosis || 'Sin registro'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#047E29]" onClick={() => navigate(`/notes?patientId=${patient.id}`)}>
                        <FileText size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#64748B]" onClick={() => handleEdit(patient)}>
                        <Eye size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#FC0000]" onClick={() => handleDelete(patient.id, patient.name)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit/New Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#047E29]">
              {editingPatient?.name ? 'Editar Expediente' : 'Nuevo Expediente'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs font-bold uppercase text-[#64748B]">Nombre Completo</Label>
                <Input 
                  required
                  value={editingPatient?.name || ''} 
                  onChange={(e) => setEditingPatient(prev => prev ? {...prev, name: e.target.value} : null)}
                  className="border-[#E2E8F0] focus:ring-[#047E29]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-[#64748B]">Edad</Label>
                <Input 
                  type="number"
                  required
                  value={editingPatient?.age || ''} 
                  onChange={(e) => setEditingPatient(prev => prev ? {...prev, age: parseInt(e.target.value)} : null)}
                  className="border-[#E2E8F0]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-[#64748B]">Género</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#047E29]"
                  value={editingPatient?.gender || 'Masculino'}
                  onChange={(e) => setEditingPatient(prev => prev ? {...prev, gender: e.target.value} : null)}
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs font-bold uppercase text-[#64748B]">CURP</Label>
                <Input 
                  required
                  value={editingPatient?.curp || ''} 
                  onChange={(e) => setEditingPatient(prev => prev ? {...prev, curp: e.target.value.toUpperCase()} : null)}
                  className="border-[#E2E8F0] font-mono"
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-[#047E29] hover:bg-[#036621] text-white gap-2">
                <Save size={18} /> Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
