import { useQuery } from '@tanstack/react-query';
import { fetchPatients, type PatientQueryParams, type PatientsResponse } from '../api/patients';

export function usePatients<T = Record<string, unknown>>(params?: PatientQueryParams) {
    return useQuery<PatientsResponse<T>>({
        queryKey: ['dashboard-patients', params],
        queryFn: () => fetchPatients<T>(params),
    });
}
