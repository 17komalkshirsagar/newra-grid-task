import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    original_filename: string;
    format: string;
    resource_type: string;
    bytes: number;
}

export const uploadToCloudinary = (
    fileBuffer: Buffer,
    originalname: string,
    folder: string = 'utility-bills'
): Promise<CloudinaryUploadResult> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                folder: folder,
                public_id: `${folder}/${Date.now()}-${originalname.split('.')[0]}`,
                transformation: [
                    { quality: 'auto:good' },
                    { fetch_format: 'auto' }
                ]
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(error);
                } else if (result) {
                    resolve({
                        public_id: result.public_id,
                        secure_url: result.secure_url,
                        original_filename: originalname,
                        format: result.format,
                        resource_type: result.resource_type,
                        bytes: result.bytes
                    });
                } else {
                    reject(new Error('Unknown upload error'));
                }
            }
        );


        const bufferStream = new Readable();
        bufferStream.push(fileBuffer);
        bufferStream.push(null);
        bufferStream.pipe(uploadStream);
    });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted from Cloudinary: ${publicId}`);
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
};

export default cloudinary;