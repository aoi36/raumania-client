import { create } from "zustand"
import axios from "@/lib/axios-custom"
import toast from "react-hot-toast"
import type { Page, ProductPaginationParams } from "@/types/pagination"

// Define the SearchProduct interface
interface SearchProduct {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  thumbnailImage: string // Add this property
  // Add other properties as needed
}

// Define the Product interface
interface Product {
  id: string
  name: string
  description: string
  productMaterial: string
  inspiration: string
  usageInstructions: string
  thumbnailImage: string
  stock: number
  price: number
  isActive: boolean
  brand: {
    id: string
    name: string
  }
  productImages: {
    id: string
    image: string
  }[]
  productVariants: {
    id: string
    size: string
  }[]
  // Add other properties as needed
}

interface ProductStoreState {
  isLoading: boolean
  error: string | null
  newProducts: SearchProduct[]
  random12Products: SearchProduct[]
  currentProduct: Product | null
  products: SearchProduct[]
  totalProducts: number
  totalPages: number
  currentPage: number
  pageSize: number

  // Filter state
  searchName: string
  minPrice: number
  maxPrice: number
  isActive: boolean | null
  brandName: string | null
  size: string | null
  scent: string | null

  setSearchFilters: (
    name: string,
    minPrice: number,
    maxPrice: number,
    isActive?: boolean | null,
    brandName?: string | null,
    size?: string | null,
    scent?: string | null,
  ) => void

  fetchNewProducts: () => Promise<void>
  fetchRandom12Products: () => Promise<void>
  fetchProductById: (productId: string) => Promise<Product | null>
  fetchProducts: (params?: Partial<ProductPaginationParams>) => Promise<void>
  addProduct: (formData: FormData) => Promise<Product | null>
  updateProduct: (id: string, formData: FormData) => Promise<Product | null>
  deleteProduct: (id: string) => Promise<void>
}

const useProductStore = create<ProductStoreState>((set, get) => ({
  isLoading: false,
  error: null,
  newProducts: [],
  random12Products: [],
  currentProduct: null,
  products: [],
  totalProducts: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10,

  searchName: "",
  minPrice: 0,
  maxPrice: 1000000,
  isActive: null,
  brandName: null,
  size: null,
  scent: null,

  setSearchFilters: (name, minPrice, maxPrice, isActive, brandName, size, scent) => {
    set({
      searchName: name,
      minPrice,
      maxPrice,
      isActive: isActive ?? null,
      brandName: brandName ?? null,
      size: size ?? null,
      scent: scent ?? null,
    })
  },

  fetchNewProducts: async () => {
    try {
      set({ isLoading: true, error: null })
      const res = await axios.get("/api/product/newest-8")
      set({ newProducts: res.data.result, isLoading: false })
    } catch (err) {
      console.error(err)
      set({ isLoading: false, error: "Failed to fetch new products" })
    }
  },

  fetchRandom12Products: async () => {
    try {
      set({ isLoading: true, error: null })
      const res = await axios.get("/api/product/random-12")
      set({ random12Products: res.data.result, isLoading: false })
    } catch (err) {
      console.error(err)
      set({ isLoading: false, error: "Failed to fetch random products" })
    }
  },

  fetchProductById: async (productId: string) => {
    try {
      set({ isLoading: true, error: null })
      const res = await axios.get(`/api/product/${productId}`)
      set({ currentProduct: res.data.result, isLoading: false })
      return res.data.result
    } catch (err) {
      console.error(err)
      set({ isLoading: false, error: "Failed to fetch product by ID" })
      return null
    }
  },

  fetchProducts: async (params?: Partial<ProductPaginationParams>) => {
    set({ isLoading: true, error: null })
    try {
      const state = get()

      const pageNumber = params?.pageNumber ?? state.currentPage
      const pageSize = params?.pageSize ?? state.pageSize
      const name = params?.name ?? state.searchName
      const minPrice = params?.minPrice ?? state.minPrice
      const maxPrice = params?.maxPrice ?? state.maxPrice
      const isActive = params?.isActive ?? state.isActive
      const brandName = params?.brandName ?? state.brandName
      const size = params?.size ?? state.size
      const scent = params?.scent ?? state.scent
      const sort = params?.sort

      const response = await axios.get<Page<SearchProduct>>("/api/product/search", {
        params: {
          pageNumber: pageNumber,
          pageSize,
          name,
          minPrice,
          maxPrice,
          isActive,
          brandName,
          size: size,
          scent,
          sort,
        },
      })

      // Update the state with the correct data structure
      set({
        products: response.data.result.content,
        totalProducts: response.data.result.totalElements,
        totalPages: response.data.result.totalPages,
        currentPage: pageNumber,
        pageSize,
        isLoading: false,
      })
    } catch (error) {
      console.error("Error fetching products:", error)
      set({ isLoading: false, error: "Failed to fetch products. Please try again." })
    }
  },

  addProduct: async (formData: FormData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post("/api/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      set((state) => ({
        products: [response.data.result, ...state.products],
        isLoading: false,
      }))

      toast.success("Product added successfully!")
      return response.data.result
    } catch (error: any) {
      console.error("Error adding product:", error)
      toast.error("Failed to add product: " + (error.response?.data?.message || "Unknown error"))
      set({ isLoading: false, error: "Failed to add product." })
      return null
    }
  },

  updateProduct: async (id: string, formData: FormData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.put(`/api/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      set((state) => ({
        products: state.products.map((p) => (p.id === id ? response.data.result : p)),
        currentProduct: response.data.result,
        isLoading: false,
      }))

      toast.success("Product updated successfully!")
      return response.data.result
    } catch (error: any) {
      console.error("Error updating product:", error)
      toast.error("Failed to update product: " + (error.response?.data?.message || "Unknown error"))
      set({ isLoading: false, error: "Failed to update product." })
      return null
    }
  },

  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await axios.delete(`/api/product/${id}`)

      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        isLoading: false,
      }))

      toast.success("Product deleted successfully!")
    } catch (error: any) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product: " + error.response?.data?.message || "Unknown error")
      set({ isLoading: false, error: "Failed to delete product." })
    }
  },
}))

export default useProductStore
