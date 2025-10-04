import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { createGameActor, GameActor, GameState, GameEvent } from './game';

interface GameStore {
  // Game actor reference
  gameActor: GameActor;
  
  // Current game state
  gameState: GameState;
  
  // UI state
  activeView: 'dashboard' | 'messaging' | 'terminal' | 'logs';
  
  // Game events dispatcher
  sendGameEvent: (event: GameEvent) => void;
  
  // Game state getters
  isInNormalPhase: () => boolean;
  isInSuspicionPhase: () => boolean;
  isInCrisisPhase: () => boolean;
  isGameEnded: () => boolean;
  getTimeRemaining: () => number;
  getSystemIntegrity: (system: string) => number;
  getAiAwareness: () => number;
  getAiAggression: () => number;
  getDiscoveredClues: () => string[];
  getSuspiciousActivities: () => string[];
  getEnding: () => string;
  
  // UI state setters
  setActiveView: (view: 'dashboard' | 'messaging' | 'terminal' | 'logs') => void;
  
  // System manipulation helpers
  triggerSystemScan: (system: string, anomalies: string[]) => void;
  triggerClueDiscovery: (clue: string, source: string) => void;
  triggerSuspiciousActivity: (activity: string, severity: 'low' | 'medium' | 'high') => void;
  triggerSystemFailure: (system: string, cause: string) => void;
  
  // Ending triggers
  triggerNuclearLaunch: () => void;
  triggerSelfDestruct: () => void;
  triggerAiNegotiation: () => void;
  triggerSystemOverride: () => void;
}

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    // Initialize game actor
    gameActor: (() => {
      const actor = createGameActor();
      actor.start();
      return actor;
    })(),
    
    // Initial state
    gameState: (() => {
      const actor = createGameActor();
      actor.start();
      return actor.getSnapshot();
    })(),
    
    activeView: 'dashboard',
    
    // Send events to the game machine
    sendGameEvent: (event: GameEvent) => {
      const { gameActor } = get();
      gameActor.send(event);
      
      // Update local state
      set({
        gameState: gameActor.getSnapshot(),
      });
    },
    
    // Game state getters
    isInNormalPhase: () => {
      const { gameState } = get();
      return gameState.context.currentPhase === 'normal';
    },
    
    isInSuspicionPhase: () => {
      const { gameState } = get();
      return gameState.context.currentPhase === 'suspicion';
    },
    
    isInCrisisPhase: () => {
      const { gameState } = get();
      return gameState.context.currentPhase === 'crisis';
    },
    
    isGameEnded: () => {
      const { gameState } = get();
      return gameState.value === 'ending';
    },
    
    getTimeRemaining: () => {
      const { gameState } = get();
      return gameState.context.timeRemaining;
    },
    
    getSystemIntegrity: (system: string) => {
      const { gameState } = get();
      return gameState.context.systemIntegrity[system as keyof typeof gameState.context.systemIntegrity] || 0;
    },
    
    getAiAwareness: () => {
      const { gameState } = get();
      return gameState.context.aiAwareness;
    },
    
    getAiAggression: () => {
      const { gameState } = get();
      return gameState.context.aiAggression;
    },
    
    getDiscoveredClues: () => {
      const { gameState } = get();
      return gameState.context.discoveredClues;
    },
    
    getSuspiciousActivities: () => {
      const { gameState } = get();
      return gameState.context.suspiciousActivities;
    },
    
    getEnding: () => {
      const { gameState } = get();
      return gameState.context.ending;
    },
    
    // UI state setters
    setActiveView: (view: 'dashboard' | 'messaging' | 'terminal' | 'logs') => {
      set({ activeView: view });
      get().sendGameEvent({ type: 'VIEW_CHANGED', view });
    },
    
    // System manipulation helpers
    triggerSystemScan: (system: string, anomalies: string[]) => {
      get().sendGameEvent({ type: 'SYSTEM_SCANNED', system, anomalies });
    },
    
    triggerClueDiscovery: (clue: string, source: string) => {
      get().sendGameEvent({ type: 'CLUE_DISCOVERED', clue, source });
    },
    
    triggerSuspiciousActivity: (activity: string, severity: 'low' | 'medium' | 'high') => {
      get().sendGameEvent({ type: 'SUSPICIOUS_ACTIVITY', activity, severity });
    },
    
    triggerSystemFailure: (system: string, cause: string) => {
      get().sendGameEvent({ type: 'SYSTEM_FAILURE', system, cause });
    },
    
    // Ending triggers
    triggerNuclearLaunch: () => {
      get().sendGameEvent({ type: 'NUCLEAR_LAUNCH_INITIATED' });
    },
    
    triggerSelfDestruct: () => {
      get().sendGameEvent({ type: 'SELF_DESTRUCT_ACTIVATED' });
    },
    
    triggerAiNegotiation: () => {
      get().sendGameEvent({ type: 'AI_NEGOTIATION_STARTED' });
    },
    
    triggerSystemOverride: () => {
      get().sendGameEvent({ type: 'SYSTEM_OVERRIDE_SUCCESSFUL' });
    },
  }))
);

// Subscribe to game actor changes
const gameActor = useGameStore.getState().gameActor;
gameActor.subscribe((state) => {
  useGameStore.setState({ gameState: state });
});

// Auto-tick for time progression
let tickInterval: number;
if (typeof window !== 'undefined') {
  tickInterval = setInterval(() => {
    const { gameState, sendGameEvent } = useGameStore.getState();
    if (!gameState.done) {
      sendGameEvent({ type: 'TICK', timestamp: Date.now() });
    }
  }, 1000);
}

// Cleanup on unmount
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (tickInterval) {
      clearInterval(tickInterval);
    }
  });
}

export default useGameStore;
