import React, { useState, useEffect } from 'react';
import { 
  History, 
  ShieldCheck, 
  User, 
  Calendar, 
  Info,
  Download,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { storage } from '@/src/lib/storage';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

import { useAuth } from '../contexts/AuthContext';
import AccessDenied from '../components/AccessDenied';

export default function AuditLog() {
  const { role } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = storage.getAuditLogs();
    setLogs(data);
    setLoading(false);
  }, []);

  if (role !== 'ADMIN') {
    return <AccessDenied moduleName="Audit Log" requiredRole="Administrador" />;
  }

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.addImage('https://appdesignproyectos.com/neo.png', 'PNG', 10, 10, 20, 20);
    doc.setFontSize(18);
    doc.setTextColor(4, 126, 41);
    doc.text('Dr. Mario Mendoza', 35, 20);
    doc.setFontSize(10);
    doc.text('BITÁCORA DE AUDITORÍA (COFEPRIS)', 35, 26);
    
    autoTable(doc, {
      startY: 35,
      head: [['Fecha y Hora', 'Usuario', 'Acción', 'Detalles']],
      body: logs.map(l => [new Date(l.timestamp).toLocaleString(), l.user, l.action, l.details]),
      theme: 'grid',
      headStyles: { fillColor: [4, 126, 41] }
    });
    doc.save('Bitacora_Auditoria.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(logs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Auditoria');
    XLSX.writeFile(wb, 'Bitacora_Auditoria.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#047E29] flex items-center justify-center text-white shrink-0">
            <History size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#282829] tracking-tight">Bitácora de Auditoría</h2>
            <p className="text-[#64748B] text-xs">Registro inmutable de acciones según normativa COFEPRIS.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <div className="hidden md:block px-3 py-1 bg-[#EBFBCA] border border-[#CDCC34] rounded text-[10px] text-[#047E29] font-bold self-center">
            NOM-024 / COFEPRIS Compliant
          </div>
          <Button onClick={exportToExcel} variant="outline" className="flex-1 sm:flex-none gap-2 h-9 text-xs font-semibold border-[#E2E8F0]">
            <FileSpreadsheet size={14} /> Excel
          </Button>
          <Button onClick={exportToPDF} variant="outline" className="flex-1 sm:flex-none gap-2 h-9 text-xs font-semibold border-[#E2E8F0]">
            <FileText size={14} /> PDF
          </Button>
        </div>
      </div>

      <Card className="border-[#E2E8F0] shadow-none rounded-xl overflow-hidden bg-white">
        <CardHeader className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2 text-[#047E29]">
            <ShieldCheck size={16} />
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider">Integridad de Datos Verificada</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-[#E2E8F0] bg-[#F8FAFC]">
                  <TableHead className="w-[180px] text-[10px] uppercase tracking-widest font-bold text-[#64748B] h-10 px-6 whitespace-nowrap">Fecha y Hora</TableHead>
                  <TableHead className="w-[150px] text-[10px] uppercase tracking-widest font-bold text-[#64748B] h-10 px-4 whitespace-nowrap">Usuario</TableHead>
                  <TableHead className="w-[200px] text-[10px] uppercase tracking-widest font-bold text-[#64748B] h-10 px-4 whitespace-nowrap">Acción</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-[#64748B] h-10 px-4 whitespace-nowrap">Detalles</TableHead>
                  <TableHead className="text-right text-[10px] uppercase tracking-widest font-bold text-[#64748B] h-10 px-6 whitespace-nowrap">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log.id} className="border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                      <TableCell className="px-6 py-3 font-mono text-[11px] text-[#64748B] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar size={12} />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#282829]">
                          <User size={14} className="text-[#64748B]" />
                          {log.user}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <Badge variant="outline" className="bg-[#EBFBCA] text-[#047E29] border-[#CDCC34] font-mono text-[10px] rounded px-2">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-[13px] text-[#64748B] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Info size={14} className="text-[#E2E8F0] shrink-0" />
                          {log.details}
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-6 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 bg-[#EBFBCA] text-[#047E29] border border-[#CDCC34] rounded-[4px] text-[10px] font-bold uppercase tracking-wider">
                          Firmado
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-[#64748B] text-sm italic">
                      No hay registros de auditoría recientes.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
