import express from 'express';
const router = express.Router();

// * controllers
import {
    googleLogin,
    verifyToken
} from '../controllers/CXauthentication.controllers';

// * [POST] google login
router.post('/google-login', googleLogin);

// * [GET] verify token
router.get('/verify-token', verifyToken);

export default router;