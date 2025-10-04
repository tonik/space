// Main game state machine and store
export { default as useGameStore } from './gameStore';
export { gameMachine, createGameActor } from './game';
export type { GameEvent, GameState, GameActor } from './game';

// View-specific stores
export { default as useTerminalStore } from './terminalStore';
export { default as useMessagingStore } from './messagingStore';
export { default as useDashboardStore } from './dashboardStore';
export { default as useSystemLogStore } from './systemLogStore';

// Re-export types
export type { 
  SystemStatus,
  Message,
  LogEntry,
} from './types';
