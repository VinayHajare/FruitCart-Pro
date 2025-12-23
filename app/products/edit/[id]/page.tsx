export const dynamic = "force-dynamic"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProductForm from "@/components/products/product-form"

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">Update product details</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Edit the details of the product</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm productId={params.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

