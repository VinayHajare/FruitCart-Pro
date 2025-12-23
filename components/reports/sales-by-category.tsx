"use client"

import { useEffect, useState } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface CategoryData {
  name: string
  value: number
}

// Custom colors for the chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export default function SalesByCategory() {
  const [data, setData] = useState<CategoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetch("/api/reports/sales-by-category")

        if (!response.ok) {
          throw new Error("Failed to fetch category data")
        }

        const categoryData = await response.json()
        setData(categoryData)
      } catch (err) {
        console.error("Error fetching category data:", err)
        setError("Failed to load category data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategoryData()
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  // If no data, show sample data
  const displayData =
    data.length > 0
      ? data
      : [
          { name: "Fruits", value: 35000 },
          { name: "Vegetables", value: 28000 },
          { name: "Dairy", value: 15000 },
          { name: "Bakery", value: 12000 },
          { name: "Other", value: 10000 },
        ]

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
            data={displayData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {displayData.map((entry, index) => (
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

