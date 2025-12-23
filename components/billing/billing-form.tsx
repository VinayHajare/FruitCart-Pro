"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { Loader2, Trash2 } from "lucide-react"
import ProductSearch from "@/components/billing/product-search"

const billSchema = z.object({
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email().optional().or(z.literal("")),
  paymentMethod: z.enum(["cash", "card", "upi", "credit"]),
  paymentStatus: z.enum(["paid", "pending", "partial"]),
  notes: z.string().optional(),
})

type BillFormValues = z.infer<typeof billSchema>

interface Product {
  _id: string
  name: string
  sku: string
  regularPrice: number
  discountPrice?: number
  unit: string
}

interface BillItem {
  product: Product
  quantity: number
  price: number
  discount: number
  total: number
}

export default function BillingForm() {
  const [items, setItems] = useState<BillItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [subtotal, setSubtotal] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<BillFormValues>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      paymentMethod: "cash",
      paymentStatus: "paid",
      notes: "",
    },
  })

  useEffect(() => {
    // Calculate totals
    const newSubtotal = items.reduce((sum, item) => sum + item.total, 0)
    setSubtotal(newSubtotal)

    // Calculate tax (assuming 5% GST)
    const newTax = newSubtotal * 0.05
    setTax(newTax)

    // Calculate total
    setTotal(newSubtotal + newTax - discount)
  }, [items, discount])

  const addProduct = (product: Product) => {
    // Check if product already exists in the bill
    const existingItemIndex = items.findIndex((item) => item.product._id === product._id)

    if (existingItemIndex >= 0) {
      // Update quantity if product already exists
      const updatedItems = [...items]
      const item = updatedItems[existingItemIndex]
      item.quantity += 1
      item.total = item.quantity * (item.price - item.discount)
      setItems(updatedItems)
    } else {
      // Add new product to the bill
      const price = product.regularPrice
      const discountAmount = product.discountPrice ? product.regularPrice - product.discountPrice : 0

      const newItem: BillItem = {
        product,
        quantity: 1,
        price,
        discount: discountAmount,
        total: price - discountAmount,
      }

      setItems([...items, newItem])
    }
  }

  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) return

    const updatedItems = [...items]
    const item = updatedItems[index]
    item.quantity = quantity
    item.total = quantity * (item.price - item.discount)
    setItems(updatedItems)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0
    setDiscount(value)
  }

  const onSubmit = async (data: BillFormValues) => {
    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product to the bill",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const transaction = {
        ...data,
        items: items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          unit: item.product.unit,
          price: item.price,
          discount: item.discount,
          total: item.total,
        })),
        subtotal,
        discount,
        tax,
        total,
      }

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      })

      if (!response.ok) throw new Error("Failed to create transaction")

      const result = await response.json()

      toast({
        title: "Success",
        description: "Bill created successfully",
      })

      // Redirect to the receipt page
      router.push(`/billing/receipt/${result._id}`)
    } catch (error) {
      console.error("Error creating bill:", error)
      toast({
        title: "Error",
        description: "Failed to create bill. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <ProductSearch onProductSelect={addProduct} />

      {items.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.product._id}>
                  <TableCell className="font-medium">
                    {item.product.name}
                    <div className="text-xs text-muted-foreground">{item.product.sku}</div>
                  </TableCell>
                  <TableCell>{formatCurrency(item.price)}</TableCell>
                  <TableCell>
                    <div className="flex items-center w-24">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItemQuantity(index, Number.parseInt(e.target.value))}
                        className="w-16"
                      />
                      <span className="ml-2 text-muted-foreground">{item.product.unit}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(item.discount * item.quantity)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(item.total)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">No products added to the bill yet.</p>
          <p className="text-muted-foreground">Use the search above to add products.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Customer Information</h3>

              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment Information</h3>

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="credit">Credit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
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
                      <Input placeholder="Add notes (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isLoading || items.length === 0}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Bill
              </Button>
            </div>
          </form>
        </Form>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Bill Summary</h3>

          <div className="border rounded-md p-4 space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Discount</span>
              <div className="flex items-center">
                <Input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={handleDiscountChange}
                  className="w-24 text-right"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <span>Tax (5% GST)</span>
              <span>{formatCurrency(tax)}</span>
            </div>

            <div className="border-t pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

