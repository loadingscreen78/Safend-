// Audit Log Utility for Firebase
import { collection, addDoc, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface AuditLog {
  id?: string;
  user: string;
  userEmail: string;
  action: string;
  target: string;
  module: string;
  timestamp: string;
  ip: string;
  details?: any;
}

// Log an activity to Firebase
export const logActivity = async (activity: Omit<AuditLog, 'id' | 'timestamp' | 'ip'>): Promise<{ success: boolean; error?: string }> => {
  try {
    const currentUser = localStorage.getItem('userName') || 'Unknown';
    const currentEmail = localStorage.getItem('userEmail') || 'unknown@email.com';
    
    // Get IP address (in production, you'd get this from server)
    const ipAddress = 'Client IP';

    const auditEntry = {
      user: activity.user || currentUser,
      userEmail: activity.userEmail || currentEmail,
      action: activity.action,
      target: activity.target,
      module: activity.module,
      timestamp: new Date().toISOString(),
      ip: ipAddress,
      details: activity.details || {},
      createdAt: Timestamp.now()
    };

    await addDoc(collection(db, 'auditLogs'), auditEntry);
    return { success: true };
  } catch (error: any) {
    console.error('Error logging activity:', error);
    return { success: false, error: error.message };
  }
};

// Get all audit logs
export const getAuditLogs = async (limitCount: number = 100): Promise<AuditLog[]> => {
  try {
    const logsQuery = query(
      collection(db, 'auditLogs'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(logsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AuditLog));
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
};

// Get audit logs by module
export const getAuditLogsByModule = async (module: string, limitCount: number = 100): Promise<AuditLog[]> => {
  try {
    const logsQuery = query(
      collection(db, 'auditLogs'),
      where('module', '==', module),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(logsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AuditLog));
  } catch (error) {
    console.error('Error fetching audit logs by module:', error);
    return [];
  }
};

// Get audit logs by user
export const getAuditLogsByUser = async (userEmail: string, limitCount: number = 100): Promise<AuditLog[]> => {
  try {
    const logsQuery = query(
      collection(db, 'auditLogs'),
      where('userEmail', '==', userEmail),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(logsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AuditLog));
  } catch (error) {
    console.error('Error fetching audit logs by user:', error);
    return [];
  }
};

// Get audit logs by date range
export const getAuditLogsByDateRange = async (
  startDate: Date,
  endDate: Date,
  limitCount: number = 100
): Promise<AuditLog[]> => {
  try {
    const logsQuery = query(
      collection(db, 'auditLogs'),
      where('createdAt', '>=', Timestamp.fromDate(startDate)),
      where('createdAt', '<=', Timestamp.fromDate(endDate)),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(logsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AuditLog));
  } catch (error) {
    console.error('Error fetching audit logs by date range:', error);
    return [];
  }
};

// Helper function to log common actions
export const auditActions = {
  userCreated: (userName: string, userEmail: string) => 
    logActivity({
      user: localStorage.getItem('userName') || 'Admin',
      userEmail: localStorage.getItem('userEmail') || 'admin@safend.com',
      action: 'User Created',
      target: userName,
      module: 'User Manager',
      details: { userEmail }
    }),
  
  userUpdated: (userName: string, changes: any) =>
    logActivity({
      user: localStorage.getItem('userName') || 'Admin',
      userEmail: localStorage.getItem('userEmail') || 'admin@safend.com',
      action: 'User Updated',
      target: userName,
      module: 'User Manager',
      details: changes
    }),
  
  userDeleted: (userName: string) =>
    logActivity({
      user: localStorage.getItem('userName') || 'Admin',
      userEmail: localStorage.getItem('userEmail') || 'admin@safend.com',
      action: 'User Deleted',
      target: userName,
      module: 'User Manager'
    }),
  
  roleChanged: (userName: string, oldRole: string, newRole: string) =>
    logActivity({
      user: localStorage.getItem('userName') || 'Admin',
      userEmail: localStorage.getItem('userEmail') || 'admin@safend.com',
      action: 'Role Changed',
      target: userName,
      module: 'Role Manager',
      details: { oldRole, newRole }
    }),
  
  userLogin: (userName: string, userEmail: string) =>
    logActivity({
      user: userName,
      userEmail: userEmail,
      action: 'Logged In',
      target: 'System',
      module: 'Authentication'
    }),
  
  userLogout: (userName: string, userEmail: string) =>
    logActivity({
      user: userName,
      userEmail: userEmail,
      action: 'Logged Out',
      target: 'System',
      module: 'Authentication'
    })
};
