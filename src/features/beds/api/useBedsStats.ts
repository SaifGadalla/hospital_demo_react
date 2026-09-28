import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { BedStats } from "../types/index";

export const useBedsStats = (searchParamsString?: string) => {
  return useQuery<BedStats, Error>({
    queryKey: ['beds', 'stats', searchParamsString],
    queryFn: async () => {
      const baseParams = searchParamsString ? `${searchParamsString}&` : '';
      
      const [totalRes, freeRes] = await Promise.all([
        fetch(`${baseUrl}/hospital/beds?${baseParams}PageSize=1`),
        fetch(`${baseUrl}/hospital/beds?${baseParams}Status=Free&PageSize=1`)
      ]);

      if (!totalRes.ok || !freeRes.ok) {
        throw new Error("Failed to fetch beds stats");
      }
      
      const totalData = await totalRes.json();
      const freeData = await freeRes.json();

      return {
        totalBeds: totalData.totalCount || 0,
        freeBeds: freeData.totalCount || 0,
      };
    },
  });
};
