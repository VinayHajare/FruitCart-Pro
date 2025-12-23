import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Product from "@/models/product"

export async function GET() {
  try {
    await connectToDatabase()

    // Total products in inventory
    const totalProducts = await Product.countDocuments()

    // Total products with low stock (less than or equal to 5 units)
    const lowStockProducts = await Product.countDocuments({ inventoryQuantity: { $lte: 5 } })

    // Calculate products expiring soon (within 7 days)
    const today = new Date()
    const sevenDaysLater = new Date(today)
    sevenDaysLater.setDate(today.getDate() + 7)

    // Find products where the expiration date falls within the next 7 days
    const expiringProducts = await Product.countDocuments({
      shelfLife: { $exists: true, $gt: 0 },
      $expr: {
        $lte: [{ $add: ["$createdAt", { $multiply: ["$shelfLife", 24 * 60 * 60 * 1000] }] }, sevenDaysLater.getTime()],
      },
    })

    return NextResponse.json({
      totalProducts,
      lowStockProducts,
      expiringProducts,
    })
  } catch (error) {
    console.error("Error fetching inventory stats:", error)
    return NextResponse.json({ error: "Failed to fetch inventory statistics" }, { status: 500 })
  }
}

