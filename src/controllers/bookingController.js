import { setDocument, getDocument, getCollection, updateDocument, deleteDocument } from '../services/firestoreService.js';
import { sendNotification } from '../services/notificationService.js';
import { errorHandler } from '../utils/errorHandler.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// helper function for generating unique transaction #
const generateInvoiceNumber = () => {
  return `KZN-INV#${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`};

  //  helper function for generating recurring dates
  const generateRecurringDates = (startDate, frequency, occurrences) => {
    const dates = [];
    let currentDate = new Date(startDate);
  
    for (let i = 0; i < occurrences; i++) {
      dates.push(new Date(currentDate).toISOString());
  
      switch (frequency) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
    }
  
    return dates;
  };

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
    const invoiceNumber = generateInvoiceNumber();
    const bookingId = `KZN-BKG#${Date.now().toString()}`; // Generate unique ID (or use Firestore auto-ID)

    let bookingEntries = [];

    if (recurringSchedule) {
      const { frequency, occurrences } = recurringSchedule;
      const recurringDates = generateRecurringDates(schedule, frequency, occurrences);

      recurringDates.forEach((date, index) => {
        const recurringBookingId = `${bookingId}-${index + 1}`;
        bookingEntries.push({
          bookingId: recurringBookingId,
          customerId,
          cleanerIds,
          serviceType,
          serviceCategory,
          addOns,
          schedule: date,
          recurringSchedule, 
          status,
          mop,
          invoiceNumber: `${invoiceNumber}-${index + 1}`,
          address,
          specialInstructions,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });
    } else {
      bookingEntries.push({
        bookingId,
        customerId,
        cleanerIds,
        serviceType,
        serviceCategory,
        addOns,
        schedule,
        status,
        mop,
        invoiceNumber,
        address,
        specialInstructions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Store all bookings in Firestore
    for (const booking of bookingEntries) {
      await setDocument('bookings', booking.bookingId, booking);
    }

    // Notify all assigned cleaners
    for (const cleanerId of cleanerIds) {
      await sendNotification(cleanerId, 'New Booking Assigned', `You have a new ${serviceType} booking.`);
    }

    successResponse(res, 'Booking(s) created successfully', { bookings: bookingEntries });
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
