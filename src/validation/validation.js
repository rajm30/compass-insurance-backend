const Joi = require('joi');

// Quote validation schema
const quoteSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name cannot exceed 100 characters',
      'any.required': 'Full name is required'
    }),
  
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
  
  phoneNumber: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .trim()
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
      'string.empty': 'Phone number is required',
      'any.required': 'Phone number is required'
    }),
  
  insuranceType: Joi.string()
    .valid(
      'health', 'motor', 'life', 'home', 'travel', 'commercial', 
      'marine', 'fire', 'liability', 'personal-accident', 
      'critical-illness', 'senior-citizen', 'child', 'term', 
      'endowment', 'ulip', 'pension', 'two-wheeler', 
      'commercial-vehicle', 'crop', 'pet', 'cyber', 'other'
    )
    .required()
    .messages({
      'any.only': 'Please select a valid insurance type',
      'any.required': 'Insurance type is required'
    }),
  
  additionalInfo: Joi.string()
    .trim()
    .max(1000)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Additional information cannot exceed 1000 characters'
    })
});

// Contact validation schema
const contactSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name cannot exceed 100 characters',
      'any.required': 'Full name is required'
    }),
  
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
  
  contactNumber: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .trim()
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid contact number',
      'string.empty': 'Contact number is required',
      'any.required': 'Contact number is required'
    }),
  
  subject: Joi.string()
    .valid('quote', 'claim', 'policy', 'other')
    .required()
    .messages({
      'any.only': 'Please select a valid subject',
      'any.required': 'Subject is required'
    }),
  
  message: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.empty': 'Message is required',
      'string.min': 'Message must be at least 10 characters long',
      'string.max': 'Message cannot exceed 2000 characters',
      'any.required': 'Message is required'
    })
});

// Update validation schemas (for PUT requests)
const quoteUpdateSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name cannot exceed 100 characters'
    }),
  
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  
  phoneNumber: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .trim()
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  
  insuranceType: Joi.string()
    .valid(
      'health', 'motor', 'life', 'home', 'travel', 'commercial', 
      'marine', 'fire', 'liability', 'personal-accident', 
      'critical-illness', 'senior-citizen', 'child', 'term', 
      'endowment', 'ulip', 'pension', 'two-wheeler', 
      'commercial-vehicle', 'crop', 'pet', 'cyber', 'other'
    )
    .optional()
    .messages({
      'any.only': 'Please select a valid insurance type'
    }),
  
  additionalInfo: Joi.string()
    .trim()
    .max(1000)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Additional information cannot exceed 1000 characters'
    })
});

const contactUpdateSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name cannot exceed 100 characters'
    }),
  
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  
  contactNumber: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .trim()
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid contact number'
    }),
  
  subject: Joi.string()
    .valid('quote', 'claim', 'policy', 'other')
    .optional()
    .messages({
      'any.only': 'Please select a valid subject'
    }),
  
  message: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .optional()
    .messages({
      'string.min': 'Message must be at least 10 characters long',
      'string.max': 'Message cannot exceed 2000 characters'
    })
});

// Validation middleware functions
const validateQuote = (req, res, next) => {
  const { error } = quoteSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

const validateContact = (req, res, next) => {
  const { error } = contactSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

const validateQuoteUpdate = (req, res, next) => {
  const { error } = quoteUpdateSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

const validateContactUpdate = (req, res, next) => {
  const { error } = contactUpdateSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

module.exports = {
  validateQuote,
  validateContact,
  validateQuoteUpdate,
  validateContactUpdate,
  quoteSchema,
  contactSchema,
  quoteUpdateSchema,
  contactUpdateSchema
};