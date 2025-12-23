"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ErrorFallback({ title, description }: { title: string; description: string }) {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}

export function ErrorCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Error</CardTitle>
        <CardDescription>Unable to connect to the database</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Please check your environment variables and ensure MONGODB_URI is properly set.
        </p>
      </CardContent>
    </Card>
  )
}

