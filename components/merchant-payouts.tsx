import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import connectToDatabase from "@/lib/mongodb"
import Payout from "@/models/payout"
import Merchant from "@/models/merchant"

async function getMerchantPayouts() {
  await connectToDatabase()

  // Get recent payouts
  const payouts = await Payout.find().sort({ date: -1 }).limit(10).populate("merchant", "name")

  // Get total payouts by merchant
  const merchantPayouts = await Payout.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: "$merchant",
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { totalAmount: -1 } },
    { $limit: 10 },
  ])

  // Get merchant names
  const merchantIds = merchantPayouts.map((item) => item._id)
  const merchants = await Merchant.find({ _id: { $in: merchantIds } }, { name: 1 })

  // Create a map of merchant ID to name
  const merchantNames = new Map()
  merchants.forEach((merchant) => {
    merchantNames.set(merchant._id.toString(), merchant.name)
  })

  // Add merchant names to the aggregation result
  const merchantPayoutData = merchantPayouts.map((item) => ({
    merchantId: item._id,
    merchantName: merchantNames.get(item._id.toString()) || "Unknown",
    totalAmount: item.totalAmount,
    count: item.count,
  }))

  return {
    recentPayouts: payouts,
    merchantTotals: merchantPayoutData,
  }
}

// Sample data for demonstration
const sampleData = {
  merchantTotals: [
    { merchantId: "1", merchantName: "Fresh Farms", totalAmount: 45000, count: 12 },
    { merchantId: "2", merchantName: "Organic Produce", totalAmount: 38000, count: 10 },
    { merchantId: "3", merchantName: "Green Valley", totalAmount: 32000, count: 8 },
    { merchantId: "4", merchantName: "Dairy Delights", totalAmount: 28000, count: 7 },
    { merchantId: "5", merchantName: "Bakery Supplies", totalAmount: 25000, count: 6 },
    { merchantId: "6", merchantName: "Fruit Express", totalAmount: 22000, count: 5 },
    { merchantId: "7", merchantName: "Veggie World", totalAmount: 18000, count: 4 },
    { merchantId: "8", merchantName: "Farm Fresh", totalAmount: 15000, count: 3 },
  ],
}

export default function MerchantPayouts() {
  // In a real implementation, we would use the data from the server
  // const data = await getMerchantPayouts()
  const data = sampleData

  return (
    <div>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Merchant</TableHead>
              <TableHead>Number of Payouts</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Average Payout</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.merchantTotals.map((item) => (
              <TableRow key={item.merchantId}>
                <TableCell className="font-medium">{item.merchantName}</TableCell>
                <TableCell>{item.count}</TableCell>
                <TableCell className="font-medium">{formatCurrency(item.totalAmount)}</TableCell>
                <TableCell>{formatCurrency(item.totalAmount / item.count)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

