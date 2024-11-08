import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (file) => {
  try {
    if (!file) {
      throw new Error("File is missing");
    }

    // Check if the file is an image or PDF
    const validFileTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];
    if (!validFileTypes.includes(file.mimetype)) {
      throw new Error("Invalid file type. Only images and PDFs are allowed.");
    }

    return new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: file.mimetype === "application/pdf" ? "auto" : "image",
        format: file.mimetype === "application/pdf" ? "pdf" : null,
        // Ensure URLs are returned as HTTPS
        secure: true,
      };

      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error("Error uploading to Cloudinary:", error.message);
            reject(error);
          } else {
            console.log("File uploaded successfully:", result.secure_url); // Use secure_url for HTTPS
            resolve(result); // Resolve with the secure HTTPS URL
          }
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    throw error;
  }
};

export { uploadOnCloudinary };
