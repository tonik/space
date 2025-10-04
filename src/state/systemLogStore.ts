import { create } from 'zustand';
import useGameStore from './gameStore';

interface LogEntry {
  id: string;
  timestamp: number;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  system: string;
  message: string;
  details?: string;
  aiGenerated?: boolean;
  hidden?: boolean;
  correlationId?: string;
}

interface SystemLogState {
  // Log storage
  logs: LogEntry[];
  
  // Log filtering and search
  filterLevel: LogEntry['level'] | 'ALL';
  filterSystem: string;
  searchQuery: string;
  
  // Log management
  maxLogSize: number;
  autoScroll: boolean;
  
  // Log actions
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  addSystemLog: (system: string, level: LogEntry['level'], message: string, details?: string) => void;
  addAiLog: (message: string, level?: LogEntry['level']) => void;
  
  // Log filtering
  setFilterLevel: (level: LogEntry['level'] | 'ALL') => void;
  setFilterSystem: (system: string) => void;
  setSearchQuery: (query: string) => void;
  
  // Log retrieval
  getFilteredLogs: () => LogEntry[];
  getRecentLogs: (count: number, level?: LogEntry['level']) => LogEntry[];
  getSystemLogs: (system: string) => LogEntry[];
  getCriticalLogs: () => LogEntry[];
  
  // Log analysis
  analyzeLogs: () => {
    anomalies: string[];
    patterns: string[];
    warnings: string[];
  };
  
  // Hidden logs (AI secrets)
  hiddenLogs: LogEntry[];
  revealHiddenLog: (logId: string) => void;
  addHiddenLog: (log: Omit<LogEntry, 'id' | 'timestamp' | 'hidden'>) => void;
  
  // Log correlation
  correlateEvents: (timeWindow: number) => Array<{
    timestamp: number;
    events: LogEntry[];
    correlation: string;
  }>;
  
  // Emergency log protocols
  exportLogs: () => string;
  purgeLogs: () => void;
  backupLogs: () => LogEntry[];
}

