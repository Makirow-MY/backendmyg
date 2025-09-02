const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  personal: {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      required: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    zipCode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'paypal', 'MTN MoMo'], // Updated to include all payment methods
      required: true,
    },
    cardNumber: {
      type: String,
      default: '',
      trim: true,
    },
    cardName: {
      type: String,
      default: '',
      trim: true,
    },
    expiry: {
      type: String,
      default: '',
      trim: true,
    },
    cvv: {
      type: String,
      default: '',
      trim: true,
    },
    bankAccount: {
      type: String,
      default: '',
      trim: true,
    },
    bankRouting: {
      type: String,
      default: '',
      trim: true,
    },
    bankName: {
      type: String,
      default: '',
      trim: true,
    },
  },
  cartItems: [{
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [{
      type: String,
      trim: true,
    }],
  }],
  amount: {
    type: String,
    required: true,
    trim: true,
  },
  currency: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt timestamp on save
TransactionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.PaymentTransaction || mongoose.model('PaymentTransaction', TransactionSchema, 'transactions');