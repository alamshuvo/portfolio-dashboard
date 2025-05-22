"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";

// === Schema ===
const experienceSchema = z.object({
  companyName: z.string().min(1, { message: "Company name is required" }),
  companyLocation: z.string().min(1, { message: "Location is required" }),
  role: z.string().min(1, { message: "Role is required" }),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ExperienceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience?: Partial<ExperienceFormValues> & {
    id?: string;
    createdAt?: string;
  };
  onSubmit: (data: ExperienceFormValues & { _id?: string }) => Promise<void>;
  isLoading?: boolean;
}

export function ExperienceModal({
  open,
  onOpenChange,
  experience,
  onSubmit,
  isLoading = false,
}: ExperienceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!experience;

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      companyName: "",
      companyLocation: "",
      role: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        companyName: experience?.companyName ?? "",
        companyLocation: experience?.companyLocation ?? "",
        role: experience?.role ?? "",
      });
    }
  }, [open, experience, form]);

  const handleSubmit = async (values: ExperienceFormValues) => {
    try {
      setIsSubmitting(true);

      const dataToSubmit = {
        ...values,
        id: experience?.id || "",
        createdAt: experience?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSubmit(dataToSubmit);
      onOpenChange(false);
    } catch (error) {
      console.error("Experience submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-white rounded-xl shadow-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditMode ? "Edit Experience" : "Add New Experience"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update your experience information."
              : "Provide details about your professional experience."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Webermelon" {...field} disabled={isSubmitting || isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dhaka, Bangladesh" {...field} disabled={isSubmitting || isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Frontend Developer Intern" {...field} disabled={isSubmitting || isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting || isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting || isLoading
                  ? "Saving..."
                  : isEditMode
                  ? "Update Experience"
                  : "Add Experience"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
