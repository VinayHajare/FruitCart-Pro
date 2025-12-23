import { notFound } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import connectToDatabase from "@/lib/mongodb"
import Merchant from "@/models/merchant"
import Payout from "@/models/payout"
import MerchantPayoutHistory from "@/components/merchants/merchant-payout-history"

async function getMerchant(id: string) {
  try {
    await connectToDatabase()
    const merchant = await Merchant.findById(id)

    if (!merchant) {
      return null
    }

    return merchant
  } catch (error) {
    console.error("Error fetching merchant:", error)
    return null
  }
}

async function getRecentPayouts(merchantId: string) {
  try {
    await connectToDatabase()
    const payouts = await Payout.find({ merchant: merchantId })
      .sort({ date: -1 })
      .limit(5)
      .populate("createdBy", "name")

    return payouts
  } catch (error) {
    console.error("Error fetching payouts:", error)
    return []
  }
}

export default async function MerchantDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return notFound()
  }

  const merchant = await getMerchant(params.id)

  if (!merchant) {
    return notFound()
  }

  const recentPayouts = await getRecentPayouts(params.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{merchant.name}</h1>
            <p className="text-muted-foreground">Merchant details and payment history</p>
          </div>
          <div className="flex gap-2">
            {merchant.currentBalance > 0 && (
              <Link href={`/merchants/payouts/new?merchant=${merchant._id}`}>
                <Button>Process Payout</Button>
              </Link>
            )}
            <Link href={`/merchants/edit/${merchant._id}`}>
              <Button variant="outline">Edit Merchant</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-muted-foreground">Contact Person:</dt>
                  <dd>{merchant.contactPerson}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-muted-foreground">Phone:</dt>
                  <dd>{merchant.phone}</dd>
                </div>
                {merchant.email && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Email:</dt>
                    <dd>{merchant.email}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Supply Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {merchant.supplyCategories?.map((category, index) => (
                  <Badge key={index} variant="outline">
                    {category}
                  </Badge>
                ))}
                {(!merchant.supplyCategories || merchant.supplyCategories.length === 0) && (
                  <span className="text-muted-foreground">No categories specified</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Balance Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current Balance:</span>
                <span className={`text-xl font-bold ${merchant.currentBalance > 0 ? "text-destructive" : ""}`}>
                  {formatCurrency(merchant.currentBalance)}
                </span>
              </div>
              {merchant.paymentTerms && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium">Payment Terms:</span> {merchant.paymentTerms}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Merchant Details</TabsTrigger>
            <TabsTrigger value="payouts">Payment History</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Information</CardTitle>
                <CardDescription>Complete merchant profile and bank details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {(merchant.address?.street || merchant.address?.city) && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Address</h3>
                    <div className="space-y-1 text-muted-foreground">
                      {merchant.address.street && <p>{merchant.address.street}</p>}
                      <p>
                        {[merchant.address.city, merchant.address.state, merchant.address.postalCode]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      {merchant.address.country && <p>{merchant.address.country}</p>}
                    </div>
                  </div>
                )}

                {(merchant.bankDetails?.accountName || merchant.bankDetails?.accountNumber) && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Bank Details</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                      {merchant.bankDetails.accountName && (
                        <>
                          <dt className="text-sm font-medium text-muted-foreground">Account Name:</dt>
                          <dd>{merchant.bankDetails.accountName}</dd>
                        </>
                      )}
                      {merchant.bankDetails.accountNumber && (
                        <>
                          <dt className="text-sm font-medium text-muted-foreground">Account Number:</dt>
                          <dd>{merchant.bankDetails.accountNumber}</dd>
                        </>
                      )}
                      {merchant.bankDetails.bankName && (
                        <>
                          <dt className="text-sm font-medium text-muted-foreground">Bank Name:</dt>
                          <dd>{merchant.bankDetails.bankName}</dd>
                        </>
                      )}
                      {merchant.bankDetails.ifscCode && (
                        <>
                          <dt className="text-sm font-medium text-muted-foreground">IFSC Code:</dt>
                          <dd>{merchant.bankDetails.ifscCode}</dd>
                        </>
                      )}
                    </dl>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium mb-2">Additional Information</h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <dt className="text-sm font-medium text-muted-foreground">Created On:</dt>
                    <dd>{new Date(merchant.createdAt).toLocaleDateString()}</dd>
                    <dt className="text-sm font-medium text-muted-foreground">Last Updated:</dt>
                    <dd>{new Date(merchant.updatedAt).toLocaleDateString()}</dd>
                  </dl>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Recent payouts made to this merchant</CardDescription>
              </CardHeader>
              <CardContent>
                <MerchantPayoutHistory merchantId={params.id} initialPayouts={recentPayouts} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

