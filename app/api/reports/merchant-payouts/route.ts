import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Payout from "@/models/payout"
import Merchant from "@/models/merchant"

export async function GET() {
  try {
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

    return NextResponse.json({
      recentPayouts: payouts,
      merchantTotals: merchantPayoutData,
    })
  } catch (error) {
    console.error("Error fetching merchant payouts:", error)
    return NextResponse.json({ error: "Failed to fetch merchant payout data" }, { status: 500 })
  }
}

