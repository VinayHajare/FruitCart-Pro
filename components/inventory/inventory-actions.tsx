"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface StockAdjustment {
  _id: string
  product: {
    _id: string
    name: string
  }
  type: "addition" | "reduction"
  quantity: number
  unit: string
  reason: string
  createdBy: {
    _id: string
    name: string
  }
  createdAt: string
}

export default function InventoryActions() {
  const [actions, setActions] = useState<StockAdjustment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInventoryActions() {
      try {
        const response = await fetch("/api/inventory/actions")

        if (!response.ok) {
          throw new Error("Failed to fetch inventory actions")
        }

        const data = await response.json()
        setActions(data)
      } catch (err) {
        console.error("Error fetching inventory actions:", err)
        setError("Failed to load inventory actions")
        setActions([])
      } finally {
        setLoading(false)
      }
    }

    fetchInventoryActions()
  }, [])

  if (loading) {
    return <ActionsSkeleton />
  }

  if (error) {
    return (
      <div className="p-4 border rounded-md bg-red-50">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (actions.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No recent inventory actions found.</p>
        <div className="mt-4">
          <Link href="/inventory/stock-adjustment">
            <Button size="sm">Make Stock Adjustment</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">Showing {actions.length} recent inventory actions</p>
        <Link href="/inventory/stock-adjustment">
          <Button size="sm">New Adjustment</Button>
        </Link>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Performed By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.map((action) => (
              <TableRow key={action._id}>
                <TableCell>{new Date(action.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{action.product?.name || "Unknown Product"}</TableCell>
                <TableCell>
                  <Badge variant={action.type === "addition" ? "success" : "destructive"}>
                    {action.type === "addition" ? "Addition" : "Reduction"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {action.quantity} {action.unit}
                </TableCell>
                <TableCell>{action.createdBy?.name || "Unknown User"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function ActionsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[100px] ml-auto" />
      </div>
      <div className="border rounded-md">
        <div className="grid grid-cols-5 gap-4 p-4 border-b">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b last:border-0">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
      </div>
    </div>
  )
}

