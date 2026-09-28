import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { InsuranceClaim } from "../types";

export const useCreateInsuranceClaim = () => {
  const queryClient = useQueryClient();

  return useMutation<InsuranceClaim, Error, Partial<InsuranceClaim>>({
    mutationFn: async (claim) => {
      const response = await fetch(`${baseUrl}/hospital/insurance/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claim),
      });

      if (!response.ok) {
        throw new Error("Failed to create insurance claim");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance', 'claims'] });
    },
  });
};
