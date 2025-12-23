import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import connectToDatabase from "@/lib/mongodb"
import Product from "@/models/product"

async function getLowStockProducts() {
  await connectToDatabase()

  // Get products with low stock (less than or equal to 5 units)
  const products = await Product.find({ inventoryQuantity: { $lte: 5 } })
    .sort({ inventoryQuantity: 1 })
    .limit(10)

  return products
}

export default async function LowStockProducts() {
  const products = await getLowStockProducts()

  if (products.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No low stock products found.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">Showing {products.length} products with low stock</p>
        <Link href="/inventory/stock-adjustment">
          <Button size="sm">Adjust Stock</Button>
        </Link>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Price</TableHead>
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
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-destructive font-medium">{product.inventoryQuantity}</span>
                    <span className="text-muted-foreground">{product.unit}</span>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(product.regularPrice)}</TableCell>
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

