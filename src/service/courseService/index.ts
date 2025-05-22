/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { authOptions } from "@/utils/authOptions";

import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export async function createOrUpdateCourse(postCategory: any) {
  const session = await getServerSession(authOptions);

  const payload: Partial<any> = {
    courseName: postCategory.courseName,
    duration: postCategory.duration,
    certificate: postCategory.certificate,
  };

  try {
    let postCategoryApiUrl = `${process.env.NEXT_PUBLIC_BASE_API}/course`;
    let method = "POST";

    if (postCategory.id || postCategory._id) {
      const id = postCategory.id || postCategory._id;
      postCategoryApiUrl = `${process.env.NEXT_PUBLIC_BASE_API}/course/${id}`;
      method = "PATCH";
      payload["id"] = id;
    }

    const response = await fetch(postCategoryApiUrl, {
      method,
      headers: {
        Authorization: `${session?.user?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  console.log(response);
    const result: any = await response.json();

    // ✅ Revalidate Projects tag after successful creation or update
    revalidateTag("course");

    return result;
  } catch (error: unknown) {
    console.error("Error creating/updating Course:", error);
    throw error;
  }
}

export async function getAllCourse() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/course`,
      {
        next: {
          tags: ["course"],
        },
      }
    );

    const result = await response.json();

    return result.data || result;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
}

export async function deleteCourseById(projectId: string) {
    console.log(projectId);
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Unauthorized access: Only admin can delete course.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/course/${projectId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `${session.user.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete course");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
}
