"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import ProductSearch from "@/components/billing/product-search"

const wastageSchema = z.object({
  product: z.object({
    _id: z.string(),
    name: z.string(),
    unit: z.string(),
  }),
  quantity: z.coerce.number().positive({ message: "Quantity must be a positive number" }),
  reason: z.enum(["damaged", "expired", "spoiled", "other"]),
  notes: z.string().optional(),
})

type WastageFormValues = z.infer<typeof wastageSchema>

export default function WastageForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<WastageFormValues>({
    resolver: zodResolver(wastageSchema),
    defaultValues: {
      quantity: 1,
      reason: "damaged",
      notes: "",
    },
  })

  const onProductSelect = (product: any) => {
    setSelectedProduct(product)
    form.setValue("product", {
      _id: product._id,
      name: product.name,
      unit: product.unit,
    })
  }

  const onSubmit = async (data: WastageFormValues) => {
    setIsLoading(true)

    try {
      // We'll use the stock adjustment API but always set type to 'reduction'
      const response = await fetch("/api/inventory/stock-adjustment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: data.product._id,
          type: "reduction",
          quantity: data.quantity,
          unit: data.product.unit,
          reason: data.reason,
          notes: data.notes,
        }),
      })

      if (!response.ok) throw new Error("Failed to record wastage")

      toast({
        title: "Success",
        description: "Wastage recorded successfully",
      })

      // Reset form
      form.reset({
        quantity: 1,
        reason: "damaged",
        notes: "",
      })
      setSelectedProduct(null)

      // Refresh the page to show updated inventory
      router.refresh()
    } catch (error) {
      console.error("Error recording wastage:", error)
      toast({
        title: "Error",
        description: "Failed to record wastage. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <FormLabel>Select Product</FormLabel>
        <ProductSearch onProductSelect={onProductSelect} />
      </div>

      {selectedProduct && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="p-4 border rounded-md bg-muted/50">
              <h3 className="font-medium mb-2">{selectedProduct.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">SKU:</span>
                <span>{selectedProduct.sku}</span>
                <span className="text-muted-foreground">Current Stock:</span>
                <span>
                  {selectedProduct.inventoryQuantity} {selectedProduct.unit}
                </span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        min="1"
                        max={selectedProduct.inventoryQuantity}
                        step="1"
                        {...field}
                        className="w-24"
                      />
                      <span className="ml-2 text-muted-foreground">{selectedProduct.unit}</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="damaged">Damaged</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="spoiled">Spoiled</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add additional details about this wastage"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Optional notes about this wastage record</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => router.push("/inventory")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Record Wastage
              </Button>
            </div>
          </form>
        </Form>
      )}

      {!selectedProduct && (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">Please select a product to record wastage.</p>
        </div>
      )}
    </div>
  )
}

