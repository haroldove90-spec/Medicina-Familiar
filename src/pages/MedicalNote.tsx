import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Badge } from '@/src/components/ui/badge';
import { 
  Save, 
  AlertTriangle, 
  Search, 
  Activity, 
  FileText, 
  ClipboardList,
  Stethoscope,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { toast } from 'sonner';
import { motion } from 'motion/react';

const noteSchema = z.object({
  systolic: z.number().min(60).max(250),
  diastolic: z.number().min(40).max(150),
  temperature: z.number().min(34).max(43),
  heartRate: z.number().min(30).max(220),
  respiratoryRate: z.number().min(8).max(60),
  weight: z.number().min(1),
  height: z.number().min(1),
  subjective: z.string().min(10, "Debe incluir detalles subjetivos"),
  objective: z.string().min(10, "Debe incluir hallazgos objetivos"),
  analysis: z.string().min(10, "Debe incluir análisis clínico"),
  plan: z.string().min(10, "Debe incluir plan de tratamiento"),
  diagnosis: z.string().min(3, "Seleccione un diagnóstico CIE-10"),
});

type NoteFormValues = z.infer<typeof noteSchema>;

export default function MedicalNote() {
  const [isSaving, setIsSaving] = useState(false);
  const [diagnosisQuery, setDiagnosisQuery] = useState('');
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      systolic: 120,
      diastolic: 80,
      temperature: 36.5,
      heartRate: 72,
      respiratoryRate: 16,
      weight: 70,
      height: 170,
    }
  });

  const systolic = watch('systolic');
  const diastolic = watch('diastolic');
  const isHighBP = systolic > 140 || diastolic > 90;

  const onSubmit = async (data: NoteFormValues) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, patientId: '1' }),
      });
      if (response.ok) {
        toast.success('Nota médica guardada y firmada electrónicamente');
      }
    } catch (error) {
      toast.error('Error al guardar la nota');
    } finally {
      setIsSaving(false);
    }
  };

  // Simulated CIE-10 Search
  const cie10Results = [
    { code: 'J00', name: 'Rinofaringitis aguda [resfriado común]' },
    { code: 'I10', name: 'Hipertensión esencial (primaria)' },
    { code: 'E11', name: 'Diabetes mellitus no insulinodependiente' },
    { code: 'K21', name: 'Enfermedad por reflujo gastroesofágico' },
  ].filter(d => d.name.toLowerCase().includes(diagnosisQuery.toLowerCase()) || d.code.toLowerCase().includes(diagnosisQuery.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">Nota Médica Activa</h2>
            <p className="text-[#64748B] text-xs">Expediente: <span className="font-semibold">#EXP-2024-001</span> • Juan Pérez</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="audit-pill self-center">Folio: 2023-0892</span>
          <Button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSaving}
            className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 rounded-lg font-semibold text-sm"
          >
            {isSaving ? 'Guardando...' : 'Guardar Nota'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Left Column: Vitals */}
        <Card className="border-[#E2E8F0] shadow-none rounded-xl overflow-hidden h-fit">
          <CardHeader className="p-4 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-bold">Signos Vitales</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-4 p-4">
            <div className="space-y-1">
              <Label className="text-[11px] text-[#64748B] font-medium">Frec. Cardiaca (LPM)</Label>
              <Input 
                type="number" 
                {...register('heartRate', { valueAsNumber: true })}
                className="h-9 text-xs border-[#E2E8F0] rounded-md"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-[#64748B] font-medium">Temp (°C)</Label>
              <Input 
                type="number" 
                step="0.1" 
                {...register('temperature', { valueAsNumber: true })}
                className="h-9 text-xs border-[#E2E8F0] rounded-md"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-[#64748B] font-medium">Presión Art. (Sist)</Label>
              <Input 
                type="number" 
                {...register('systolic', { valueAsNumber: true })}
                className={cn(
                  "h-9 text-xs border-[#E2E8F0] rounded-md",
                  isHighBP && "border-[#EF4444] bg-[#FEF2F2] text-[#EF4444]"
                )}
              />
              {isHighBP && <p className="text-[10px] text-[#EF4444] font-bold mt-1">Alerta: Alta</p>}
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-[#64748B] font-medium">Presión Art. (Diast)</Label>
              <Input 
                type="number" 
                {...register('diastolic', { valueAsNumber: true })}
                className={cn(
                  "h-9 text-xs border-[#E2E8F0] rounded-md",
                  isHighBP && "border-[#EF4444] bg-[#FEF2F2] text-[#EF4444]"
                )}
              />
            </div>
          </div>
          <div className="p-4 pt-0 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[11px] text-[#64748B] font-medium">Peso (kg)</Label>
              <Input 
                type="number" 
                step="0.1" 
                {...register('weight', { valueAsNumber: true })}
                className="h-9 text-xs border-[#E2E8F0] rounded-md"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-[#64748B] font-medium">Talla (cm)</Label>
              <Input 
                type="number" 
                {...register('height', { valueAsNumber: true })}
                className="h-9 text-xs border-[#E2E8F0] rounded-md"
              />
            </div>
          </div>
        </Card>

        {/* Right Column: SOAP & Diagnosis */}
        <Card className="border-[#E2E8F0] shadow-none rounded-xl overflow-hidden flex flex-col">
          <CardHeader className="p-4 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-bold">Nota Médica (SOAP)</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-4 p-4 flex-1">
            <div className="flex flex-col gap-1">
              <Label className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider">Subjetivo (S)</Label>
              <textarea 
                {...register('subjective')}
                className="flex-1 min-h-[120px] p-3 border border-[#E2E8F0] rounded-md text-[13px] text-[#1E293B] outline-none focus:border-[#2563EB] transition-colors resize-none"
                placeholder="Paciente refiere..."
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider">Objetivo (O)</Label>
              <textarea 
                {...register('objective')}
                className="flex-1 min-h-[120px] p-3 border border-[#E2E8F0] rounded-md text-[13px] text-[#1E293B] outline-none focus:border-[#2563EB] transition-colors resize-none"
                placeholder="Exploración física..."
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider">Análisis (A)</Label>
              <textarea 
                {...register('analysis')}
                className="flex-1 min-h-[120px] p-3 border border-[#E2E8F0] rounded-md text-[13px] text-[#1E293B] outline-none focus:border-[#2563EB] transition-colors resize-none"
                placeholder="Impresión diagnóstica..."
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider">Plan (P)</Label>
              <textarea 
                {...register('plan')}
                className="flex-1 min-h-[120px] p-3 border border-[#E2E8F0] rounded-md text-[13px] text-[#1E293B] outline-none focus:border-[#2563EB] transition-colors resize-none"
                placeholder="Tratamiento..."
              />
            </div>
          </div>

          <div className="p-4 bg-[#EFF6FF] border-t border-[#E2E8F0] flex gap-4 items-end">
            <div className="flex-1 space-y-1">
              <Label className="text-[11px] text-[#64748B] font-medium">Diagnóstico (CIE-10)</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-[#64748B]" size={14} />
                <Input 
                  placeholder="Buscar diagnóstico..." 
                  className="pl-9 h-9 text-[13px] bg-white border-[#E2E8F0]"
                  value={diagnosisQuery}
                  onChange={(e) => setDiagnosisQuery(e.target.value)}
                />
              </div>
            </div>
            <Button 
              onClick={handleSubmit(onSubmit)}
              className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white h-9 px-6 rounded-lg font-semibold text-sm"
            >
              Guardar Nota
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
