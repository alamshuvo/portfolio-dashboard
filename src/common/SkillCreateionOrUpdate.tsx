/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Textarea } from "@/components/ui/textarea";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import Image from "next/image";
import * as z from "zod";
import { uploadToCloudinary } from "@/utils/uploadTocloudinery";

// === Schema ===
const skillSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string(),
  photo: z.string().optional(),
});

type SkillFormValues = z.infer<typeof skillSchema>;

interface SkillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill?: Partial<SkillFormValues> & { _id?: string; createdAt?: string };
  onSubmit: (data: SkillFormValues & { _id?: string }) => Promise<void>;
  isLoading?: boolean;
}

export function SkillModal({
  open,
  onOpenChange,
  skill,
  onSubmit,
  isLoading = false,
}: SkillModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!skill;

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      title: "",
      description: "",
      photo: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: skill?.title ?? "",
        description: skill?.description ?? "",
        photo: skill?.photo ?? "",
      });
    }
  }, [open, skill, form]);

  const handleSubmit = async (values: SkillFormValues) => {
    try {
      setIsSubmitting(true);

      const dataToSubmit = {
        ...values,
        _id: skill?._id || "",
        createdAt: skill?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSubmit(dataToSubmit);
      onOpenChange(false);
    } catch (error) {
      console.error("Skill submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white rounded-xl shadow-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditMode ? "Edit Skill" : "Add New Skill"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update your skill information."
              : "Provide details about your skill."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., JavaScript"
                      {...field}
                      disabled={isSubmitting || isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      className="resize-none"
                      placeholder="Describe your expertise..."
                      {...field}
                      disabled={isSubmitting || isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Icon</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      disabled={isSubmitting || isLoading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const imageUrl = await uploadToCloudinary(file);
                        if (imageUrl) {
                          form.setValue("photo", imageUrl);
                        }
                      }}
                    />
                  </FormControl>

                  {form.watch("photo") && (
                    <div className="mt-2 w-20 h-20 relative rounded overflow-hidden border">
                      <Image
                        src={form.watch("photo") || ""}
                        alt="Skill Icon"
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  )}

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
                  ? "Update Skill"
                  : "Add Skill"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
