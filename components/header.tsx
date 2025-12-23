"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { MoonIcon, SunIcon, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Header() {
  const { setTheme } = useTheme()
  const pathname = usePathname()
  const isMobile = useMobile()
  const { data: session } = useSession()
  const router = useRouter()

  const navigation = [
    { name: "Dashboard", href: "/" },
    { name: "Billing", href: "/billing" },
    { name: "Inventory", href: "/inventory" },
    { name: "Products", href: "/products" },
    { name: "Merchants", href: "/merchants" },
    { name: "Reports", href: "/reports" },
  ]

  // Add admin-only navigation items
  const adminNavigation =
    session?.user?.role === "admin"
      ? [
          { name: "User Management", href: "/admin/users" },
          { name: "Settings", href: "/admin/settings" },
          { name: "Admin Guide", href: "/admin/guide" },
        ]
      : []

  const allNavigation = [...navigation, ...adminNavigation]

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/auth/login")
    router.refresh()
  }

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl flex items-center">
            <span className="text-primary mr-2">🍎</span> Fruit Shop
          </Link>

          {!isMobile && (
            <nav className="ml-10 flex items-center space-x-4 lg:space-x-6">
              {allNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  {allNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        pathname === item.href ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {session ? (
                    <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  ) : (
                    <Button asChild variant="outline">
                      <Link href="/auth/login">Login</Link>
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          )}

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(session.user.name || "")}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">{session.user.name}</DropdownMenuItem>
                <DropdownMenuItem className="text-muted-foreground text-sm">{session.user.email}</DropdownMenuItem>
                <DropdownMenuItem className="text-muted-foreground text-sm">
                  Role: {session.user.role === "admin" ? "Administrator" : "User"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

