import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, Clock } from "lucide-react"
import connectToDatabase from "@/lib/mongodb"
import Product from "@/models/product"

async function getInventoryStats() {
  await connectToDatabase()

  // Total products in inventory
  const totalProducts = await Product.countDocuments()

  // Total products with low stock (less than or equal to 5 units)
  const lowStockProducts = await Product.countDocuments({ inventoryQuantity: { $lte: 5 } })

  // Calculate products expiring soon (within 7 days)
  const today = new Date()
  const sevenDaysLater = new Date(today)
  sevenDaysLater.setDate(today.getDate() + 7)

  // Find products where the expiration date falls within the next 7 days
  // This assumes we track when products were added and their shelf life
  const expiringProducts = await Product.countDocuments({
    shelfLife: { $exists: true, $gt: 0 },
    $expr: {
      $lte: [{ $add: ["$createdAt", { $multiply: ["$shelfLife", 24 * 60 * 60 * 1000] }] }, sevenDaysLater.getTime()],
    },
  })

  return {
    totalProducts,
    lowStockProducts,
    expiringProducts,
  }
}

export default async function InventoryOverview() {
  const stats = await getInventoryStats()

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
            <span className="text-2xl font-bold">{stats.totalProducts}</span>
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
            <span className="text-2xl font-bold">{stats.lowStockProducts}</span>
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
            <span className="text-2xl font-bold">{stats.expiringProducts}</span>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

