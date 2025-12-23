export const dynamic = "force-dynamic"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MerchantForm from "@/components/merchants/merchant-form"

export default function NewMerchantPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Merchant</h1>
          <p className="text-muted-foreground">Create a new supplier in your system</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Merchant Details</CardTitle>
            <CardDescription>Enter the details of the new merchant</CardDescription>
          </CardHeader>
          <CardContent>
            <MerchantForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

