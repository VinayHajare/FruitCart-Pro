import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import connectToDatabase from "@/lib/mongodb"
import Transaction from "@/models/transaction"

async function getTopProducts() {
  await connectToDatabase()

  // Get all transactions
  const transactions = await Transaction.find()

  // Calculate sales by product
  const productSales = new Map()

  transactions.forEach((transaction) => {
    transaction.items.forEach((item) => {
      const productName = item.name
      const quantity = item.quantity
      const total = item.total

      if (productSales.has(productName)) {
        const current = productSales.get(productName)
        productSales.set(productName, {
          name: productName,
          quantity: current.quantity + quantity,
          total: current.total + total,
          averagePrice: (current.total + total) / (current.quantity + quantity),
        })
      } else {
        productSales.set(productName, {
          name: productName,
          quantity,
          total,
          averagePrice: total / quantity,
        })
      }
    })
  })

  // Convert to array and sort by total sales
  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)

  return topProducts
}

// Sample data for demonstration
const sampleData = [
  { name: "Apples", quantity: 250, total: 12500, averagePrice: 50 },
  { name: "Bananas", quantity: 320, total: 9600, averagePrice: 30 },
  { name: "Oranges", quantity: 180, total: 7200, averagePrice: 40 },
  { name: "Tomatoes", quantity: 150, total: 6000, averagePrice: 40 },
  { name: "Potatoes", quantity: 200, total: 5000, averagePrice: 25 },
  { name: "Onions", quantity: 180, total: 3600, averagePrice: 20 },
  { name: "Milk", quantity: 120, total: 6000, averagePrice: 50 },
  { name: "Bread", quantity: 100, total: 3000, averagePrice: 30 },
  { name: "Eggs", quantity: 80, total: 4000, averagePrice: 50 },
  { name: "Cheese", quantity: 50, total: 5000, averagePrice: 100 },
]

export default function TopProducts() {
  // In a real implementation, we would use the data from the server
  // const products = await getTopProducts()
  const products = sampleData

  return (
    <div>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity Sold</TableHead>
              <TableHead>Average Price</TableHead>
              <TableHead>Total Sales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {product.name}
                  <Badge className="ml-2" variant={index < 3 ? "default" : "outline"}>
                    #{index + 1}
                  </Badge>
                </TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{formatCurrency(product.averagePrice)}</TableCell>
                <TableCell className="font-medium">{formatCurrency(product.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

