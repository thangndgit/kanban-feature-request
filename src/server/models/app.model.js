// src/server/models/app.model.js
import mongoose from 'mongoose';

const appSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    apiKey: { type: String, required: true, unique: true, length: 32 },
    description: { type: String, trim: true, maxlength: 500 },
    imageUrl: { type: String, trim: true, default: 'https://placehold.co/500x500?text=NO+IMAGE' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index for faster queries
appSchema.index({ apiKey: 1 });
appSchema.index({ isActive: 1 });

export default mongoose.model('App', appSchema);

