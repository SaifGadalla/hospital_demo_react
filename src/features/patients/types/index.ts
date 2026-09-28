export interface Patient {
  id?: string;
  tenantId?: string;
  mrn?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  fullName?: string;
  dateOfBirth?: string | Date;
  age?: number;
  gender?: string;
  nationalId?: string;
  passportNumber?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  bloodType?: string;
  maritalStatus?: string;
  nationality?: string;
  photoUrl?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  primaryInsuranceId?: string;
  insurancePolicyNumber?: string;
  insuranceMemberNumber?: string;
  isVIP?: boolean;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Admission {
  id?: string;
  tenantId?: string;
  admissionNumber?: string;
  patientId?: string;
  patientName?: string;
  patientMRN?: string;
  doctorId?: string;
  departmentId?: string;
  admissionDate?: string | Date;
  dischargeDate?: string | Date;
  admissionType?: string;
  bedId?: string;
  bedNumber?: string;
  roomId?: string;
  roomNumber?: string;
  admissionDiagnosis?: string;
  dischargeDiagnosis?: string;
  status?: string;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface DischargeSummary {
  id?: string;
  admissionId?: string;
  dischargeDate?: string | Date;
  dischargeDiagnosis?: string;
  proceduresPerformed?: string;
  medicationsOnDischarge?: string;
  followUpInstructions?: string;
  dischargeTo?: string;
  approvedById?: string;
  notes?: string;
  doctorId?: string;
  patientId?: string;
}
