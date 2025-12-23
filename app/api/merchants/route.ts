import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/mongodb"
import Merchant from "@/models/merchant"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    let filter = {}
    if (query) {
      filter = {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { contactPerson: { $regex: query, $options: "i" } },
          { phone: { $regex: query, $options: "i" } },
        ],
      }
    }

    const merchants = await Merchant.find(filter).sort({ name: 1 })

    return NextResponse.json(merchants)
  } catch (error) {
    console.error("Error fetching merchants:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin for creating merchants
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await connectToDatabase()

    const data = await request.json()
    const merchant = new Merchant(data)
    await merchant.save()

    return NextResponse.json(merchant, { status: 201 })
  } catch (error) {
    console.error("Error creating merchant:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

