import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { Appointment } from "../types";

export const useTodayAppointments = (searchParamsString?: string) => {
  return useQuery<{ items: Appointment[], totalCount: number }, Error>({
    queryKey: ['appointments', 'today', searchParamsString],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const params = new URLSearchParams(searchParamsString || '');
      if (!params.has('AppointmentDateFrom')) params.append('AppointmentDateFrom', today);
      if (!params.has('AppointmentDateTo')) params.append('AppointmentDateTo', today);
      if (!params.has('PageSize')) params.append('PageSize', '100');

      const url = `${baseUrl}/hospital/appointments?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch today's appointments");
      }
      return response.json();
    },
  });
};
