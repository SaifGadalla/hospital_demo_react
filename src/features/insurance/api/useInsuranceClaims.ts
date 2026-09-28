import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { InsuranceClaim } from "../types";

export const useInsuranceClaims = (searchParamsString?: string) => {
  return useQuery<{ items: InsuranceClaim[], totalCount: number }, Error>({
    queryKey: ['insurance', 'claims', searchParamsString],
    queryFn: async () => {
      const params = new URLSearchParams(searchParamsString || '');
      if (!params.has('PageSize')) params.append('PageSize', '100');

      const url = `${baseUrl}/hospital/insurance/claims?${params.toString()}`;
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch insurance claims");
      }
      return response.json();
    },
  });
};
