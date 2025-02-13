import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { auth } from '../config/firebase.js';
import { setDocument, getDocument } from '../services/firestoreService.js';
import { sendNotification } from '../services/notificationService.js';
import { errorHandler } from '../utils/errorHandler.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// Register via Email or Phone
export const registerUser = async (req, res) => {
  const { firstName, lastName, email, address, phoneNumber, password, role } = req.body;

  try {
    let userRecord;

    if (email) {
      userRecord = await auth.createUser({ email, password });
    } else if (phoneNumber) {
      userRecord = await auth.createUser({ phoneNumber });
    } else {
      return errorResponse(res, "Email or phone number required", 400);
    }

    const userData = { uid: userRecord.uid, firstName, lastName, address, email, phoneNumber, role };
    await setDocument("users", userRecord.uid, userData);

    const token = jwt.sign({ uid: userRecord.uid, role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // if (fcmToken) {
    //   await sendNotification(fcmToken, "Welcome!", "Your account has been created successfully.");
    // }

    successResponse(res, `User registered successfully`, { token });
  } catch (error) {
    errorHandler(res, error);
  }
};

// Login via Email and Password
export const loginUser = async (req, res) => {
  const { email, password, } = req.body;

  try {
    const userRecord = await auth.getUserByEmail(email);
    const userData = await getDocument("users", userRecord.uid);

    if (!userData) return errorResponse(res, "User not found", 404);

    // if (fcmToken && fcmToken !== userData.fcmToken) {
    //   await updateDocument("users", userRecord.uid, { fcmToken });
    // }

    const accessToken = jwt.sign({ uid: userRecord.uid, role: userData.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ uid: userRecord.uid, role: userData.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // if (fcmToken) {
    //   await sendNotification(fcmToken, "Login Alert", "You have successfully logged in.");
    // }

    successResponse(res, "Login successful", { accessToken, refreshToken });
  } catch (error) {
    errorHandler(res, error);
  }
};


// Phone Number Login (Simplified for Firebase Phone Auth)
export const phoneLogin = async (req, res) => {
  return errorResponse(res, "Phone authentication must be handled on the client-side.", 400);
};

// Login via Google OAuth
export const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const credential = await auth.verifyIdToken(idToken);
    const { uid, email } = credential;

    let userData = await getDocument("users", uid);

    if (!userData) {
      userData = { uid, email, role: "customer" };
      await setDocument("users", uid, userData);
    }

    const accessToken = jwt.sign({ uid, email, role: userData.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    successResponse(res, "Login successful", { accessToken });
  } catch (error) {
    errorHandler(res, error);
  }
};



// Get current user 
export const getCurrentUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];  // Extract token from Authorization header

  if (!token) {
    return errorResponse(res, "No token provided", 403);
  }
  try {
    // Verify the token and extract user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { uid } = decoded;

    // Fetch user data from Firestore
    const userData = await getDocument("users", uid);
    if (!userData) return errorResponse(res, "User not found", 404);

    // Return user profile data
    successResponse(res, "User profile fetched successfully", userData);
  } catch (error) {
    errorResponse(res, "Invalid or expired token", 401);
  }
};