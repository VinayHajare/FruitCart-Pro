import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Transaction from "@/models/transaction"

export async function GET() {
  try {
    await connectToDatabase()

    // Get all transactions
    const transactions = await Transaction.find()

    // Calculate sales by product
    const productSales = new Map()

    transactions.forEach((transaction) => {
      transaction.items.forEach((item: { name: string; quantity: number; total: number }) => {
        const productName: string = item.name
        const quantity: number = item.quantity
        const total: number = item.total

        if (productSales.has(productName)) {
          const current = productSales.get(productName)
          productSales.set(productName, {
            name: productName,
            quantity: current.quantity + quantity,
            total: current.total + total,
            averagePrice: (current.total + total) / (current.quantity + quantity),
          })
        } else {
          productSales.set(productName, {
            name: productName,
            quantity,
            total,
            averagePrice: total / quantity,
          })
        }
      })
    })

    // Convert to array and sort by total sales
    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)

    return NextResponse.json({ products: topProducts })
  } catch (error) {
    console.error("Error fetching top products:", error)
    return NextResponse.json({ error: "Failed to fetch top products data" }, { status: 500 })
  }
}