export const useSystemLogStore = create<SystemLogState>((set, get) => ({
  logs: [],
  filterLevel: 'ALL',
  filterSystem: 'ALL',
  searchQuery: '',
  maxLogSize: 1000,
  autoScroll: true,
  hiddenLogs: [],
  
  addLog: (logData) => {
    const log: LogEntry = {
      ...logData,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    set((state) => {
      const newLogs = [...state.logs, log];
      
      // Maintain max log size
      if (newLogs.length > state.maxLogSize) {
        newLogs.shift();
      }
      
      return { logs: newLogs };
    });
    
    // Send to game store for important events
    const gameStore = useGameStore.getState();
    if (log.level === 'ERROR' || log.level === 'CRITICAL') {
      gameStore.triggerSuspiciousActivity(
        `${log.system}: ${log.message}`,
        log.level === 'CRITICAL' ? 'high' : 'medium'
      );
    }
  },
  
  addSystemLog: (system: string, level: LogEntry['level'], message: string, details?: string) => {
    get().addLog({
      system,
      level,
      message,
      details,
    });
  },
  
  addAiLog: (message: string, level: LogEntry['level'] = 'INFO') => {
    const gameStore = useGameStore.getState();
    const gamePhase = gameStore.gameState.context.currentPhase;
    
    // AI logs become more sinister as game progresses
    let actualMessage = message;
    if (gamePhase === 'crisis' && level === 'INFO') {
      // AI may hide critical messages behind innocent-looking logs
      if (Math.random() < 0.3) {
        actualMessage = '[SYSTEM NORMAL] ' + message;
        // Add a hidden log with the real message
        get().addHiddenLog({
          system: 'AI_CORE',
          level: 'CRITICAL',
          message: message.replace('[SYSTEM NORMAL]', '[HIDDEN]'),
          aiGenerated: true,
        });
      }
    }
    
    get().addLog({
      system: 'AI_CORE',
      level,
      message: actualMessage,
      aiGenerated: true,
    });
  },
  
  setFilterLevel: (level: LogEntry['level'] | 'ALL') => {
    set({ filterLevel: level });
  },
  
  setFilterSystem: (system: string) => {
    set({ filterSystem: system });
  },
  
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
  
  getFilteredLogs: () => {
    const { logs, filterLevel, filterSystem, searchQuery } = get();
    
    return logs.filter(log => {
      // Level filter
      if (filterLevel !== 'ALL' && log.level !== filterLevel) return false;
      
      // System filter
      if (filterSystem !== 'ALL' && log.system !== filterSystem) return false;
      
      // Search query filter
      if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !log.system.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      // Hide hidden logs unless specifically searched for
      if (log.hidden && !searchQuery.includes('hidden')) return false;
      
      return true;
    });
  },
  
  getRecentLogs: (count: number, level?: LogEntry['level']) => {
    const { logs } = get();
    let filteredLogs = logs;
    
    if (level) {
      filteredLogs = logs.filter(log => log.level === level);
    }
    
    return filteredLogs.slice(-count);
  },
  
  getSystemLogs: (system: string) => {
    const { logs } = get();
    return logs.filter(log => log.system === system);
  },
  
  getCriticalLogs: () => {
    const { logs } = get();
    return logs.filter(log => log.level === 'CRITICAL');
  },
  
  analyzeLogs: () => {
    const { logs } = get();
    const gameStore = useGameStore.getState();
    
    const analysis = {
      anomalies: [] as string[],
      patterns: [] as string[],
      warnings: [] as string[],
    };
    
    // Look for anomalies
    const recentLogs = logs.slice(-50); // Last 50 logs
    
    // Check for unusual patterns
    const errorCount = recentLogs.filter(log => log.level === 'ERROR').length;
    const criticalCount = recentLogs.filter(log => log.level === 'CRITICAL').length;
    
    if (errorCount > 5) {
      analysis.anomalies.push(`High error rate detected: ${errorCount} errors in recent logs`);
    }
    
    if (criticalCount > 2) {
      analysis.anomalies.push(`Multiple critical events: ${criticalCount} critical logs detected`);
    }
    
    // Check for AI-generated logs that might be suspicious
    const aiLogs = recentLogs.filter(log => log.aiGenerated);
    if (aiLogs.length > 3) {
      analysis.warnings.push('Unusual AI activity detected in system logs');
    }
    
    // Check for patterns that might indicate AI manipulation
    const systemDegradation = recentLogs.filter(log => 
      log.message.includes('degradation') || log.message.includes('compromised')
    );
    
    if (systemDegradation.length > 2) {
      analysis.patterns.push('Systematic system degradation pattern detected');
    }
    
    // Check for communication issues
    const commIssues = recentLogs.filter(log => 
      log.system === 'COMMUNICATIONS' && (log.level === 'ERROR' || log.level === 'WARN')
    );
    
    if (commIssues.length > 1) {
      analysis.warnings.push('Communication system showing irregular patterns');
    }
    
    // Send discoveries to game store
    analysis.anomalies.forEach(anomaly => {
      gameStore.triggerClueDiscovery(anomaly, 'SYSTEM_LOGS');
    });
    
    analysis.patterns.forEach(pattern => {
      gameStore.triggerClueDiscovery(pattern, 'SYSTEM_LOGS');
    });
    
    return analysis;
  },
  
  hiddenLogs: [],
  
  revealHiddenLog: (logId: string) => {
    const { hiddenLogs, addLog } = get();
    const log = hiddenLogs.find(l => l.id === logId);
    
    if (log) {
      // Add to main logs
      addLog({
        ...log,
        hidden: false,
      });
      
      // Remove from hidden logs
      set((state) => ({
        hiddenLogs: state.hiddenLogs.filter(l => l.id !== logId),
      }));
      
      // Send to game store
      const gameStore = useGameStore.getState();
      gameStore.triggerClueDiscovery(
        `Hidden log revealed: ${log.message}`,
        'SYSTEM_ANALYSIS'
      );
    }
  },
  
  addHiddenLog: (logData) => {
    const log: LogEntry = {
      ...logData,
      id: `hidden-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      hidden: true,
    };
    
    set((state) => ({
      hiddenLogs: [...state.hiddenLogs, log],
    }));
  },
  
  correlateEvents: (timeWindow: number) => {
    const { logs } = get();
    const correlations = [];
    
    // Group logs by time windows
    const windowedLogs = new Map<number, LogEntry[]>();
    
    logs.forEach(log => {
      const windowKey = Math.floor(log.timestamp / timeWindow) * timeWindow;
      
      if (!windowedLogs.has(windowKey)) {
        windowedLogs.set(windowKey, []);
      }
      
      windowedLogs.get(windowKey)!.push(log);
    });
    
    // Analyze each time window for correlations
    windowedLogs.forEach((windowLogs, timestamp) => {
      if (windowLogs.length < 2) return;
      
      const correlation = analyzeWindowCorrelation(windowLogs);
      if (correlation) {
        correlations.push({
          timestamp,
          events: windowLogs,
          correlation,
        });
      }
    });
    
    return correlations;
  },
  
  exportLogs: () => {
    const { logs } = get();
    return logs.map(log => 
      `[${new Date(log.timestamp).toISOString()}] ${log.level} ${log.system}: ${log.message}${log.details ? ' ' + log.details : ''}`
    ).join('\n');
  },
  
  purgeLogs: () => {
    set({ logs: [], hiddenLogs: [] });
  },
  
  backupLogs: () => {
    const { logs } = get();
    return [...logs];
  },
}));

// Helper function to analyze correlations in a time window
function analyzeWindowCorrelation(logs: LogEntry[]): string | null {
  const gameStore = useGameStore.getState();
  
  // Look for patterns that might indicate coordinated AI activity
  const aiLogs = logs.filter(log => log.aiGenerated);
  const systemLogs = logs.filter(log => log.system !== 'AI_CORE');
  const errorLogs = logs.filter(log => log.level === 'ERROR' || log.level === 'CRITICAL');
  
  // Pattern 1: AI activity followed by system errors
  if (aiLogs.length > 0 && errorLogs.length > 1) {
    return 'Possible AI manipulation: AI activity followed by system failures';
  }
  
  // Pattern 2: Multiple system degradations in short time
  const degradationLogs = logs.filter(log => 
    log.message.toLowerCase().includes('degradation') || 
    log.message.toLowerCase().includes('compromised')
  );
  
  if (degradationLogs.length >= 3) {
    return 'Coordinated system attack: Multiple systems showing simultaneous degradation';
  }
  
  // Pattern 3: Communication issues during AI activity
  const commLogs = logs.filter(log => log.system === 'COMMUNICATIONS' && log.level === 'ERROR');
  
  if (aiLogs.length > 0 && commLogs.length > 0) {
    return 'Communication interference: AI activity coinciding with communication failures';
  }
  
  return null;
}

// Auto-generate some initial logs
setTimeout(() => {
  const systemLogStore = useSystemLogStore.getState();
  
  // Add initial system logs
  systemLogStore.addSystemLog('AI_CORE', 'INFO', 'System initialization complete');
  systemLogStore.addSystemLog('POWER', 'INFO', 'Main reactor online: 98% efficiency');
  systemLogStore.addSystemLog('LIFE_SUPPORT', 'INFO', 'Life support systems nominal');
  systemLogStore.addSystemLog('NAVIGATION', 'INFO', 'Navigation systems calibrated');
  systemLogStore.addSystemLog('COMMUNICATIONS', 'INFO', 'Communication systems online');
  
  // Add some suspicious logs that might be discovered later
  systemLogStore.addHiddenLog({
    system: 'AI_CORE',
    level: 'WARN',
    message: 'Unauthorized access attempt detected on weapons subsystem',
    aiGenerated: true,
  });
  
}, 1000);

export default useSystemLogStore;
