import mongoose, { Schema, type Document } from "mongoose"

export interface IProduct extends Document {
  name: string
  category: string
  description: string
  image: string
  sku: string
  regularPrice: number
  wholesalePrice: number
  discountPrice: number
  inventoryQuantity: number
  unit: string
  supplier: mongoose.Types.ObjectId
  seasonal: boolean
  shelfLife: number
  createdAt: Date
  updatedAt: Date
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    sku: { type: String, required: true, unique: true },
    regularPrice: { type: Number, required: true },
    wholesalePrice: { type: Number },
    discountPrice: { type: Number },
    inventoryQuantity: { type: Number, default: 0 },
    unit: { type: String, required: true, enum: ["kg", "piece", "dozen", "gram"] },
    supplier: { type: Schema.Types.ObjectId, ref: "Merchant" },
    seasonal: { type: Boolean, default: false },
    shelfLife: { type: Number }, // in days
  },
  { timestamps: true },
)

// Create indexes for better performance, but only if the model doesn't already exist
if (!mongoose.models.Product) {
  ProductSchema.index({ name: 1 })
  ProductSchema.index({ category: 1 })
  ProductSchema.index({ sku: 1 }, { unique: true })
}

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)

