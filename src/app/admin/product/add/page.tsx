"use client"

import { useState, useRef, type ChangeEvent, type FormEvent } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { DashboardShell } from "@/components/admin/dashboard-shell"
import { DashboardHeader } from "@/components/admin/dashboard-header"
import useProductStore from "@/stores/useProductStore"
import toast from "react-hot-toast"

export default function AddProductPage() {
  const { addProduct, isLoading } = useProductStore()
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const additionalImagesInputRef = useRef<HTMLInputElement>(null)

  // Form state - matching CreateProductRequest fields
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [productMaterial, setProductMaterial] = useState("")
  const [inspiration, setInspiration] = useState("")
  const [usageInstructions, setUsageInstructions] = useState("")
  const [brand, setBrand] = useState("")
  const [stock, setStock] = useState("")
  const [price, setPrice] = useState("")
  const [isActive, setIsActive] = useState(true)

  // Thumbnail image state
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  // Additional images state
  const [additionalImages, setAdditionalImages] = useState<File[]>([])
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([])

  // Size options for fragrance (50ml, 100ml, 150ml as requested)
  const sizeOptions = ["50ml", "100ml", "150ml"]
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["100ml"])

  // Handle thumbnail image upload
  const handleThumbnailUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setThumbnailImage(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Handle additional images upload
  const handleAdditionalImagesUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages: File[] = [...additionalImages]
    const newPreviews: string[] = [...additionalPreviews]

    Array.from(files).forEach((file) => {
      newImages.push(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result as string)
        setAdditionalPreviews([...newPreviews])
      }
      reader.readAsDataURL(file)
    })

    setAdditionalImages(newImages)
  }

  // Remove an additional image
  const removeAdditionalImage = (index: number) => {
    const newImages = [...additionalImages]
    const newPreviews = [...additionalPreviews]

    newImages.splice(index, 1)
    newPreviews.splice(index, 1)

    setAdditionalImages(newImages)
    setAdditionalPreviews(newPreviews)
  }

  // Toggle size selection
  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size))
    } else {
      setSelectedSizes([...selectedSizes, size])
    }
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!name || !description || !price || !stock || !brand) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!thumbnailImage) {
      toast.error("Please upload a product thumbnail image")
      return
    }

    try {
      // Create a product object that matches your CreateProductRequest on the backend
      const productData = {
        name,
        description,
        productMaterial,
        inspiration,
        usageInstructions,
        stock: Number.parseInt(stock),
        price: Number.parseFloat(price),
        isActive,
        brand,
      }

      // Create FormData with the correct structure
      const formData = new FormData()

      // Add the product data as a JSON string in a part named "product"
      formData.append(
        "product",
        new Blob([JSON.stringify(productData)], {
          type: "application/json",
        }),
      )

      // Add thumbnail image
      if (thumbnailImage) {
        formData.append("thumbnailImage", thumbnailImage)
      }

      // Add additional images
      if (additionalImages.length > 0) {
        additionalImages.forEach((image) => {
          formData.append("images", image)
        })
      }

      // Use the addProduct function from the store
      const result = await addProduct(formData)

      if (result) {
        resetForm()
      }
    } catch (error) {
      console.error("Error adding product:", error)
      toast.error("Failed to add product. Please try again.")
    }
  }

  // Reset form fields
  const resetForm = () => {
    setName("")
    setDescription("")
    setProductMaterial("")
    setInspiration("")
    setUsageInstructions("")
    setBrand("")
    setStock("")
    setPrice("")
    setIsActive(true)
    setThumbnailImage(null)
    setThumbnailPreview(null)
    setAdditionalImages([])
    setAdditionalPreviews([])
    setSelectedSizes(["100ml"])
  }

  return (
    <DashboardShell>
      <DashboardHeader title="CREATE PRODUCT" />

      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Product Images */}
            <div className="lg:col-span-1">
              {/* Main Product Image */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-medium mb-4">Add Product Photo</h2>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors"
                  onClick={() => thumbnailInputRef.current?.click()}
                >
                  {thumbnailPreview ? (
                    <div className="relative w-full aspect-square">
                      <Image
                        src={thumbnailPreview || "/placeholder.svg"}
                        alt="Product thumbnail preview"
                        fill
                        className="object-contain"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setThumbnailPreview(null)
                          setThumbnailImage(null)
                        }}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10">
                      <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4">
                        <Upload className="h-8 w-8 text-orange-500" />
                      </div>
                      <p className="text-sm text-gray-500 text-center">
                        Drop your images here, or <span className="text-orange-500">click to browse</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={thumbnailInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                  />
                </div>
              </div>

              {/* Additional Images */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium mb-4">Additional Images</h2>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors mb-4"
                  onClick={() => additionalImagesInputRef.current?.click()}
                >
                  <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-orange-500" />
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    Add more product images, or <span className="text-orange-500">click to browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Upload multiple images to show different angles</p>
                  <input
                    type="file"
                    ref={additionalImagesInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesUpload}
                  />
                </div>

                {additionalImages.length > 0 && (
                  <>
                    <h3 className="text-sm font-medium mb-2 text-gray-700">
                      Selected Images ({additionalImages.length})
                    </h3>
                    <div className="flex flex-wrap">
                      {additionalImages.map((image, index) => (
                        <div key={index} className="relative w-24 h-24 m-1">
                          <Image
                            src={additionalPreviews[index] || "/placeholder.svg"}
                            alt={`Product image ${index + 1}`}
                            fill
                            className="object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Product Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium mb-4">Product Information</h2>

                <div className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      id="productName"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Items Name"
                      required
                    />
                  </div>

                  {/* Brand */}
                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <input
                      id="brand"
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brand Name"
                      required
                    />
                  </div>

                  {/* Sizes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size:</label>
                    <div className="flex flex-wrap gap-2">
                      {sizeOptions.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedSizes.includes(size)
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Short description about the product"
                      required
                    />
                  </div>

                  {/* Product Material */}
                  <div>
                    <label htmlFor="productMaterial" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Material
                    </label>
                    <input
                      id="productMaterial"
                      type="text"
                      value={productMaterial}
                      onChange={(e) => setProductMaterial(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter product material"
                      required
                    />
                  </div>

                  {/* Inspiration */}
                  <div>
                    <label htmlFor="inspiration" className="block text-sm font-medium text-gray-700 mb-1">
                      Inspiration
                    </label>
                    <input
                      id="inspiration"
                      type="text"
                      value={inspiration}
                      onChange={(e) => setInspiration(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter product inspiration"
                      required
                    />
                  </div>

                  {/* Usage Instructions */}
                  <div>
                    <label htmlFor="usageInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                      Usage Instructions
                    </label>
                    <input
                      id="usageInstructions"
                      type="text"
                      value={usageInstructions}
                      onChange={(e) => setUsageInstructions(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter usage instructions"
                      required
                    />
                  </div>

                  {/* Price and Stock */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <input
                          id="price"
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                        Stock
                      </label>
                      <input
                        id="stock"
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter quantity"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Active Status */}
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Product is active and available for sale</span>
                    </label>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Creating..." : "Create Product"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardShell>
  )
}
