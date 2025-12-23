import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/mongodb"
import Transaction from "@/models/transaction"
import Product from "@/models/product"
import StockAdjustment from "@/models/stock-adjustment"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Get date range (last 30 days)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    // Get all products
    const products = await Product.find({}, { name: 1, category: 1, inventoryQuantity: 1 })

    // Get all transactions in date range
    const transactions = await Transaction.find({
      date: { $gte: startDate, $lte: endDate },
    })

    // Get all stock adjustments in date range
    const stockAdjustments = await StockAdjustment.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })

    // Calculate inventory turnover for each product
    const productMap = new Map()

    // Initialize product map with current inventory
    products.forEach((product) => {
      productMap.set(product._id.toString(), {
        id: product._id.toString(),
        name: product.name,
        category: product.category,
        currentStock: product.inventoryQuantity,
        sold: 0,
        received: 0,
        wasted: 0,
        turnoverRate: 0,
      })
    })

    // Add transaction data (sales)
    transactions.forEach((transaction) => {
    transaction.items.forEach((item: { product: string; quantity: number }) => {
      const productId = item.product.toString()
      if (productMap.has(productId)) {
        const product = productMap.get(productId) as {
        id: string
        name: string
        category: string
        currentStock: number
        sold: number
        received: number
        wasted: number
        turnoverRate: number
        }
        product.sold += item.quantity
      }
    })
    })

    // Add stock adjustment data
    stockAdjustments.forEach((adjustment) => {
      const productId = adjustment.product.toString()
      if (productMap.has(productId)) {
        const product = productMap.get(productId)
        if (adjustment.type === "addition") {
          product.received += adjustment.quantity
        } else if (adjustment.type === "reduction") {
          if (adjustment.reason === "damaged" || adjustment.reason === "expired") {
            product.wasted += adjustment.quantity
          }
        }
      }
    })

    // Calculate turnover rate
    // Formula: Turnover Rate = Sales / Average Inventory
    productMap.forEach((product) => {
      const averageInventory = (product.currentStock + product.received) / 2
      product.turnoverRate = averageInventory > 0 ? product.sold / averageInventory : 0
    })

    // Convert map to array and sort by turnover rate
    const inventoryTurnover = Array.from(productMap.values())
      .sort((a, b) => b.turnoverRate - a.turnoverRate)
      .slice(0, 10) // Get top 10

    // Calculate category averages
    const categoryMap = new Map()
    inventoryTurnover.forEach((product) => {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, {
          category: product.category,
          totalTurnover: 0,
          count: 0,
          averageTurnover: 0,
        })
      }

      const category = categoryMap.get(product.category)
      category.totalTurnover += product.turnoverRate
      category.count++
    })

    categoryMap.forEach((category) => {
      category.averageTurnover = category.totalTurnover / category.count
    })

    const categoryTurnover = Array.from(categoryMap.values()).sort((a, b) => b.averageTurnover - a.averageTurnover)

    return NextResponse.json({
      products: inventoryTurnover,
      categories: categoryTurnover,
    })
  } catch (error) {
    console.error("Error fetching inventory turnover:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

