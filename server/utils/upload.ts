import multer from "multer"
import { Request } from "express";

const multerMiddleware = (fileTypes: string[] = [], fileSize: number = 10) => {
    const storage = multer.memoryStorage();

    const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
        if (fileTypes.length > 0 && !fileTypes.includes(file.mimetype)) {
            return cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
        }
        cb(null, true);
    };

    const maxFileSize = fileSize * 1024 * 1024

    return multer({
        storage,
        limits: { fileSize: maxFileSize },
        fileFilter,
    });
};

export default multerMiddleware;
