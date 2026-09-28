export interface LabOrderTest {
  id?: string;
  tenantId?: string;
  labOrderId?: string;
  testId?: string;
  testName?: string;
  testCode?: string;
  result?: string;
  unit?: string;
  referenceRange?: string;
  isAbnormal?: boolean;
  abnormalFlag?: string;
  status?: string;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface LabOrder {
  id?: string;
  tenantId?: string;
  orderNumber?: string;
  patientId?: string;
  doctorId?: string;
  orderDate?: string | Date;
  appointmentId?: string;
  priority?: string;
  status?: string;
  clinicalIndication?: string;
  specimenType?: string;
  sampleCollectionDate?: string | Date;
  sampleBarcode?: string;
  resultDate?: string | Date;
  resultApprovedById?: string;
  tests?: LabOrderTest[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
