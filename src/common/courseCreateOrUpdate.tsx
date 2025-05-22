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
const courseSchema = z.object({
  courseName: z.string().min(1, { message: "Course name is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  certificate: z.string().min(1, { message: "Certificate link or status is required" }),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Partial<CourseFormValues> & {
    id?: string;
    createdAt?: string;
  };
  onSubmit: (data: CourseFormValues & { _id?: string }) => Promise<void>;
  isLoading?: boolean;
}

export function CourseModal({
  open,
  onOpenChange,
  course,
  onSubmit,
  isLoading = false,
}: CourseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!course;

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseName: "",
      duration: "",
      certificate: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        courseName: course?.courseName ?? "",
        duration: course?.duration ?? "",
        certificate: course?.certificate ?? "",
      });
    }
  }, [open, course, form]);

  const handleSubmit = async (values: CourseFormValues) => {
    try {
      setIsSubmitting(true);

      const dataToSubmit = {
        ...values,
        id: course?.id || "",
        createdAt: course?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSubmit(dataToSubmit);
      onOpenChange(false);
    } catch (error) {
      console.error("Course submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-white rounded-xl shadow-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditMode ? "Edit Course" : "Add New Course"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update your course details."
              : "Provide information about your course or training."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="courseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., React Bootcamp" {...field} disabled={isSubmitting || isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 3 months" {...field} disabled={isSubmitting || isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="certificate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., https://certificate-link.com"
                      {...field}
                      disabled={isSubmitting || isLoading}
                    />
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
                  ? "Update Course"
                  : "Add Course"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
