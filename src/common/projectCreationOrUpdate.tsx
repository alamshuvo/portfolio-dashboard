/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

// === Replace with your actual Cloudinary values ===

// ==================================================

const projectSchema = z.object({
  projectsName: z.string().min(1, { message: "Project name is required" }),
  liveLink: z.string().url({ message: "Must be a valid URL" }),
  githubFrontendLink: z.string().url({ message: "Must be a valid URL" }),
  githubBackendLink: z.string().url({ message: "Must be a valid URL" }),
  backendLiveLink: z.string().url({ message: "Must be a valid URL" }),
  projectPhoto: z.string().min(1, { message: "Image is required" }),
  description: z.string().min(10, { message: "Provide more details" }),
});

type FormValues = z.infer<typeof projectSchema>;

interface ProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Partial<FormValues> & { _id?: string; createdAt?: string };
  onSubmit: (data: FormValues & { _id?: string }) => Promise<void>;
  isLoading?: boolean;
}

export function ProjectModal({
  open,
  onOpenChange,
  project,
  onSubmit,
  isLoading = false,
}: ProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!project;
  const form = useForm<FormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectsName: "",
      liveLink: "",
      githubFrontendLink: "",
      githubBackendLink: "",
      backendLiveLink: "",
      projectPhoto: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        projectsName: project?.projectsName ?? "",
        liveLink: project?.liveLink ?? "",
        githubFrontendLink: project?.githubFrontendLink ?? "",
        githubBackendLink: project?.githubBackendLink ?? "",
        backendLiveLink: project?.backendLiveLink ?? "",
        projectPhoto: project?.projectPhoto ?? "",
        description: project?.description ?? "",
      });
    }
  }, [open, project, form]);

  // const uploadToCloudinary = async (file: any) => {
  //   const formData = new FormData();
  //   formData.append("file", file as any);
  //   formData.append("upload_preset", UPLOAD_PRESET);

  //   try {
  //     const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
  //     const data = await res.json();
  //     if (data.secure_url) {
  //       setFileList([{ uid: file.uid, name: file.name, status: "done", url: data.secure_url }]);
  //       toast.success("Image uploaded successfully!");
  //     }
  //   } catch (error) {
  //     toast.error("Image upload failed.");
  //   }
  // };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      const dataToSubmit: any = {
        ...values,
        id: project?._id || "",
        createdAt: project?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSubmit(dataToSubmit);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-white rounded-xl shadow-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditMode ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update your project details."
              : "Provide details for your new project."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Project Name", name: "projectsName" },
                { label: "Live Link", name: "liveLink" },
                { label: "Frontend GitHub", name: "githubFrontendLink" },
                { label: "Backend GitHub", name: "githubBackendLink" },
                { label: "Backend Live Link", name: "backendLiveLink" },
              ].map(({ label, name }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof FormValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Enter ${label.toLowerCase()}`}
                          {...field}
                          disabled={isSubmitting || isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {/* Photo Upload Field */}
              <FormField
                control={form.control}
                name="projectPhoto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Image</FormLabel>
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
                            form.setValue("projectPhoto", imageUrl);
                          }
                        }}
                      />
                    </FormControl>

                    {form.watch("projectPhoto") && (
                      <div className="mt-2 w-32 h-32 relative rounded overflow-hidden border">
                        <Image
                          src={form.watch("projectPhoto")}
                          alt="Preview"
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Project description..."
                      rows={5}
                      className="resize-none"
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
                  ? "Update Project"
                  : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
