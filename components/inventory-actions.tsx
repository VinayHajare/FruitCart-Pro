import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import connectToDatabase from "@/lib/mongodb"
import StockAdjustment from "@/models/stock-adjustment"

async function getRecentActions() {
  await connectToDatabase()

  // Get recent stock adjustments
  const adjustments = await StockAdjustment.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("product", "name")
    .populate("createdBy", "name")

  return adjustments.map((adjustment) => ({
    ...adjustment.toObject(),
    createdAt: adjustment.createdAt.toISOString(),
  }))
}

export default async function InventoryActions() {
  let actions = []

  try {
    actions = await getRecentActions()
  } catch (error) {
    console.error("Error fetching inventory actions:", error)
    // If StockAdjustment model doesn't exist yet, we'll show an empty state
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
              <TableRow key={action._id.toString()}>
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

