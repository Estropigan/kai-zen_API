import express from 'express';
import { validateRegistration, validateLogin } from '../middlewares/validationMiddleware.js';
import {registerUser, loginUser, googleLogin, phoneLogin, getCurrentUser } from '../controllers/authController.js';
import { verifyToken, isAdmin } from '../middlewares/authenticationMiddleware.js'

const router = express.Router();

// User Email Registration Route
router.post('/register', validateRegistration, registerUser);

// User Login Route - Email
router.post('/login', validateLogin, loginUser);

// User Login Route - Phone
router.post('/login/mobile-number', validateLogin, phoneLogin);

// Google Login Route (OAuth)
router.post('/google-login', googleLogin);

//  get current user
router.get('/user', getCurrentUser);

export default router;
