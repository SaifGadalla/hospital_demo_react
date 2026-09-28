export interface PrescriptionItem {
  id?: string;
  tenantId?: string;
  prescriptionId?: string;
  medicationId?: string;
  medicationName?: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  durationDays?: number;
  quantity?: number;
  instructions?: string;
  isDispensed?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Prescription {
  id?: string;
  tenantId?: string;
  prescriptionNumber?: string;
  patientId?: string;
  doctorId?: string;
  prescriptionDate?: string | Date;
  appointmentId?: string;
  medicalRecordId?: string;
  diagnosis?: string;
  status?: string;
  dispensedDate?: string | Date;
  dispensedById?: string;
  notes?: string;
  items?: PrescriptionItem[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface MedicationAdministration {
  actualTime?: string | Date;
  notes?: string;
  reason?: string;
  admissionId?: string;
  patientId?: string;
  prescriptionItemId?: string;
  administeredById?: string;
  scheduledTime?: string | Date;
  dose?: string;
  route?: string;
}
