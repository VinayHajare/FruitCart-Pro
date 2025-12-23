import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import connectToDatabase from "@/lib/mongodb"
import Merchant from "@/models/merchant"

async function getMerchantsWithBalance() {
  await connectToDatabase()

  // Get merchants with positive balance (money owed to them)
  const merchants = await Merchant.find({ currentBalance: { $gt: 0 } }).sort({ currentBalance: -1 })

  return merchants
}

export default async function PendingPayouts() {
  const merchants = await getMerchantsWithBalance()

  if (merchants.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No pending payouts found.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">Showing {merchants.length} merchants with pending payouts</p>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Merchant</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Payment Terms</TableHead>
              <TableHead>Amount Due</TableHead>
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
                <TableCell>{merchant.paymentTerms || "Not specified"}</TableCell>
                <TableCell>
                  <span className="text-destructive font-medium">{formatCurrency(merchant.currentBalance)}</span>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/merchants/payouts/new?merchant=${merchant._id}`}>
                    <Button size="sm">Process Payout</Button>
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

