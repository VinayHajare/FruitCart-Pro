"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface SalesStats {
  todaySales: number
  todayOrders: number
  thisMonthSales: number
  thisMonthOrders: number
  dailyChange: number
  monthlyChange: number
}

export default function SalesOverview() {
  const [stats, setStats] = useState<SalesStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSalesStats = async () => {
      try {
        const response = await fetch("/api/reports/sales-overview")

        if (!response.ok) {
          throw new Error("Failed to fetch sales data")
        }

        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error("Error fetching sales stats:", err)
        setError("Failed to load sales data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSalesStats()
  }, [])

  if (error) {
    return (
      <>
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Error</CardTitle>
                <CardDescription>Failed to load data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-red-500 text-sm">{error}</div>
              </CardContent>
            </Card>
          ))}
      </>
    )
  }

  if (isLoading || !stats) {
    return (
      <>
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-[140px]" />
                <Skeleton className="h-3 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[80px]" />
              </CardContent>
            </Card>
          ))}
      </>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
          <CardDescription>Total revenue today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{formatCurrency(stats.todaySales)}</span>
            </div>
            {stats.dailyChange !== 0 && (
              <div
                className={`flex items-center text-xs ${stats.dailyChange >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {stats.dailyChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                <span>{Math.abs(stats.dailyChange).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
          <CardDescription>Number of transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <ShoppingCart className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{stats.todayOrders}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
          <CardDescription>Current month revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{formatCurrency(stats.thisMonthSales)}</span>
            </div>
            {stats.monthlyChange !== 0 && (
              <div
                className={`flex items-center text-xs ${stats.monthlyChange >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {stats.monthlyChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                <span>{Math.abs(stats.monthlyChange).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Monthly Orders</CardTitle>
          <CardDescription>Current month transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <ShoppingCart className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{stats.thisMonthOrders}</span>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

