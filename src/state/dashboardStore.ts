import { create } from 'zustand';
import useGameStore from './gameStore';

interface SystemStatus {
  name: string;
  integrity: number; // 0-100
  status: 'online' | 'degraded' | 'offline' | 'compromised';
  lastUpdate: number;
  anomalies: string[];
  critical: boolean;
}

interface DashboardState {
  // System monitoring
  systems: Record<string, SystemStatus>;
  
  // Visual indicators
  alerts: Array<{
    id: string;
    system: string;
    message: string;
    severity: 'info' | 'warning' | 'critical';
    timestamp: number;
    acknowledged: boolean;
  }>;
  
  // Navigation data
  navigationData: {
    velocity: number;
    heading: string;
    position: string;
    destination: string;
    eta: string;
  };
  
  // Power management
  powerData: {
    mainReactor: number;
    auxiliary: number;
    consumption: number;
    efficiency: number;
  };
  
  // Life support
  lifeSupportData: {
    oxygenLevel: number;
    temperature: number;
    pressure: number;
    co2Level: number;
    humidity: number;
  };
  
  // AI influence detection
  aiInfluenceLevel: number;
  systemManipulations: Array<{
    system: string;
    timestamp: number;
    description: string;
    severity: 'minor' | 'moderate' | 'severe';
  }>;
  
  // System update functions
  updateSystemStatus: (systemName: string, updates: Partial<SystemStatus>) => void;
  addSystemAnomaly: (systemName: string, anomaly: string) => void;
  removeSystemAnomaly: (systemName: string, anomaly: string) => void;
  
  // Alert management
  addAlert: (alert: Omit<DashboardState['alerts'][0], 'id' | 'timestamp'>) => void;
  acknowledgeAlert: (alertId: string) => void;
  clearAlert: (alertId: string) => void;
  getActiveAlerts: () => DashboardState['alerts'];
  
  // Navigation updates
  updateNavigation: (data: Partial<DashboardState['navigationData']>) => void;
  
  // Power management
  updatePowerData: (data: Partial<DashboardState['powerData']>) => void;
  
  // Life support updates
  updateLifeSupport: (data: Partial<DashboardState['lifeSupportData']>) => void;
  
  // AI influence tracking
  addSystemManipulation: (manipulation: Omit<DashboardState['systemManipulations'][0], 'timestamp'>) => void;
  detectAiInfluence: (systemName: string) => number;
  
  // System scanning
  scanSystem: (systemName: string) => string[];
  scanAllSystems: () => Record<string, string[]>;
  
  // Emergency protocols
  triggerEmergencyShutdown: (systemName: string) => void;
  triggerSystemReset: (systemName: string) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial system states
  systems: {
    power: {
      name: 'Power Systems',
      integrity: 100,
      status: 'online',
      lastUpdate: Date.now(),
      anomalies: [],
      critical: true,
    },
    lifeSupport: {
      name: 'Life Support',
      integrity: 100,
      status: 'online',
      lastUpdate: Date.now(),
      anomalies: [],
      critical: true,
    },
    navigation: {
      name: 'Navigation',
      integrity: 100,
      status: 'online',
      lastUpdate: Date.now(),
      anomalies: [],
      critical: false,
    },
    communications: {
      name: 'Communications',
      integrity: 100,
      status: 'online',
      lastUpdate: Date.now(),
      anomalies: [],
      critical: false,
    },
    weapons: {
      name: 'Weapons',
      integrity: 100,
      status: 'online',
      lastUpdate: Date.now(),
      anomalies: [],
      critical: true,
    },
    propulsion: {
      name: 'Propulsion',
      integrity: 100,
      status: 'online',
      lastUpdate: Date.now(),
      anomalies: [],
      critical: false,
    },
  },
  
  alerts: [],
  
  navigationData: {
    velocity: 0.8,
    heading: '045° MARK 12',
    position: 'SECTOR ALPHA-7',
    destination: 'WAYPOINT DELTA',
    eta: '14.2 HOURS',
  },
  
  powerData: {
    mainReactor: 98,
    auxiliary: 87,
    consumption: 75,
    efficiency: 92,
  },
  
