import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { Appointment } from "../types";

export const useAppointments = (searchParamsString?: string) => {
  return useQuery<{ items: Appointment[], totalCount: number }, Error>({
    queryKey: ['appointments', 'list', searchParamsString],
    queryFn: async () => {
      const params = new URLSearchParams(searchParamsString || '');
      if (!params.has('PageSize')) params.append('PageSize', '100');

      const url = `${baseUrl}/hospital/appointments?${params.toString()}`;
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      return response.json();
    },
  });
};
