import mongoose, { Schema, type Document } from "mongoose"

export interface IMerchant extends Document {
  name: string
  contactPerson: string
  phone: string
  email: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  supplyCategories: string[]
  paymentTerms: string
  bankDetails: {
    accountName: string
    accountNumber: string
    bankName: string
    ifscCode: string
  }
  currentBalance: number
  createdAt: Date
  updatedAt: Date
}

const MerchantSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String, default: "India" },
    },
    supplyCategories: [{ type: String }],
    paymentTerms: { type: String },
    bankDetails: {
      accountName: { type: String },
      accountNumber: { type: String },
      bankName: { type: String },
      ifscCode: { type: String },
    },
    currentBalance: { type: Number, default: 0 },
  },
  { timestamps: true },
)

// Create indexes for better performance, but only if the model doesn't already exist
if (!mongoose.models.Merchant) {
  MerchantSchema.index({ name: 1 })
  MerchantSchema.index({ phone: 1 })
}

export default mongoose.models.Merchant || mongoose.model<IMerchant>("Merchant", MerchantSchema)

