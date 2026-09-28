export interface MedicalRecord {
  id?: string;
  tenantId?: string;
  patientId?: string;
  appointmentId?: string;
  doctorId?: string;
  visitDate?: string | Date;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  oxygenSaturation?: number;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  diagnosisCode?: string;
  diagnosisDescription?: string;
  allergies?: string;
  currentMedications?: string;
  clinicalNotes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface NursingNote {
  admissionId?: string;
  patientId?: string;
  nurseId?: string;
  noteDate?: string | Date;
  noteTime?: string | Date;
  bloodPressure?: string;
  temperature?: number;
  pulseRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  intakeOutput?: string;
  observations?: string;
  careProvided?: string;
}
