/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { authOptions } from "@/utils/authOptions";

import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export async function createOrUpdateBlogs(postCategory: any) {
  const session = await getServerSession(authOptions);

  const payload: Partial<any> = {
    blogsName: postCategory.blogsName,
    title: postCategory.title,
    description: postCategory.description,
    photo: postCategory.photo,
    externalLink: postCategory.externalLink,
  };

  try {
    let postCategoryApiUrl = `${process.env.NEXT_PUBLIC_BASE_API}/blogs`;
    let method = "POST";

    if (postCategory.id || postCategory._id) {
      const id = postCategory.id || postCategory._id;
      postCategoryApiUrl = `${process.env.NEXT_PUBLIC_BASE_API}/blogs/${id}`;
      method = "PATCH";
      payload["id"] = id;
    }

    const response = await fetch(postCategoryApiUrl, {
      next: { tags: ["blogs"] },
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
  

    return result;
  } catch (error: unknown) {
    console.error("Error creating/updating Course:", error);
    throw error;
  }
}

export async function getAllBlogs() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/blogs`
    );

    const result = await response.json();
    revalidateTag("blogs");
    return result.data || result;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
}

export async function deleteBlogsById(projectId: string) {
    console.log(projectId);
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Unauthorized access: Only admin can delete blogs.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/blogs/${projectId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `${session.user.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete blogs");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting blogs:", error);
    throw error;
  }
}
