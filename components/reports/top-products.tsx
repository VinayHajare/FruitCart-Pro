"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface Product {
  name: string
  quantity: number
  total: number
  averagePrice: number
}

export default function TopProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/reports/top-products")

        if (!response.ok) {
          throw new Error("Failed to fetch top products data")
        }

        const data = await response.json()
        setProducts(data.products)
        setError(null)
      } catch (err) {
        console.error("Error fetching top products:", err)
        setError("Failed to load top products data")
        // Set some sample data for demonstration
        setProducts([
          { name: "Apples", quantity: 120, total: 12000, averagePrice: 100 },
          { name: "Bananas", quantity: 85, total: 8500, averagePrice: 100 },
          { name: "Oranges", quantity: 75, total: 7500, averagePrice: 100 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error} - Showing sample data instead.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity Sold</TableHead>
              <TableHead>Average Price</TableHead>
              <TableHead>Total Sales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {product.name}
                  <Badge className="ml-2" variant={index < 3 ? "default" : "outline"}>
                    #{index + 1}
                  </Badge>
                </TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{formatCurrency(product.averagePrice)}</TableCell>
                <TableCell className="font-medium">{formatCurrency(product.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

