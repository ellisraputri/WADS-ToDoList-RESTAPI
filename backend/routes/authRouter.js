import express from 'express';
import { getUserData, isAuthenticated, updateBio, updateProfile, uploadImage, verifySecretKey } from '../controller/authController.js';
import { register } from '../controller/authController.js';
import { login } from '../controller/authController.js';
import { logout } from '../controller/authController.js';
import { resetPassword } from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js'
import multer from 'multer';

const authRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/is-authenticated', userAuth, isAuthenticated);
authRouter.post('/verify-key-reset', verifySecretKey);
authRouter.post('/reset-password', resetPassword);
authRouter.get('/data', userAuth ,getUserData);
authRouter.post('/update-bio', userAuth, updateBio);
authRouter.post('/upload-image', upload.single('file'), uploadImage);
authRouter.post('/update-profile', userAuth, updateProfile);

export default authRouter