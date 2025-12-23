"use client"

import { useState, useEffect } from "react"
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
import { formatCurrency } from "@/lib/utils"

const payoutSchema = z.object({
  merchant: z.string().min(1, { message: "Merchant is required" }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number" }),
  date: z.string().min(1, { message: "Date is required" }),
  paymentMethod: z.enum(["cash", "bank_transfer", "check", "upi"]),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["pending", "completed", "failed"]),
})

type PayoutFormValues = z.infer<typeof payoutSchema>

interface Merchant {
  _id: string
  name: string
  currentBalance: number
  bankDetails?: {
    accountName?: string
    accountNumber?: string
    bankName?: string
    ifscCode?: string
  }
}

interface PayoutFormProps {
  preselectedMerchantId?: string
}

export default function PayoutForm({ preselectedMerchantId }: PayoutFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Format today's date as YYYY-MM-DD for the date input
  const today = new Date().toISOString().split("T")[0]

  const form = useForm<PayoutFormValues>({
    resolver: zodResolver(payoutSchema),
    defaultValues: {
      merchant: preselectedMerchantId || "",
      amount: 0,
      date: today,
      paymentMethod: "bank_transfer",
      referenceNumber: "",
      notes: "",
      status: "completed",
    },
  })

  // Fetch merchants
  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const response = await fetch("/api/merchants")
        if (!response.ok) throw new Error("Failed to fetch merchants")

        const data = await response.json()
        // Filter to only show merchants with positive balance
        const merchantsWithBalance = data.filter((m: Merchant) => m.currentBalance > 0)
        setMerchants(merchantsWithBalance)

        // If preselected merchant, find and set it
        if (preselectedMerchantId) {
          const preselected = data.find((m: Merchant) => m._id === preselectedMerchantId)
          if (preselected) {
            setSelectedMerchant(preselected)
            form.setValue("amount", preselected.currentBalance)
          }
        }
      } catch (error) {
        console.error("Error fetching merchants:", error)
        toast({
          title: "Error",
          description: "Failed to load merchants. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchMerchants()
  }, [preselectedMerchantId, form, toast])

  // Update selected merchant when merchant selection changes
  const onMerchantChange = (merchantId: string) => {
    const merchant = merchants.find((m) => m._id === merchantId) || null
    setSelectedMerchant(merchant)

    if (merchant) {
      // Pre-fill the amount with the current balance
      form.setValue("amount", merchant.currentBalance)
    }
  }

  const onSubmit = async (data: PayoutFormValues) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/payouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to create payout")

      toast({
        title: "Success",
        description: "Payout created successfully",
      })

      router.push("/merchants")
      router.refresh()
    } catch (error) {
      console.error("Error creating payout:", error)
      toast({
        title: "Error",
        description: "Failed to create payout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="merchant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Merchant</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  onMerchantChange(value)
                }}
                defaultValue={field.value}
                disabled={!!preselectedMerchantId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a merchant" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {merchants.map((merchant) => (
                    <SelectItem key={merchant._id} value={merchant._id}>
                      {merchant.name} ({formatCurrency(merchant.currentBalance)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedMerchant && (
          <div className="p-4 border rounded-md bg-muted/50">
            <h3 className="font-medium mb-2">Merchant Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Current Balance:</span>
              <span className="font-medium">{formatCurrency(selectedMerchant.currentBalance)}</span>

              {selectedMerchant.bankDetails?.accountName && (
                <>
                  <span className="text-muted-foreground">Account Name:</span>
                  <span>{selectedMerchant.bankDetails.accountName}</span>
                </>
              )}

              {selectedMerchant.bankDetails?.accountNumber && (
                <>
                  <span className="text-muted-foreground">Account Number:</span>
                  <span>{selectedMerchant.bankDetails.accountNumber}</span>
                </>
              )}

              {selectedMerchant.bankDetails?.bankName && (
                <>
                  <span className="text-muted-foreground">Bank Name:</span>
                  <span>{selectedMerchant.bankDetails.bankName}</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>Amount to be paid to the merchant</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Set to "Completed" to immediately update merchant balance</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="referenceNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter transaction reference number" {...field} />
              </FormControl>
              <FormDescription>Transaction ID, check number, or other reference</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Add notes about this payout" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => router.push("/merchants")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !selectedMerchant}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Process Payout
          </Button>
        </div>
      </form>
    </Form>
  )
}

