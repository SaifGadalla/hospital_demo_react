import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";

export const usePatientsStats = (searchParamsString?: string) => {
  return useQuery<{ totalPatients: number }, Error>({
    queryKey: ['patients', 'stats', searchParamsString],
    queryFn: async () => {
      const params = new URLSearchParams(searchParamsString || '');
      params.set('PageSize', '1');
      
      const url = `${baseUrl}/hospital/patients?${params.toString()}`;
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch patients stats");
      }
      const data = await response.json();
      return { totalPatients: data.totalCount || 0 };
    },
  });
};
