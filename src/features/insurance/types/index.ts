export interface InsuranceClaim {
  id?: string;
  tenantId?: string;
  claimNumber?: string;
  patientId?: string;
  patientName?: string;
  insurancePlanId?: string;
  insurancePlanName?: string;
  serviceDate?: string | Date;
  serviceProviderId?: string;
  diagnosisCodes?: string;
  procedureCodes?: string;
  totalAmount?: number;
  claimedAmount?: number;
  submissionDate?: string | Date;
  status?: string;
  approvedAmount?: number;
  paidAmount?: number;
  rejectionReason?: string;
  paymentDate?: string | Date;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  
  // Custom Dashboard property
  claimed?: number;
  total?: number;
}

export interface InsurancePlan {
  id?: string;
  tenantId?: string;
  planName?: string;
  planCode?: string;
  insuranceCompanyId?: string;
  coverageType?: string;
  coveragePercentage?: number;
  coPayAmount?: number;
  deductibleAmount?: number;
  annualLimit?: number;
  exclusions?: string;
  preAuthRequired?: boolean;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface InsurancePreauthorization {
  id?: string;
  tenantId?: string;
  authNumber?: string;
  patientId?: string;
  patientName?: string;
  insurancePlanId?: string;
  insurancePlanName?: string;
  serviceRequested?: string;
  estimatedCost?: number;
  requestDate?: string;
  approvalStatus?: string;
  approvalNumber?: string;
  approvedAmount?: number;
  validFrom?: string | Date;
  validTo?: string | Date;
  remarks?: string;
  rejectionReason?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
