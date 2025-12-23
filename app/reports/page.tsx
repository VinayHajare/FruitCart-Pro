export const dynamic = "force-dynamic"

import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import SalesOverview from "@/components/reports/sales-overview"
import SalesByCategory from "@/components/reports/sales-by-category"
import TopProducts from "@/components/reports/top-products"
import MerchantPayouts from "@/components/reports/merchant-payouts"
import InventoryTurnover from "@/components/reports/inventory-turnover"

export default function ReportsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">View insights and performance metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SalesOverview />
        </div>

        <Tabs defaultValue="sales">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="merchants">Merchants</TabsTrigger>
          </TabsList>
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales across different product categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <SalesByCategory />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Products with the highest sales volume</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<TableSkeleton />}>
                  <TopProducts />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Turnover</CardTitle>
                <CardDescription>How quickly products are sold and replaced</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <Suspense fallback={<ChartSkeleton />}>
                  <InventoryTurnover />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="merchants">
            <Card>
              <CardHeader>
                <CardTitle>Merchant Payouts</CardTitle>
                <CardDescription>Summary of payments made to merchants</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<TableSkeleton />}>
                  <MerchantPayouts />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="flex items-center justify-center h-full">
      <Skeleton className="h-[300px] w-full" />
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[100px] ml-auto" />
      </div>
      <div className="border rounded-md">
        <div className="grid grid-cols-4 gap-4 p-4 border-b">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b last:border-0">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
      </div>
    </div>
  )
}

