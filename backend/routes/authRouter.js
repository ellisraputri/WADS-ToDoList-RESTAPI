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
/**
 * @swagger
 * tags:
 *   name: Auth and User
 *   description: User and Authentication related APIs
 */

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Auth and User
 *     summary: Register a new user
 *     description: |
 *       **Registers a new user account.**
 *
 *       This endpoint allows a client to create a new user by submitting a full name, email, password, and secret key.
 *
 *       **Validations include:**
 *       - All fields are required.
 *       - Email must be in a valid format.
 *       - Password must be at least 8 characters long and contain at least one letter and one number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - secretKey
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *                 description: Full name of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *                 description: User's unique email address
 *               password:
 *                 type: string
 *                 example: P@ssw0rd123
 *                 description: Password (min. 8 chars, must include a letter and a number)
 *               secretKey:
 *                 type: string
 *                 example: MySecretKey
 *                 description: Personal secret key used for recovery or verification
 *     responses:
 *       200:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Account created successfully
 *       400:
 *         description: Bad request - missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please fill all the required fields
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */
authRouter.post('/register', register);

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Auth and User
 *     summary: Log in an existing user
 *     description: |
 *       **Authenticates a user and starts a session.**
 *
 *       This endpoint allows a user to log in with their registered email and password.
 *
 *       **Validations include:**
 *       - Both email and password fields are required.
 *       - The email must exist in the system.
 *       - The password must match the hashed password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *                 description: Registered user's email
 *               password:
 *                 type: string
 *                 example: P@ssw0rd123
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged in successfully
 *       400:
 *         description: Invalid credentials or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */
authRouter.post('/login', login);

/**
 * @swagger
 * /logout:
 *   post:
 *     tags:
 *       - Auth and User
 *     summary: Log out the user
 *     description: |
 *       **Logs the user out and destroys the session.**
 *
 *       This endpoint logs the user out by destroying their session and clearing the session cookie.
 *
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out
 *       500:
 *         description: Internal server error while logging out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Logout failed
 */
authRouter.post('/logout', logout);

/**
 * @swagger
 * /is-authenticated:
 *   get:
 *     tags:
 *       - Auth and User
 *     summary: Check if the user is authenticated
 *     description: |
 *       **Checks if the user is currently authenticated.**
 *
 *       This endpoint verifies whether the user has an active session.
 *       If the user is authenticated, it returns a success status.
 *     responses:
 *       200:
 *         description: User is authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */
authRouter.get('/is-authenticated', userAuth, isAuthenticated);

/**
 * @swagger
 * /verify-key-reset:
 *   post:
 *     tags:
 *       - Auth and User
 *     summary: Verify the secret key for password reset
 *     description: |
 *       **Verifies the secret key for the password reset process.**
 *
 *       This endpoint checks whether the secret key provided by the user matches the one stored for the given email.
 *       If the key is valid, the system confirms it, allowing the user to proceed with the password reset.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - key
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *                 description: User's email address
 *               key:
 *                 type: string
 *                 example: SecretKey123
 *                 description: Secret key for verifying password reset request
 *     responses:
 *       200:
 *         description: Secret key is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Secret key is valid
 *       400:
 *         description: Missing details, user not found, or invalid key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */
authRouter.post('/verify-key-reset', verifySecretKey);

/**
 * @swagger
 * /reset-password:
 *   post:
 *     tags:
 *       - Auth and User
 *     summary: Reset the user's password
 *     description: |
 *       **Resets the user's password.**
 *
 *       This endpoint allows the user to reset their password by providing their registered email and a new password.
 *       The new password will be validated before being hashed and updated in the system.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *                 description: User's email address
 *               newPassword:
 *                 type: string
 *                 example: NewP@ssw0rd123
 *                 description: The new password (min. 8 chars, must include a letter and a number)
 *     responses:
 *       200:
 *         description: Password has been reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password has been reset successfully
 *       400:
 *         description: Missing details, invalid password format, or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */
authRouter.post('/reset-password', resetPassword);

/**
 * @swagger
 * /data:
 *   get:
 *     tags:
 *       - Auth and User
 *     summary: Get user data by user ID
 *     description: |
 *       **Retrieves user data by user ID.**
 *
 *       This endpoint requires the user to be authenticated and provides the user data based on the provided `userId`.
 *       The user must be logged in and have a valid session.
 *
 *     parameters:
 *       - in: body
 *         name: userId
 *         description: The ID of the user whose data is to be fetched.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: integer
 *               example: 123
 *               description: User's ID
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 userData:
 *                   type: object
 *                   description: The user's data object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 123
 *                       description: User's unique ID
 *                     fullName:
 *                       type: string
 *                       example: John Doe
 *                       description: User's full name
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                       description: User's email address
 *       400:
 *         description: User not found or missing user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */
authRouter.get('/data', userAuth ,getUserData);

/**
 * @swagger
 * /update-bio:
 *   post:
 *     tags:
 *       - Auth and User
 *     summary: Update the user's bio
 *     description: |
 *       **Updates the bio of the authenticated user.**
 *
 *       This endpoint allows the authenticated user to update their bio. The user must be logged in to perform this action.
 *       The new bio will be saved to the user's profile.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newbio
 *             properties:
 *               newbio:
 *                 type: string
 *                 example: I am a software developer passionate about technology.
 *                 description: The new bio text to update
 *     responses:
 *       200:
 *         description: Bio updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Bio updated successfully
 *       400:
 *         description: Missing bio or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please fill in the bio.
 *       401:
 *         description: Unauthorized (user not authenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 *     security:
 *       - cookieAuth: []  
 */
authRouter.post('/update-bio', userAuth, updateBio);

/**
 * @swagger
 * /upload-image:
 *   post:
 *     tags:
 *       - Auth and User
 *     summary: Upload an image and store it in the cloud
 *     description: |
 *       **Uploads an image to the cloud storage** and returns the URL of the uploaded image.
 *       The image is uploaded via a multipart form and temporarily stored locally before being
 *       uploaded to cloud storage. The temporary file is deleted after upload.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully and URL returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                   example: https://example.com/images/uploaded-image.jpg
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No file uploaded
 *       500:
 *         description: Internal server error during image upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to process image upload
 */
authRouter.post('/upload-image', upload.single('file'), uploadImage);

/**
 * @swagger
 * /update-profile:
 *   post:
 *     tags:
 *       - Auth and User
 *     summary: Update the user's profile image
 *     description: |
 *       **Updates the profile image URL of the authenticated user.**
 *       This endpoint allows the authenticated user to update their profile image by providing a new image URL.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - imageUrl
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user whose profile is being updated
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/profile-images/user123.jpg
 *                 description: The URL of the new profile image
 *     responses:
 *       200:
 *         description: Profile image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile image updated successfully
 *       400:
 *         description: User not found or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *       401:
 *         description: Unauthorized (user not authenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 *     security:
 *       - cookieAuth: []  
 */
authRouter.post('/update-profile', userAuth, updateProfile);

export default authRouter