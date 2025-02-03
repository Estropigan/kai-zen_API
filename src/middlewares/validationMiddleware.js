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
    cleanerId: Joi.array().required(),
    serviceType: Joi.string().valid('regular', 'deep', 'carpet', 'windows').required(),
    time: Joi.date().iso().required(), // ISO format date
    status: Joi.string().valid('pending', 'in-progress', 'completed').required(),
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
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid('customer', 'admin', 'cleaner').optional(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};
