"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

interface Product {
  _id: string
  name: string
  category: string
  price: number
  stock: number
  unit: string
}

interface ProductListProps {
  searchQuery?: string
}

export default function ProductList({ searchQuery = "" }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products")
        if (!response.ok) throw new Error("Failed to fetch products")
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = products.filter(
      (product) => product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query),
    )
    setFilteredProducts(filtered)
  }, [searchQuery, products])

  if (loading) {
    return <div>Loading products...</div>
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          {products.length === 0
            ? "No products found. Add your first product to get started."
            : "No products match your search criteria."}
        </p>
        <Link href="/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>
      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <div key={product._id} className="flex items-center justify-between p-4 border rounded-md">
            <div>
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-muted-foreground">
                <Badge variant="outline" className="mr-2">
                  {product.category}
                </Badge>
                Stock: {product.stock} {product.unit}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="font-medium">{formatCurrency(product.price)}</div>
              <Link href={`/products/edit/${product._id}`}>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

