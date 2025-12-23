"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface Payout {
  _id: string
  date: string
  amount: number
  paymentMethod: string
  referenceNumber?: string
  status: string
  createdBy: {
    name: string
  }
}

interface MerchantPayoutHistoryProps {
  merchantId: string
  initialPayouts?: Payout[]
}

export default function MerchantPayoutHistory({ merchantId, initialPayouts = [] }: MerchantPayoutHistoryProps) {
  const [payouts, setPayouts] = useState<Payout[]>(initialPayouts)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { toast } = useToast()

  const fetchPayouts = async (pageNum: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/payouts?merchant=${merchantId}&page=${pageNum}&limit=10`)

      if (!response.ok) throw new Error("Failed to fetch payouts")

      const data = await response.json()

      if (pageNum === 1) {
        setPayouts(data.payouts)
      } else {
        setPayouts((prev) => [...prev, ...data.payouts])
      }

      setHasMore(data.pagination.page < data.pagination.pages)
    } catch (error) {
      console.error("Error fetching payouts:", error)
      toast({
        title: "Error",
        description: "Failed to load payout history. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (initialPayouts.length === 0) {
      fetchPayouts(1)
    } else {
      // We already have initial payouts, check if we need to load more
      setHasMore(initialPayouts.length === 5) // Assuming we loaded 5 initially
    }
  }, [merchantId, initialPayouts.length])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPayouts(nextPage)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>
      case "pending":
        return <Badge variant="warning">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "cash":
        return "Cash"
      case "bank_transfer":
        return "Bank Transfer"
      case "check":
        return "Check"
      case "upi":
        return "UPI"
      default:
        return method
    }
  }

  if (payouts.length === 0 && !isLoading) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No payment history found for this merchant.</p>
        <div className="mt-4">
          <Link href={`/merchants/payouts/new?merchant=${merchantId}`}>
            <Button size="sm">Create First Payout</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.map((payout) => (
              <TableRow key={payout._id.toString()}>
                <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{formatCurrency(payout.amount)}</TableCell>
                <TableCell>{getPaymentMethodLabel(payout.paymentMethod)}</TableCell>
                <TableCell>{payout.referenceNumber || "-"}</TableCell>
                <TableCell>{getStatusBadge(payout.status)}</TableCell>
                <TableCell>{payout.createdBy?.name || "Unknown"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={loadMore} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}

