import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import MerchantList from "@/components/merchants/merchant-list"
import MerchantStats from "@/components/merchants/merchant-stats"
import PendingPayouts from "@/components/merchants/pending-payouts"

export default function MerchantsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Merchants</h1>
            <p className="text-muted-foreground">Manage your suppliers and payouts</p>
          </div>
          <div className="flex gap-2">
            <Link href="/merchants/payouts/new">
              <Button variant="outline">New Payout</Button>
            </Link>
            <Link href="/merchants/new">
              <Button>Add Merchant</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Suspense fallback={<MerchantStatsSkeleton />}>
            <MerchantStats />
          </Suspense>
        </div>

        <Tabs defaultValue="merchants">
          <TabsList>
            <TabsTrigger value="merchants">All Merchants</TabsTrigger>
            <TabsTrigger value="pending-payouts">Pending Payouts</TabsTrigger>
          </TabsList>
          <TabsContent value="merchants">
            <Card>
              <CardHeader>
                <CardTitle>Merchant List</CardTitle>
                <CardDescription>View and manage all your suppliers</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<TableSkeleton />}>
                  <MerchantList />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pending-payouts">
            <Card>
              <CardHeader>
                <CardTitle>Pending Payouts</CardTitle>
                <CardDescription>Merchants with outstanding payments</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<TableSkeleton />}>
                  <PendingPayouts />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function MerchantStatsSkeleton() {
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-[140px]" />
          <Skeleton className="h-3 w-[100px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[80px]" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-[140px]" />
          <Skeleton className="h-3 w-[100px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[80px]" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-[140px]" />
          <Skeleton className="h-3 w-[100px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[80px]" />
        </CardContent>
      </Card>
    </>
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

