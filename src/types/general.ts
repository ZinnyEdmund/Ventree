// --- Shared Enums (should ideally be imported from your backend-generated types)
export type Role = "owner" | "staff";
export type ServiceProviderRole = "INDIVIDUAL" | "COMPANY";

// --- User Types
export interface User {
  id: string; 
  shopName: string;
  phoneNumber: string;
  ownerName: string;
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
  responseObject: T;
  statusCode: number;
}

// --- Auth Responses
export interface AuthResponse extends BaseResponse<{
  accessToken: string;
  refreshToken: string;
  user: User;
}> {}

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
    staff: any | null;
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