import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/mongodb"
import Payout from "@/models/payout"
import Merchant from "@/models/merchant"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin for viewing all payouts
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const merchantId = searchParams.get("merchant")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const query: any = {}

    if (merchantId) {
      query.merchant = merchantId
    }

    if (status) {
      query.status = status
    }

    const payouts = await Payout.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate("merchant", "name contactPerson")
      .populate("createdBy", "name")

    const total = await Payout.countDocuments(query)

    return NextResponse.json({
      payouts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching payouts:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin for creating payouts
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await connectToDatabase()

    const data = await request.json()

    // Validate required fields
    if (!data.merchant || !data.amount || !data.paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if merchant exists
    const merchant = await Merchant.findById(data.merchant)
    if (!merchant) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 })
    }

    // Create payout record
    const payout = new Payout({
      ...data,
      createdBy: session.user.id,
    })

    await payout.save()

    // Update merchant balance if payout is completed
    if (data.status === "completed") {
      await Merchant.findByIdAndUpdate(data.merchant, { $inc: { currentBalance: -data.amount } })
    }

    return NextResponse.json(payout, { status: 201 })
  } catch (error) {
    console.error("Error creating payout:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

