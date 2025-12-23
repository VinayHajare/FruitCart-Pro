"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface InventoryStats {
  totalProducts: number
  lowStockProducts: number
  expiringProducts: number
}

export default function InventoryOverview() {
  const [stats, setStats] = useState<InventoryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInventoryStats() {
      try {
        const response = await fetch("/api/inventory/stats")

        if (!response.ok) {
          throw new Error("Failed to fetch inventory statistics")
        }

        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error("Error fetching inventory stats:", err)
        setError("Failed to load inventory statistics")
        // Fallback data
        setStats({
          totalProducts: 0,
          lowStockProducts: 0,
          expiringProducts: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchInventoryStats()
  }, [])

  if (loading) {
    return <InventoryStatsSkeleton />
  }

  if (error) {
    return (
      <div className="col-span-3 p-4 border rounded-md bg-red-50">
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-muted-foreground mt-2">Please check your database connection and try again.</p>
      </div>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <CardDescription>Products in inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Package className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{stats?.totalProducts || 0}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          <CardDescription>Products to restock</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-destructive mr-2" />
            <span className="text-2xl font-bold">{stats?.lowStockProducts || 0}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          <CardDescription>Within 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-warning mr-2" />
            <span className="text-2xl font-bold">{stats?.expiringProducts || 0}</span>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function InventoryStatsSkeleton() {
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-[140px]" />
          <Skeleton className="h-3 w-[100px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[80px]" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-[140px]" />
          <Skeleton className="h-3 w-[100px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[80px]" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-[140px]" />
          <Skeleton className="h-3 w-[100px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[80px]" />
        </CardContent>
      </Card>
    </>
  )
}

