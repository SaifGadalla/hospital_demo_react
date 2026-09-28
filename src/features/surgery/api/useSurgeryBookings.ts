import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { SurgeryBooking } from "../types";

export const useSurgeryBookings = (searchParamsString?: string) => {
  return useQuery<{ items: SurgeryBooking[], totalCount: number }, Error>({
    queryKey: ['surgery', 'bookings', searchParamsString],
    queryFn: async () => {
      const params = new URLSearchParams(searchParamsString || '');
      if (!params.has('PageSize')) params.append('PageSize', '100');

      const url = `${baseUrl}/hospital/surgery/bookings?${params.toString()}`;
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch surgery bookings");
      }
      return response.json();
    },
  });
};
