"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface MerchantTotal {
  merchantId: string
  merchantName: string
  totalAmount: number
  count: number
}

interface PayoutData {
  merchantTotals: MerchantTotal[]
}

export default function MerchantPayouts() {
  const [data, setData] = useState<PayoutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/reports/merchant-payouts")

        if (!response.ok) {
          throw new Error("Failed to fetch merchant payout data")
        }

        const responseData = await response.json()
        setData(responseData)
        setError(null)
      } catch (err) {
        console.error("Error fetching merchant payouts:", err)
        setError("Failed to load merchant payout data")
        // Set some sample data for demonstration
        setData({
          merchantTotals: [
            { merchantId: "1", merchantName: "Farm Fresh Produce", totalAmount: 25000, count: 5 },
            { merchantId: "2", merchantName: "Organic Farms", totalAmount: 18000, count: 3 },
            { merchantId: "3", merchantName: "Local Growers", totalAmount: 12000, count: 4 },
          ],
        })
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
              <TableHead>Merchant</TableHead>
              <TableHead>Number of Payouts</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Average Payout</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.merchantTotals.map((item) => (
              <TableRow key={item.merchantId}>
                <TableCell className="font-medium">{item.merchantName}</TableCell>
                <TableCell>{item.count}</TableCell>
                <TableCell className="font-medium">{formatCurrency(item.totalAmount)}</TableCell>
                <TableCell>{formatCurrency(item.totalAmount / item.count)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

