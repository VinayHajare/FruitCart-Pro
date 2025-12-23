import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import connectToDatabase from "@/lib/mongodb"
import Transaction from "@/models/transaction"

async function getSalesStats() {
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

  return {
    todaySales: todaySales.length > 0 ? todaySales[0].total : 0,
    todayOrders: todaySales.length > 0 ? todaySales[0].count : 0,
    thisMonthSales: thisMonthSales.length > 0 ? thisMonthSales[0].total : 0,
    thisMonthOrders: thisMonthSales.length > 0 ? thisMonthSales[0].count : 0,
    dailyChange,
    monthlyChange,
    lastMonthDailyAvg,
  }
}

export default async function SalesOverview() {
  const stats = await getSalesStats()

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
          <CardDescription>Total revenue today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{formatCurrency(stats.todaySales)}</span>
            </div>
            {stats.dailyChange !== 0 && (
              <div
                className={`flex items-center text-xs ${stats.dailyChange >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {stats.dailyChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                <span>{Math.abs(stats.dailyChange).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
          <CardDescription>Number of transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <ShoppingCart className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{stats.todayOrders}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
          <CardDescription>Current month revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{formatCurrency(stats.thisMonthSales)}</span>
            </div>
            {stats.monthlyChange !== 0 && (
              <div
                className={`flex items-center text-xs ${stats.monthlyChange >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {stats.monthlyChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                <span>{Math.abs(stats.monthlyChange).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Monthly Orders</CardTitle>
          <CardDescription>Current month transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <ShoppingCart className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{stats.thisMonthOrders}</span>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

