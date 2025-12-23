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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import ProductSearch from "@/components/billing/product-search"

const stockAdjustmentSchema = z.object({
  product: z.object({
    _id: z.string(),
    name: z.string(),
    unit: z.string(),
  }),
  type: z.enum(["addition", "reduction"]),
  quantity: z.coerce.number().positive({ message: "Quantity must be a positive number" }),
  reason: z.string().min(1, { message: "Reason is required" }),
  notes: z.string().optional(),
})

type StockAdjustmentFormValues = z.infer<typeof stockAdjustmentSchema>

export default function StockAdjustmentForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<StockAdjustmentFormValues>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: {
      type: "addition",
      quantity: 1,
      reason: "",
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

  const onSubmit = async (data: StockAdjustmentFormValues) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/inventory/stock-adjustment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: data.product._id,
          type: data.type,
          quantity: data.quantity,
          unit: data.product.unit,
          reason: data.reason,
          notes: data.notes,
        }),
      })

      if (!response.ok) throw new Error("Failed to adjust stock")

      toast({
        title: "Success",
        description: "Stock adjustment completed successfully",
      })

      // Reset form
      form.reset({
        type: "addition",
        quantity: 1,
        reason: "",
        notes: "",
      })
      setSelectedProduct(null)

      // Refresh the page to show updated inventory
      router.refresh()
    } catch (error) {
      console.error("Error adjusting stock:", error)
      toast({
        title: "Error",
        description: "Failed to adjust stock. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Select Product
        </label>
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
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Adjustment Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="addition" />
                        </FormControl>
                        <FormLabel className="font-normal">Addition (Increase Stock)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="reduction" />
                        </FormControl>
                        <FormLabel className="font-normal">Reduction (Decrease Stock)</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input type="number" min="1" step="1" {...field} className="w-24" />
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
                      <SelectItem value="purchase">New Purchase</SelectItem>
                      <SelectItem value="return">Customer Return</SelectItem>
                      <SelectItem value="damaged">Damaged/Spoiled</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="theft">Theft/Loss</SelectItem>
                      <SelectItem value="correction">Inventory Correction</SelectItem>
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
                      placeholder="Add additional details about this adjustment"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Optional notes about this stock adjustment</FormDescription>
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
                Submit Adjustment
              </Button>
            </div>
          </form>
        </Form>
      )}

      {!selectedProduct && (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">Please select a product to adjust its stock.</p>
        </div>
      )}
    </div>
  )
}

