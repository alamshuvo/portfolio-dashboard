/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { NoDataFound } from "@/common/noDataFound";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { useEffect, useState } from "react";
import { DeleteConfirmationModal } from "@/common/deleteConfirmationModal";
import { toast } from "sonner";
import { CourseModal } from "@/common/courseCreateOrUpdate";
import {
  createOrUpdateCourse,
  deleteCourseById,
  getAllCourse,
} from "@/service/courseService";
import { BlogModal } from "@/common/blogsCreateOrUpdate";
import { createOrUpdateBlogs, deleteBlogsById, getAllBlogs } from "@/service/Blogs";

interface Project {
  id: string;
  blogsName: string;
  title: string;
  description: string;
  photo: string;
  externalLink: string;
}
const BlogsPage = () => {
  const [postCategories, setPostCategories] = useState<Project[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [curentProject, setCurentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [project, setProject] = useState<Project[]>([]);
  const [expanded, setExpanded] = useState(false);

  const refetchProjects = async () => {
    setIsTableLoading(true);
    try {
      const result = await getAllBlogs(); // this always hits the API
      setProject(result);
    } catch (err) {
      console.error("Failed to Blogs", err);
    } finally {
      setIsTableLoading(false);
    }
  };

  useEffect(() => {
    refetchProjects(); // fetch on mount
  }, []);

  const handleEditPlan = async (project: any) => {
    setCurentProject(project);
    setOpen(true);
  };
  const openDeleteConfirmModal = (project: Project) => {
    console.log(project);
    setCurentProject(project);
    setIsDeleteOpen(true);
  };

  const handleDeleteCategory = async () => {
    const toastId = toast.loading("Deleting Blogs...");
    setIsDeleting(true);
    const result = await deleteBlogsById(curentProject!.id);
    console.log(result);
    if (result.success) {
      setProject(project.filter((plan) => plan.id !== curentProject?.id));
      toast.success(result.message || "Blogs deleted", { id: toastId });
    } else {
      toast.error(result.message || "Some error occurred while deleting", {
        id: toastId,
      });
    }
    setIsDeleting(false);
    setIsDeleteOpen(false);
  };
  const handleCreateCategory = () => {
    setCurentProject(null);
    setOpen(true);
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);

    const toastId = toast.loading(
      `${curentProject ? "Updating" : "Creating"} plan ${data.blogsName}...`
    );

    try {
      const result = await createOrUpdateBlogs(data);

      console.log({ result });

      if (curentProject) {
        // Update existing category
        setPostCategories((prevCategories) =>
          prevCategories.map((plan) =>
            plan.blogsName === curentProject.blogsName ? result.data : plan
          )
        );
        toast.success(`Successfully updated ${data.blogsName}`, {
          id: toastId,
        });
      } else {
        // Create new category
        setPostCategories((prevCategories) => [...prevCategories, result.data]);
        toast.success(`Successfully created ${data.blogsName}`, {
          id: toastId,
        });
      }

      setOpen(false);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  console.log(curentProject);
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">My Blogs</h2>
          <p className="text-sm text-gray-500">Manage my Blogs</p>
        </div>
        <Button className="cursor-pointer" onClick={handleCreateCategory}>
          <PlusCircle /> Add
        </Button>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader className="bg-accent">
              <TableRow>
                <TableHead className="w-[20%] text-left">Blogs Name</TableHead>
                <TableHead className="w-[20%]">Title</TableHead>
                <TableHead className="w-[20%] text-left">Description</TableHead>
                <TableHead className="w-[20%] text-right">ExternalLink</TableHead>
                <TableHead className="w-[20%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isTableLoading ? (
                <TableSkeleton cols={6} />
              ) : project.length ? (
                project?.map((postCategory) => (
                  <TableRow key={postCategory?.id}>
                    <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                      {postCategory.blogsName}
                    </TableCell>
                    <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                      {postCategory.title}
                    </TableCell>
                    <TableCell className="sm:max-w-none align-top">
                      <div className="bg-gray-100 text-gray-800 text-sm p-2 rounded-md max-w-[300px] whitespace-normal break-words">
                        <p className={expanded ? "" : "line-clamp-2"}>
                          {postCategory.description}
                        </p>
                        {postCategory.description.length > 10 && (
                          <button
                            className="text-blue-600 text-xs mt-1"
                            onClick={() => setExpanded(!expanded)}
                          >
                            {expanded ? "Show less" : "Read more"}
                          </button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                      <a
                        href={postCategory.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition"
                      >
                        External Link
                      </a>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <Button
                          onClick={() => handleEditPlan(postCategory)}
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 cursor-pointer"
                        >
                          <Pencil />
                        </Button>
                        <Button
                          onClick={() => openDeleteConfirmModal(postCategory)}
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8 cursor-pointer bg-red-400"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <NoDataFound className="h-full" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteCategory}
        isLoading={isDeleting}
        title="Delete Experience?"
        description={
          <>
            Are you sure you want to delete{" "}
            <span className="font-bold">{curentProject?.blogsName}?</span> This
            action cannot be undone.
          </>
        }
      />

      <BlogModal
        open={open}
        onOpenChange={setOpen}
        blog={curentProject || undefined}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BlogsPage;
