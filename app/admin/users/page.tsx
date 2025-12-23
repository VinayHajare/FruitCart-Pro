import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import UserList from "@/components/admin/user-list"

export default function UsersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage system users and permissions</p>
          </div>
          <Link href="/admin/users/new">
            <Button>Add User</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>View and manage all system users</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<UserListSkeleton />}>
              <UserList />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function UserListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[100px] ml-auto" />
      </div>
      <div className="border rounded-md">
        <div className="grid grid-cols-5 gap-4 p-4 border-b">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b last:border-0">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
      </div>
    </div>
  )
}

