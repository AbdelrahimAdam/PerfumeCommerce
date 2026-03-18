// src/stores/admin.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AdminService } from '@/services/adminService'
import type { AdminUser, CreateAdminDto, UpdateAdminDto } from '@/types/admin'
import { useAuthStore } from './auth'

export const useAdminStore = defineStore('admin', () => {
  const authStore = useAuthStore()

  const admins = ref<AdminUser[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const stats = ref({
    total: 0,
    superAdmins: 0,
    activeAdmins: 0,
    inactiveAdmins: 0
  })

  // Fetch all admins for the current tenant
  const fetchAdmins = async () => {
    loading.value = true
    error.value = null
    try {
      const adminList = await AdminService.getAdmins(authStore.currentTenant ?? undefined)
      admins.value = adminList.map(admin => ({
        ...admin,
        createdAt: admin.createdAt || new Date().toISOString(),
        lastLoginAt: admin.lastLoginAt || new Date().toISOString()
      }))
      updateStats()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch admins'
      console.error('Error fetching admins:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create new admin – include tenantId from current context
  const createAdmin = async (adminData: CreateAdminDto) => {
    loading.value = true
    error.value = null
    try {
      // Ensure tenantId is provided
      const tenantId = adminData.tenantId || authStore.currentTenant
      if (!tenantId) {
        throw new Error('Tenant ID is required to create an admin')
      }
      const dataWithTenant = {
        ...adminData,
        tenantId
      }
      const newAdmin = await AdminService.createAdmin(dataWithTenant)
      admins.value.unshift(newAdmin)
      updateStats()
      return newAdmin
    } catch (err: any) {
      error.value = err.message || 'Failed to create admin'
      console.error('Error creating admin:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update admin
  const updateAdmin = async (uid: string, updateData: UpdateAdminDto) => {
    loading.value = true
    error.value = null
    try {
      await AdminService.updateAdmin(uid, updateData)
      const index = admins.value.findIndex(admin => admin.uid === uid)
      if (index !== -1) {
        admins.value[index] = { ...admins.value[index], ...updateData }
      }
      updateStats()
    } catch (err: any) {
      error.value = err.message || 'Failed to update admin'
      console.error('Error updating admin:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete admin
  const deleteAdmin = async (uid: string) => {
    loading.value = true
    error.value = null
    try {
      await AdminService.deleteAdmin(uid)
      admins.value = admins.value.filter(admin => admin.uid !== uid)
      updateStats()
    } catch (err: any) {
      error.value = err.message || 'Failed to delete admin'
      console.error('Error deleting admin:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Reset admin password
  const resetAdminPassword = async (email: string) => {
    loading.value = true
    error.value = null
    try {
      await AdminService.resetAdminPassword(email)
    } catch (err: any) {
      error.value = err.message || 'Failed to reset password'
      console.error('Error resetting password:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get admin stats for the current tenant
  const fetchAdminStats = async () => {
    try {
      const adminStats = await AdminService.getAdminStats(authStore.currentTenant ?? undefined)
      stats.value = adminStats
    } catch (err: any) {
      console.error('Error fetching admin stats:', err)
    }
  }

  // Search admins within the current tenant
  const searchAdmins = async (searchTerm: string) => {
    try {
      return await AdminService.searchAdmins(searchTerm, authStore.currentTenant ?? undefined)
    } catch (err: any) {
      console.error('Error searching admins:', err)
      return []
    }
  }

  // Update last login
  const updateLastLogin = async (uid: string) => {
    try {
      await AdminService.updateLastLogin(uid)
      const index = admins.value.findIndex(admin => admin.uid === uid)
      if (index !== -1) {
        admins.value[index].lastLoginAt = new Date().toISOString()
      }
    } catch (err) {
      console.error('Error updating last login:', err)
    }
  }

  // Helper function to update local stats
  const updateStats = () => {
    stats.value = {
      total: admins.value.length,
      superAdmins: admins.value.filter(admin => admin.role === 'super-admin').length,
      activeAdmins: admins.value.filter(admin => admin.isActive).length,
      inactiveAdmins: admins.value.filter(admin => !admin.isActive).length
    }
  }

  // Get admin by ID
  const getAdminById = (uid: string) => {
    return admins.value.find(admin => admin.uid === uid) || null
  }

  return {
    admins,
    loading,
    error,
    stats,
    fetchAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    resetAdminPassword,
    fetchAdminStats,
    searchAdmins,
    updateLastLogin,
    getAdminById
  }
})