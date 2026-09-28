import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { Patient } from "../types/index";

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation<Patient, Error, Partial<Patient>>({
    mutationFn: async (patient) => {
      const response = await fetch(`${baseUrl}/hospital/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
      });

      if (!response.ok) {
        throw new Error("Failed to create patient");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['patients', 'stats'] });
    },
  });
};
