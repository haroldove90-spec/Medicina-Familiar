export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  curp: string;
  lastVisit: string;
  lastDiagnosis?: string;
  email?: string;
  phone?: string;
}

export interface MedicalNote {
  id: string;
  patientId: string;
  date: string;
  vitals: {
    heartRate: number;
    temperature: number;
    systolic: number;
    diastolic: number;
    weight: number;
    height: number;
    satO2: number;
  };
  soap: {
    subjective: string;
    objective: string;
    analysis: string;
    plan: string;
  };
  diagnosis: string;
  folio: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: 'Confirmada' | 'En espera' | 'Pendiente' | 'Cancelada';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  cedula: string;
  phone: string;
  email: string;
}

export interface LibraryFile {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  url: string;
}

export interface Charge {
  id: string;
  patientId: string;
  patientName: string;
  service: string;
  amount: number;
  date: string;
}

export interface Payment {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  iva: number;
  total: number;
  date: string;
  method: string;
  folio: string;
}

const MOCK_PATIENTS: Patient[] = [
  { id: '1', name: 'Juan Pérez', age: 45, gender: 'Masculino', curp: 'PERJ790101HDFRRN01', lastVisit: '2024-03-10', lastDiagnosis: 'Hipertensión Arterial', email: 'juan.perez@email.com', phone: '555-0101' },
  { id: '2', name: 'María López', age: 32, gender: 'Femenino', curp: 'LOPM920505MDFRRN02', lastVisit: '2024-03-12', lastDiagnosis: 'Rinofaringitis', email: 'maria.lopez@email.com', phone: '555-0202' },
  { id: '3', name: 'Carlos García', age: 58, gender: 'Masculino', curp: 'GARC660808HDFRRN03', lastVisit: '2024-03-14', lastDiagnosis: 'Diabetes Mellitus Tipo 2', email: 'carlos.garcia@email.com', phone: '555-0303' },
];

const MOCK_DOCTORS: Doctor[] = [
  { id: '1', name: 'Dr. Mario Mendoza', specialty: 'Medicina General', cedula: '12345678', phone: '555-123-4567', email: 'mario@mendoza.com' },
  { id: '2', name: 'Lic. Ana Sosa', specialty: 'Asistente Médico', cedula: 'N/A', phone: '555-987-6543', email: 'ana@mendoza.com' },
];

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', patientId: '1', patientName: 'Juan Pérez', date: new Date().toISOString().split('T')[0], time: '09:00', type: 'Consulta', status: 'Confirmada' },
  { id: '2', patientId: '2', patientName: 'María López', date: new Date().toISOString().split('T')[0], time: '10:30', type: 'Seguimiento', status: 'Pendiente' },
  { id: '3', patientId: '3', patientName: 'Carlos García', date: new Date().toISOString().split('T')[0], time: '12:00', type: 'Resultados', status: 'En espera' },
  { id: '4', patientId: '1', patientName: 'Juan Pérez', date: new Date().toISOString().split('T')[0], time: '16:00', type: 'Urgencia', status: 'Pendiente' },
];

const MOCK_PAYMENTS: Payment[] = [
  { id: '1', patientId: '1', patientName: 'Juan Pérez', amount: 800, iva: 128, total: 928, date: new Date().toISOString().split('T')[0], method: 'Efectivo', folio: 'REC-001' },
  { id: '2', patientId: '2', patientName: 'María López', amount: 1200, iva: 192, total: 1392, date: new Date().toISOString().split('T')[0], method: 'Tarjeta', folio: 'REC-002' },
  { id: '3', patientId: '3', patientName: 'Carlos García', amount: 800, iva: 128, total: 928, date: new Date().toISOString().split('T')[0], method: 'Transferencia', folio: 'REC-003' },
  { id: '4', patientId: '1', patientName: 'Juan Pérez', amount: 1500, iva: 240, total: 1740, date: new Date().toISOString().split('T')[0], method: 'Efectivo', folio: 'REC-004' },
  { id: '5', patientId: '2', patientName: 'María López', amount: 800, iva: 128, total: 928, date: new Date().toISOString().split('T')[0], method: 'Tarjeta', folio: 'REC-005' },
];

export type UserRole = 'ADMIN' | 'MEDICO' | 'RECEPCION' | 'PACIENTE';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Dr. Mario Mendoza', role: 'ADMIN', email: 'mario@mendoza.com' },
  { id: 'u2', name: 'Dr. Sergio Ramos', role: 'MEDICO', email: 'sergio@mendoza.com' },
  { id: 'u3', name: 'Lic. Ana Sosa', role: 'RECEPCION', email: 'ana@mendoza.com' },
  { id: 'u4', name: 'Juan Pérez', role: 'PACIENTE', email: 'juan.perez@email.com' },
];

