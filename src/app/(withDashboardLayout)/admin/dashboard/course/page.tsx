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
import {
  createOrUpdateSkills,
  deleteSkillsById,
  getAllSkills,
} from "@/service/skillService";
import { ExperienceModal } from "@/common/ExperienceCreationOrUpdate";
import {
  createOrUpdateExperience,
  deleteExperienceById,
  getAllExperience,
} from "@/service/experienceService";
import { CourseModal } from "@/common/courseCreateOrUpdate";
import { createOrUpdateCourse, deleteCourseById, getAllCourse } from "@/service/courseService";

interface Project {
  id: string;
  courseName: string;
  duration: string;
  certificate: string;
}
const CoursePage = () => {
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
      const result = await getAllCourse(); // this always hits the API
      setProject(result);
    } catch (err) {
      console.error("Failed to Course", err);
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
    const toastId = toast.loading("Deleting Course...");
    setIsDeleting(true);
    const result = await deleteCourseById(curentProject!.id);
    console.log(result);
    if (result.success) {
      setProject(project.filter((plan) => plan.id !== curentProject?.id));
      toast.success(result.message || "Course deleted", { id: toastId });
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
      `${curentProject ? "Updating" : "Creating"} plan ${data.courseName}...`
    );

    try {
      const result = await createOrUpdateCourse(data);

      console.log({ result });

      if (curentProject) {
        // Update existing category
        setPostCategories((prevCategories) =>
          prevCategories.map((plan) =>
            plan.courseName === curentProject.courseName ? result.data : plan
          )
        );
        toast.success(`Successfully updated ${data.courseName}`, {
          id: toastId,
        });
      } else {
        // Create new category
        setPostCategories((prevCategories) => [...prevCategories, result.data]);
        toast.success(`Successfully created ${data.courseName}`, {
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
          <h2 className="text-2xl font-semibold">My Course</h2>
          <p className="text-sm text-gray-500">Manage my Course</p>
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
                <TableHead className="w-[25%] text-left">Course Name</TableHead>
                <TableHead className="w-[25%]">Duration</TableHead>

                <TableHead className="w-[25%] text-left">Certificate</TableHead>
                <TableHead className="w-[25%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isTableLoading ? (
                <TableSkeleton cols={6} />
              ) : project.length ? (
                project?.map((postCategory) => (
                  <TableRow key={postCategory?.id}>
                    <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                      {postCategory.courseName}
                    </TableCell>
                    <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                      {postCategory.duration}
                    </TableCell>
                    <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                      <a
                        href={postCategory.certificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition"
                      >
                        Certificate
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
            <span className="font-bold">{curentProject?.courseName}?</span> This
            action cannot be undone.
          </>
        }
      />
      <CourseModal
        open={open}
        onOpenChange={setOpen}
        course={
          curentProject
            ? { ...curentProject, id: curentProject.id }
            : undefined
        }
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CoursePage;
