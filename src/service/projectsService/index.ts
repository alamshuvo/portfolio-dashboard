/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export async function createOrUpdateProjects(postCategory: any) {
  const session = await getServerSession(authOptions);

  const payload: Partial<any> = {
    projectsName: postCategory.projectsName,
    liveLink: postCategory.liveLink,
    githubFrontendLink: postCategory.githubFrontendLink,
    githubBackendLink: postCategory.githubBackendLink,
    backendLiveLink: postCategory.backendLiveLink,
    projectPhoto: postCategory.projectPhoto,
    deployedIn: postCategory.deployedIn,
    description: postCategory.description,
  };

  try {
    let postCategoryApiUrl = `${process.env.NEXT_PUBLIC_BASE_API}/projects`;
    let method = "POST";

    if (postCategory.id || postCategory._id) {
      const id = postCategory.id || postCategory._id;
      postCategoryApiUrl = `${process.env.NEXT_PUBLIC_BASE_API}/projects/${id}`;
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

    const result: any = await response.json();

    if (!response.ok)
      throw new Error(result.message || "Failed to save project");

    // ✅ Revalidate Projects tag after successful creation or update
    revalidateTag("projects");

    return result;
  } catch (error: unknown) {
    console.error("Error creating/updating project:", error);
    throw error;
  }
}

export async function getAllProjects() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/projects`,{
        next:{
            tags:["projects"]
        }
      }
    );

    const result = await response.json();
    
    return result.data || result;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

export async function deleteProjectById(projectId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Unauthorized access: Only admin can delete projects.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/projects/${projectId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `${session.user.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete project");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}
