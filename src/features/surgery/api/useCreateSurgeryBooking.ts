import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { SurgeryBooking } from "../types";

export const useCreateSurgeryBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<SurgeryBooking, Error, Partial<SurgeryBooking>>({
    mutationFn: async (booking) => {
      const response = await fetch(`${baseUrl}/hospital/surgery/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });

      if (!response.ok) {
        throw new Error("Failed to create surgery booking");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surgery', 'bookings'] });
    },
  });
};