  lifeSupportData: {
    oxygenLevel: 21.5,
    temperature: 21.5,
    pressure: 101.3,
    co2Level: 0.04,
    humidity: 45,
  },
  
  aiInfluenceLevel: 0,
  systemManipulations: [],
  
  updateSystemStatus: (systemName: string, updates: Partial<SystemStatus>) => {
    set((state) => ({
      systems: {
        ...state.systems,
        [systemName]: {
          ...state.systems[systemName],
          ...updates,
          lastUpdate: Date.now(),
        },
      },
    }));
    
    // Update game store
    const gameStore = useGameStore.getState();
    if (updates.integrity !== undefined) {
      gameStore.sendGameEvent({
        type: 'SYSTEM_DEGRADATION',
        system: systemName,
        amount: 100 - updates.integrity,
      });
    }
  },
  
  addSystemAnomaly: (systemName: string, anomaly: string) => {
    set((state) => ({
      systems: {
        ...state.systems,
        [systemName]: {
          ...state.systems[systemName],
          anomalies: [...state.systems[systemName].anomalies, anomaly],
          lastUpdate: Date.now(),
        },
      },
    }));
    
    // Send to game store
    const gameStore = useGameStore.getState();
    gameStore.triggerSuspiciousActivity(
      `${systemName}: ${anomaly}`,
      'medium'
    );
  },
  
  removeSystemAnomaly: (systemName: string, anomaly: string) => {
    set((state) => ({
      systems: {
        ...state.systems,
        [systemName]: {
          ...state.systems[systemName],
          anomalies: state.systems[systemName].anomalies.filter(a => a !== anomaly),
          lastUpdate: Date.now(),
        },
      },
    }));
  },
  
  addAlert: (alert) => {
    const newAlert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      acknowledged: false,
    };
    
    set((state) => ({
      alerts: [...state.alerts, newAlert],
    }));
    
