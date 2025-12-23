export const dynamic = "force-dynamic"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MerchantForm from "@/components/merchants/merchant-form"

export default function EditMerchantPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Merchant</h1>
          <p className="text-muted-foreground">Update merchant details</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Merchant Details</CardTitle>
            <CardDescription>Edit the details of the merchant</CardDescription>
          </CardHeader>
          <CardContent>
            <MerchantForm merchantId={params.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

