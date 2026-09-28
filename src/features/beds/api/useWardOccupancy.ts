import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { WardOccupancy, Ward } from "../types/index";

export const useWardOccupancy = (searchParamsString?: string) => {
  return useQuery<WardOccupancy[], Error>({
    queryKey: ['beds', 'occupancy', searchParamsString],
    queryFn: async () => {
      const params = new URLSearchParams(searchParamsString || '');
      if (!params.has('PageSize')) params.append('PageSize', '100');

      const url = `${baseUrl}/hospital/wards?${params.toString()}`;
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch ward occupancy");
      }
      const data = await response.json();
      
      return (data.items || []).map((w: Ward) => {
        const total = w.totalBeds || 0;
        const available = w.availableBeds || 0;
        return {
          id: w.id || '',
          name: w.wardName || 'Unknown Ward',
          total: total,
          occupied: Math.max(0, total - available),
        };
      });
    },
  });
};
