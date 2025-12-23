"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const receiptSettingsSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().optional(),
  receiptFooter: z.string().optional(),
  showLogo: z.boolean().default(true),
  paperSize: z.enum(["80mm", "a4", "letter"]),
  includeDateTime: z.boolean().default(true),
  includeSalesperson: z.boolean().default(true),
  showItemDiscount: z.boolean().default(true),
})

type ReceiptSettingsValues = z.infer<typeof receiptSettingsSchema>

export default function ReceiptSettings() {
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const form = useForm<ReceiptSettingsValues>({
    resolver: zodResolver(receiptSettingsSchema),
    defaultValues: {
      businessName: "Fruit Shop",
      address: "",
      phone: "",
      email: "",
      website: "",
      receiptFooter: "Thank you for your business!",
      showLogo: true,
      paperSize: "80mm",
      includeDateTime: true,
      includeSalesperson: true,
      showItemDiscount: true,
    },
  })

  useEffect(() => {
    async function fetchReceiptSettings() {
      try {
        const response = await fetch("/api/admin/settings/receipt")

        if (response.ok) {
          const data = await response.json()
          form.reset(data)
        }
      } catch (error) {
        console.error("Error fetching receipt settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReceiptSettings()
  }, [form])

  async function onSubmit(values: ReceiptSettingsValues) {
    try {
      const response = await fetch("/api/admin/settings/receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to save receipt settings")
      }

      toast({
        title: "Settings saved",
        description: "Receipt settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving receipt settings:", error)
      toast({
        title: "Error",
        description: "Failed to save receipt settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading receipt settings...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Address</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="receiptFooter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receipt Footer</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>Custom message to display at the bottom of receipts</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paperSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paper Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select paper size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="80mm">Thermal 80mm</SelectItem>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Paper size for printed receipts</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="showLogo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Show Logo</FormLabel>
                  <FormDescription>Display business logo on receipts</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="includeDateTime"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Include Date & Time</FormLabel>
                  <FormDescription>Show transaction date and time</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="includeSalesperson"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Show Salesperson</FormLabel>
                  <FormDescription>Display cashier/salesperson name</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="showItemDiscount"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Show Item Discounts</FormLabel>
                  <FormDescription>Display individual item discounts</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={!form.formState.isDirty}>
          Save Receipt Settings
        </Button>
      </form>
    </Form>
  )
}

