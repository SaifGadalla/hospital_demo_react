import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { Admission } from "../../patients/types/index";

export const useAdmissions = (searchParamsString?: string) => {
  return useQuery<{ items: Admission[], totalCount: number }, Error>({
    queryKey: ['admissions', 'list', searchParamsString],
    queryFn: async () => {
      const params = newSearchParams(searchParamsString);

      const url = `${baseUrl}/hospital/admissions?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch admissions");
      }
      return response.json();
    },
  });
};

function newSearchParams(searchParamsString?: string) {
  const params = new URLSearchParams(searchParamsString || '');
  if (!params.has('PageSize')) params.append('PageSize', '100');
  return params;
}