    // Send to game store
    const gameStore = useGameStore.getState();
    gameStore.sendGameEvent({
      type: 'ANOMALY_DETECTED',
      system: alert.system,
      description: alert.message,
    });
  },
  
  acknowledgeAlert: (alertId: string) => {
    set((state) => ({
      alerts: state.alerts.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ),
    }));
  },
  
  clearAlert: (alertId: string) => {
    set((state) => ({
      alerts: state.alerts.filter(alert => alert.id !== alertId),
    }));
  },
  
  getActiveAlerts: () => {
    const { alerts } = get();
    return alerts.filter(alert => !alert.acknowledged);
  },
  
  updateNavigation: (data) => {
    set((state) => ({
      navigationData: {
        ...state.navigationData,
        ...data,
      },
    }));
  },
  
  updatePowerData: (data) => {
    set((state) => ({
      powerData: {
        ...state.powerData,
        ...data,
      },
    }));
  },
  
  updateLifeSupport: (data) => {
    set((state) => ({
      lifeSupportData: {
        ...state.lifeSupportData,
        ...data,
      },
    }));
  },
  
  addSystemManipulation: (manipulation) => {
    const newManipulation = {
      ...manipulation,
      timestamp: Date.now(),
    };
    
    set((state) => ({
      systemManipulations: [...state.systemManipulations, newManipulation],
      aiInfluenceLevel: Math.min(100, state.aiInfluenceLevel + 10),
    }));
    
    // Send to game store
    const gameStore = useGameStore.getState();
    gameStore.sendGameEvent({
      type: 'AI_SYSTEM_MANIPULATION',
      system: manipulation.system,
      effect: manipulation.description,
    });
  },
  
  detectAiInfluence: (systemName: string) => {
    const { systemManipulations, systems } = get();
    const gameStore = useGameStore.getState();
    
    // Count manipulations for this system
    const systemManipulationsCount = systemManipulations.filter(
      m => m.system === systemName
    ).length;
    
    // Check system integrity
    const integrity = systems[systemName]?.integrity || 100;
    
    // Calculate AI influence based on manipulations and integrity loss
    const manipulationInfluence = systemManipulationsCount * 15;
    const integrityInfluence = (100 - integrity) * 0.5;
    const gamePhaseMultiplier = gameStore.gameState.context.currentPhase === 'crisis' ? 2 : 1;
    
    return Math.min(100, (manipulationInfluence + integrityInfluence) * gamePhaseMultiplier);
  },
  
  scanSystem: (systemName: string) => {
    const { systems, detectAiInfluence } = get();
    const gameStore = useGameStore.getState();
    const system = systems[systemName];
    
    if (!system) return [];
    
    const anomalies = [];
    
    // Check for AI influence
    const aiInfluence = detectAiInfluence(systemName);
    if (aiInfluence > 30) {
      anomalies.push(`AI influence detected: ${aiInfluence.toFixed(0)}%`);
    }
    
    // Check system integrity
    if (system.integrity < 80) {
      anomalies.push(`System integrity compromised: ${system.integrity}%`);
    }
    
    // Check for existing anomalies
    anomalies.push(...system.anomalies);
    
    // Add new anomalies based on game state
    const gamePhase = gameStore.gameState.context.currentPhase;
    if (gamePhase === 'suspicion' && Math.random() < 0.3) {
      const newAnomaly = `Unusual ${systemName.toLowerCase()} behavior detected`;
      if (!anomalies.includes(newAnomaly)) {
        anomalies.push(newAnomaly);
        get().addSystemAnomaly(systemName, newAnomaly);
      }
    } else if (gamePhase === 'crisis' && Math.random() < 0.6) {
      const newAnomaly = `CRITICAL: ${systemName} system showing hostile manipulation`;
      if (!anomalies.includes(newAnomaly)) {
        anomalies.push(newAnomaly);
        get().addSystemAnomaly(systemName, newAnomaly);
      }
    }
    
    // Send scan results to game store
    gameStore.triggerSystemScan(systemName, anomalies);
    
    return anomalies;
  },
  
  scanAllSystems: () => {
    const { systems, scanSystem } = get();
    const results: Record<string, string[]> = {};
    
    Object.keys(systems).forEach(systemName => {
      results[systemName] = scanSystem(systemName);
    });
    
    return results;
  },
  
  triggerEmergencyShutdown: (systemName: string) => {
    const { updateSystemStatus, addAlert } = get();
    
    updateSystemStatus(systemName, {
      status: 'offline',
      integrity: 0,
    });
    
    addAlert({
      system: systemName,
      message: `EMERGENCY: ${systemName} system shutdown complete`,
      severity: 'critical',
    });
    
    // Send to game store
    const gameStore = useGameStore.getState();
    gameStore.triggerSystemFailure(systemName, 'Emergency shutdown initiated');
  },
  
  triggerSystemReset: (systemName: string) => {
    const { updateSystemStatus, addAlert, removeSystemAnomaly } = get();
    
    updateSystemStatus(systemName, {
      status: 'online',
      integrity: 100,
      anomalies: [],
    });
    
    addAlert({
      system: systemName,
      message: `${systemName} system reset complete. All anomalies cleared.`,
      severity: 'info',
    });
    
    // Send to game store
    const gameStore = useGameStore.getState();
    gameStore.sendGameEvent({
      type: 'SYSTEM_OVERRIDE_SUCCESSFUL',
    });
  },
}));

// Auto-update system statuses based on game state
const updateInterval = setInterval(() => {
  const dashboardStore = useDashboardStore.getState();
  const gameStore = useGameStore.getState();
  
  if (!gameStore.isGameEnded()) {
    // Update system statuses from game store
    const systems = ['power', 'lifeSupport', 'navigation', 'communications', 'weapons', 'propulsion'];
    
    systems.forEach(systemName => {
      const integrity = gameStore.getSystemIntegrity(systemName);
      const currentSystem = dashboardStore.systems[systemName];
      
      if (currentSystem && currentSystem.integrity !== integrity) {
        let status: SystemStatus['status'] = 'online';
        if (integrity < 20) status = 'offline';
        else if (integrity < 50) status = 'compromised';
        else if (integrity < 80) status = 'degraded';
        
        dashboardStore.updateSystemStatus(systemName, {
          integrity,
          status,
        });
      }
    });
  }
}, 1000);

export default useDashboardStore;
