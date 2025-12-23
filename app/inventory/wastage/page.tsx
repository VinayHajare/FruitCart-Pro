export const dynamic = "force-dynamic"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import WastageForm from "@/components/inventory/wastage-form"

export default function WastagePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wastage Tracking</h1>
          <p className="text-muted-foreground">Record damaged or expired products</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Record Wastage</CardTitle>
            <CardDescription>Track damaged, spoiled, or expired inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <WastageForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

