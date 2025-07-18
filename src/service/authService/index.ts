/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use server";

// import { jwtDecode } from "jwt-decode";
// import { cookies } from "next/headers";
// import { FieldValues } from "react-hook-form";
// export const loginUser = async (userData: FieldValues) => {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       });
  
//       const result = await res.json();
  
//       if (result.success) {
//         (await cookies()).set("accessToken", result.data.accessToken);
//       }
  
//       return result;
//     } catch (error: any) {
//       return Error(error);
//     }
//   };
  
//   export const getCurrentUser = async () => {
//     const accessToken = (await cookies()).get("accessToken")?.value;
//     let decodedData = null;
  
//     if (accessToken) {
//       decodedData = await jwtDecode(accessToken);
//       return decodedData;
//     } else {
//       return null;
//     }
//   };
  
//   export const logout = async()=>{
//    ((await cookies())).delete("accessToken")
//   }
  

"use server";

import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";

// ✅ Server-side function to get current user from session token
export const getCurrentUser = async () => {
  const token = await getToken({
    req: {
      headers: {
        cookie: cookies().toString(),
      },
    } as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token?.accessToken) {
    return token;
  } else {
    return null;
  }
};
