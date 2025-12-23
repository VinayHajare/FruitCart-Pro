import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Merchant from "@/models/merchant"
import Payout from "@/models/payout"

export async function GET() {
  try {
    await connectToDatabase()

    // Total merchants
    const totalMerchants = await Merchant.countDocuments()

    // Total outstanding balance
    const merchants = await Merchant.find()
    const totalOutstanding = merchants.reduce((sum, merchant) => sum + (merchant.currentBalance || 0), 0)

    // Pending payouts
    const pendingPayouts = await Payout.countDocuments({ status: "pending" })

    return NextResponse.json({
      totalMerchants,
      totalOutstanding,
      pendingPayouts,
    })
  } catch (error) {
    console.error("Error fetching merchant stats:", error)
    return NextResponse.json({ error: "Failed to fetch merchant statistics" }, { status: 500 })
  }
}

