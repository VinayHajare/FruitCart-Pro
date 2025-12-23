"use client"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"

interface Product {
  _id: string
  name: string
  sku: string
  regularPrice: number
  discountPrice?: number
  unit: string
}

interface ProductSearchProps {
  onProductSelect: (product: Product) => void
}

export default function ProductSearch({ onProductSelect }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchProducts()
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const searchProducts = async () => {
    if (searchQuery.trim().length < 2) return

    setIsLoading(true)
    setShowResults(true)

    try {
      const response = await fetch(`/api/products?q=${encodeURIComponent(searchQuery.trim())}`)
      if (!response.ok) throw new Error("Failed to fetch products")

      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error("Error searching products:", error)
      toast({
        title: "Error",
        description: "Failed to search products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProductSelect = (product: Product) => {
    onProductSelect(product)
    setSearchQuery("")
    setSearchResults([])
    setShowResults(false)
  }

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search products by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            onFocus={() => {
              if (searchResults.length > 0) {
                setShowResults(true)
              }
            }}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          )}
        </div>
        <Button type="button" onClick={searchProducts}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {searchResults.map((product) => (
            <div
              key={product._id}
              className="p-2 hover:bg-muted cursor-pointer border-b last:border-0"
              onClick={() => handleProductSelect(product)}
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-muted-foreground">{product.sku}</div>
                </div>
                <div className="text-right">
                  <div>{formatCurrency(product.regularPrice)}</div>
                  <div className="text-xs text-muted-foreground">{product.unit}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && searchQuery.trim().length >= 2 && searchResults.length === 0 && !isLoading && (
        <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg p-4 text-center">
          <p className="text-muted-foreground">No products found. Try a different search term.</p>
        </div>
      )}
    </div>
  )
}

