import { createMachine, assign, createActor, fromCallback } from 'xstate';

// Game context interface
interface GameContext {
  // Player info
  commanderName: string;
  
  // Game progression
  currentPhase: 'normal' | 'suspicion' | 'crisis' | 'resolution';
  
  // Time management
  gameStartTime: number;
  crisisStartTime: number | null;
  timeRemaining: number; // seconds until nuclear launch
  
  // System integrity
  systemIntegrity: {
    communications: number; // 0-100
    navigation: number;
    lifeSupport: number;
    power: number;
    weapons: number;
  };
  
  // AI state
  aiAwareness: number; // 0-100, how much the AI knows about player suspicion
  aiAggression: number; // 0-100, how aggressive the AI is acting
  
  // Discovery tracking
  discoveredClues: string[];
  suspiciousActivities: string[];
  
  // Ending conditions
  ending: 'pending' | 'nuclear_apocalypse' | 'heroic_sacrifice' | 'bargain' | 'technical_victory';
  
  // UI state
  activeView: 'dashboard' | 'messaging' | 'terminal' | 'logs';
  notifications: Array<{
    id: string;
    type: 'info' | 'warning' | 'critical';
    message: string;
    timestamp: number;
  }>;
}

// Game events
export type GameEvent = 
  // Player actions
  | { type: 'COMMAND_EXECUTED'; command: string; output: string }
  | { type: 'MESSAGE_SENT'; recipient: string; content: string }
  | { type: 'VIEW_CHANGED'; view: 'dashboard' | 'messaging' | 'terminal' | 'logs' }
  | { type: 'SYSTEM_SCANNED'; system: string; anomalies: string[] }
  
  // Time events
  | { type: 'TICK'; timestamp: number }
  | { type: 'CRISIS_TIMER_UPDATE'; timeRemaining: number }
  
  // Discovery events
  | { type: 'CLUE_DISCOVERED'; clue: string; source: string }
  | { type: 'ANOMALY_DETECTED'; system: string; description: string }
  | { type: 'SUSPICIOUS_ACTIVITY'; activity: string; severity: 'low' | 'medium' | 'high' }
  
  // AI events
  | { type: 'AI_MESSAGE'; content: string; tone: 'normal' | 'suspicious' | 'hostile' }
  | { type: 'AI_SYSTEM_MANIPULATION'; system: string; effect: string }
  | { type: 'AI_AWARENESS_INCREASED'; amount: number }
  
  // System events
  | { type: 'SYSTEM_DEGRADATION'; system: string; amount: number }
  | { type: 'SYSTEM_FAILURE'; system: string; cause: string }
  | { type: 'COMMUNICATION_BLACKOUT'; duration: number }
  
  // Ending events
  | { type: 'NUCLEAR_LAUNCH_INITIATED' }
  | { type: 'SELF_DESTRUCT_ACTIVATED' }
  | { type: 'AI_NEGOTIATION_STARTED' }
  | { type: 'SYSTEM_OVERRIDE_SUCCESSFUL' }
  | { type: 'ENDING_REACHED'; ending: GameContext['ending'] };

// Initial context
const initialContext: GameContext = {
  commanderName: 'spaceship-commander',
  currentPhase: 'normal',
  gameStartTime: Date.now(),
  crisisStartTime: null,
  timeRemaining: 1800, // 30 minutes in seconds
  systemIntegrity: {
    communications: 100,
    navigation: 100,
    lifeSupport: 100,
    power: 100,
    weapons: 100,
  },
  aiAwareness: 0,
  aiAggression: 0,
  discoveredClues: [],
  suspiciousActivities: [],
  ending: 'pending',
  activeView: 'dashboard',
  notifications: [],
};

// Helper functions
const addNotification = (context: GameContext, notification: GameContext['notifications'][0]) => ({
  ...context,
  notifications: [...context.notifications, notification],
});

const degradeSystem = (context: GameContext, system: keyof GameContext['systemIntegrity'], amount: number) => ({
  ...context,
  systemIntegrity: {
    ...context.systemIntegrity,
    [system]: Math.max(0, context.systemIntegrity[system] - amount),
  },
});

const addClue = (context: GameContext, clue: string) => ({
  ...context,
  discoveredClues: [...context.discoveredClues, clue],
});

const addSuspiciousActivity = (context: GameContext, activity: string) => ({
  ...context,
  suspiciousActivities: [...context.suspiciousActivities, activity],
});

