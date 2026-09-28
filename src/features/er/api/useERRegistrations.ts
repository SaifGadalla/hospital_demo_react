import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { ErRegistration } from "../types";

export const useERRegistrations = (searchParamsString?: string) => {
  return useQuery<{ items: ErRegistration[], totalCount: number }, Error>({
    queryKey: ['er', 'registrations', searchParamsString],
    queryFn: async () => {
      const params = new URLSearchParams(searchParamsString || '');
      if (!params.has('PageSize')) params.append('PageSize', '100');

      const url = `${baseUrl}/hospital/er/registrations?${params.toString()}`;
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch ER registrations");
      }
      return response.json();
    },
  });
};
