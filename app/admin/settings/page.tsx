import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import TaxSettings from "@/components/admin/tax-settings"
import ReceiptSettings from "@/components/admin/receipt-settings"

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
        </div>

        <Tabs defaultValue="tax">
          <TabsList>
            <TabsTrigger value="tax">Tax Configuration</TabsTrigger>
            <TabsTrigger value="receipt">Receipt Template</TabsTrigger>
          </TabsList>
          <TabsContent value="tax">
            <Card>
              <CardHeader>
                <CardTitle>Tax Settings</CardTitle>
                <CardDescription>Configure tax rates and rules for billing</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<SettingsSkeleton />}>
                  <TaxSettings />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="receipt">
            <Card>
              <CardHeader>
                <CardTitle>Receipt Template</CardTitle>
                <CardDescription>Customize receipt appearance and content</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<SettingsSkeleton />}>
                  <ReceiptSettings />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-[200px]" />
      <div className="grid gap-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
      </div>
      <Skeleton className="h-10 w-[100px]" />
    </div>
  )
}

