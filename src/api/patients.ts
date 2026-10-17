import { baseUrl, tenantId } from '../constants';

export interface PatientQueryParams {
    searchTerm?: string;
    gender?: string;
    bloodType?: string;
    isVIP?: boolean;
    isActive?: boolean;
    city?: string;
    country?: string;
    dateOfBirthFrom?: Date;
    dateOfBirthTo?: Date;
    ageFrom?: number;
    ageTo?: number;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDescending?: boolean;
}

export interface PatientsResponse<T = Record<string, unknown>> {
    totalCount: number;
    items: T[];
}

export async function fetchPatients<T = Record<string, unknown>>(
    params?: PatientQueryParams
): Promise<PatientsResponse<T>> {
    const queryParams = new URLSearchParams();

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value != null) {
                queryParams.set(
                    key,
                    value instanceof Date ? value.toISOString() : String(value)
                );
            }
        });
    }

    const url = `${baseUrl}/api/hospital/patients${queryParams.size > 0 ? `?${queryParams.toString()}` : ''}`;
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Tenant-Id': tenantId,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch patients');
    }

    const data = await res.json();
    return {
        totalCount: data?.totalCount ?? data?.total ?? 0,
        items: data?.items ?? data?.patients ?? [],
    };
}
