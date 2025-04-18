export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED" | "COMPLETED"
export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED" | "FAILED"
export type DeliveryStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "RETURNED"
export type Priority = "Normal" | "High"

export interface OrderItem {
  id: string
  productVariantId: string
  productName: string
  variantName: string
  price: number
  quantity: number
  imageUrl?: string
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  customerName: string
  totalAmount: number
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
  deliveryStatus: DeliveryStatus
  deliveryNumber?: string
  createdAt: string
  updatedAt: string
  priority: Priority
  itemsCount: number
  orderItems: OrderItem[]
}

export interface OrdersPage {
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  content: Order[]
}

export interface OrderStatusCounts {
  orderStatus: {
    PENDING: number
    PROCESSING: number
    SHIPPED: number
    DELIVERED: number
    CANCELED: number
    COMPLETED: number
  }
  paymentStatus: {
    PENDING: number
    PAID: number
    REFUNDED: number
    FAILED: number
  }
  deliveryStatus: {
    PENDING: number
    PROCESSING: number
    SHIPPED: number
    DELIVERED: number
    RETURNED: number
  }
}

export interface UpdateOrderStatusRequest {
  orderStatus?: string
  paymentStatus?: string
  deliveryStatus?: string
}
