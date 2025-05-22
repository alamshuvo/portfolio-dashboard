"use server";

import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { DefaultSession } from "next-auth";

// Extend the DefaultSession interface to include accessToken
declare module "next-auth" {
  interface Session {
    user?: {
      accessToken?: string;
    } & DefaultSession["user"];
  }
}

export const getAllMeta = async () => {
const session = await getServerSession(authOptions);
try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/meta`, {
        headers:{
            Authorization:`${session?.user?.accessToken}`,
        },
        next:{
            tags:["meta"],
        }
    })
    const metaResult = await res.json();
    return metaResult.data;
} catch (error) {
    console.error(error);
}
};
