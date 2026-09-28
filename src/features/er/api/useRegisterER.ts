import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../../../constants";
import type { ErRegistration } from "../types";

export const useRegisterER = () => {
  const queryClient = useQueryClient();

  return useMutation<ErRegistration, Error, Partial<ErRegistration>>({
    mutationFn: async (registration) => {
      const response = await fetch(`${baseUrl}/hospital/er/registrations/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registration),
      });

      if (!response.ok) {
        throw new Error("Failed to register ER patient");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['er', 'registrations'] });
      queryClient.invalidateQueries({ queryKey: ['er', 'active'] });
    },
  });
};
