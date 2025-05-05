import {v2 as cloudinary} from "cloudinary";
import {config} from 'dotenv';

config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return result.url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};