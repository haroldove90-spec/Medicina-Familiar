import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus,
  Search,
  DollarSign,
  Calendar,
  User,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Charge, storage } from '@/src/lib/storage';

export default function Cargos() {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setCharges(storage.getCharges());
  }, []);

  const handleAddCharge = () => {
    const newCharge: Charge = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: '1',
      patientName: 'Juan Pérez',
      service: 'Consulta Médica General',
      amount: 800,
      date: new Date().toLocaleDateString()
    };
    storage.saveCharge(newCharge);
    setCharges(storage.getCharges());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#282829]">Registro de Cargos</h2>
          <p className="text-[#64748B] text-sm">Control de servicios prestados y honorarios médicos.</p>
        </div>
        <Button onClick={handleAddCharge} className="bg-[#047E29] hover:bg-[#036621] gap-2">
          <Plus size={18} /> Nuevo Cargo
        </Button>
      </div>

      <Card className="border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden bg-white">
        <CardHeader className="p-4 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold">Historial de Cargos</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-[#64748B]" size={14} />
            <Input 
              placeholder="Buscar por paciente..." 
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
                <TableHead className="text-[10px] uppercase font-bold text-[#64748B]">Fecha</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-[#64748B]">Paciente</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-[#64748B]">Servicio / Concepto</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-[#64748B]">Monto</TableHead>
                <TableHead className="text-right text-[10px] uppercase font-bold text-[#64748B]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {charges.length > 0 ? (
                charges.map((charge) => (
                  <TableRow key={charge.id} className="hover:bg-[#F8FAFC]">
                    <TableCell className="text-[12px] font-medium text-[#64748B]">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} /> {charge.date}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-[#047E29]" />
                        <span className="font-bold text-[13px]">{charge.patientName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px] text-[#282829]">{charge.service}</TableCell>
                    <TableCell className="font-bold text-[#047E29]">
                      ${charge.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right">
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
        </CardContent>
      </Card>
    </div>
  );
}
