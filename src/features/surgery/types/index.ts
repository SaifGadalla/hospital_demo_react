export interface OperatingRoom {
  id?: string;
  roomNumber?: string;
  roomCode?: string;
  roomType?: string;
  status?: string;
  equipmentList?: string;
  isActive?: boolean;
  createdAt?: string | Date;
}

export interface SurgeryBooking {
  id?: string;
  bookingNumber?: string;
  patientId?: string;
  patientName?: string;
  primarySurgeonId?: string;
  surgicalProcedureId?: string;
  procedureName?: string;
  operatingRoomId?: string;
  operatingRoomNumber?: string;
  scheduledDate?: string | Date;
  scheduledStartTime?: string | Date;
  estimatedDuration?: number;
  priority?: string;
  status?: string;
  anesthesiaType?: string;
  notes?: string;
  createdAt?: string | Date;
}

export interface SurgicalProcedure {
  id?: string;
  procedureCode?: string;
  procedureName?: string;
  cptCode?: string;
  specialtyId?: string;
  estimatedDuration?: number;
  requiredEquipment?: string;
  preOpInstructions?: string;
  postOpInstructions?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string | Date;
}
