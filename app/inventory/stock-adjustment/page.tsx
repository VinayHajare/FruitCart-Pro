export const dynamic = "force-dynamic"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StockAdjustmentForm from "@/components/inventory/stock-adjustment-form"

export default function StockAdjustmentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Adjustment</h1>
          <p className="text-muted-foreground">Adjust inventory levels for products</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Adjust Stock</CardTitle>
            <CardDescription>Add or remove stock from inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <StockAdjustmentForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

