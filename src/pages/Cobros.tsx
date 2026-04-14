import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Plus,
  Search,
  Download,
  FileSpreadsheet,
  Printer,
  User,
  Calendar,
  DollarSign,
  Save,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Payment, storage } from '@/src/lib/storage';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';

export default function Cobros() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    patientName: '',
    amount: 0,
    method: 'Efectivo'
  });

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = () => {
    setPayments(storage.getPayments());
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(newPayment.amount) || 0;
    const iva = amount * 0.16;
    const total = amount + iva;
    
    const payment: Payment = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: 'manual',
      patientName: newPayment.patientName || 'Paciente General',
      amount,
      iva,
      total,
      date: new Date().toISOString().split('T')[0],
      method: newPayment.method || 'Efectivo',
      folio: `REC-${Date.now().toString().slice(-6)}`
    };

    storage.savePayment(payment);
    loadPayments();
    setIsModalOpen(false);
    setNewPayment({ patientName: '', amount: 0, method: 'Efectivo' });
    toast.success('Recibo generado correctamente');
  };

  const exportToPDF = (payment: Payment) => {
    const doc = new jsPDF();
    
    doc.addImage('https://appdesignproyectos.com/neo.png', 'PNG', 10, 10, 20, 20);
    doc.setFontSize(18);
    doc.setTextColor(4, 126, 41);
    doc.text('Dr. Mario Mendoza', 35, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 41);
    doc.text('RECIBO DE HONORARIOS MÉDICOS', 35, 26);
    doc.text(`Folio: ${payment.folio}`, 150, 20);
    doc.text(`Fecha: ${payment.date}`, 150, 26);
    
    doc.line(10, 35, 200, 35);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL PACIENTE', 10, 45);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Nombre: ${payment.patientName}`, 10, 52);
    
    autoTable(doc, {
      startY: 65,
      head: [['Concepto', 'Monto']],
      body: [
        ['Consulta Médica Especializada', `$${payment.amount.toFixed(2)}`],
        ['IVA (16%)', `$${payment.iva.toFixed(2)}`],
        ['TOTAL', `$${payment.total.toFixed(2)}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [4, 126, 41] },
      footStyles: { fillColor: [248, 250, 252], textColor: [40, 40, 41], fontStyle: 'bold' }
    });
    
    doc.text(`Método de Pago: ${payment.method}`, 10, (doc as any).lastAutoTable.finalY + 10);
    doc.save(`Recibo_${payment.folio}.pdf`);
  };

  const exportToExcel = () => {
    const data = payments.map(p => ({
      Folio: p.folio,
      Fecha: p.date,
      Paciente: p.patientName,
      Subtotal: p.amount,
      IVA: p.iva,
      Total: p.total,
      Metodo: p.method
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cobros');
    XLSX.writeFile(wb, 'Reporte_Cobros.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#282829]">Módulo de Cobros</h2>
          <p className="text-[#64748B] text-sm">Emisión de recibos y control de ingresos del consultorio.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportToExcel} variant="outline" className="gap-2 border-[#E2E8F0] hover:bg-[#F8FAFC]">
            <FileSpreadsheet size={18} /> Exportar Reporte
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="bg-[#047E29] hover:bg-[#036621] text-white gap-2 shadow-md">
            <Plus size={18} /> Nuevo Recibo
          </Button>
        </div>
      </div>

      <Card className="border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden bg-white">
        <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold">Historial de Pagos</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-[#64748B]" size={14} />
            <Input 
              placeholder="Buscar por folio o paciente..." 
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
                <TableHead className="text-[10px] uppercase font-bold text-[#64748B]">Folio</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-[#64748B]">Fecha</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-[#64748B]">Paciente</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-[#64748B]">Total</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-[#64748B]">Método</TableHead>
                <TableHead className="text-right text-[10px] uppercase font-bold text-[#64748B]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.filter(p => p.folio.toLowerCase().includes(searchQuery.toLowerCase()) || p.patientName.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                payments.filter(p => p.folio.toLowerCase().includes(searchQuery.toLowerCase()) || p.patientName.toLowerCase().includes(searchQuery.toLowerCase())).map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-[#F8FAFC]">
                    <TableCell className="text-[12px] font-bold text-[#047E29]">{payment.folio}</TableCell>
                    <TableCell className="text-[12px] text-[#64748B]">{payment.date}</TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-[#64748B]" />
                        <span className="font-bold text-[13px]">{payment.patientName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-[#282829]">
                      ${payment.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-[12px]">{payment.method}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#047E29]" onClick={() => exportToPDF(payment)}>
                          <Download size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#64748B]">
                          <Printer size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-[#64748B] text-sm italic">
                    No hay cobros registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Payment Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#047E29]">Nuevo Recibo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSavePayment} className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#64748B]">Nombre del Paciente</Label>
              <Input 
                required
                placeholder="Ej. Juan Pérez"
                value={newPayment.patientName} 
                onChange={(e) => setNewPayment(prev => ({...prev, patientName: e.target.value}))}
                className="border-[#E2E8F0]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#64748B]">Monto (Subtotal)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 text-[#64748B]" size={14} />
                <Input 
                  type="number"
                  required
                  placeholder="0.00"
                  className="pl-8 border-[#E2E8F0]"
                  value={newPayment.amount || ''}
                  onChange={(e) => setNewPayment(prev => ({...prev, amount: Number(e.target.value)}))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#64748B]">Método de Pago</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#047E29]"
                value={newPayment.method}
                onChange={(e) => setNewPayment(prev => ({...prev, method: e.target.value}))}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>
            <div className="p-3 bg-[#EBFBCA] rounded-lg space-y-1">
              <div className="flex justify-between text-xs text-[#64748B]">
                <span>IVA (16%):</span>
                <span>${((newPayment.amount || 0) * 0.16).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-bold text-[#047E29]">
                <span>Total:</span>
                <span>${((newPayment.amount || 0) * 1.16).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-[#047E29] hover:bg-[#036621] text-white gap-2">
                <Save size={18} /> Generar Recibo
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
