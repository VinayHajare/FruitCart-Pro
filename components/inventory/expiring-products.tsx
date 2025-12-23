import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import connectToDatabase from "@/lib/mongodb"
import Product from "@/models/product"

async function getExpiringProducts() {
  await connectToDatabase()

  // Calculate products expiring soon (within 7 days)
  const today = new Date()
  const sevenDaysLater = new Date(today)
  sevenDaysLater.setDate(today.getDate() + 7)

  // Find products where the expiration date falls within the next 7 days
  const products = await Product.find({
    shelfLife: { $exists: true, $gt: 0 },
    $expr: {
      $lte: [{ $add: ["$createdAt", { $multiply: ["$shelfLife", 24 * 60 * 60 * 1000] }] }, sevenDaysLater.getTime()],
    },
  })
    .sort({ shelfLife: 1 })
    .limit(10)

  return products.map((product) => {
    const createdAt = new Date(product.createdAt)
    const expiryDate = new Date(createdAt)
    expiryDate.setDate(createdAt.getDate() + product.shelfLife)

    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    return {
      ...product.toObject(),
      expiryDate,
      daysUntilExpiry,
    }
  })
}

export default async function ExpiringProducts() {
  const products = await getExpiringProducts()

  if (products.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No products expiring soon.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">Showing {products.length} products expiring soon</p>
        <Link href="/inventory/wastage">
          <Button size="sm">Record Wastage</Button>
        </Link>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Days Left</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id.toString()}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                      {product.image ? (
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="object-cover h-full w-full"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                          No img
                        </div>
                      )}
                    </div>
                    <span>{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell>{new Date(product.expiryDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={product.daysUntilExpiry <= 2 ? "destructive" : "warning"}>
                    {product.daysUntilExpiry} days
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/products/edit/${product._id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

