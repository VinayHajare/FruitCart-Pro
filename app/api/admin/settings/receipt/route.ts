import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Setting from "@/models/setting"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    await connectToDatabase()

    // Get the current receipt settings
    const receiptSettings = await Setting.findOne({ key: "receiptSettings" })

    if (!receiptSettings) {
      // Return default settings if none exist
      return NextResponse.json({
        businessName: "Fruit Shop",
        address: "",
        phone: "",
        email: "",
        website: "",
        receiptFooter: "Thank you for your business!",
        showLogo: true,
        paperSize: "80mm",
        includeDateTime: true,
        includeSalesperson: true,
        showItemDiscount: true,
      })
    }

    return NextResponse.json(receiptSettings.value)
  } catch (error) {
    console.error("Error fetching receipt settings:", error)
    return NextResponse.json({ error: "Failed to fetch receipt settings" }, { status: 500 })
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

    // Update or create receipt settings
    await Setting.findOneAndUpdate(
      { key: "receiptSettings" },
      {
        key: "receiptSettings",
        value: data,
        updatedBy: session.user.id,
        updatedAt: new Date(),
      },
      { upsert: true, new: true },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving receipt settings:", error)
    return NextResponse.json({ error: "Failed to save receipt settings" }, { status: 500 })
  }
}

