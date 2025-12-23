import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import connectToDatabase from "@/lib/mongodb"
import Merchant from "@/models/merchant"

async function getMerchants() {
  await connectToDatabase()

  const merchants = await Merchant.find().sort({ name: 1 })

  return merchants
}

export default async function MerchantList() {
  const merchants = await getMerchants()

  if (merchants.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No merchants found.</p>
        <div className="mt-4">
          <Link href="/merchants/new">
            <Button size="sm">Add Merchant</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">Showing {merchants.length} merchants</p>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {merchants.map((merchant) => (
              <TableRow key={merchant._id.toString()}>
                <TableCell className="font-medium">{merchant.name}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>{merchant.contactPerson}</div>
                    <div className="text-sm text-muted-foreground">{merchant.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {merchant.supplyCategories?.map((category, index) => (
                      <Badge key={index} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={merchant.currentBalance > 0 ? "text-destructive font-medium" : ""}>
                    {formatCurrency(merchant.currentBalance)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/merchants/${merchant._id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                    {merchant.currentBalance > 0 && (
                      <Link href={`/merchants/payouts/new?merchant=${merchant._id}`}>
                        <Button size="sm">Pay</Button>
                      </Link>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

