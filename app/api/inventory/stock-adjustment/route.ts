import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/mongodb"
import StockAdjustment from "@/models/stock-adjustment"
import Product from "@/models/product"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const data = await request.json()

    // Validate required fields
    if (!data.product || !data.type || !data.quantity || !data.reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find the product
    const product = await Product.findById(data.product)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Create stock adjustment record
    const stockAdjustment = new StockAdjustment({
      product: data.product,
      type: data.type,
      quantity: data.quantity,
      unit: data.unit,
      reason: data.reason,
      notes: data.notes,
      createdBy: session.user.id,
    })

    await stockAdjustment.save()

    // Update product inventory
    const quantityChange = data.type === "addition" ? data.quantity : -data.quantity

    // Ensure inventory doesn't go below zero for reductions
    if (data.type === "reduction" && product.inventoryQuantity < data.quantity) {
      return NextResponse.json({ error: "Insufficient inventory for reduction" }, { status: 400 })
    }

    await Product.findByIdAndUpdate(data.product, { $inc: { inventoryQuantity: quantityChange } })

    return NextResponse.json(stockAdjustment, { status: 201 })
  } catch (error) {
    console.error("Error creating stock adjustment:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("product")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    let query = {}
    if (productId) {
      query = { product: productId }
    }

    const adjustments = await StockAdjustment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("product", "name")
      .populate("createdBy", "name")

    const total = await StockAdjustment.countDocuments(query)

    return NextResponse.json({
      adjustments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching stock adjustments:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

