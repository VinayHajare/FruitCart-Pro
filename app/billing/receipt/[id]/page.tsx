import { notFound } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/mongodb"
import Transaction from "@/models/transaction"
import User from "@/models/user"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Printer, Download } from "lucide-react"
import Link from "next/link"

async function getTransaction(id: string) {
  try {
    await connectToDatabase()
    const transaction = await Transaction.findById(id)

    if (!transaction) {
      return null
    }

    // Get operator details
    const operator = await User.findById(transaction.operator, "name")

    return {
      ...transaction.toObject(),
      operator: operator ? operator.name : "Unknown",
      date: transaction.date.toISOString(),
      createdAt: transaction.createdAt.toISOString(),
    }
  } catch (error) {
    console.error("Error fetching transaction:", error)
    return null
  }
}

export default async function ReceiptPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return notFound()
  }

  const transaction = await getTransaction(params.id)

  if (!transaction) {
    return notFound()
  }

  const date = new Date(transaction.date)
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Receipt</h1>
            <p className="text-muted-foreground">Transaction #{transaction._id}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="border-b">
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-2xl">Fruit Shop</CardTitle>
                <CardDescription>123 Main Street, City, Country</CardDescription>
                <CardDescription>Phone: +1 234 567 890</CardDescription>
              </div>
              <div className="text-right">
                <CardTitle>Receipt</CardTitle>
                <CardDescription>Date: {formattedDate}</CardDescription>
                <CardDescription>Operator: {transaction.operator}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {transaction.customer && (transaction.customer.name || transaction.customer.phone) && (
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Customer Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  {transaction.customer.name && (
                    <>
                      <span className="text-muted-foreground">Name:</span>
                      <span>{transaction.customer.name}</span>
                    </>
                  )}
                  {transaction.customer.phone && (
                    <>
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{transaction.customer.phone}</span>
                    </>
                  )}
                  {transaction.customer.email && (
                    <>
                      <span className="text-muted-foreground">Email:</span>
                      <span>{transaction.customer.email}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-medium mb-2">Items</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Discount
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {transaction.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap">{item.name}</td>
                        <td className="px-4 py-2 text-right whitespace-nowrap">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="px-4 py-2 text-right whitespace-nowrap">{formatCurrency(item.price)}</td>
                        <td className="px-4 py-2 text-right whitespace-nowrap">
                          {formatCurrency(item.discount * item.quantity)}
                        </td>
                        <td className="px-4 py-2 text-right whitespace-nowrap font-medium">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>{formatCurrency(transaction.subtotal)}</span>
              </div>
              {transaction.discount > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Discount:</span>
                  <span>-{formatCurrency(transaction.discount)}</span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Tax (5% GST):</span>
                <span>{formatCurrency(transaction.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatCurrency(transaction.total)}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="capitalize">{transaction.paymentMethod}</span>

                <span className="text-muted-foreground">Payment Status:</span>
                <span className="capitalize">{transaction.paymentStatus}</span>
              </div>
            </div>

            {transaction.notes && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Notes</h3>
                <p>{transaction.notes}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t flex justify-between">
            <p className="text-sm text-muted-foreground">Thank you for your business!</p>
            <Link href="/billing">
              <Button variant="outline">New Bill</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

