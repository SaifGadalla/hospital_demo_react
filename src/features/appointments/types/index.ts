export interface Appointment {
  id?: string;
  tenantId?: string;
  appointmentNumber?: string;
  patientId?: string;
  patientName?: string;
  patientMRN?: string;
  doctorId?: string;
  departmentId?: string;
  appointmentDate?: string | Date;
  startTime?: string | Date;
  durationMinutes?: number;
  endTime?: string;
  appointmentType?: string;
  status?: string;
  chiefComplaint?: string;
  notes?: string;
  checkInTime?: string | Date;
  checkOutTime?: string | Date;
  requiresFollowUp?: boolean;
  followUpDate?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
