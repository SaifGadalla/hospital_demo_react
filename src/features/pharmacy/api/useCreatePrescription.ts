import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { Prescription } from "../types";

export const useCreatePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation<Prescription, Error, Partial<Prescription>>({
    mutationFn: async (prescription) => {
      const response = await fetch(`${baseUrl}/hospital/prescriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescription),
      });

      if (!response.ok) {
        throw new Error("Failed to create prescription");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });
};
