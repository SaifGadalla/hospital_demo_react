import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { Appointment } from "../types";

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<Appointment, Error, Partial<Appointment>>({
    mutationFn: async (appointment) => {
      const response = await fetch(`${baseUrl}/hospital/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment),
      });

      if (!response.ok) {
        throw new Error("Failed to create appointment");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
