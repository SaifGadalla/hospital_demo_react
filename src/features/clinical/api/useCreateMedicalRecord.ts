import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { MedicalRecord } from "../types";

export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation<MedicalRecord, Error, Partial<MedicalRecord>>({
    mutationFn: async (record) => {
      const response = await fetch(`${baseUrl}/hospital/medical-records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        throw new Error("Failed to create medical record");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-records'] });
    },
  });
};
