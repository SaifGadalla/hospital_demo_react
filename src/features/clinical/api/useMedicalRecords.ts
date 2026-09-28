import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { MedicalRecord } from "../types";

export const useMedicalRecords = (searchParamsString?: string) => {
  return useQuery<{ items: MedicalRecord[], totalCount: number }, Error>({
    queryKey: ['medical-records', 'list', searchParamsString],
    queryFn: async () => {
      const params = new URLSearchParams(searchParamsString || '');
      if (!params.has('PageSize')) params.append('PageSize', '100');

      const url = `${baseUrl}/hospital/medical-records?${params.toString()}`;
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch medical records");
      }
      return response.json();
    },
  });
};
