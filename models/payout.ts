import mongoose, { Schema, type Document } from "mongoose"

export interface IPayout extends Document {
  merchant: mongoose.Types.ObjectId
  amount: number
  date: Date
  paymentMethod: string
  referenceNumber: string
  notes: string
  status: string
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const PayoutSchema: Schema = new Schema(
  {
    merchant: { type: Schema.Types.ObjectId, ref: "Merchant", required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "bank_transfer", "check", "upi"],
    },
    referenceNumber: { type: String },
    notes: { type: String },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
)

// Create indexes for better performance, but only if the model doesn't already exist
if (!mongoose.models.Payout) {
  PayoutSchema.index({ merchant: 1 })
  PayoutSchema.index({ date: -1 })
  PayoutSchema.index({ status: 1 })
}

export default mongoose.models.Payout || mongoose.model<IPayout>("Payout", PayoutSchema)

