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
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import * as z from "zod";
import { uploadToCloudinary } from "@/utils/uploadTocloudinery";
import TiptapEditor from "@/component/shared/TiptapEditor";

// === Schema ===
const blogSchema = z.object({
  blogsName: z.string().min(1, { message: "Blog name is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  externalLink: z.string().url().optional(),
  photo: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

interface BlogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blog?: Partial<BlogFormValues> & { id?: string; createdAt?: string };
  onSubmit: (data: BlogFormValues & { id?: string }) => Promise<void>;
  isLoading?: boolean;
}

export function BlogModal({
  open,
  onOpenChange,
  blog,
  onSubmit,
  isLoading = false,
}: BlogModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!blog;

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      blogsName: "",
      title: "",
      description: "",
      externalLink: "",
      photo: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        blogsName: blog?.blogsName ?? "",
        title: blog?.title ?? "",
        description: blog?.description ?? "",
        externalLink: blog?.externalLink ?? "",
        photo: blog?.photo ?? "",
      });
    }
  }, [open, blog, form]);

  const handleSubmit = async (values: BlogFormValues) => {
    try {
      setIsSubmitting(true);
      const dataToSubmit = {
        ...values,
        id: blog?.id || "",
        createdAt: blog?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await onSubmit(dataToSubmit);
      onOpenChange(false);
    } catch (error) {
      console.error("Blog submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white rounded-xl shadow-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Blog" : "Add Blog"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the blog details."
              : "Fill out the form to publish a new blog."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {/* Blog Name */}
            <FormField
              control={form.control}
              name="blogsName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blog Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Tech Trends"
                      {...field}
                      disabled={isSubmitting || isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Top JavaScript Frameworks in 2025"
                      {...field}
                      disabled={isSubmitting || isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <TiptapEditor
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting || isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* External Link */}
            <FormField
              control={form.control}
              name="externalLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External Link (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://medium.com/your-post"
                      {...field}
                      disabled={isSubmitting || isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blog Thumbnail</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const imageUrl = await uploadToCloudinary(file);
                        if (imageUrl) form.setValue("photo", imageUrl);
                      }}
                      disabled={isSubmitting || isLoading}
                    />
                  </FormControl>
                  {form.watch("photo") && (
                    <div className="mt-2 w-32 h-20 relative border rounded">
                      <Image
                        src={form.watch("photo") || ""}
                        alt="Thumbnail"
                        fill
                        sizes="128px"
                        className="object-cover rounded"
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
                  ? "Update Blog"
                  : "Add Blog"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
