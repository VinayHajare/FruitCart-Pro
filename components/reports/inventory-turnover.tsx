"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductTurnover {
  id: string
  name: string
  category: string
  currentStock: number
  sold: number
  received: number
  wasted: number
  turnoverRate: number
}

interface CategoryTurnover {
  category: string
  totalTurnover: number
  count: number
  averageTurnover: number
}

interface InventoryTurnoverData {
  products: ProductTurnover[]
  categories: CategoryTurnover[]
}

// Sample data for fallback
const sampleData: InventoryTurnoverData = {
  products: [
    {
      id: "1",
      name: "Apples",
      category: "fruits",
      currentStock: 100,
      sold: 250,
      received: 300,
      wasted: 10,
      turnoverRate: 2.5,
    },
    {
      id: "2",
      name: "Bananas",
      category: "fruits",
      currentStock: 80,
      sold: 320,
      received: 350,
      wasted: 15,
      turnoverRate: 3.8,
    },
    {
      id: "3",
      name: "Carrots",
      category: "vegetables",
      currentStock: 150,
      sold: 180,
      received: 200,
      wasted: 5,
      turnoverRate: 1.2,
    },
    {
      id: "4",
      name: "Potatoes",
      category: "vegetables",
      currentStock: 200,
      sold: 150,
      received: 250,
      wasted: 20,
      turnoverRate: 0.7,
    },
    {
      id: "5",
      name: "Milk",
      category: "dairy",
      currentStock: 50,
      sold: 300,
      received: 320,
      wasted: 10,
      turnoverRate: 5.7,
    },
  ],
  categories: [
    { category: "dairy", totalTurnover: 5.7, count: 1, averageTurnover: 5.7 },
    { category: "fruits", totalTurnover: 6.3, count: 2, averageTurnover: 3.15 },
    { category: "vegetables", totalTurnover: 1.9, count: 2, averageTurnover: 0.95 },
  ],
}

export default function InventoryTurnover() {
  const [data, setData] = useState<InventoryTurnoverData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/reports/inventory-turnover")

        if (!response.ok) {
          throw new Error("Failed to fetch inventory turnover data")
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        console.error("Error fetching inventory turnover data:", err)
        setError("Could not load inventory turnover data. Using sample data instead.")
        setData(sampleData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  const displayData = data || sampleData

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-md mb-4">{error}</div>
      )}

      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="pt-4">
          <Card>
            <CardContent className="p-0">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displayData.products} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => value.toFixed(2)}
                      labelFormatter={(label) => `Product: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="turnoverRate" name="Turnover Rate" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayData.products.slice(0, 3).map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <p className="text-2xl font-bold">{product.turnoverRate.toFixed(2)}</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    Sold: {product.sold} | Stock: {product.currentStock}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="pt-4">
          <Card>
            <CardContent className="p-0">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displayData.categories} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => value.toFixed(2)}
                      labelFormatter={(label) => `Category: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="averageTurnover" name="Average Turnover Rate" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[350px] w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  )
}

