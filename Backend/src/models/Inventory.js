import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  qty: { type: String, required: true },
  capacity: { type: String, required: true },
  percentage: { type: Number, required: true },
  status: { type: String, enum: ['NORMAL', 'WARNING', 'CRITICAL'], default: 'NORMAL' },
  category: { type: String, default: 'General' }
}, { timestamps: true });

export const Inventory = mongoose.model('Inventory', InventorySchema);
