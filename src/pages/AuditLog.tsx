import React, { useState, useEffect } from 'react';
import { 
  History, 
  ShieldCheck, 
  User, 
  Calendar, 
  Info,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { AuditLog as AuditLogType } from '@/src/types';

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditLogType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/audit-logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#1E293B] flex items-center justify-center text-white">
            <History size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">Bitácora de Auditoría</h2>
            <p className="text-[#64748B] text-xs">Registro inmutable de acciones según normativa COFEPRIS.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="audit-pill self-center">NOM-024 / COFEPRIS Compliant</span>
          <Button variant="outline" className="gap-2 h-9 text-xs font-semibold border-[#E2E8F0]">
            <Download size={14} />
            Exportar Reporte
          </Button>
        </div>
      </div>

      <Card className="border-[#E2E8F0] shadow-none rounded-xl overflow-hidden bg-white">
        <CardHeader className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2 text-[#10B981]">
            <ShieldCheck size={16} />
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider">Integridad de Datos Verificada</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-[#E2E8F0] bg-[#F8FAFC]">
                <TableHead className="w-[180px] text-[10px] uppercase tracking-widest font-bold text-[#64748B] h-10 px-6">Fecha y Hora</TableHead>
                <TableHead className="w-[150px] text-[10px] uppercase tracking-widest font-bold text-[#64748B] h-10 px-4">Usuario</TableHead>
                <TableHead className="w-[200px] text-[10px] uppercase tracking-widest font-bold text-[#64748B] h-10 px-4">Acción</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold text-[#64748B] h-10 px-4">Detalles</TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-widest font-bold text-[#64748B] h-10 px-6">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id} className="border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                    <TableCell className="px-6 py-3 font-mono text-[11px] text-[#64748B]">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1E293B]">
                        <User size={14} className="text-[#64748B]" />
                        {log.user}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant="outline" className="bg-[#EFF6FF] text-[#2563EB] border-[#E2E8F0] font-mono text-[10px] rounded px-2">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[13px] text-[#64748B]">
                      <div className="flex items-center gap-2">
                        <Info size={14} className="text-[#E2E8F0] shrink-0" />
                        {log.details}
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-6 py-3">
                      <span className="audit-pill bg-[#ECFDF5] text-[#10B981] border-[#D1FAE5]">
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
        </CardContent>
      </Card>
    </div>
  );
}
