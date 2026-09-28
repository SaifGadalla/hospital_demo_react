import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { LabOrder } from "../types";

export const useCreateLabOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<LabOrder, Error, Partial<LabOrder>>({
    mutationFn: async (order) => {
      const response = await fetch(`${baseUrl}/hospital/labs/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error("Failed to create lab order");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labs', 'orders'] });
    },
  });
};
