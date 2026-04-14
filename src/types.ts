export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  lastVisit: string;
}

export interface VitalSigns {
  systolic: number;
  diastolic: number;
  temperature: number;
  heartRate: number;
  respiratoryRate: number;
  weight: number;
  height: number;
}

export interface MedicalNote {
  patientId: string;
  date: string;
  vitals: VitalSigns;
  subjective: string;
  objective: string;
  analysis: string;
  plan: string;
  diagnosis: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  entity: string;
}
