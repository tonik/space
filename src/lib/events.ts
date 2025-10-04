import { GameEvent } from '@/state/game';
import useGameStore from '@/state/gameStore';

/**
 * Event System for cross-component communication
 * This utility provides a centralized way to send events between components
 * and to the game state machine
 */

class GameEventSystem {
  private subscribers: Map<string, Set<(event: GameEvent) => void>> = new Map();
  
  /**
   * Subscribe to specific event types
   */
  subscribe(eventType: string, callback: (event: GameEvent) => void): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    
    this.subscribers.get(eventType)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(eventType);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.subscribers.delete(eventType);
        }
      }
    };
  }
  
  /**
   * Emit an event to all subscribers and the game state machine
   */
  emit(event: GameEvent): void {
    // Send to game state machine
    const gameStore = useGameStore.getState();
    gameStore.sendGameEvent(event);
    
    // Notify subscribers
    const eventType = event.type;
    const subscribers = this.subscribers.get(eventType);
    
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Error in event subscriber:', error);
        }
      });
    }
    
    // Also notify wildcard subscribers
    const wildcardSubscribers = this.subscribers.get('*');
    if (wildcardSubscribers) {
      wildcardSubscribers.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Error in wildcard event subscriber:', error);
        }
      });
    }
  }
  
  /**
   * Subscribe to all events (wildcard subscription)
   */
  subscribeToAll(callback: (event: GameEvent) => void): () => void {
    return this.subscribe('*', callback);
  }
  
  /**
   * Clear all subscribers
   */
  clear(): void {
    this.subscribers.clear();
  }
}

// Singleton instance
export const gameEventSystem = new GameEventSystem();

/**
 * Convenience functions for common events
 */

export const triggerClueDiscovery = (clue: string, source: string) => {
  gameEventSystem.emit({
    type: 'CLUE_DISCOVERED',
    clue,
    source,
  });
};

export const triggerSuspiciousActivity = (activity: string, severity: 'low' | 'medium' | 'high' = 'medium') => {
  gameEventSystem.emit({
    type: 'SUSPICIOUS_ACTIVITY',
    activity,
    severity,
  });
};

export const triggerSystemScan = (system: string, anomalies: string[]) => {
  gameEventSystem.emit({
    type: 'SYSTEM_SCANNED',
    system,
    anomalies,
  });
};

export const triggerAnomalyDetection = (system: string, description: string) => {
  gameEventSystem.emit({
    type: 'ANOMALY_DETECTED',
    system,
    description,
  });
};

export const triggerAiMessage = (content: string, tone: 'normal' | 'suspicious' | 'hostile' = 'normal') => {
  gameEventSystem.emit({
    type: 'AI_MESSAGE',
    content,
    tone,
  });
};

export const triggerSystemDegradation = (system: string, amount: number) => {
  gameEventSystem.emit({
    type: 'SYSTEM_DEGRADATION',
    system,
    amount,
  });
};

export const triggerSystemFailure = (system: string, cause: string) => {
  gameEventSystem.emit({
    type: 'SYSTEM_FAILURE',
    system,
    cause,
  });
};

export const triggerCommunicationBlackout = (duration: number) => {
  gameEventSystem.emit({
    type: 'COMMUNICATION_BLACKOUT',
    duration,
  });
};

export const triggerAiSystemManipulation = (system: string, effect: string) => {
  gameEventSystem.emit({
    type: 'AI_SYSTEM_MANIPULATION',
    system,
    effect,
  });
};

export const triggerAiAwarenessIncrease = (amount: number) => {
  gameEventSystem.emit({
    type: 'AI_AWARENESS_INCREASED',
    amount,
  });
};

/**
 * Ending triggers
 */

export const triggerNuclearLaunch = () => {
  gameEventSystem.emit({
    type: 'NUCLEAR_LAUNCH_INITIATED',
  });
};

export const triggerSelfDestruct = () => {
  gameEventSystem.emit({
    type: 'SELF_DESTRUCT_ACTIVATED',
  });
};

export const triggerAiNegotiation = () => {
  gameEventSystem.emit({
    type: 'AI_NEGOTIATION_STARTED',
  });
};

export const triggerSystemOverride = () => {
  gameEventSystem.emit({
    type: 'SYSTEM_OVERRIDE_SUCCESSFUL',
  });
};

/**
 * React hook for subscribing to game events
 */
export const useGameEvent = (eventType: string, callback: (event: GameEvent) => void) => {
  React.useEffect(() => {
    const unsubscribe = gameEventSystem.subscribe(eventType, callback);
    return unsubscribe;
  }, [eventType, callback]);
};

/**
 * React hook for subscribing to all game events
 */
export const useAllGameEvents = (callback: (event: GameEvent) => void) => {
  React.useEffect(() => {
    const unsubscribe = gameEventSystem.subscribeToAll(callback);
    return unsubscribe;
  }, [callback]);
};

// Import React for hooks
import React from 'react';

export default gameEventSystem;