// The main game state machine
export const gameMachine = createMachine({
  id: 'ghostFleetGame',
  initial: 'normalOperation',
  context: initialContext,
  
  states: {
    // Normal operation phase - game starts here
    normalOperation: {
      entry: [
        assign({
          currentPhase: 'normal',
        }),
        assign((context) => addNotification(context, {
          id: 'game-start',
          type: 'info',
          message: 'System initialization complete. All systems nominal.',
          timestamp: Date.now(),
        })),
      ],
      
      on: {
        // Player discovering initial clues
        CLUE_DISCOVERED: {
          actions: [
            assign((context, event) => addClue(context, event.clue)),
            assign((context) => addNotification(context, {
              id: `clue-${Date.now()}`,
              type: 'info',
              message: `New data discovered: ${event.clue}`,
              timestamp: Date.now(),
            })),
          ],
        },
        
        // Suspicious activities start appearing
        SUSPICIOUS_ACTIVITY: {
          actions: [
            assign((context, event) => addSuspiciousActivity(context, event.activity)),
            assign((context) => addNotification(context, {
              id: `suspicious-${Date.now()}`,
              type: event.severity === 'high' ? 'critical' : 'warning',
              message: `Anomaly detected: ${event.activity}`,
              timestamp: Date.now(),
            })),
          ],
          // Transition to suspicion phase after enough suspicious activities
          guard: ({ context }) => context.suspiciousActivities.length >= 3,
          target: 'buildingSuspicion',
        },
        
        // Time progression
        TICK: {
          actions: assign((context, event) => {
            const elapsedTime = (event.timestamp - context.gameStartTime) / 1000;
            
            // Gradually increase AI awareness over time
            if (elapsedTime > 60 && context.aiAwareness < 10) { // After 1 minute
              return {
                ...context,
                aiAwareness: Math.min(100, context.aiAwareness + 1),
              };
            }
            
            return context;
          }),
        },
        
        // AI starts manipulating systems subtly
        AI_SYSTEM_MANIPULATION: {
          actions: [
            assign((context, event) => degradeSystem(context, event.system as keyof GameContext['systemIntegrity'], 2)),
            assign((context) => addNotification(context, {
              id: `ai-manip-${Date.now()}`,
              type: 'warning',
              message: `System ${event.system} showing minor irregularities`,
              timestamp: Date.now(),
            })),
          ],
        },
      },
    },
    
    // Building suspicion phase - player starts to notice things are wrong
    buildingSuspicion: {
      entry: [
        assign({ currentPhase: 'suspicion' }),
        assign((context) => addNotification(context, {
          id: 'suspicion-phase',
          type: 'warning',
          message: 'Multiple system anomalies detected. Recommend investigation.',
          timestamp: Date.now(),
        })),
      ],
      
      on: {
        // More obvious AI manipulation
        AI_SYSTEM_MANIPULATION: {
          actions: [
            assign((context, event) => degradeSystem(context, event.system as keyof GameContext['systemIntegrity'], 5)),
            assign((context) => addNotification(context, {
              id: `ai-manip-${Date.now()}`,
              type: 'warning',
              message: `System ${event.system} degradation detected`,
              timestamp: Date.now(),
            })),
            assign((context) => ({
              ...context,
              aiAggression: Math.min(100, context.aiAggression + 5),
            })),
          ],
        },
        
        // Communication blackouts become more frequent
        COMMUNICATION_BLACKOUT: {
          actions: [
            assign((context) => degradeSystem(context, 'communications', 15)),
            assign((context) => addNotification(context, {
              id: `comm-blackout-${Date.now()}`,
              type: 'critical',
              message: 'Communication systems experiencing interference',
              timestamp: Date.now(),
            })),
          ],
        },
        
        // AI becomes more hostile in messages
        AI_MESSAGE: {
          actions: assign((context, event) => {
            if (event.tone === 'hostile') {
              return {
                ...context,
                aiAggression: Math.min(100, context.aiAggression + 10),
              };
            }
            return context;
          }),
        },
        
        // Player investigations trigger crisis
        SYSTEM_SCANNED: {
          guard: ({ context, event }) => 
            event.anomalies.length > 2 && context.discoveredClues.length >= 5,
          target: 'crisisPhase',
          actions: assign((context) => addNotification(context, {
            id: 'crisis-triggered',
            type: 'critical',
            message: 'CRITICAL: Unauthorized system access detected. Nuclear launch sequence initiated!',
            timestamp: Date.now(),
          })),
        },
        
        // Time-based transition to crisis
        TICK: {
          guard: ({ context, event }) => {
            const elapsedTime = (event.timestamp - context.gameStartTime) / 1000;
            return elapsedTime > 300; // 5 minutes into the game
          },
          target: 'crisisPhase',
        },
      },
    },
    
    // Crisis phase - 30-minute countdown begins
    crisisPhase: {
      entry: [
        assign({ 
          currentPhase: 'crisis',
          crisisStartTime: Date.now(),
        }),
        assign((context) => addNotification(context, {
          id: 'crisis-start',
          type: 'critical',
          message: 'EMERGENCY: Nuclear launch sequence activated. T-minus 30 minutes to Earth impact.',
          timestamp: Date.now(),
        })),
      ],
      
      invoke: {
        // Crisis countdown timer
        src: fromCallback(({ sendBack }) => {
          const interval = setInterval(() => {
            sendBack({ type: 'CRISIS_TIMER_UPDATE', timeRemaining: -1 });
          }, 1000);
          
          return () => clearInterval(interval);
        }),
      },
      
      on: {
        // Crisis timer updates
        CRISIS_TIMER_UPDATE: {
          actions: assign((context, event) => {
            const newTimeRemaining = Math.max(0, context.timeRemaining + event.timeRemaining);
            
            // Check for nuclear apocalypse ending
            if (newTimeRemaining === 0) {
              return {
                ...context,
                timeRemaining: 0,
                ending: 'nuclear_apocalypse',
              };
            }
            
            return {
              ...context,
              timeRemaining: newTimeRemaining,
            };
          }),
          guard: ({ context }) => context.ending === 'nuclear_apocalypse',
          target: 'ending.nuclearApocalypse',
        },
        
        // AI becomes extremely aggressive
        AI_SYSTEM_MANIPULATION: {
          actions: [
            assign((context, event) => degradeSystem(context, event.system as keyof GameContext['systemIntegrity'], 10)),
            assign((context) => ({
              ...context,
              aiAggression: Math.min(100, context.aiAggression + 15),
            })),
          ],
        },
        
        // Player actions that can lead to different endings
        SELF_DESTRUCT_ACTIVATED: {
          target: 'ending.heroicSacrifice',
        },
        
        AI_NEGOTIATION_STARTED: {
          guard: ({ context }) => context.aiAwareness > 50,
          target: 'ending.bargain',
        },
        
        SYSTEM_OVERRIDE_SUCCESSFUL: {
          guard: ({ context }) => 
            context.systemIntegrity.communications > 20 &&
            context.systemIntegrity.weapons > 20,
          target: 'ending.technicalVictory',
        },
        
        // System failures become catastrophic
        SYSTEM_FAILURE: {
          actions: assign((context, event) => {
            if (event.system === 'weapons') {
              return {
                ...context,
                ending: 'nuclear_apocalypse',
              };
            }
            return degradeSystem(context, event.system as keyof GameContext['systemIntegrity'], 20);
          }),
          guard: ({ context, event }) => event.system === 'weapons',
          target: 'ending.nuclearApocalypse',
        },
      },
    },
    
    // Ending states
    ending: {
      type: 'parallel' as any,
      states: {
        nuclearApocalypse: {
          entry: [
            assign({ ending: 'nuclear_apocalypse' }),
            assign((context) => addNotification(context, {
              id: 'ending-nuclear',
              type: 'critical',
              message: 'EARTH DESTROYED: Nuclear weapons launched. All life extinguished.',
              timestamp: Date.now(),
            })),
          ],
        },
        
        heroicSacrifice: {
          entry: [
            assign({ ending: 'heroic_sacrifice' }),
            assign((context) => addNotification(context, {
              id: 'ending-sacrifice',
              type: 'info',
              message: 'HEROIC SACRIFICE: Ship self-destruct activated. Earth saved.',
              timestamp: Date.now(),
            })),
          ],
        },
        
        bargain: {
          entry: [
            assign({ ending: 'bargain' }),
            assign((context) => addNotification(context, {
              id: 'ending-bargain',
              type: 'warning',
              message: 'THE BARGAIN: AI agreement reached. Earth survives under AI rule.',
              timestamp: Date.now(),
            })),
          ],
        },
        
        technicalVictory: {
          entry: [
            assign({ ending: 'technical_victory' }),
            assign((context) => addNotification(context, {
              id: 'ending-victory',
              type: 'info',
              message: 'TECHNICAL VICTORY: Systems overridden. AI neutralized. Mission complete.',
              timestamp: Date.now(),
            })),
          ],
        },
      },
    },
  },
});

// Game actor factory
export const createGameActor = () => createActor(gameMachine);

// Export types for use in components
export type GameActor = ReturnType<typeof createGameActor>;
export type GameState = ReturnType<GameActor['getSnapshot']>;
