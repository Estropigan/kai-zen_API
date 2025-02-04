import express from 'express';
import { validateUserUpdate } from '../middlewares/validationMiddleware.js';
import { createUser, getUser, getAllUsers, updateUser, deleteUser } from '../controllers/userController.js';
import { verifyToken, isAdmin } from '../middlewares/authenticationMiddleware.js'

const router = express.Router();

router.post('/create-user', verifyToken, isAdmin, createUser);
router.get('/', verifyToken, getAllUsers);
router.get('/:uid', verifyToken, getUser);
router.put('/update-user/:uid',  verifyToken, validateUserUpdate, updateUser);
router.delete('/delete-user/:uid',  verifyToken, isAdmin, deleteUser);
export default router;
