// types/inventory.types.ts

// ============================================================================
// Base Inventory Types
// ============================================================================

export interface Stocks {
  _id: string;
  shopId: string;
  name: string;
  description?: string;
  category: string;
  subCategory?: string;
  sku?: string;
  barcode?: string;
  costPrice: number;
  sellingPrice: number;
  minSellingPrice?: number;
  initialQuantity: number;
  availableQuantity: number;
  soldQuantity: number;
  damagedQuantity: number;
  returnedQuantity: number;
  reorderLevel: number;
  reorderQuantity: number;
  unit: string;
  supplier?: {
    name?: string;
    contact?: string;
    email?: string;
  };
  expiryDate?: string;
  manufacturingDate?: string;
  location?: string;
  images: string[];
  tags: string[];
  isActive: boolean;
  isLowStock: boolean;
  isOutOfStock: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ============================================================================
// DTOs (Data Transfer Objects)
// ============================================================================

export interface CreateProductDto {
  name: string;
  description?: string;
  category: string;
  subCategory?: string;
  sku?: string;
  barcode?: string;
  costPrice: number;
  sellingPrice: number;
  minSellingPrice?: number;
  initialQuantity: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  unit: string;
  supplier?: {
    name?: string;
    contact?: string;
    email?: string;
  };
  expiryDate?: string;
  manufacturingDate?: string;
  location?: string;
  images?: string[];
  tags?: string[];
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  category?: string;
  subCategory?: string;
  barcode?: string;
  costPrice?: number;
  sellingPrice?: number;
  minSellingPrice?: number;
  reorderLevel?: number;
  initialQuantity?: number;
  availableQuantity?: number;
  reorderQuantity?: number;
  unit?: string;
  supplier?: {
    name?: string;
    contact?: string;
    email?: string;
  };
  expiryDate?: string;
  manufacturingDate?: string;
  location?: string;
  images?: string[];
  tags?: string[];
  isActive?: boolean;
}

export interface RestockDto {
  quantity: number;
  costPrice?: number;
  notes?: string;
}

export interface AdjustStockDto {
  quantity: number;
  reason: "damaged" | "expired" | "lost" | "found" | "returned" | "correction";
  notes?: string;
}

// ============================================================================
// Response Types
// ============================================================================

export interface InventoryData {
  items: Stocks[];
  total: number;
  page: number;
  pages: number;
}

export interface InventoryAnalytics {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  expiringCount: number;
  totalSold: number;
  totalRevenue: number;
  topSellingItems: Array<{
    itemId: string;
    name: string;
    soldQuantity: number;
    revenue: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
    value: number;
  }>;
}

export interface CategoryData {
  categories: Array<{
    name: string;
    count: number;
    subCategories?: string[];
  }>;
}

export interface StockMovement {
  _id: string;
  itemId: string;
  shopId: string;
  type: "sale" | "restock" | "adjustment" | "return" | "initial";
  quantity: number;
  balanceAfter: number;
  reason?: string;
  notes?: string;
  performedBy: string;
  performedByName?: string;
  createdAt: string;
}

export interface StockMovementsData {
  movements: StockMovement[];
  total: number;
  page: number;
  pages: number;
}

export interface ExpiringItem extends Stocks {
  daysUntilExpiry: number;
}

// ============================================================================
// Query Parameters
// ============================================================================

export interface GetInventoryParams {
  shopId: string;
  category?: string;
  subCategory?: string;
  isActive?: boolean;
  isLowStock?: boolean;
  isOutOfStock?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: "name" | "createdAt" | "sellingPrice" | "availableQuantity" | "soldQuantity";
  sortOrder?: "asc" | "desc";
}

export interface GetExpiringItemsParams {
  shopId: string;
  days?: number;
}

export interface GetStockMovementsParams {
  shopId: string;
  itemId: string;
  page?: number;
  limit?: number;
}

// ============================================================================
// Mutation Parameters
// ============================================================================

export interface CreateInventoryParams extends CreateProductDto {
  shopId: string;
}

export interface UpdateInventoryParams extends UpdateProductDto {
  shopId: string;
  itemId: string;
}

export interface DeleteInventoryParams {
  shopId: string;
  itemId: string;
}

export interface RestockInventoryParams extends RestockDto {
  shopId: string;
  itemId: string;
}

export interface AdjustStockParams extends AdjustStockDto {
  shopId: string;
  itemId: string;
}

// ============================================================================
// Base Response Type
// ============================================================================

export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}