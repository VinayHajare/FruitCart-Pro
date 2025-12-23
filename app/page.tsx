import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Package, Users, BarChart, Truck } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="flex items-center justify-center mb-6">
          <span className="text-6xl">🍎</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Fruit Shop Billing System</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          A comprehensive solution for managing your fruit shop billing and merchant payouts
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle>Billing</CardTitle>
              </div>
              <CardDescription>Create and manage customer bills</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Create bills, process payments, and generate receipts for your customers.</p>
            </CardContent>
            <CardFooter>
              <Link href="/billing" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
                  Go to Billing
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <CardTitle>Inventory</CardTitle>
              </div>
              <CardDescription>Manage your product inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Track stock levels, manage product details, and handle inventory adjustments.</p>
            </CardContent>
            <CardFooter>
              <Link href="/inventory" className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                  Go to Inventory
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <CardTitle>Merchants</CardTitle>
              </div>
              <CardDescription>Manage suppliers and handle payouts</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Track payments to suppliers, schedule recurring payments, and manage merchant relationships.</p>
            </CardContent>
            <CardFooter>
              <Link href="/merchants" className="w-full">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600">
                  Go to Merchants
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <CardTitle>Reports</CardTitle>
              </div>
              <CardDescription>View insights and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Access sales reports, inventory analytics, and financial insights.</p>
            </CardContent>
            <CardFooter>
              <Link href="/reports" className="w-full">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
                  Go to Reports
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-red-600 dark:text-red-400" />
                <CardTitle>Products</CardTitle>
              </div>
              <CardDescription>Manage your product catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Add, edit, and organize your product catalog with prices and categories.</p>
            </CardContent>
            <CardFooter>
              <Link href="/products" className="w-full">
                <Button className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600">
                  Go to Products
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <CardTitle>User Management</CardTitle>
              </div>
              <CardDescription>Manage system users (Admin only)</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Create and manage user accounts with different permission levels.</p>
            </CardContent>
            <CardFooter>
              <Link href="/admin/users" className="w-full">
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600">
                  Manage Users
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

