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

const MOCK_PATIENTS: Patient[] = [
  { id: '1', name: 'Juan Pérez', age: 45, gender: 'Masculino', curp: 'PERJ790101HDFRRN01', lastVisit: '2024-03-10', lastDiagnosis: 'Hipertensión Arterial' },
  { id: '2', name: 'María García', age: 32, gender: 'Femenino', curp: 'GARM920505MDFRRN02', lastVisit: '2024-03-12', lastDiagnosis: 'Rinofaringitis' },
  { id: '3', name: 'Carlos López', age: 58, gender: 'Masculino', curp: 'LOCC660808HDFRRN03', lastVisit: '2024-03-14', lastDiagnosis: 'Diabetes Mellitus Tipo 2' },
  { id: '4', name: 'Ana Martínez', age: 29, gender: 'Femenino', curp: 'MARA950101MDFRRN04', lastVisit: '2024-03-15', lastDiagnosis: 'Gastritis Crónica' },
];

export const storage = {
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
