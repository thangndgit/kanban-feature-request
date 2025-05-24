import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  token: String,
  role: String,
});

export default mongoose.model('admin', adminSchema);
