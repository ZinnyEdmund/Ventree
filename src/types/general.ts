// --- Shared Enums (should ideally be imported from your backend-generated types)
export type Role = "owner" | "staff";
export type ServiceProviderRole = "INDIVIDUAL" | "COMPANY";

// --- Staff Types
export interface Staff {
  _id: string;
  staffName: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  shopId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStaffInput {
  shopId: string;
  staffName: string;
  phoneNumber: string;
  password: string;
  role?: string;
}

export enum PaymentMethodOptions {
  cash = "cash",
  transfer = "transfer",
  pos = "pos",
  credit = "credit",
}

export interface RecordSaleItemDto {
  itemId: string;
  quantity: number;
  sellingPrice: number;
}

export interface RecordSaleDto {
  shopId: string;
  items: RecordSaleItemDto[];
  soldBy: string;
  paymentMethod: PaymentMethodOptions;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  dueDate?: string;
  notes?: string;
  transactionReference?: string;
}

export interface UpdateStaffInput {
  staffName?: string;
  phoneNumber?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
}

export enum EnumBusinessType {
  RETAIL = "retail",
  WHOLESALE = "wholesale",
  MANUFACTURER = "manufacturer",
  OTHER = "other"
}

export interface UpdateShopDTO {
  shopName?: string;
  phoneNumber?: string;
  ownerName?: string;
  businessType?: EnumBusinessType; // or: businessTypeValues[number]
  address?: string;
}

export interface SubmitKYCInfo {
  address: string;
  businessType: EnumBusinessType;
}
export interface KYCData {
  id: string;
  shopName: string;
  businessType: string;
  address: string;
  kycStatus: string;        // or "verified" | "pending" | "rejected"
  kycSubmittedAt: string;   // ISO timestamp
}

export interface StaffListData {
  page: number;
  pages: number;
  total: number;
  staff: Staff[];
}

export interface StaffResponse {
  success: boolean;
  message: string;
  data: Staff;
}

// --- User Types
export interface User {
  userId: string; 
  shopId: string; 
  shopName: string;
  phoneNumber: string;
  userName: string;
  role: Role;
  avatar?: string | null;
  createdAt: string; // ISO date
  updatedAt: string;
}

export enum AvailabilityStatus {
  AVAILABLE = "AVAILABLE",
  AWAY = "AWAY",
  OFFLINE = "OFFLINE",
}


export interface ClientType {
  id: number;
  userId: number;
  fullname: string;
  description?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  street?: string | null;
  pfp?: string | null;
  phone?: string | null;
  createdAt: string; // ISO date
  updatedAt: string;

  user: User;  // relation to User
}

export type ClientProfile = BaseResponse<ClientType>;

export type ServiceProviderProfile = BaseResponse<{ 
  id: number;
  userId: number;
  fullName: string;
  companyName?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  street?: string | null;
  pfp?: string | null;
  yearsOfExperience?: number | null;
  description?: string | null;
  providerType: ServiceProviderRole;
  availability: AvailabilityStatus;
  pastWork: string[];   // array of image URLs
  isSubscribed: boolean;
  createdAt: string; // ISO date
  updatedAt: string;

  user: User;  // relation to User
  // services: ServiceProviderService[]; // if you want type for this, see below
}>;


// --- Auth Requests
export interface RegisterRequest {
  shopName: string;
  phoneNumber: string;
  ownerName: string;
  password: string;
}

export interface LoginRequest {
  shopName: string;
  phoneNumber: string;
  password: string;
}

export interface VerifyOtpRequest {
  shopName: string;
  phoneNumber: string;
  otp: string;
}

export interface ResendOtpRequest {
  shopName: string;
  phoneNumber: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}


// --- Base Response
export interface BaseResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

// --- Auth Responses
export type AuthResponse = BaseResponse<{
  accessToken: string;
  refreshToken: string;
  user: User;
}>;

export interface Staff {
  id: string;
  staffName: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt?: string;  // or Date
  updatedAt?: string;  // or Date
}

// Actual API response structure for login
export interface LoginResponse {
  success: boolean;
  data: {
    message: string;
    accessToken: string;
    refreshToken: string;
    role: Role;
    owner: {
      name: string;
      phoneNumber: string;
    };
    shop: {
      id: string;
      shopName: string;
      phoneNumber: string;
      businessType: string;
      isVerified: boolean;
      kycStatus: string;
      owner: {
        name: string;
        phoneNumber: string;
      };
    };
    staff: Staff | null;
  };
}

// Refresh token response - may use either BaseResponse format or direct data format
export type RefreshTokenResponse = BaseResponse<{
  accessToken: string;
  refreshToken: string;
}>;

// Alternative format (if API returns data directly like LoginResponse)
export interface RefreshTokenDataResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    message?: string;
  };
}

// --- Cloudinary
export interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
}

