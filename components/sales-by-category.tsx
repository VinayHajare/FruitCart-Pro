"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import connectToDatabase from "@/lib/mongodb"
import Transaction from "@/models/transaction"
import Product from "@/models/product"

async function getSalesByCategory() {
  await connectToDatabase()

  // Get all transactions
  const transactions = await Transaction.find()

  // Extract all product IDs from transactions
  const productIds = transactions.flatMap((transaction) => transaction.items.map((item) => item.product))

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
    transaction.items.forEach((item) => {
      const productId = item.product.toString()
      const category = productCategories.get(productId) || "Uncategorized"
      const amount = item.total

      if (categorySales.has(category)) {
        categorySales.set(category, categorySales.get(category) + amount)
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

  return data
}

// This would be fetched from the server in a real implementation
// For now, we'll use sample data
const sampleData = [
  { name: "Fruits", value: 35000 },
  { name: "Vegetables", value: 28000 },
  { name: "Dairy", value: 15000 },
  { name: "Bakery", value: 12000 },
  { name: "Other", value: 10000 },
]

// Custom colors for the chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export default function SalesByCategory() {
  // In a real implementation, we would use the data from the server
  // const data = await getSalesByCategory()
  const data = sampleData

  return (
    <ChartContainer
      config={{
        fruits: {
          label: "Fruits",
          color: COLORS[0],
        },
        vegetables: {
          label: "Vegetables",
          color: COLORS[1],
        },
        dairy: {
          label: "Dairy",
          color: COLORS[2],
        },
        bakery: {
          label: "Bakery",
          color: COLORS[3],
        },
        other: {
          label: "Other",
          color: COLORS[4],
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

