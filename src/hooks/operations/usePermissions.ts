
import { useEffect, useState, useCallback } from 'react';
import { PERMISSIONS } from '@/config';
import { Permission } from '@/types/branch';
import RolePermissionService from '@/services/admin/RolePermissionService'; 

interface PermissionHook {
  hasPermission: (permission: keyof typeof PERMISSIONS) => boolean;
  hasModuleAction: (module: Permission['module'], action: string) => boolean;
  userRoles: string[];
  userPermissions: Permission[];
  isLoading: boolean;
  refreshPermissions: () => Promise<void>;
}

export function usePermissions(): PermissionHook {
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchUserPermissions = useCallback(async () => {
    if (!userId) return;
    
    try {
      // Changed from getUserPermissions to getUserRoles which exists in RolePermissionService
      const userRolesData = await RolePermissionService.getUserRoles(userId);
      
      // Since we're now getting roles instead of permissions directly,
      // we need to map them to a permission format
      // For now, we'll use mock permissions similar to the fallback
      setUserPermissions([
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
      ] as Permission[]);
    } catch (error) {
      console.error("Error fetching user permissions:", error);
      // Set default permissions for development
      setUserPermissions([
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
      ] as Permission[]);
    }
  }, [userId]);

  useEffect(() => {
    // In a real application, this would fetch from an auth context or API
    const fetchUserRoles = async () => {
      // Simulate API call to get user roles
      try {
        setIsLoading(true);
        // For now, use localStorage as a mock
        const storedRoles = localStorage.getItem('userRoles');
        const roles = storedRoles ? JSON.parse(storedRoles) : ['branch_manager'];
        const mockUserId = localStorage.getItem('userId') || 'user-1';
        
        setUserRoles(roles);
        setUserId(mockUserId);
        
        // After we have the userId, fetch permissions
        await fetchUserPermissions();
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user roles:', error);
        setUserRoles(['branch_manager']); // Default fallback
        setIsLoading(false);
      }
    };

    fetchUserRoles();
  }, [fetchUserPermissions]);

  const hasPermission = (permission: keyof typeof PERMISSIONS): boolean => {
    if (isLoading) return false;
    if (userRoles.includes('admin')) return true; // Admin has all permissions
    
    const requiredRoles = PERMISSIONS[permission] || [];
    return userRoles.some(role => requiredRoles.includes(role));
  };

  const hasModuleAction = (module: Permission['module'], action: string): boolean => {
    if (isLoading) return false;
    if (userRoles.includes('admin')) return true; // Admin has all permissions
    
    return userPermissions.some(
      permission => 
        permission.module === module && 
        permission.actions.includes(action as any)
    );
  };

  const refreshPermissions = async () => {
    setIsLoading(true);
    await fetchUserPermissions();
    setIsLoading(false);
  };

  return {
    hasPermission,
    hasModuleAction,
    userRoles,
    userPermissions,
    isLoading,
    refreshPermissions
  };
}
