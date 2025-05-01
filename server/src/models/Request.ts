import mongoose from 'mongoose';

const repairRequestSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Opis jest wymagany'],
    minlength: [10, 'Opis musi mieć minimum 10 znaków']
  },
  location: {
    type: String,
    required: [true, 'Lokalizacja jest wymagana']
  },
  contact: {
    type: String,
    required: [true, 'Kontakt jest wymagany']
  },
  category: {
    type: String,
    enum: {
      values: ['plumbing', 'electrical', 'carpentry', 'painting', 'cleaning', 'other'],
      message: 'Nieprawidłowa kategoria'
    },
    required: [true, 'Kategoria jest wymagana']
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Nieprawidłowy priorytet'
    },
    default: 'medium'
  },
  status: {
    type: String,
    enum: {
      values: ['New', 'InProgress', 'Completed', 'Cancelled'],
      message: 'Nieprawidłowy status'
    },
    default: 'New'
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  handymanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notatki nie mogą przekraczać 500 znaków']
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
repairRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const RepairRequest = mongoose.model('RepairRequest', repairRequestSchema); 