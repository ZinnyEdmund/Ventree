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
  card = "card",
  mobile = "mobile", 
  bankTransfer= "bank_transfer"
}

export interface RecordSaleDto {
  shopId: string;                     // Required - MongoId
  itemId: string;                     // Required - MongoId
  quantity: number;                   // Required - 1 to 10,000
  soldBy: string;                     // Required - MongoId
  paymentMethod: PaymentMethodOptions
  discount?: number;                  // Optional - 0 to 50
  customerName?: string;              // Optional - 2 to 100 chars
  customerPhone?: string;             // Optional - Valid international phone
  notes?: string;                     // Optional - Max 500 chars
  transactionReference?: string;
  sellingPrice?: number;
  taxAmount?: number;
  profitPercentage: string;
}

export interface UpdateStaffInput {
  staffName?: string;
  phoneNumber?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
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

export interface ClientProfile extends BaseResponse<ClientType> {}

export interface ServiceProviderProfile extends BaseResponse<{ 
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
}> {}


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
  message: string;
  data: T;
}

// --- Auth Responses
export interface AuthResponse extends BaseResponse<{
  accessToken: string;
  refreshToken: string;
  user: User;
}> {}

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
export interface RefreshTokenResponse extends BaseResponse<{
  accessToken: string;
  refreshToken: string;
}> {}

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

// --- Notifications stuff
export enum NotificationType {
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',  
  SALE_COMPLETED = 'sale_completed'
}

// matches what backend sends exactly
export interface INotification {
  _id: string;
  shopId: string;
  staffId?: string;
  inventoryId?: string;
  message: string;
  isRead: boolean;
  type: NotificationType;
  metadata?: Record<string, any>; // backend sometimes adds extra stuff here
  created_at: Date;
  updated_at: Date;
}

export interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
  isConnected: boolean;
  connectionError: string | null;
  lastUpdated: string | null;
}

export interface NotificationMessage {
  type: 'notification';
  data: INotification;
}

export interface ConnectionConfirmation {
  message: string;
  userId: string;
  shopId: string;
  role: Role;
}

// for the helper functions
export interface NotificationDisplay {
  icon: string;
  title: string;
  color: string;
}

export interface NotificationResponse extends BaseResponse<INotification[]> {}
export interface CreateNotificationResponse extends BaseResponse<INotification> {}  
export interface UpdateNotificationResponse extends BaseResponse<INotification> {}

export interface CreateNotificationDto {
  shopId: string;
  staffId?: string;
  inventoryId?: string; 
  message: string;
  type: NotificationType;
  metadata?: Record<string, any>;
}

export interface UpdateNotificationDto {
  isRead?: boolean; // probably only thing we'll update
}

export interface NotificationQueryParams {
  shopId: string;
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
}