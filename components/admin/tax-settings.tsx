"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const taxSettingsSchema = z.object({
  enableTax: z.boolean().default(true),
  taxType: z.enum(["gst", "vat", "sales"]),
  taxRate: z.coerce.number().min(0).max(100),
  applyTaxAfterDiscount: z.boolean().default(true),
  displayTaxOnReceipt: z.boolean().default(true),
  taxIdentificationNumber: z.string().optional(),
})

type TaxSettingsValues = z.infer<typeof taxSettingsSchema>

export default function TaxSettings() {
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const form = useForm<TaxSettingsValues>({
    resolver: zodResolver(taxSettingsSchema),
    defaultValues: {
      enableTax: true,
      taxType: "gst",
      taxRate: 5,
      applyTaxAfterDiscount: true,
      displayTaxOnReceipt: true,
      taxIdentificationNumber: "",
    },
  })

  useEffect(() => {
    async function fetchTaxSettings() {
      try {
        const response = await fetch("/api/admin/settings/tax")

        if (response.ok) {
          const data = await response.json()
          form.reset(data)
        }
      } catch (error) {
        console.error("Error fetching tax settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTaxSettings()
  }, [form])

  async function onSubmit(values: TaxSettingsValues) {
    try {
      const response = await fetch("/api/admin/settings/tax", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to save tax settings")
      }

      toast({
        title: "Settings saved",
        description: "Tax settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving tax settings:", error)
      toast({
        title: "Error",
        description: "Failed to save tax settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading tax settings...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="enableTax"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enable Tax</FormLabel>
                <FormDescription>Apply tax calculations to all transactions</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="taxType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Type</FormLabel>
                <Select disabled={!form.watch("enableTax")} onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tax type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="gst">GST</SelectItem>
                    <SelectItem value="vat">VAT</SelectItem>
                    <SelectItem value="sales">Sales Tax</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Type of tax applied to transactions</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" disabled={!form.watch("enableTax")} {...field} />
                </FormControl>
                <FormDescription>Percentage rate applied to taxable amount</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="taxIdentificationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax Identification Number</FormLabel>
              <FormControl>
                <Input
                  disabled={!form.watch("enableTax")}
                  placeholder="e.g., GST123456789"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>Your business tax identification number (optional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="applyTaxAfterDiscount"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Apply After Discount</FormLabel>
                  <FormDescription>Calculate tax after applying discounts</FormDescription>
                </div>
                <FormControl>
                  <Switch disabled={!form.watch("enableTax")} checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="displayTaxOnReceipt"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Show on Receipt</FormLabel>
                  <FormDescription>Display tax details on customer receipts</FormDescription>
                </div>
                <FormControl>
                  <Switch disabled={!form.watch("enableTax")} checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={!form.formState.isDirty}>
          Save Tax Settings
        </Button>
      </form>
    </Form>
  )
}

