import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { type LeadInput, type LeadUpdateInput, type Lead, insertLeadSchema, updateLeadSchema } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://auth.kaax.ai";

export function useLeads() {
  return useQuery<Lead[]>({
    queryKey: [`${API_URL}/leads`],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/leads`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch leads");
      return await res.json();
    },
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: LeadInput) => {
      const validated = insertLeadSchema.parse(data);
      const res = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Invalid input");
        }
        throw new Error("Failed to submit lead");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${API_URL}/leads`] });
    },
    onError: (err) => {
      toast({
        title: "Error capturing lead",
        description: err.message,
        variant: "destructive",
      });
    }
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & LeadUpdateInput) => {
      const validated = updateLeadSchema.parse(updates);
      const res = await fetch(`${API_URL}/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update lead");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${API_URL}/leads`] });
      toast({ title: "Lead updated successfully" });
    },
    onError: (err) => {
      toast({
        title: "Failed to update",
        description: err.message,
        variant: "destructive",
      });
    }
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_URL}/leads/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete lead");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${API_URL}/leads`] });
      toast({ title: "Lead deleted" });
    },
    onError: (err) => {
      toast({
        title: "Delete failed",
        description: err.message,
        variant: "destructive",
      });
    }
  });
}
