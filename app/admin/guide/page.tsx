import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Guide</h1>
          <p className="text-muted-foreground">Comprehensive guide for system administrators</p>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="merchants">Merchant Management</TabsTrigger>
            <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
            <TabsTrigger value="system">System Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management Guide</CardTitle>
                <CardDescription>How to create and manage user accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Creating a New User</h3>
                  <ol className="list-decimal list-inside space-y-2 mt-2">
                    <li>
                      Navigate to{" "}
                      <Link href="/admin/users" className="text-primary hover:underline">
                        User Management
                      </Link>
                    </li>
                    <li>Click on the "Add New User" button</li>
                    <li>
                      Fill in the required information:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>Full Name</li>
                        <li>Username (for login)</li>
                        <li>Email Address</li>
                        <li>Password</li>
                        <li>Role (Admin or User)</li>
                      </ul>
                    </li>
                    <li>Click "Create User" to save</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-medium">User Roles</h3>
                  <div className="mt-2 space-y-2">
                    <div>
                      <h4 className="font-medium">Admin</h4>
                      <p className="text-sm text-muted-foreground">
                        Full access to all system features including user management, merchant payouts, and system
                        configuration.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">User</h4>
                      <p className="text-sm text-muted-foreground">
                        Access to day-to-day operations like billing, inventory management, and basic reporting.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Managing Existing Users</h3>
                  <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>Edit user details by clicking the edit icon next to a user</li>
                    <li>Deactivate users by toggling their status (users can be reactivated later)</li>
                    <li>Reset passwords for users who have forgotten their credentials</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="merchants">
            <Card>
              <CardHeader>
                <CardTitle>Merchant Management Guide</CardTitle>
                <CardDescription>How to manage suppliers and process payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Adding New Merchants</h3>
                  <ol className="list-decimal list-inside space-y-2 mt-2">
                    <li>
                      Navigate to{" "}
                      <Link href="/merchants" className="text-primary hover:underline">
                        Merchants
                      </Link>
                    </li>
                    <li>Click on "Add New Merchant"</li>
                    <li>Fill in merchant details including contact information and payment terms</li>
                    <li>Save the new merchant record</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Processing Merchant Payouts</h3>
                  <ol className="list-decimal list-inside space-y-2 mt-2">
                    <li>Go to the Merchants section</li>
                    <li>Select a merchant from the list</li>
                    <li>Click "New Payout"</li>
                    <li>Enter the payment amount and details</li>
                    <li>Select payment method</li>
                    <li>Confirm and process the payment</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Viewing Payout History</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    You can view the complete payment history for each merchant by clicking on their name in the
                    merchant list. This shows all past transactions and outstanding balances.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics Guide</CardTitle>
                <CardDescription>How to use the reporting features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Available Reports</h3>
                  <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>Sales Overview - Daily, weekly, and monthly sales figures</li>
                    <li>Sales by Category - Distribution of sales across product categories</li>
                    <li>Top Products - Best-selling products by volume and revenue</li>
                    <li>Inventory Turnover - How quickly products are sold and replaced</li>
                    <li>Merchant Payouts - Summary of payments to suppliers</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Exporting Reports</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Most reports can be exported to CSV or PDF format using the export button in the report view. These
                    exports can be used for accounting, tax purposes, or further analysis.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Custom Date Ranges</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    You can customize the date range for most reports to focus on specific time periods. This is useful
                    for monthly reconciliation or seasonal analysis.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration Guide</CardTitle>
                <CardDescription>Managing system settings and configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Environment Variables</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    The system requires the following environment variables to be set:
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>MONGODB_URI - Connection string for MongoDB database</li>
                    <li>NEXTAUTH_SECRET - Secret key for authentication</li>
                    <li>NEXTAUTH_URL - Base URL of the application</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Database Backup</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Regular database backups are recommended. You can use MongoDB Atlas backup features or set up
                    automated backups using scripts.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Troubleshooting</h3>
                  <p className="text-sm text-muted-foreground mt-2">If you encounter issues with the application:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Check that all environment variables are correctly set</li>
                    <li>Verify MongoDB connection is working</li>
                    <li>Check server logs for error messages</li>
                    <li>Ensure the server has sufficient resources</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

