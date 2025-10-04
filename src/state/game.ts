import { createMachine, assign } from 'xstate';

export interface GameContext {
  commanderName: string;
  currentPhase: 'exploration' | 'discovery' | 'conflict' | 'resolution';
  gameStartTime: number;
  activeView: 'dashboard' | 'messaging' | 'terminal' | 'logs';
  phaseData: {
    exploration: { scansPerformed: number; areasExplored: string[] };
    discovery: { cluesFound: number; mysteriesUncovered: string[] };
    conflict: { challengesFaced: number; decisionsMode: string[] };
    resolution: { outcome: string; finalScore: number };
  };
}

export type GameEvent = 
  | { type: 'START_GAME'; commanderName: string }
  | { type: 'CHANGE_VIEW'; view: GameContext['activeView'] }
  | { type: 'PERFORM_SCAN'; area: string }
  | { type: 'DISCOVER_CLUE'; clue: string }
  | { type: 'FACE_CHALLENGE'; challenge: string }
  | { type: 'ADVANCE_PHASE' }
  | { type: 'END_GAME'; outcome: string };

const initialContext: GameContext = {
  commanderName: 'Commander',
  currentPhase: 'exploration',
  gameStartTime: Date.now(),
  activeView: 'dashboard',
  phaseData: {
    exploration: { scansPerformed: 0, areasExplored: [] },
    discovery: { cluesFound: 0, mysteriesUncovered: [] },
    conflict: { challengesFaced: 0, decisionsMode: [] },
    resolution: { outcome: 'pending', finalScore: 0 },
  },
};

export const gameMachine = createMachine({
  id: 'game',
  initial: 'exploration',
  context: initialContext,
  types: {} as {
    context: GameContext;
    events: GameEvent;
  },
  states: {
    exploration: {
      entry: assign({
        currentPhase: 'exploration',
      }),
      on: {
        PERFORM_SCAN: {
          actions: assign({
            phaseData: ({ context, event }) => ({
              ...context.phaseData,
              exploration: {
                scansPerformed: context.phaseData.exploration.scansPerformed + 1,
                areasExplored: [...context.phaseData.exploration.areasExplored, event.area],
              },
            }),
          }),
        },
        ADVANCE_PHASE: {
          target: 'discovery',
          guard: ({ context }) => context.phaseData.exploration.scansPerformed >= 3,
        },
      },
    },
    discovery: {
      entry: assign({
        currentPhase: 'discovery',
      }),
      on: {
        DISCOVER_CLUE: {
          actions: assign({
            phaseData: ({ context, event }) => ({
              ...context.phaseData,
              discovery: {
                cluesFound: context.phaseData.discovery.cluesFound + 1,
                mysteriesUncovered: [...context.phaseData.discovery.mysteriesUncovered, event.clue],
              },
            }),
          }),
        },
        ADVANCE_PHASE: {
          target: 'conflict',
          guard: ({ context }) => context.phaseData.discovery.cluesFound >= 3,
        },
      },
    },
    conflict: {
      entry: assign({
        currentPhase: 'conflict',
      }),
      on: {
        FACE_CHALLENGE: {
          actions: assign({
            phaseData: ({ context, event }) => ({
              ...context.phaseData,
              conflict: {
                challengesFaced: context.phaseData.conflict.challengesFaced + 1,
                decisionsMode: [...context.phaseData.conflict.decisionsMode, event.challenge],
              },
            }),
          }),
        },
        ADVANCE_PHASE: {
          target: 'resolution',
          guard: ({ context }) => context.phaseData.conflict.challengesFaced >= 3,
        },
      },
    },
    resolution: {
      entry: assign({
        currentPhase: 'resolution',
      }),
      on: {
        END_GAME: {
          actions: assign({
            phaseData: ({ context, event }) => ({
              ...context.phaseData,
              resolution: {
                outcome: event.outcome,
                finalScore: 
                  context.phaseData.exploration.scansPerformed * 10 +
                  context.phaseData.discovery.cluesFound * 20 +
                  context.phaseData.conflict.challengesFaced * 30,
              },
            }),
          }),
        },
      },
    },
  },
  on: {
    START_GAME: {
      actions: assign({
        commanderName: ({ event }) => event.commanderName,
        gameStartTime: Date.now(),
      }),
    },
    CHANGE_VIEW: {
      actions: assign({
        activeView: ({ event }) => event.view,
      }),
    },
  },
});
