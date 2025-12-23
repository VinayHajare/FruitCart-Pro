import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Transaction from "@/models/transaction"

export async function GET() {
  try {
    await connectToDatabase()

    // Get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get yesterday's date
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Get start of current month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Get start of previous month
    const startOfPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)

    // Get end of previous month
    const endOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0)

    // Today's sales
    const todaySales = await Transaction.aggregate([
      { $match: { date: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
    ])

    // Yesterday's sales
    const yesterdaySales = await Transaction.aggregate([
      { $match: { date: { $gte: yesterday, $lt: today } } },
      { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
    ])

    // This month's sales
    const thisMonthSales = await Transaction.aggregate([
      { $match: { date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
    ])

    // Last month's sales
    const lastMonthSales = await Transaction.aggregate([
      { $match: { date: { $gte: startOfPrevMonth, $lt: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
    ])

    // Calculate daily average for last month
    const daysInLastMonth = endOfPrevMonth.getDate()
    const lastMonthDailyAvg = lastMonthSales.length > 0 ? lastMonthSales[0].total / daysInLastMonth : 0

    // Calculate percentage changes
    const dailyChange =
      yesterdaySales.length > 0 && todaySales.length > 0
        ? ((todaySales[0].total - yesterdaySales[0].total) / yesterdaySales[0].total) * 100
        : 0

    const monthlyChange =
      lastMonthSales.length > 0 && thisMonthSales.length > 0
        ? ((thisMonthSales[0].total - lastMonthSales[0].total) / lastMonthSales[0].total) * 100
        : 0

    const stats = {
      todaySales: todaySales.length > 0 ? todaySales[0].total : 0,
      todayOrders: todaySales.length > 0 ? todaySales[0].count : 0,
      thisMonthSales: thisMonthSales.length > 0 ? thisMonthSales[0].total : 0,
      thisMonthOrders: thisMonthSales.length > 0 ? thisMonthSales[0].count : 0,
      dailyChange,
      monthlyChange,
      lastMonthDailyAvg,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching sales overview:", error)
    return NextResponse.json({ error: "Failed to fetch sales overview" }, { status: 500 })
  }
}

