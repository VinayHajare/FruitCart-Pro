import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import StockAdjustment from "@/models/stock-adjustment"

export async function GET() {
  try {
    await connectToDatabase()

    // Get recent stock adjustments
    const adjustments = await StockAdjustment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("product", "name")
      .populate("createdBy", "name")

    // Convert to plain objects and format dates
    const formattedAdjustments = adjustments.map((adjustment) => {
      const plainObj = adjustment.toObject()
      return {
        ...plainObj,
        _id: plainObj._id.toString(),
        createdAt: plainObj.createdAt.toISOString(),
        product: plainObj.product
          ? {
              _id: plainObj.product._id.toString(),
              name: plainObj.product.name,
            }
          : null,
        createdBy: plainObj.createdBy
          ? {
              _id: plainObj.createdBy._id.toString(),
              name: plainObj.createdBy.name,
            }
          : null,
      }
    })

    return NextResponse.json(formattedAdjustments)
  } catch (error) {
    console.error("Error fetching inventory actions:", error)
    return NextResponse.json({ error: "Failed to fetch inventory actions" }, { status: 500 })
  }
}

