import express from 'express';
import { validateBooking } from '../middlewares/validationMiddleware.js';
import { createBooking, getBookingById, getBookings, updateBooking, deleteBooking } from '../controllers/bookingController.js';
import { verifyToken, isAdmin } from '../middlewares/authenticationMiddleware.js'


const router = express.Router();

// Create a new booking
router.post('/create', verifyToken, validateBooking, createBooking);

// Get booking by id
router.get('/:bookingId', getBookingById)

// Get all bookings
router.get('/', getBookings);

// Update booking status
router.put('/update-booking/:id', verifyToken, isAdmin, validateBooking, updateBooking);

// Delete booking

router.delete('/delete-booking/:id', verifyToken, isAdmin, deleteBooking);

export default router;
