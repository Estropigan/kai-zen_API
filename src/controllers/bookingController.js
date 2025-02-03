import { setDocument, getDocument, getCollection, updateDocument, deleteDocument } from '../services/firestoreService.js';
import { sendNotification } from '../services/notificationService.js';
import { errorHandler } from '../utils/errorHandler.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';


const generateInvoiceNumber = () => {
  return `KZN-INV#${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`};

// Create Booking
export const createBooking = async (req, res) => {
  const { 
    customerId, 
    cleanerIds = [], 
    serviceType, 
    serviceCategory, 
    addOns = [], 
    schedule, 
    recurringSchedule = null, 
    status = "pending", 
    mop,  
    address,
    specialInstructions 
  } = req.body;

  try {
    const bookingId = Date.now().toString(); // Generate unique ID (or use Firestore auto-ID)
    const invoiceNumber = generateInvoiceNumber();

    const bookingData = { 
      bookingId,
      customerId, 
      cleanerIds, 
      serviceType, 
      serviceCategory,
      addOns, 
      schedule, 
      recurringSchedule, 
      status, 
      mop,
      invoiceNumber,
      address, // Optional: Customer address for on-site cleaning
      specialInstructions, // Optional: Special cleaning instructions
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store booking in Firestore
    await setDocument('bookings', bookingId, bookingData);

    // Notify all assigned cleaners
    for (const cleanerId of cleanerIds) {
      await sendNotification(cleanerId, 'New Booking Assigned', `You have a new ${serviceType} booking.`);
    }

    successResponse(res, 'Booking created successfully', { bookingId, invoiceNumber });
  } catch (error) {
    errorHandler(res, error);
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await getDocument('bookings', bookingId);
    if (!booking) {
      return errorResponse(res, 'Booking not found');
    }
    successResponse(res, 'Booking retrieved successfully', booking);
  } catch (error) {
    errorHandler(res, error);
  }
}

// Get All Bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await getCollection('bookings');
    successResponse(res, 'Bookings retrieved successfully', bookings);
  } catch (error) {
    errorHandler(res, error);
  }
};



// Update Booking Status
export const updateBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { status, cleanerId } = req.body;

  try {
    await updateDocument('bookings', bookingId, { status, cleanerId });

    // Send a notification if booking status is updated
    if (status === 'Completed') {
      await sendNotification(cleanerId, 'Booking Completed', 'You have successfully completed a booking.');
    }

    successResponse(res, 'Booking updated successfully');
  } catch (error) {
    errorHandler(res, error);
  }
};

// Delete Booking
export const deleteBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    await deleteDocument('bookings', bookingId);
    successResponse(res, 'Booking deleted successfully');
  } catch (error) {
    errorHandler(res, error);
  }
};
