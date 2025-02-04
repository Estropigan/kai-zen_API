import { auth } from '../config/firebase.js';
import { setDocument, getDocument, getCollection, updateDocument, deleteDocument } from '../services/firestoreService.js';
import { errorHandler } from '../utils/errorHandler.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const createUser = async (req, res) => {
  const { firstName, lastName, email, address, phoneNumber, password, role } = req.body;

  try {
    let createdUserRecord; 

    createdUserRecord = await auth.createUser({email, password});

    const createdUserData = {uid: createdUserRecord.uid, firstName, lastName, email, address, phoneNumber, role}
    await setDocument("users", createdUserRecord.uid, createdUserData)

    successResponse(res, 'User created successfully', createdUserData, 201);
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getUser = async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await getDocument('users', uid);
    if (!user) return errorResponse(res, 'User not found', 404);

    successResponse(res, 'User retrieved successfully', user);
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getAllUsers  = async (req, res) => {
  try {
    const users = await getCollection('users');
    successResponse(res, 'Users retrieved successfully', users);
  } catch (error) {
    errorHandler(res, error);
  }
}

export const updateUser = async (req, res) => {
  const { uid } = req.params;
  const { firstName, lastName, email, address } = req.body;

  try {
     await updateDocument('users', uid, { firstName, lastName, email, address });
    successResponse(res, 'User updated successfully', {firstName, lastName, email, address});
  } catch (error) {
    errorHandler(res, error);
  }
};

export const deleteUser = async (req, res) => {
  const { uid } = req.params;

  try {
    await deleteDocument('users', uid);
    successResponse(res, 'User deleted successfully');
  } catch (error) {
    errorHandler(res, error);
  }
};
