import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, AlertCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import connectToDatabase from "@/lib/mongodb"
import Merchant from "@/models/merchant"
import Payout from "@/models/payout"

async function getMerchantStats() {
  await connectToDatabase()

  // Total merchants
  const totalMerchants = await Merchant.countDocuments()

  // Total outstanding balance
  const merchants = await Merchant.find()
  const totalOutstanding = merchants.reduce((sum, merchant) => sum + merchant.currentBalance, 0)

  // Pending payouts
  const pendingPayouts = await Payout.countDocuments({ status: "pending" })

  return {
    totalMerchants,
    totalOutstanding,
    pendingPayouts,
  }
}

export default async function MerchantStats() {
  const stats = await getMerchantStats()

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Merchants</CardTitle>
          <CardDescription>Active suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{stats.totalMerchants}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
          <CardDescription>Total amount due</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{formatCurrency(stats.totalOutstanding)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
          <CardDescription>Awaiting processing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-warning mr-2" />
            <span className="text-2xl font-bold">{stats.pendingPayouts}</span>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

