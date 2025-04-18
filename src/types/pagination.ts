export interface Page<T> {
    result: {
      content: T[]
      pageNumber: number
      pageSize: number
      totalElements: number
      totalPages: number
    }
  }
  
  export interface ProductPaginationParams {
    pageNumber: number
    pageSize: number
    sort?: string
    name?: string
    minPrice?: number
    maxPrice?: number
    isActive?: boolean
    brandName?: string
    size?: string
    scent?: string
  }
  