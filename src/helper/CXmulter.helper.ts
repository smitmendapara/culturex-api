import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// * utils
import _constantUtil from '../utils/CXconstant.utils';
import { viewJSONResponse } from '../utils/CXcommon.utils';

const {
    STATUS_200,
    BOOLEAN_TRUE: trueValue,
    BOOLEAN_FALSE: falseValue
} = _constantUtil;

// * Ensure 'uploads/' directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: trueValue });
}

// * Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// * File validation
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, trueValue);
    } else {
        cb(null, falseValue);
        (req as any).fileValidationError = 'Only images and videos are allowed!';
    }
};

const upload = multer({ storage, fileFilter });

// * Middleware to handle file validation error
const validateFileUpload = (req: Request, res: any, next: any) => {
    if ((req as any).fileValidationError) {
        return viewJSONResponse(res, falseValue, STATUS_200, (req as any).fileValidationError, {}); 
    }
    next();
};

export { upload, validateFileUpload };