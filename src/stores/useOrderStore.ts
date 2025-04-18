import { create } from "zustand"
import axios from "@/lib/axios-custom"
import toast from "react-hot-toast"
import type { DeliveryStatus, Order, OrdersPage, OrderStatus, OrderStatusCounts, PaymentStatus, UpdateOrderStatusRequest } from "@/types/order"

type OrderStoreState = {
  isLoading: boolean
  error: string | null
  orders: Order[]
  selectedOrder: Order | null
  totalOrders: number
  totalPages: number
  currentPage: number
  pageSize: number 
  statusCounts: OrderStatusCounts | null

  // Fetch orders
  fetchOrders: (params?: {
    page?: number
    size?: number
    sortBy?: string
    sortDir?: string
  }) => Promise<void>

  // Fetch order statistics
  fetchOrderStatistics: () => Promise<void>

  // Get order by ID
  getOrderById: (orderId: string) => Promise<void>

  // Update order status
  updateOrderStatus: (orderId: string, data: UpdateOrderStatusRequest) => Promise<void>

  // Delete order
  deleteOrder: (orderId: string) => Promise<void>
}

const useOrderStore = create<OrderStoreState>((set, get) => ({
  isLoading: false,
  error: null,
  orders: [],
  selectedOrder: null,
  totalOrders: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10,
  statusCounts: null,

  fetchOrders: async (params = {}) => {
    set({ isLoading: true, error: null })
    try {
      const state = get()
      const page = params.page ?? state.currentPage
      const size = params.size ?? state.pageSize
      const sortBy = params.sortBy ?? "createdAt"
      const sortDir = params.sortDir ?? "desc"

      const response = await axios.get<{ result: OrdersPage }>("/api/orders", {
        params: {
          page,
          size,
          sortBy,
          sortDir,
        },
      })

      set({
        orders: response.data.result.content,
        totalOrders: response.data.result.totalElements,
        totalPages: response.data.result.totalPages,
        currentPage: page,
        pageSize: size,
        isLoading: false,
      })
    } catch (error: any) {
      console.error("Error fetching orders:", error)
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch orders. Please try again.",
      })
      toast.error(error.response?.data?.message || "Failed to fetch orders")
    }
  },

  fetchOrderStatistics: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.get<{ result: OrderStatusCounts }>("/api/orders/status-counts")
      set({
        statusCounts: response.data.result,
        isLoading: false,
      })
    } catch (error: any) {
      console.error("Error fetching order statistics:", error)
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch order statistics. Please try again.",
      })
      toast.error(error.response?.data?.message || "Failed to fetch order statistics")
    }
  },

  getOrderById: async (orderId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.get<{ result: Order }>(`/api/orders/${orderId}`)
      set({
        selectedOrder: response.data.result,
        isLoading: false,
      })
    } catch (error: any) {
      console.error("Error fetching order:", error)
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch order. Please try again.",
      })
      toast.error(error.response?.data?.message || "Failed to fetch order")
    }
  },

  updateOrderStatus: async (orderId: string, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch<{ result: Order }>(`/api/orders/${orderId}`, data);
  
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                orderStatus: data.orderStatus as OrderStatus || order.orderStatus,
                paymentStatus: data.paymentStatus as PaymentStatus || order.paymentStatus,
                deliveryStatus: data.deliveryStatus as DeliveryStatus || order.deliveryStatus,
              }
            : order,
        ),
        selectedOrder:
          state.selectedOrder && state.selectedOrder.id === orderId
            ? response.data.result
            : state.selectedOrder,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to update order status", isLoading: false });
    }
  },

  deleteOrder: async (orderId: string) => {
    set({ isLoading: true, error: null })
    try {
      await axios.delete(`/api/orders/${orderId}`)

      // Remove the order from the orders array
      set((state) => ({
        orders: state.orders.filter((order) => order.id !== orderId),
        selectedOrder: state.selectedOrder && state.selectedOrder.id === orderId ? null : state.selectedOrder,
        isLoading: false,
      }))

      toast.success("Order deleted successfully")
    } catch (error: any) {
      console.error("Error deleting order:", error)
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to delete order. Please try again.",
      })
      toast.error(error.response?.data?.message || "Failed to delete order")
    }
  },
}))

export default useOrderStore
