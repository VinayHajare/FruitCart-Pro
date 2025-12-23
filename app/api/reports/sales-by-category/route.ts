import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Transaction from "@/models/transaction"
import Product from "@/models/product"

// Define TransactionType and TransactionItemType interfaces
interface TransactionItemType {
  product: string | { toString(): string }
  total: number
}

interface TransactionType {
  items: TransactionItemType[]
}

export async function GET() {
  try {
    await connectToDatabase()

    // Get all transactions
    const transactions = await Transaction.find()

    // Extract all product IDs from transactions
    const productIds: string[] = transactions.flatMap((transaction: TransactionType) => 
      transaction.items.map((item: TransactionItemType) => item.product.toString())
    )

    // Get products with their categories
    const products = await Product.find({ _id: { $in: productIds } }, { category: 1 })

    // Create a map of product ID to category
    const productCategories = new Map()
    products.forEach((product) => {
      productCategories.set(product._id.toString(), product.category)
    })

    // Calculate sales by category
    const categorySales = new Map()

    transactions.forEach((transaction) => {
      transaction.items.forEach((item: TransactionItemType) => {
        const productId: string = item.product.toString()
        const category: string = productCategories.get(productId) || "Uncategorized"
        const amount: number = item.total

        if (categorySales.has(category)) {
          categorySales.set(category, (categorySales.get(category) as number) + amount)
        } else {
          categorySales.set(category, amount)
        }
      })
    })

    // Convert to array for chart
    const data = Array.from(categorySales.entries()).map(([name, value]) => ({
      name,
      value,
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching sales by category:", error)
    return NextResponse.json({ error: "Failed to fetch sales by category" }, { status: 500 })
  }
}

