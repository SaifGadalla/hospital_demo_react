import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { Prescription } from "../types";

export const usePrescriptions = (searchParamsString?: string) => {
  return useQuery<{ items: Prescription[], totalCount: number }, Error>({
    queryKey: ['prescriptions', 'list', searchParamsString],
    queryFn: async () => {
      const params = new URLSearchParams(searchParamsString || '');
      if (!params.has('PageSize')) params.append('PageSize', '100');

      const url = `${baseUrl}/hospital/prescriptions?${params.toString()}`;
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch prescriptions");
      }
      return response.json();
    },
  });
};
