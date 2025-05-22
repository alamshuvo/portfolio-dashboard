// utils/uploadToCloudinary.ts

import { toast } from "sonner";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqugrb0la/image/upload";
const UPLOAD_PRESET = "car-management";

export const uploadToCloudinary = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  try {
    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
   console.log(data);
    if (data.secure_url) {
      toast.success("Image uploaded successfully!");
      return data.secure_url;
    } else {
      toast.error("Image upload failed.");
      console.error("Cloudinary response error:", data);
      return null;
    }
  } catch (error) {
    toast.error("Image upload failed.");
    console.error("Upload error:", error);
    return null;
  }
};
