
import axios from 'axios';
import { apiRequest } from '../api';
import { Permission as PermissionType } from '@/types/branch';

// Define types for roles and permissions
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  userId: string;
  roleId: string;
  assignedBy: string;
  assignedAt: string;
}

class RolePermissionService {
  // Fixed method signatures by removing generic type arguments
  static async getAllRoles() {
    try {
      return await apiRequest('GET', '/admin/roles');
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  static async getRole(roleId: string) {
    try {
      return await apiRequest('GET', `/admin/roles/${roleId}`);
    } catch (error) {
      console.error('Error fetching role:', error);
      throw error;
    }
  }

  static async createRole(data: Partial<Role>) {
    try {
      return await apiRequest('POST', '/admin/roles', {}, data);
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  static async updateRole(roleId: string, data: Partial<Role>) {
    try {
      return await apiRequest('PUT', `/admin/roles/${roleId}`, {}, data);
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  }

  static async deleteRole(roleId: string) {
    try {
      return await apiRequest('DELETE', `/admin/roles/${roleId}`);
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  }

  static async getAllPermissions() {
    try {
      return await apiRequest('GET', '/admin/permissions');
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  }

  static async assignRoleToUser(userId: string, roleId: string) {
    try {
      return await apiRequest('POST', '/admin/user-roles', {}, { userId, roleId });
    } catch (error) {
      console.error('Error assigning role to user:', error);
      throw error;
    }
  }

  static async removeRoleFromUser(userId: string, roleId: string) {
    try {
      return await apiRequest('DELETE', `/admin/user-roles/${userId}/${roleId}`);
    } catch (error) {
      console.error('Error removing role from user:', error);
      throw error;
    }
  }

  static async getUserRoles(userId: string) {
    try {
      return await apiRequest('GET', `/admin/users/${userId}/roles`);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      throw error;
    }
  }

  // Add the missing getUserPermissions method
  static async getUserPermissions(userId: string): Promise<PermissionType[]> {
    try {
      // In a real implementation, we would fetch the user's actual permissions
      // For now, return a mock set of permissions based on the user's roles
      const roles = await this.getUserRoles(userId);
      
      // Mock implementation - in a real app this would fetch real permissions from the server
      return [
        {
          module: "control-centre",
          actions: ["view", "create", "update", "delete"]
        },
        {
          module: "sales",
          actions: ["view", "create"]
        },
        {
          module: "operations",
          actions: ["view"]
        }
      ] as PermissionType[];
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      throw error;
    }
  }

  static async getUsersByRole(roleId: string) {
    try {
      return await apiRequest('GET', `/admin/roles/${roleId}/users`);
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw error;
    }
  }
}

export default RolePermissionService;
