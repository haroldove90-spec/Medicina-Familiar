import React, { useState, useEffect } from 'react';
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
  Plus,
  Download,
  FileSpreadsheet,
  Mic,
  TrendingUp,
  User,
  History,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { VoiceDictation } from '@/src/components/VoiceDictation';
import { storage, Patient, MedicalNote as MedicalNoteType } from '@/src/lib/storage';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { cn } from '@/src/lib/utils';

const noteSchema = z.object({
  systolic: z.number().min(60).max(250),
  diastolic: z.number().min(40).max(150),
  temperature: z.number().min(34).max(43),
  heartRate: z.number().min(30).max(220),
  weight: z.number().min(1),
  height: z.number().min(1),
  satO2: z.number().min(50).max(100),
  subjective: z.string().min(1, "Debe incluir detalles subjetivos"),
  objective: z.string().min(1, "Debe incluir hallazgos objetivos"),
  analysis: z.string().min(1, "Debe incluir análisis clínico"),
  plan: z.string().min(1, "Debe incluir plan de tratamiento"),
  diagnosis: z.string().min(1, "El diagnóstico es obligatorio"),
});

type NoteFormValues = z.infer<typeof noteSchema>;

export default function MedicalNote() {
  const [isSaving, setIsSaving] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [patientNotes, setPatientNotes] = useState<MedicalNoteType[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      systolic: 120,
      diastolic: 80,
      temperature: 36.5,
      heartRate: 72,
      weight: 70,
      height: 170,
      satO2: 98,
      subjective: '',
      objective: '',
      analysis: '',
      plan: '',
      diagnosis: '',
    }
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pId = params.get('patientId');
    
    const data = storage.getPatients();
    setPatients(data);
    
    if (pId) {
      setSelectedPatientId(pId);
    } else if (data.length > 0) {
      setSelectedPatientId(data[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      const notes = storage.getNotes(selectedPatientId);
      setPatientNotes(notes);
    }
  }, [selectedPatientId]);

  const systolic = watch('systolic');
  const diastolic = watch('diastolic');
  const temperature = watch('temperature');
  const satO2 = watch('satO2');

  const isHighBP = systolic > 140 || diastolic > 90;
  const isHighTemp = temperature > 38.0;
  const isLowSat = satO2 < 90;

  const handleLoadNote = (note: MedicalNoteType) => {
    setEditingNoteId(note.id);
    reset({
      systolic: note.vitals.systolic,
      diastolic: note.vitals.diastolic,
      temperature: note.vitals.temperature,
      heartRate: note.vitals.heartRate,
      weight: note.vitals.weight,
      height: note.vitals.height,
      satO2: note.vitals.satO2,
      subjective: note.soap.subjective,
      objective: note.soap.objective,
      analysis: note.soap.analysis,
      plan: note.soap.plan,
      diagnosis: note.diagnosis,
    });
    toast.info(`Cargando nota folio: ${note.folio}`);
  };

  const onSubmit = async (data: NoteFormValues) => {
    if (!selectedPatientId) {
      toast.error('Seleccione un paciente');
      return;
    }
    setIsSaving(true);
    try {
      const note: MedicalNoteType = {
        id: editingNoteId || Math.random().toString(36).substr(2, 9),
        patientId: selectedPatientId,
        date: new Date().toISOString(),
        vitals: {
          heartRate: data.heartRate,
          temperature: data.temperature,
          systolic: data.systolic,
          diastolic: data.diastolic,
          weight: data.weight,
          height: data.height,
          satO2: data.satO2,
        },
        soap: {
          subjective: data.subjective,
          objective: data.objective,
          analysis: data.analysis,
          plan: data.plan,
        },
        diagnosis: data.diagnosis,
        folio: editingNoteId 
          ? patientNotes.find(n => n.id === editingNoteId)?.folio || ''
          : `FOL-${Date.now().toString().slice(-6)}`
      };
      
      storage.saveNote(note);
      toast.success(editingNoteId ? 'Nota médica actualizada' : 'Nota médica guardada');
      
      setEditingNoteId(null);
      
      // Refresh notes
      const updatedNotes = storage.getNotes(selectedPatientId);
      setPatientNotes(updatedNotes);
      
      // Reset form fields
      reset({
        ...data,
        subjective: '',
        objective: '',
        analysis: '',
        plan: '',
        diagnosis: '',
      });
    } catch (error) {
      toast.error('Error al guardar la nota');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTranscript = (text: string, category: 'subjective' | 'objective') => {
    const currentVal = watch(category);
    setValue(category, currentVal + ' ' + text);
  };

  const exportToPDF = () => {
    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) return;

    const data = watch();
    const doc = new jsPDF();
    
    // Header with Logo
    doc.addImage('https://appdesignproyectos.com/neo.png', 'PNG', 10, 10, 20, 20);
    
    doc.setFontSize(18);
    doc.setTextColor(4, 126, 41); // #047E29
    doc.text('Dr. Mario Mendoza', 35, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 41); // #282829
    doc.text('Médico Especialista | Cédula: 12345678', 35, 26);
    doc.text('Dirección: Av. Médica 123, Ciudad de México', 35, 31);
    
    doc.setDrawColor(205, 204, 52); // #CDCC34
    doc.line(10, 35, 200, 35);

    // Patient Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('NOTA MÉDICA (NOM-024-SSA3-2012)', 10, 45);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 45);

    autoTable(doc, {
      startY: 55,
      head: [['Paciente', 'Edad', 'Género', 'CURP']],
      body: [[patient.name, `${patient.age} años`, patient.gender, patient.curp]],
      theme: 'grid',
      headStyles: { fillColor: [4, 126, 41], textColor: [255, 255, 255] }
    });

    // Vitals
    doc.setFont('helvetica', 'bold');
    doc.text('Signos Vitales:', 10, (doc as any).lastAutoTable.finalY + 10);
    
    const vitalsData = [
      ['Tensión Arterial', `${data.systolic}/${data.diastolic} mmHg`],
      ['Frecuencia Cardíaca', `${data.heartRate} lpm`],
      ['Temperatura', `${data.temperature} °C`],
      ['Saturación O2', `${data.satO2} %`],
      ['Peso', `${data.weight} kg`],
      ['Estatura', `${data.height} cm`]
    ];

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 15,
      body: vitalsData,
      theme: 'plain',
      styles: { fontSize: 9 }
    });

    // SOAP
    const soapY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Subjetivo:', 10, soapY);
    doc.setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(data.subjective || 'N/A', 180), 10, soapY + 5);

    const objY = soapY + 25;
    doc.setFont('helvetica', 'bold');
    doc.text('Objetivo:', 10, objY);
    doc.setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(data.objective || 'N/A', 180), 10, objY + 5);

    const diagY = objY + 25;
    doc.setFont('helvetica', 'bold');
    doc.text('Diagnóstico:', 10, diagY);
    doc.setFont('helvetica', 'normal');
    doc.text(data.diagnosis || 'N/A', 10, diagY + 5);

    const planY = diagY + 15;
    doc.setFont('helvetica', 'bold');
    doc.text('Plan de Tratamiento:', 10, planY);
    doc.setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(data.plan || 'N/A', 180), 10, planY + 5);

    // Signature
    doc.line(70, 260, 140, 260);
    doc.text('Firma del Médico', 90, 265);
    doc.text('Dr. Mario Mendoza', 88, 270);

    doc.save(`Nota_${patient.name.replace(' ', '_')}.pdf`);
    toast.success('PDF generado con éxito');
  };

  const exportToExcel = () => {
    const data = patientNotes.map(n => ({
      ID: n.id,
      Fecha: new Date(n.date).toLocaleDateString(),
      Folio: n.folio,
      Paciente: patients.find(p => p.id === n.patientId)?.name,
      'Diagnóstico CIE-10': n.diagnosis,
      'Plan de Tratamiento': n.soap.plan,
      'TA Sistólica': n.vitals.systolic,
      'TA Diastólica': n.vitals.diastolic,
      Temperatura: n.vitals.temperature,
      'Sat O2': n.vitals.satO2
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Historial');
    XLSX.writeFile(wb, `Historial_Clinico_${selectedPatientId}.xlsx`);
    toast.success('Excel generado con éxito');
  };

  const chartData = [...patientNotes].reverse().slice(-5).map(n => ({
    date: new Date(n.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }),
    peso: n.vitals.weight,
    sistolica: n.vitals.systolic,
    diastolica: n.vitals.diastolic
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#047E29] flex items-center justify-center text-white shadow-lg">
            <Stethoscope size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#282829] tracking-tight">Expediente Clínico</h2>
            <p className="text-[#64748B] text-sm">Registro de consulta bajo normativa NOM-024.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <VoiceDictation onTranscript={handleTranscript} />
          <Button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSaving}
            className="bg-[#047E29] hover:bg-[#036621] text-white px-6 rounded-lg font-semibold text-sm shadow-md"
          >
            {isSaving ? 'Guardando...' : 'Guardar Nota'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Vitals & Trends */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-[#E2E8F0] shadow-none rounded-xl overflow-hidden">
            <CardHeader className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <User size={16} className="text-[#047E29]" />
                Paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <select 
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-sm focus:ring-2 focus:ring-[#047E29] outline-none"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.age} años)</option>
                ))}
              </select>
            </CardContent>
          </Card>

          <Card className="border-[#E2E8F0] shadow-none rounded-xl overflow-hidden">
            <CardHeader className="p-4 border-b border-[#E2E8F0] bg-[#EBFBCA]">
              <CardTitle className="text-sm font-bold text-[#047E29] flex items-center gap-2">
                <Activity size={16} />
                Signos Vitales
              </CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="space-y-1">
                <Label className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">Presión (Sist)</Label>
                <Input 
                  type="number" 
                  {...register('systolic', { valueAsNumber: true })}
                  className={cn(
                    "h-9 text-xs border-[#E2E8F0] rounded-md",
                    isHighBP && "border-[#FC0000] bg-[#FEF2F2] text-[#FC0000] font-bold"
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">Presión (Diast)</Label>
                <Input 
                  type="number" 
                  {...register('diastolic', { valueAsNumber: true })}
                  className={cn(
                    "h-9 text-xs border-[#E2E8F0] rounded-md",
                    isHighBP && "border-[#FC0000] bg-[#FEF2F2] text-[#FC0000] font-bold"
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">Temp (°C)</Label>
                <Input 
                  type="number" 
                  step="0.1" 
                  {...register('temperature', { valueAsNumber: true })}
                  className={cn(
                    "h-9 text-xs border-[#E2E8F0] rounded-md",
                    isHighTemp && "border-[#FC0000] bg-[#FEF2F2] text-[#FC0000] font-bold"
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">Sat O2 (%)</Label>
                <Input 
                  type="number" 
                  {...register('satO2', { valueAsNumber: true })}
                  className={cn(
                    "h-9 text-xs border-[#E2E8F0] rounded-md",
                    isLowSat && "border-[#FC0000] bg-[#FEF2F2] text-[#FC0000] font-bold"
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">Peso (kg)</Label>
                <Input 
                  type="number" 
                  step="0.1" 
                  {...register('weight', { valueAsNumber: true })}
                  className="h-9 text-xs border-[#E2E8F0] rounded-md"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">Talla (cm)</Label>
                <Input 
                  type="number" 
                  {...register('height', { valueAsNumber: true })}
                  className="h-9 text-xs border-[#E2E8F0] rounded-md"
                />
              </div>
            </div>
            {(isHighBP || isHighTemp || isLowSat) && (
              <div className="px-4 pb-4">
                <div className="p-3 bg-red-50 border border-[#FC0000]/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="text-[#FC0000] shrink-0" size={16} />
                  <div className="text-[11px] text-[#FC0000] font-bold leading-tight">
                    {isHighBP && <p>• Alerta: Tensión Arterial Elevada.</p>}
                    {isHighTemp && <p>• Alerta: Temperatura fuera de rango (Fiebre).</p>}
                    {isLowSat && <p>• Alerta: Saturación de Oxígeno Crítica.</p>}
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="border-[#E2E8F0] shadow-none rounded-xl overflow-hidden">
            <CardHeader className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <TrendingUp size={16} className="text-[#047E29]" />
                Tendencias
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 h-[200px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                    <Line type="monotone" dataKey="sistolica" stroke="#047E29" strokeWidth={2} dot={{ r: 4 }} name="Sistólica" />
                    <Line type="monotone" dataKey="peso" stroke="#CDCC34" strokeWidth={2} dot={{ r: 4 }} name="Peso" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-[#64748B] text-xs italic">
                  Sin datos históricos suficientes
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: SOAP & History */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[#E2E8F0] shadow-none rounded-xl overflow-hidden flex flex-col">
            <CardHeader className="p-4 border-b border-[#E2E8F0] flex justify-between items-center bg-white">
              <CardTitle className="text-sm font-bold">Nota Médica (SOAP)</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 text-[10px] gap-1 border-[#E2E8F0]" onClick={exportToPDF}>
                  <Download size={12} /> PDF
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-[10px] gap-1 border-[#E2E8F0]" onClick={exportToExcel}>
                  <FileSpreadsheet size={12} /> Excel
                </Button>
              </div>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">Subjetivo (S)</Label>
                <textarea 
                  {...register('subjective')}
                  className="flex min-h-[120px] w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#282829] outline-none focus:ring-2 focus:ring-[#047E29] transition-all resize-none"
                  placeholder="Síntomas referidos..."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">Objetivo (O)</Label>
                <textarea 
                  {...register('objective')}
                  className="flex min-h-[120px] w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#282829] outline-none focus:ring-2 focus:ring-[#047E29] transition-all resize-none"
                  placeholder="Exploración física..."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">Análisis (A)</Label>
                <textarea 
                  {...register('analysis')}
                  className="flex min-h-[100px] w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#282829] outline-none focus:ring-2 focus:ring-[#047E29] transition-all resize-none"
                  placeholder="Impresión diagnóstica..."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">Plan (P)</Label>
                <textarea 
                  {...register('plan')}
                  className="flex min-h-[100px] w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#282829] outline-none focus:ring-2 focus:ring-[#047E29] transition-all resize-none"
                  placeholder="Tratamiento..."
                />
              </div>
            </div>

            <div className="p-4 bg-[#EBFBCA] border-t border-[#E2E8F0] flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full space-y-1">
                <Label className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">Diagnóstico CIE-10</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-[#64748B]" size={14} />
                  <Input 
                    {...register('diagnosis')}
                    placeholder="Buscar diagnóstico..." 
                    className="pl-9 h-10 text-[13px] bg-white border-[#E2E8F0] rounded-lg focus:ring-[#047E29]"
                  />
                </div>
              </div>
              <Button 
                onClick={handleSubmit(onSubmit)}
                disabled={isSaving}
                className="bg-[#047E29] hover:bg-[#036621] text-white h-10 px-8 rounded-lg font-bold text-sm shadow-md w-full sm:w-auto"
              >
                {isSaving ? 'Guardando...' : 'Guardar Nota'}
              </Button>
            </div>
          </Card>

          <Card className="border-[#E2E8F0] shadow-none rounded-xl overflow-hidden">
            <CardHeader className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <History size={16} className="text-[#047E29]" />
                Historial de Consultas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[300px] overflow-y-auto">
                {patientNotes.length > 0 ? (
                  patientNotes.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => handleLoadNote(n)}
                      className={cn(
                        "p-4 border-b border-[#E2E8F0] last:border-none hover:bg-[#EBFBCA] transition-colors cursor-pointer",
                        editingNoteId === n.id && "bg-[#EBFBCA] border-l-4 border-l-[#047E29]"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs font-bold text-[#282829]">{new Date(n.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          <p className="text-[10px] text-[#64748B] uppercase font-bold">Folio: {n.folio}</p>
                        </div>
                        <Badge variant="outline" className="bg-white text-[#047E29] border-[#CDCC34] text-[10px] font-bold">
                          {n.diagnosis}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">{n.soap.plan}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-[#64748B] text-sm italic">
                    No hay consultas previas registradas.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
