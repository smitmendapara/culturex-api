import express from 'express';
const router = express.Router();

// * multer upload
import { upload, validateFileUpload } from '../helper/CXmulter.helper';

// * controllers
import {
    allMedia,
    uploadMedia
} from '../controllers/CXmedia.controllers';

// * middleware
import { authenticate } from '../middleware/CXauth.middleware';

// * [GET] all media
router.get('/all-media', 
    authenticate as any,
    allMedia);

// * [POST] upload media
router.post('/upload-media', 
    authenticate as any,
    upload.single('file'),
    validateFileUpload as any,
    uploadMedia);

export default router;