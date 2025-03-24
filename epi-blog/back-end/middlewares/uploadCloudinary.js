import multer from 'multer';
import {v2 as cloudinary} from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'node:path';

process.env.CLOUDINARY_CLOUD_NAME

const storageCloudinary = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'epicode', // The name of the folder in cloudinary
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLAUDINARY_API_KEY,
        api_secret: process.env.CLAUDINARY_API_SECRET// The cloudinary name, api key and api secret are stored in the .env file
    },
});

const uploadCloudinary = multer({ storage: storageCloudinary });

export default uploadCloudinary;

