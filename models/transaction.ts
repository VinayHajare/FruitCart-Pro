import mongoose, { Schema, type Document } from "mongoose"

export interface ITransaction extends Document {
  date: Date
  operator: mongoose.Types.ObjectId
  customer: {
    name: string
    phone: string
    email: string
  }
  items: Array<{
    product: mongoose.Types.ObjectId
    name: string
    quantity: number
    unit: string
    price: number
    discount: number
    total: number
  }>
  subtotal: number
  discount: number
  tax: number
  total: number
  paymentMethod: string
  paymentStatus: string
  notes: string
  createdAt: Date
  updatedAt: Date
}

const TransactionSchema: Schema = new Schema(
  {
    date: { type: Date, default: Date.now },
    operator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customer: {
      name: { type: String },
      phone: { type: String },
      email: { type: String },
    },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        total: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "card", "upi", "credit"],
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["paid", "pending", "partial"],
      default: "paid",
    },
    notes: { type: String },
  },
  { timestamps: true },
)

// Create indexes for better performance, but only if the model doesn't already exist
if (!mongoose.models.Transaction) {
  TransactionSchema.index({ date: -1 })
  TransactionSchema.index({ "customer.phone": 1 })
  TransactionSchema.index({ paymentStatus: 1 })
}

export default mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema)

