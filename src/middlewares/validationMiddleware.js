import Joi from 'joi';

// Validate user registration
export const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.number().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('customer', 'admin', 'cleaner').required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

// Validate login credentials (email/password)
export const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

// Validate booking creation (service type, time, etc.)
export const validateBooking = (req, res, next) => {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    cleanerIds: Joi.array().items(Joi.string()).min(1).required(), 
    serviceType: Joi.string().valid('carpet', 'end-of-lease', 'residential', 'ndis', 'office', 'spring', 'upholstery').required(),
    serviceCategory: Joi.string().valid('regular', 'deep').required(),
    addOns: Joi.array().items(Joi.string()).optional(),
    schedule: Joi.date().iso().required(), // ISO format date
    recurringSchedule: Joi.object({
      frequency: Joi.string().valid('daily', 'weekly', 'monthly').required(),
      endDate: Joi.date().iso().greater(Joi.ref('/schedule')).required()// Limit to 12 occurrences max
    }).optional(),
    status: Joi.string().valid('pending', 'in-progress', 'completed', 'cancelled', 'paid').required(),
    mop: Joi.string().valid('card', 'applePay', 'googlePay', 'stripe', 'paypal').required(),
    address: Joi.string().optional(),
    specialInstructions: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

// Validate user update (name, email, role)
export const validateUserUpdate = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};
