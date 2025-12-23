import mongoose, { Schema, type Document } from "mongoose"

export interface IStockAdjustment extends Document {
  product: mongoose.Types.ObjectId
  type: "addition" | "reduction"
  quantity: number
  unit: string
  reason: string
  notes: string
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const StockAdjustmentSchema: Schema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    type: {
      type: String,
      required: true,
      enum: ["addition", "reduction"],
    },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    reason: {
      type: String,
      required: true,
      enum: ["purchase", "return", "damaged", "expired", "theft", "correction", "other"],
    },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
)

// Create indexes for better performance, but only if the model doesn't already exist
if (!mongoose.models.StockAdjustment) {
  StockAdjustmentSchema.index({ product: 1 })
  StockAdjustmentSchema.index({ createdAt: -1 })
  StockAdjustmentSchema.index({ type: 1 })
}

export default mongoose.models.StockAdjustment ||
  mongoose.model<IStockAdjustment>("StockAdjustment", StockAdjustmentSchema)

