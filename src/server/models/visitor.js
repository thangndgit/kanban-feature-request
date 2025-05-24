import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    lowercase: true,
  },
  ip: String,
  country: String,
  countryCode: String,
  longitude: String,
  latitude: String,
  city: String,
  region: String,
  timezone: String,
  checkedUrls: [
    {
      url: String,
      count: Number,
      lastCheck: Date,
    },
  ],
});

export default mongoose.model("visitor", visitorSchema);
