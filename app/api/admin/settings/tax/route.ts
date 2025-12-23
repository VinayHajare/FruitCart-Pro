import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Setting from "@/models/setting"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    await connectToDatabase()

    // Get the current tax settings
    const taxSettings = await Setting.findOne({ key: "taxSettings" })

    if (!taxSettings) {
      // Return default settings if none exist
      return NextResponse.json({
        enableTax: true,
        taxType: "gst",
        taxRate: 5,
        applyTaxAfterDiscount: true,
        displayTaxOnReceipt: true,
        taxIdentificationNumber: "",
      })
    }

    return NextResponse.json(taxSettings.value)
  } catch (error) {
    console.error("Error fetching tax settings:", error)
    return NextResponse.json({ error: "Failed to fetch tax settings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Only admins can update settings." }, { status: 403 })
    }

    const data = await request.json()
    await connectToDatabase()

    // Update or create tax settings
    await Setting.findOneAndUpdate(
      { key: "taxSettings" },
      {
        key: "taxSettings",
        value: data,
        updatedBy: session.user.id,
        updatedAt: new Date(),
      },
      { upsert: true, new: true },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving tax settings:", error)
    return NextResponse.json({ error: "Failed to save tax settings" }, { status: 500 })
  }
}

