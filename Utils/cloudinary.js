import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import ApiError from "./apiError.js";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

export const cloudinaryUploadImage = async (buffer, folderName) => {
  return new Promise((resolve, reject) => {
    try {
      const result = cloudinary.uploader.upload_stream(
        {
          transformation: [{ width: 400, height: 400, crop: "fill" }],
          chunk_size: 20 * 1024 * 1024, // 20MB chunks
          resource_type: "image",
          folder: folderName,
        },
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(result);
    } catch (error) {
      throw new ApiError(`Cloudinary: ${error}`, 500);
    }
  });
};

export const cloudinaryRemoveFile = async (PublicId) => {
  const result = await cloudinary.uploader.destroy(PublicId);
  return result;
};
