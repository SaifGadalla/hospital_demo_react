import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { Admission } from "../../patients/types/index";

export const useAdmitPatient = () => {
  const queryClient = useQueryClient();

  return useMutation<Admission, Error, Partial<Admission>>({
    mutationFn: async (admission) => {
      const response = await fetch(`${baseUrl}/hospital/admissions/admit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(admission),
      });

      if (!response.ok) {
        throw new Error("Failed to admit patient");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
  });
};