export const storage = {
  getUsers: (): User[] => {
    const stored = localStorage.getItem('users');
    if (!stored) {
      localStorage.setItem('users', JSON.stringify(MOCK_USERS));
      return MOCK_USERS;
    }
    return JSON.parse(stored);
  },
  
  getPatients: (): Patient[] => {
    const stored = localStorage.getItem('patients');
    if (!stored) {
      localStorage.setItem('patients', JSON.stringify(MOCK_PATIENTS));
      return MOCK_PATIENTS;
    }
    return JSON.parse(stored);
  },
  
  savePatient: (patient: Patient) => {
    const patients = storage.getPatients();
    const index = patients.findIndex(p => p.id === patient.id);
    if (index >= 0) {
      patients[index] = patient;
    } else {
      patients.push(patient);
    }
    localStorage.setItem('patients', JSON.stringify(patients));
  },

  deletePatient: (id: string) => {
    const patients = storage.getPatients().filter(p => p.id !== id);
    localStorage.setItem('patients', JSON.stringify(patients));
    // Also delete their notes
    const notes = storage.getNotes().filter(n => n.patientId !== id);
    localStorage.setItem('notes', JSON.stringify(notes));
  },

  getNotes: (patientId?: string): MedicalNote[] => {
    const stored = localStorage.getItem('notes');
    const notes: MedicalNote[] = stored ? JSON.parse(stored) : [];
    if (patientId) {
      return notes.filter(n => n.patientId === patientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  saveNote: (note: MedicalNote) => {
    const notes = storage.getNotes();
    const index = notes.findIndex(n => n.id === note.id);
    if (index >= 0) {
      notes[index] = note;
    } else {
      notes.push(note);
    }
    localStorage.setItem('notes', JSON.stringify(notes));
    
    // Update patient's last visit and diagnosis
    const patients = storage.getPatients();
    const pIndex = patients.findIndex(p => p.id === note.patientId);
    if (pIndex >= 0) {
      patients[pIndex].lastVisit = note.date.split('T')[0];
      patients[pIndex].lastDiagnosis = note.diagnosis;
      localStorage.setItem('patients', JSON.stringify(patients));
    }

    // Add to audit log
    storage.addAuditLog({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      user: 'Dr. Mario Mendoza',
      action: index >= 0 ? 'UPDATE_NOTE' : 'CREATE_NOTE',
      details: `${index >= 0 ? 'Actualización' : 'Creación'} de nota médica para paciente ID: ${note.patientId}, Folio: ${note.folio}`
    });
  },

  deleteNote: (id: string) => {
    const notes = storage.getNotes().filter(n => n.id !== id);
    localStorage.setItem('notes', JSON.stringify(notes));
  },

  // Agenda
  getAppointments: (): Appointment[] => {
    const stored = localStorage.getItem('appointments');
    if (!stored) {
      localStorage.setItem('appointments', JSON.stringify(MOCK_APPOINTMENTS));
      return MOCK_APPOINTMENTS;
    }
    return JSON.parse(stored);
  },

  saveAppointment: (apt: Appointment) => {
    const apts = storage.getAppointments();
    const index = apts.findIndex(a => a.id === apt.id);
    if (index >= 0) apts[index] = apt;
    else apts.push(apt);
    localStorage.setItem('appointments', JSON.stringify(apts));
  },

  // Doctors
  getDoctors: (): Doctor[] => {
    const stored = localStorage.getItem('doctors');
    if (!stored) {
      localStorage.setItem('doctors', JSON.stringify(MOCK_DOCTORS));
      return MOCK_DOCTORS;
    }
    return JSON.parse(stored);
  },

  // Library
  getLibraryFiles: (): LibraryFile[] => {
    const stored = localStorage.getItem('library');
    return stored ? JSON.parse(stored) : [];
  },

  saveLibraryFile: (file: LibraryFile) => {
    const files = storage.getLibraryFiles();
    files.push(file);
    localStorage.setItem('library', JSON.stringify(files));
  },

  // Charges & Payments
  getCharges: (): Charge[] => {
    const stored = localStorage.getItem('charges');
    return stored ? JSON.parse(stored) : [];
  },

  saveCharge: (charge: Charge) => {
    const charges = storage.getCharges();
    charges.push(charge);
    localStorage.setItem('charges', JSON.stringify(charges));
  },

  getPayments: (): Payment[] => {
    const stored = localStorage.getItem('payments');
    if (!stored) {
      localStorage.setItem('payments', JSON.stringify(MOCK_PAYMENTS));
      return MOCK_PAYMENTS;
    }
    return JSON.parse(stored);
  },

  savePayment: (payment: Payment) => {
    const payments = storage.getPayments();
    payments.push(payment);
    localStorage.setItem('payments', JSON.stringify(payments));
  },

  addAuditLog: (log: any) => {
    const stored = localStorage.getItem('audit_logs');
    const logs = stored ? JSON.parse(stored) : [];
    logs.unshift(log);
    localStorage.setItem('audit_logs', JSON.stringify(logs));
  },

  getAuditLogs: () => {
    const stored = localStorage.getItem('audit_logs');
    return stored ? JSON.parse(stored) : [];
  }
};
