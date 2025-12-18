
// Frontend-only service - Firebase functionality removed

export interface FirebaseService {
  isInitialized: boolean;
  initialize(): Promise<void>;
}

class FirebaseIntegrationService implements FirebaseService {
  private static instance: FirebaseIntegrationService;
  isInitialized = true; // Always initialized for frontend-only
  private healthData: any = {};
  private listeners: Map<string, Function> = new Map();

  private constructor() {
    this.healthData = {
      lastUpdated: new Date().toISOString(),
      status: 'healthy',
      metrics: {
        activeUsers: 42,
        systemLoad: 0.35,
        responseTime: 124,
        errorRate: 0.02,
        uptime: '99.98%',
        nodeStatus: 'online',
        databaseConnections: 18,
        activeTransactions: 7
      },
      nodes: [
        { id: 'node-1', status: 'online', load: 0.42, memory: 0.67 },
        { id: 'node-2', status: 'online', load: 0.38, memory: 0.58 },
        { id: 'node-3', status: 'online', load: 0.25, memory: 0.51 }
      ]
    };
    
    setInterval(() => this.updateSimulatedData(), 10000);
  }
  
  private updateSimulatedData() {
    this.healthData = {
      ...this.healthData,
      lastUpdated: new Date().toISOString(),
      metrics: {
        ...this.healthData.metrics,
        activeUsers: Math.floor(Math.random() * 50) + 30,
        systemLoad: +(Math.random() * 0.5).toFixed(2),
        responseTime: Math.floor(Math.random() * 50) + 100,
        errorRate: +(Math.random() * 0.05).toFixed(3),
        activeTransactions: Math.floor(Math.random() * 15) + 1
      },
      nodes: this.healthData.nodes.map((node: any) => ({
        ...node,
        load: +(Math.random() * 0.5).toFixed(2),
        memory: +(Math.random() * 0.4 + 0.3).toFixed(2)
      }))
    };
    
    this.notifyListeners();
  }
  
  private notifyListeners() {
    this.listeners.forEach((callback) => {
      callback(this.healthData);
    });
  }

  static getInstance(): FirebaseIntegrationService {
    if (!FirebaseIntegrationService.instance) {
      FirebaseIntegrationService.instance = new FirebaseIntegrationService();
    }
    return FirebaseIntegrationService.instance;
  }

  async initialize(): Promise<void> {
    // Mock initialization for frontend-only
    console.log('Frontend-only mode - no Firebase initialization needed');
  }

  subscribeToRealtimeData(path: string, callback: Function): string {
    const listenerId = `listener-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    this.listeners.set(listenerId, callback);
    
    setTimeout(() => callback(this.healthData), 0);
    
    return listenerId;
  }
  
  unsubscribeFromRealtimeData(listenerId: string): void {
    this.listeners.delete(listenerId);
  }
  
  getHealthData(): any {
    return this.healthData;
  }

  async getCurrentUser() {
    return { uid: 'demo-user-id', email: 'admin@example.com', displayName: 'Demo User' };
  }
  
  async getRealtimeData(path: string) {
    return this.healthData;
  }
  
  async getSystemMetrics() {
    return this.healthData.metrics;
  }
  
  async getNodeStatus() {
    return this.healthData.nodes;
  }
  
  async getUsersOnline() {
    return {
      total: this.healthData.metrics.activeUsers,
      breakdown: {
        admin: 3,
        managers: 8,
        staff: this.healthData.metrics.activeUsers - 11
      }
    };
  }
}

export const firebaseService = FirebaseIntegrationService.getInstance();
export default firebaseService;
