export const dynamic = "force-dynamic"

import { Suspense } from "react"
import BillingForm from "@/components/billing/billing-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function BillingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
          <p className="text-muted-foreground">Create and manage bills for customers</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Bill</CardTitle>
            <CardDescription>Create a new bill for a customer</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<BillingFormSkeleton />}>
              <BillingForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function BillingFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[150px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <Skeleton className="h-[300px] w-full" />
      <div className="flex justify-end">
        <Skeleton className="h-10 w-[120px]" />
      </div>
    </div>
  )
}

