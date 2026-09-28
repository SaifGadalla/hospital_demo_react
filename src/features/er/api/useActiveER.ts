import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { ERPatient } from "../types";

export const useActiveER = (searchParamsString?: string) => {
  return useQuery<{ items: ERPatient[], totalCount: number }, Error>({
    queryKey: ['er', 'active', searchParamsString],
    queryFn: async () => {
      const params = new URLSearchParams(searchParamsString || '');
      if (!params.has('Status')) params.append('Status', 'Active');
      if (!params.has('PageSize')) params.append('PageSize', '100');

      const url = `${baseUrl}/hospital/er/registrations?${params.toString()}`;
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch active ER patients");
      }
      return response.json();
    },
  });
};
