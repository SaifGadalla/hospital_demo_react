export interface ErAmbulanceCall {
  callTime?: string | Date;
  patientName?: string;
  age?: number;
  gender?: string;
  pickupLocation?: string;
  incidentType?: string;
  initialAssessment?: string;
  crewMembers?: string;
  notes?: string;
}

export interface ErBed {
  id?: string;
  bedNumber?: string;
  bedCode?: string;
  erZoneId?: string;
  bedType?: string;
  status?: string;
  isActive?: boolean;
  createdAt?: string | Date;
}

export interface ErRegistration {
  id?: string;
  tenantId?: string;
  erNumber?: string;
  patientId?: string;
  patientName?: string;
  patientMRN?: string;
  arrivalTime?: string | Date;
  arrivalMode?: string;
  chiefComplaint?: string;
  triageLevel?: number;
  triageColor?: string;
  status?: string;
  dispositionTime?: string | Date;
  notes?: string;
  createdAt?: string | Date;
}

export interface ErTreatment {
  treatmentEndTime?: string | Date;
  disposition?: string;
  erRegistrationId?: string;
  treatingDoctorId?: string;
  treatmentStartTime?: string | Date;
  assessment?: string;
  diagnosis?: string;
  treatmentProvided?: string;
  investigationsOrdered?: string;
  medicationsGiven?: string;
  notes?: string;
}

export interface ErTriage {
  id?: string;
  tenantId?: string;
  erRegistrationId?: string;
  patientId?: string;
  triagedById?: string;
  triageTime?: string | Date;
  triageLevel?: number;
  triageColor?: string;
  bloodPressure?: string;
  temperature?: number;
  pulseRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  painScale?: number;
  chiefComplaint?: string;
  briefHistory?: string;
  allergies?: string;
  currentMedications?: string;
  notes?: string;
  createdAt?: string | Date;
}

// Dashboard ER Aggregation Type (Simplified from ErRegistration / ErTriage)
export interface ERPatient {
  id: string;
  call: string;
  patientName: string;
  triage: number;
  status: string;
}
