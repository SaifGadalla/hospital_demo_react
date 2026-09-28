export interface Bed {
  id?: string;
  tenantId?: string;
  bedNumber?: string;
  bedCode?: string;
  roomId?: string;
  roomNumber?: string;
  wardId?: string;
  wardName?: string;
  bedType?: string;
  status?: string;
  dailyRate?: number;
  isActive?: boolean;
  createdAt?: string | Date;
}

export interface Room {
  id?: string;
  tenantId?: string;
  roomNumber?: string;
  roomCode?: string;
  wardId?: string;
  wardName?: string;
  roomType?: string;
  capacity?: number;
  dailyRate?: number;
  isActive?: boolean;
  createdAt?: string | Date;
}

export interface Ward {
  id?: string;
  tenantId?: string;
  wardName?: string;
  wardCode?: string;
  departmentId?: string;
  wardType?: string;
  totalBeds?: number;
  availableBeds?: number;
  nurseStationLocation?: string;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Dashboard Aggregation Types
export interface WardOccupancy {
  id: string;
  name: string;
  occupied: number;
  total: number;
}

export interface BedStats {
  freeBeds: number;
  totalBeds: number;
}
