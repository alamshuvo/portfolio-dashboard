/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export async function createOrUpdateSkills(postCategory: any) {
  const session = await getServerSession(authOptions);

  const payload: Partial<any> = {
    title: postCategory.title,
    description: postCategory.description,
    photo: postCategory.photo,
  };

  try {
    let postCategoryApiUrl = `${process.env.NEXT_PUBLIC_BASE_API}/skills`;
    let method = "POST";

    if (postCategory.id || postCategory._id) {
      const id = postCategory.id || postCategory._id;
      postCategoryApiUrl = `${process.env.NEXT_PUBLIC_BASE_API}/skills/${id}`;
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

    if (!response.ok)
      throw new Error(result.message || "Failed to save Skills");

    // ✅ Revalidate Projects tag after successful creation or update
    revalidateTag("skills");

    return result;
  } catch (error: unknown) {
    console.error("Error creating/updating project:", error);
    throw error;
  }
}

export async function getAllSkills() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/skills`,
      {
        next: {
          tags: ["skills"],
        },
      }
    );

    const result = await response.json();

    return result.data || result;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

export async function deleteSkillsById(projectId: string) {
    console.log(projectId);
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Unauthorized access: Only admin can delete skills.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/skills/${projectId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `${session.user.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete skills");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}
