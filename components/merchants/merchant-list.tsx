"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, AlertCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface MerchantStats {
  totalMerchants: number
  totalOutstanding: number
  pendingPayouts: number
}

export default function MerchantStats() {
  const [stats, setStats] = useState<MerchantStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMerchantStats() {
      try {
        const response = await fetch("/api/merchants/stats")

        if (!response.ok) {
          throw new Error("Failed to fetch merchant statistics")
        }

        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error("Error fetching merchant stats:", err)
        setError("Failed to load merchant statistics")
        // Fallback data
        setStats({
          totalMerchants: 0,
          totalOutstanding: 0,
          pendingPayouts: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMerchantStats()
  }, [])

  if (loading) {
    return <MerchantStatsSkeleton />
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
          <CardTitle className="text-sm font-medium">Total Merchants</CardTitle>
          <CardDescription>Active suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{stats?.totalMerchants || 0}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
          <CardDescription>Total amount due</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{formatCurrency(stats?.totalOutstanding || 0)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
          <CardDescription>Awaiting processing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-warning mr-2" />
            <span className="text-2xl font-bold">{stats?.pendingPayouts || 0}</span>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function MerchantStatsSkeleton() {
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

