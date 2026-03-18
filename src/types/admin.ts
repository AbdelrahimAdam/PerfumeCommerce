// src/types/admin.ts

export interface AdminUser {
  uid: string
  email: string
  displayName?: string
  phoneNumber?: string                // added
  role: 'admin' | 'super-admin'
  tenantId: string                     // added
  isActive: boolean
  createdAt: string
  lastLoginAt: string
  permissions?: string[]               // added
}

export interface CreateAdminDto {
  email: string
  displayName?: string
  role: 'admin' | 'super-admin'
  password: string
  isActive?: boolean
  phoneNumber?: string                  // added
  permissions?: string[]                 // added
  tenantId: string                       // added
}

export interface UpdateAdminDto {
  displayName?: string
  role?: 'admin' | 'super-admin'
  isActive?: boolean
  phoneNumber?: string                   // added
  permissions?: string[]                  // added
}