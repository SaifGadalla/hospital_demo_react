import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { Patient } from "../types/index";

export const usePatients = (searchParamsString?: string) => {
  return useQuery<{ items: Patient[], totalCount: number }, Error>({
    queryKey: ['patients', 'list', searchParamsString],
    queryFn: async () => {
      const params = new URLSearchParams(searchParamsString || '');
      if (!params.has('PageSize')) params.append('PageSize', '100');

      const url = `${baseUrl}/hospital/patients?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      return response.json();
    },
  });
};
