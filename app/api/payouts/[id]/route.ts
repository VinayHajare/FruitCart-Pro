import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/mongodb"
import Payout from "@/models/payout"
import Merchant from "@/models/merchant"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin for viewing payout details
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await connectToDatabase()

    const payout = await Payout.findById(params.id)
      .populate("merchant", "name contactPerson phone email bankDetails")
      .populate("createdBy", "name")

    if (!payout) {
      return NextResponse.json({ error: "Payout not found" }, { status: 404 })
    }

    return NextResponse.json(payout)
  } catch (error) {
    console.error("Error fetching payout:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin for updating payouts
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await connectToDatabase()

    const data = await request.json()

    // Get the current payout to check status change
    const currentPayout = await Payout.findById(params.id)
    if (!currentPayout) {
      return NextResponse.json({ error: "Payout not found" }, { status: 404 })
    }

    // Update the payout
    const payout = await Payout.findByIdAndUpdate(params.id, data, { new: true, runValidators: true })

    // If status changed to completed, update merchant balance
    if (currentPayout.status !== "completed" && data.status === "completed") {
      await Merchant.findByIdAndUpdate(payout.merchant, { $inc: { currentBalance: -payout.amount } })
    }

    // If status changed from completed to something else, revert the balance change
    if (currentPayout.status === "completed" && data.status !== "completed") {
      await Merchant.findByIdAndUpdate(payout.merchant, { $inc: { currentBalance: payout.amount } })
    }

    return NextResponse.json(payout)
  } catch (error) {
    console.error("Error updating payout:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin for deleting payouts
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await connectToDatabase()

    const payout = await Payout.findById(params.id)

    if (!payout) {
      return NextResponse.json({ error: "Payout not found" }, { status: 404 })
    }

    // If payout was completed, restore the merchant balance
    if (payout.status === "completed") {
      await Merchant.findByIdAndUpdate(payout.merchant, { $inc: { currentBalance: payout.amount } })
    }

    await Payout.findByIdAndDelete(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting payout:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

