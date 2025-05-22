/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export async function createOrUpdateExperience(postCategory: any) {
  const session = await getServerSession(authOptions);

  const payload: Partial<any> = {
    companyName: postCategory.companyName,
    companyLocation: postCategory.companyLocation,
    role: postCategory.role,
  };

  try {
    let postCategoryApiUrl = `${process.env.NEXT_PUBLIC_BASE_API}/experience`;
    let method = "POST";

    if (postCategory.id || postCategory._id) {
      const id = postCategory.id || postCategory._id;
      postCategoryApiUrl = `${process.env.NEXT_PUBLIC_BASE_API}/experience/${id}`;
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
    revalidateTag("experience");

    return result;
  } catch (error: unknown) {
    console.error("Error creating/updating Experience:", error);
    throw error;
  }
}

export async function getAllExperience() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/experience`,
      {
        next: {
          tags: ["experience"],
        },
      }
    );

    const result = await response.json();

    return result.data || result;
  } catch (error) {
    console.error("Error fetching experience:", error);
    throw error;
  }
}

export async function deleteExperienceById(projectId: string) {
    console.log(projectId);
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Unauthorized access: Only admin can delete experience.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/experience/${projectId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `${session.user.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete experience");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting Experience:", error);
    throw error;
  }
}
