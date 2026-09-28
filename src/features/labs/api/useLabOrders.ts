import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { LabOrder } from "../types";

export const useLabOrders = (searchParamsString?: string) => {
  return useQuery<{ items: LabOrder[], totalCount: number }, Error>({
    queryKey: ['labs', 'orders', searchParamsString],
    queryFn: async () => {
      const params = new URLSearchParams(searchParamsString || '');
      if (!params.has('PageSize')) params.append('PageSize', '100');

      const url = `${baseUrl}/hospital/labs/orders?${params.toString()}`;
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch lab orders");
      }
      return response.json();
    },
  });
};
