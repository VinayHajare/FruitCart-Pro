export const dynamic = "force-dynamic"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PayoutForm from "@/components/merchants/payout-form"

export default function NewPayoutPage({ searchParams }: { searchParams: { merchant?: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Payout</h1>
          <p className="text-muted-foreground">Process a payment to a merchant</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payout Details</CardTitle>
            <CardDescription>Enter the details of the payout</CardDescription>
          </CardHeader>
          <CardContent>
            <PayoutForm preselectedMerchantId={searchParams.merchant} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

