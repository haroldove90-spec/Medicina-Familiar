import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus,
  Search,
  DollarSign,
  Calendar,
  User,
  MoreVertical,
  FileSpreadsheet,
  FileText,
  Save,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Charge, storage, Patient } from '@/src/lib/storage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

import { useAuth } from '../contexts/AuthContext';
import AccessDenied from '../components/AccessDenied';

export default function Cargos() {
  const { role } = useAuth();
  const [charges, setCharges] = useState<Charge[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCharge, setNewCharge] = useState<Partial<Charge>>({
    patientId: '',
    patientName: '',
    service: '',
    amount: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setCharges(storage.getCharges());
    setPatients(storage.getPatients());
  };

  if (role !== 'ADMIN' && role !== 'RECEPCION') {
    return <AccessDenied moduleName="Cargos" requiredRole="Recepción / Administrador" />;
  }

  const handleSaveCharge = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === newCharge.patientId);
    
    const charge: Charge = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: newCharge.patientId || 'manual',
      patientName: patient?.name || newCharge.patientName || 'Paciente General',
      service: newCharge.service || 'Servicio Médico',
      amount: Number(newCharge.amount) || 0,
      date: new Date().toLocaleDateString()
    };

    storage.saveCharge(charge);
    loadData();
    setIsModalOpen(false);
    setNewCharge({ patientId: '', patientName: '', service: '', amount: 0 });
    toast.success('Cargo registrado correctamente');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.addImage('https://appdesignproyectos.com/neo.png', 'PNG', 10, 10, 20, 20);
    doc.setFontSize(18);
    doc.setTextColor(4, 126, 41);
    doc.text('Dr. Mario Mendoza', 35, 20);
    doc.setFontSize(10);
    doc.text('REPORTE DE CARGOS', 35, 26);
    
    autoTable(doc, {
      startY: 35,
      head: [['Fecha', 'Paciente', 'Servicio', 'Monto']],
      body: charges.map(c => [c.date, c.patientName, c.service, `$${c.amount.toFixed(2)}`]),
      theme: 'grid',
      headStyles: { fillColor: [4, 126, 41] }
    });
    doc.save('Reporte_Cargos.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(charges);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cargos');
    XLSX.writeFile(wb, 'Reporte_Cargos.xlsx');
  };

  const filteredCharges = charges.filter(c => 
    c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#282829]">Registro de Cargos</h2>
          <p className="text-[#64748B] text-sm">Control de servicios prestados y honorarios médicos.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button onClick={exportToExcel} variant="outline" className="flex-1 sm:flex-none gap-2 border-[#E2E8F0] h-9 text-xs">
            <FileSpreadsheet size={16} /> Excel
          </Button>
          <Button onClick={exportToPDF} variant="outline" className="flex-1 sm:flex-none gap-2 border-[#E2E8F0] h-9 text-xs">
            <FileText size={16} /> PDF
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="flex-1 sm:flex-none bg-[#047E29] hover:bg-[#036621] text-white gap-2 shadow-md h-9 text-xs">
            <Plus size={16} /> Nuevo Cargo
          </Button>
        </div>
      </div>

      <Card className="border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden bg-white">
        <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <CardTitle className="text-sm font-bold">Historial de Cargos</CardTitle>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 text-[#64748B]" size={14} />
            <Input 
              placeholder="Buscar por paciente..." 
              className="pl-9 h-9 text-xs border-[#E2E8F0] w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F8FAFC]">
                  <TableHead className="text-[10px] uppercase font-bold text-[#64748B] whitespace-nowrap">Fecha</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-[#64748B] whitespace-nowrap">Paciente</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-[#64748B] whitespace-nowrap">Servicio / Concepto</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-[#64748B] whitespace-nowrap">Monto</TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-bold text-[#64748B] whitespace-nowrap">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCharges.length > 0 ? (
                  filteredCharges.map((charge) => (
                    <TableRow key={charge.id} className="hover:bg-[#F8FAFC]">
                      <TableCell className="text-[12px] font-medium text-[#64748B] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar size={12} /> {charge.date}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-[#047E29]" />
                          <span className="font-bold text-[13px]">{charge.patientName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[13px] text-[#282829] whitespace-nowrap">{charge.service}</TableCell>
                      <TableCell className="font-bold text-[#047E29] whitespace-nowrap">
                        ${charge.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-[#64748B] text-sm italic">
                      No hay cargos registrados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New Charge Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#047E29]">Registrar Nuevo Cargo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveCharge} className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#64748B]">Paciente</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#047E29]"
                value={newCharge.patientId}
                onChange={(e) => setNewCharge(prev => ({...prev, patientId: e.target.value}))}
                required
              >
                <option value="">Seleccionar Paciente</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#64748B]">Servicio / Concepto</Label>
              <Input 
                required
                placeholder="Ej. Consulta Médica, Análisis..."
                value={newCharge.service}
                onChange={(e) => setNewCharge(prev => ({...prev, service: e.target.value}))}
                className="border-[#E2E8F0]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#64748B]">Monto</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 text-[#64748B]" size={14} />
                <Input 
                  type="number"
                  required
                  placeholder="0.00"
                  className="pl-8 border-[#E2E8F0]"
                  value={newCharge.amount || ''}
                  onChange={(e) => setNewCharge(prev => ({...prev, amount: Number(e.target.value)}))}
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-[#047E29] hover:bg-[#036621] text-white gap-2">
                <Save size={18} /> Registrar Cargo
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
