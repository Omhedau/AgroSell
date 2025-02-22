const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, unique: true, required: true },
  lang: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  role: { type: String, enum: ['Farmer', 'Owner', 'Admin'], default: 'Farmer' },
  profile: { type: String },
  isVerified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  address: { type: [AddressSchema], default: [] } // Added address attribute
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