// --- Stocks
export interface Stocks {
  _id: string;
  shopId: string;
  name: string;
  category: string;
  sku: string;
  costPrice: number;
  sellingPrice: number;
  initialQuantity: number;
  availableQuantity: number;
  soldQuantity: number;
  damagedQuantity: number;
  returnedQuantity: number;
  reorderLevel: number;
  reorderQuantity: number;
  unit: string;
  images: string[];
  tags: string[];
  isActive: boolean;
  isLowStock: boolean;
  isOutOfStock: boolean;
  createdBy: string;
  createdAt: string;  // or Date
  updatedAt: string;  // or Date
  __v: number;
}

export interface CreateProductDto {
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  initialQuantity: number;
  unit: string;            // e.g., "kg", "liters", "pieces"
  reorderLevel: number;    // threshold for stock alerts
}

export interface InventoryData {
  items: Stocks[];
  total: number;
  page: number;
  pages: number;
}

export interface Sales {
  shopId: string;
  itemId: string;
  itemName: string;
  itemCategory: string;
  quantitySold: number;
  costPrice: number;
  sellingPrice: number;
  discount: number;
  taxAmount: number;
  totalAmount: number;
  profitAmount: number;
  soldBy: string;
  soldByName: string;
  paymentMethod: string;
  date: string; // ISO Date string
  refunded: boolean;
  _id: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  __v: number;
  profitPercentage: string; // e.g. "15.00"
  id: string;
}

export interface ExpenseData {
  _id: string;
  shopId: string;
  title: string;
  date: string; // ISO Date string
  category: string;
  amount: number;
  notes: string;
  uploader: string;
  createdAt: string; // or Date if you convert it on fetch
  updatedAt: string; // or Date
  __v: number;
}

export interface ICreateExpense {
  shopId: string;
  staffId?: string; // optional
  category: string;
  amount: number;
  title: string;
  // date?: string; // optional date in ISO format
  notes?: string; // optional notes (since you may or may not include it)
}

export interface ShopOwner {
  name: string;
}

export interface IShop {
  _id: string;
  shopName: string;
  phoneNumber: string;
  businessType: EnumBusinessType;
  isVerified: boolean;
  kycStatus: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  kycSubmittedAt: string;
  __v: number;
  owner: ShopOwner;
}

export interface DashboardResponse {
  success: boolean;
  data: {
    shop: Shop;
    owner: Owner;
    staff: Staff;
    dashboard: DashboardStats;
  };
}

export interface Shop {
  id: string;
  shopName: string;
  phoneNumber: string;
  businessType: string;
  isVerified: boolean;
  kycStatus: string;
  owner: Owner;
}

export interface Owner {
  name: string;
  phoneNumber: string;
}

export interface Staff {
  id: string;
  staffName: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt?: string;   // or Date if you want
  updatedAt?: string;   // or Date if you want
}

export interface DashboardStats {
  period: string;
  sales: number;
  expenses: number;
  lowStockItems: number;
  profit: number;
}

export enum TimePeriod {
  DAILY = "today",
  WEEKLY = "week",
}

export interface SoldBy {
  _id: string;
  staffName: string;
}

export interface Sale {
  _id: string;
  shopId: string;
  itemId: string;
  itemName: string;
  itemCategory: string;
  quantitySold: number;
  costPrice: number;
  sellingPrice: number;
  totalAmount: number;
  amountPaid: number;
  amountOwed: number;
  discount: number;
  taxAmount: number;
  profitAmount: number;
  paymentMethod: string;
  isCredit: boolean;
  creditStatus: string;
  refunded: boolean;
  payments: unknown[]; // If needed, define a detailed payment interface
  soldBy?: SoldBy;
  soldByName?: string;

  date: string;
  createdAt: string;
  updatedAt: string;

  __v: number;
}

export interface SaleHistoryItem {
  _id: string;
  ticketNumber: string;
  soldBy: string;
  soldByName: string;
  paymentMethod: string;
  date: string;
  refunded: boolean;
  ticketId: string;
  itemId: string;
  itemName: string;
  itemCategory: string;
  quantitySold: number;
  costPrice: number;
  sellingPrice: number;
  discount: number;
  lineTotal: number;
  lineProfit: number;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  dueDate?: string;
}

export interface SaleTicketItem {
  itemId: string;
  itemName: string;
  itemCategory: string;
  quantitySold: number;
  costPrice: number;
  sellingPrice: number;
  discount: number;
  lineTotal: number;
  lineProfit: number;
}

export interface SaleTicket {
  _id: string;
  ticketNumber: string;
  shopId: string;
  items: SaleTicketItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  totalProfit: number;
  totalItemCount: number;
  soldBy: string;
  soldByName: string;
  paymentMethod: PaymentMethodOptions;
  date: string;
  refunded: boolean;
  isCredit: boolean;
  creditStatus: string;
  amountPaid: number;
  amountOwed: number;
  payments: unknown[];
}

export interface SalesResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    pages: number;
    total: number;
    sales: Sale[];
  };
}

export interface SalesItemsResponse {
  success: boolean;
  message: string;
  data: {
    items: SaleHistoryItem[];
    total: number;
    page: number;
    pages: number;
  };
}

export interface RecordCreditPaymentDTO {
  amount: number;
  paymentMethod: "cash" | "transfer";
  receivedBy: string;             // staff ID
  transactionReference?: string;
  notes?: string;
}