import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/mongodb"
import Product from "@/models/product"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    let filter = {}
    if (query) {
      filter = {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
          { sku: { $regex: query, $options: "i" } },
        ],
      }
    }

    const products = await Product.find(filter).sort({ createdAt: -1 })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const data = await request.json()

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: data.sku })
    if (existingProduct) {
      return NextResponse.json({ error: "A product with this SKU already exists" }, { status: 400 })
    }

    const product = new Product(data)
    await product.save()

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

