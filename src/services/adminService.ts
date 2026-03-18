// src/services/adminService.ts
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore'
import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth'
import { db, auth } from '@/firebase/config'
import type { AdminUser, CreateAdminDto, UpdateAdminDto } from '@/types/admin'

const ADMIN_COLLECTION = 'admins'
const USERS_COLLECTION = 'users'

export class AdminService {
  /**
   * Get all admins – optionally filtered by tenantId
   * @param tenantId - if provided, only admins of that tenant are returned
   */
  static async getAdmins(tenantId?: string): Promise<AdminUser[]> {
    try {
      const adminsRef = collection(db, ADMIN_COLLECTION)
      let q
      if (tenantId) {
        q = query(
          adminsRef,
          where('tenantId', '==', tenantId),
          orderBy('createdAt', 'desc')
        )
      } else {
        q = query(adminsRef, orderBy('createdAt', 'desc'))
      }
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as AdminUser[]
    } catch (error) {
      console.error('Error fetching admins:', error)
      throw new Error('Failed to fetch admins')
    }
  }

  // Get admin by ID (no tenant filter – rules will enforce)
  static async getAdminById(uid: string): Promise<AdminUser | null> {
    try {
      const adminRef = doc(db, ADMIN_COLLECTION, uid)
      const snapshot = await getDoc(adminRef)
      
      if (snapshot.exists()) {
        return { uid: snapshot.id, ...snapshot.data() } as AdminUser
      }
      return null
    } catch (error) {
      console.error('Error fetching admin:', error)
      throw new Error('Failed to fetch admin')
    }
  }

  /**
   * Create a new admin – requires tenantId
   * @param adminData - includes email, password, displayName, role, and tenantId
   */
  static async createAdmin(adminData: CreateAdminDto): Promise<AdminUser> {
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        adminData.email,
        adminData.password
      )

      const user = userCredential.user

      // 2. Update user profile
      if (adminData.displayName) {
        await updateProfile(user, {
          displayName: adminData.displayName
        })
      }

      // 3. Create admin document in Firestore with tenantId
      const adminRef = doc(db, ADMIN_COLLECTION, user.uid)
      
      const adminDocData = {
        email: adminData.email,
        displayName: adminData.displayName || '',
        role: adminData.role || 'admin',
        tenantId: adminData.tenantId,          // now exists on CreateAdminDto
        isActive: adminData.isActive ?? true,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        phoneNumber: adminData.phoneNumber || '',  // now exists
        permissions: adminData.permissions || []   // now exists
      }
      
      await setDoc(adminRef, adminDocData)

      // 4. Also add to users collection for consistency (include tenantId)
      const userRef = doc(db, USERS_COLLECTION, user.uid)
      await setDoc(userRef, {
        email: adminData.email,
        displayName: adminData.displayName || '',
        role: adminData.role || 'admin',
        tenantId: adminData.tenantId,          // now exists
        isActive: adminData.isActive ?? true,
        createdAt: serverTimestamp(),
        isAdmin: true
      }, { merge: true })

      return {
        uid: user.uid,
        ...adminDocData,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      } as AdminUser
    } catch (error: any) {
      console.error('Error creating admin:', error)
      
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email already in use')
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address')
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak')
      }
      
      throw new Error('Failed to create admin')
    }
  }

  // Update admin (no tenant filter – rules will enforce)
  static async updateAdmin(uid: string, updateData: UpdateAdminDto): Promise<void> {
    try {
      const adminRef = doc(db, ADMIN_COLLECTION, uid)
      const userRef = doc(db, USERS_COLLECTION, uid)

      const updatePayload: any = {}
      
      if (updateData.displayName !== undefined) {
        updatePayload.displayName = updateData.displayName
      }
      if (updateData.role !== undefined) {
        updatePayload.role = updateData.role
      }
      if (updateData.isActive !== undefined) {
        updatePayload.isActive = updateData.isActive
      }
      if (updateData.phoneNumber !== undefined) {
        updatePayload.phoneNumber = updateData.phoneNumber  // now exists
      }
      if (updateData.permissions !== undefined) {
        updatePayload.permissions = updateData.permissions  // now exists
      }
      // tenantId should never be updated via this method

      // Update in admins collection
      await updateDoc(adminRef, updatePayload)
      
      // Also update in users collection
      await updateDoc(userRef, {
        displayName: updateData.displayName,
        role: updateData.role,
        isActive: updateData.isActive,
        updatedAt: serverTimestamp()
      })

      // Update displayName in Auth if provided and current user
      if (updateData.displayName && auth.currentUser?.uid === uid) {
        await updateProfile(auth.currentUser, {
          displayName: updateData.displayName
        })
      }

    } catch (error) {
      console.error('Error updating admin:', error)
      throw new Error('Failed to update admin')
    }
  }

  // Delete admin (no tenant filter – rules will enforce)
  static async deleteAdmin(uid: string): Promise<void> {
    try {
      // Don't allow deletion of current user
      if (auth.currentUser?.uid === uid) {
        throw new Error('Cannot delete your own account')
      }

      // 1. Delete admin document
      const adminRef = doc(db, ADMIN_COLLECTION, uid)
      await deleteDoc(adminRef)

      // 2. Update user document (don't delete, just mark as not admin)
      const userRef = doc(db, USERS_COLLECTION, uid)
      await updateDoc(userRef, {
        isAdmin: false,
        role: 'user',
        updatedAt: serverTimestamp()
      })

      console.log(`Admin ${uid} deleted successfully`)
    } catch (error: any) {
      console.error('Error deleting admin:', error)
      throw new Error(error.message || 'Failed to delete admin')
    }
  }

  // Reset admin password (no tenant filter)
  static async resetAdminPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      console.error('Error resetting password:', error)
      
      if (error.code === 'auth/user-not-found') {
        throw new Error('User not found')
      }
      
      throw new Error('Failed to reset password')
    }
  }

  /**
   * Get admin stats for a specific tenant
   * @param tenantId - filter by this tenant
   */
  static async getAdminStats(tenantId?: string): Promise<{
    total: number
    superAdmins: number
    activeAdmins: number
    inactiveAdmins: number
  }> {
    try {
      const admins = await this.getAdmins(tenantId)
      
      return {
        total: admins.length,
        superAdmins: admins.filter(admin => admin.role === 'super-admin').length,
        activeAdmins: admins.filter(admin => admin.isActive).length,
        inactiveAdmins: admins.filter(admin => !admin.isActive).length
      }
    } catch (error) {
      console.error('Error getting admin stats:', error)
      throw new Error('Failed to get admin stats')
    }
  }

  /**
   * Search admins within a tenant
   * @param searchTerm - term to search (email, displayName, phone)
   * @param tenantId - optional tenant filter
   */
  static async searchAdmins(searchTerm: string, tenantId?: string): Promise<AdminUser[]> {
    try {
      const admins = await this.getAdmins(tenantId)
      
      return admins.filter(admin => 
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.phoneNumber?.includes(searchTerm)   // now exists on AdminUser
      )
    } catch (error) {
      console.error('Error searching admins:', error)
      throw new Error('Failed to search admins')
    }
  }

  // Update last login timestamp (no tenant filter – document ID is known)
  static async updateLastLogin(uid: string): Promise<void> {
    try {
      const adminRef = doc(db, ADMIN_COLLECTION, uid)
      await updateDoc(adminRef, {
        lastLoginAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating last login:', error)
    }
  }
}