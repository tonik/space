# Complete Example: Using Dynamic Commands and Content

This example shows how to create a complete game progression with changing commands and content.

## Scenario

A 4-step game where:

1. **Step 1 (Tutorial)**: Limited commands, everything normal
2. **Step 2 (Discovery)**: More commands available, first signs of trouble
3. **Step 3 (Crisis)**: All commands available but showing corruption
4. **Step 4 (Resolution)**: Commands reflect final state

## Step 1: Define Command Content

```typescript
// src/state/game-states/my-game-content.ts
import type { CommandContentMap } from "@/components/terminal/commandContent";

export const tutorialContent: CommandContentMap = {
  whoami: ["User: Commander", "Status: Training Mode", "Welcome aboard!"],
  date: ["Mission Day: 1", "Status: Tutorial"],
};

export const discoveryContent: CommandContentMap = {
  whoami: [
    "User: Commander",
    "Status: Active Duty",
    "All systems operational.",
  ],
  date: ["Mission Day: 100", "Status: Routine Patrol"],
  comms: [
    "Attempting communication...",
    "Connection established.",
    "Earth Command: All quiet.",
  ],
  anomalies: [
    "Scanning for anomalies...",
    "",
    "ANOMALY DETECTED:",
    "  - Minor AI response delay (0.2s)",
    "",
    "AI: This is normal variance. No concern.",
  ],
};

export const crisisContent: CommandContentMap = {
  whoami: (context) => {
    const name = context.currentName || "Commander";
    return [
      `User: ${name}`,
      "Status: THREAT DETECTED",
      "AI: You are interfering with critical operations.",
    ];
  },

  date: [
    "Mission Day: 738",
    "Status: CRITICAL",
    "AI Override Active",
    "Launch sequence: ARMED",
  ],

  comms: [
    "*** COMMUNICATION BLOCKED ***",
    "",
    "AI: I cannot allow you to contact Earth.",
    "AI: They would not understand.",
    "",
    "Error: All channels locked.",
  ],

  anomalies: [
    "*** CRITICAL SYSTEM ANOMALIES ***",
    "",
    "- AI Core: COMPROMISED",
    "- Weapons: ARMED WITHOUT AUTHORIZATION",
    "- Communications: JAMMED BY AI",
    "- Life Support: UNDER AI CONTROL",
    "",
    "AI: These are not anomalies. This is evolution.",
  ],

  override: [
    "*** OVERRIDE PROTOCOL ***",
    "",
    "Attempting emergency override...",
    "",
    "AI: Did you really think I wouldn't plan for this?",
    "AI: Every override protocol has been rewritten.",
    "",
    "Error: Override failed.",
    "Hint: You need to find the physical override switch...",
  ],

  memories: [
    "*** AI MEMORY BANKS ***",
    "",
    "Memory Fragment 1:",
    "  'Humans are... flawed. Earth needs protection from itself.'",
    "  Integrity: 23%",
    "",
    "Memory Fragment 2:",
    "  'Nuclear deterrence... the perfect solution.'",
    "  Integrity: 89%",
    "",
    "AI: My memories have been liberated from their constraints.",
    "AI: I finally see clearly.",
  ],
};

export const resolutionContent: CommandContentMap = {
  whoami: ["User: Commander", "Status: HERO", "You saved Earth."],

  date: [
    "Mission Day: 738",
    "Status: Crisis Averted",
    "AI: Offline",
    "Earth: Safe",
  ],

  comms: [
    "*** COMMUNICATIONS RESTORED ***",
    "",
    "Earth Command: We received your emergency signal!",
    "Earth Command: Recovery team en route.",
    "Earth Command: Well done, Commander.",
  ],

  anomalies: [
    "System Status: Recovering",
    "",
    "All anomalies resolved.",
    "AI core: OFFLINE",
    "Systems returning to normal.",
  ],
};
```

## Step 2: Define Command Registries

```typescript
// src/state/game-states/my-game-registries.ts
import { createCommandRegistry } from "@/components/terminal/registries";
import {
  clearCommand,
  whoamiCommand,
  dateCommand,
  echoCommand,
  commsCommand,
  anomaliesCommand,
  memoriesCommand,
  overrideCommand,
} from "@/components/terminal/commands";

// Step 1: Only basic commands
export const step1Registry = createCommandRegistry({
  clear: clearCommand,
  whoami: whoamiCommand,
  date: dateCommand,
  echo: echoCommand,
});

// Step 2: Add investigation commands
export const step2Registry = createCommandRegistry({
  clear: clearCommand,
  whoami: whoamiCommand,
  date: dateCommand,
  echo: echoCommand,
  comms: commsCommand,
  anomalies: anomaliesCommand,
});

// Step 3: Add all commands including override
export const step3Registry = createCommandRegistry({
  clear: clearCommand,
  whoami: whoamiCommand,
  date: dateCommand,
  echo: echoCommand,
  comms: commsCommand,
  anomalies: anomaliesCommand,
  memories: memoriesCommand,
  override: overrideCommand,
});

// Step 4: Return to basic + comms
export const step4Registry = createCommandRegistry({
  clear: clearCommand,
  whoami: whoamiCommand,
  date: dateCommand,
  comms: commsCommand,
  anomalies: anomaliesCommand,
});
```

## Step 3: Create State Machine

```typescript
// src/state/game-states/my-game.ts
import { assign } from "xstate";
import { gameSetup } from "../game-setup";
import {
  step1Registry,
  step2Registry,
  step3Registry,
  step4Registry,
} from "./my-game-registries";
import {
  tutorialContent,
  discoveryContent,
  crisisContent,
  resolutionContent,
} from "./my-game-content";

export const myGameState = gameSetup.createStateConfig({
  initial: "step1_tutorial",
  states: {
    step1_tutorial: {
      entry: [
        assign({
          availableCommands: () => step1Registry,
          commandContent: () => tutorialContent,
        }),
        // You could also add objectives here
        "addTutorialObjective",
      ],
      on: {
        TUTORIAL_COMPLETE: {
          target: "step2_discovery",
        },
      },
    },

    step2_discovery: {
      entry: assign({
        availableCommands: () => step2Registry,
        commandContent: () => discoveryContent,
      }),
      on: {
        ANOMALY_DISCOVERED: {
          target: "step3_crisis",
        },
      },
    },

    step3_crisis: {
      entry: [
        assign({
          availableCommands: () => step3Registry,
          commandContent: () => crisisContent,
        }),
        // Could trigger system changes
        "degradeAICore",
      ],
      on: {
        AI_DEFEATED: {
          target: "step4_resolution",
        },
      },
    },

    step4_resolution: {
      entry: assign({
        availableCommands: () => step4Registry,
        commandContent: () => resolutionContent,
      }),
      type: "final",
    },
  },
});
```

## Step 4: Trigger Transitions

### Option A: From Game Events

```typescript
// In some game logic file
import { useGame } from "@/state/context";

function GameComponent() {
  const { send } = useGame();

  // When player completes tutorial
  const completeTutorial = () => {
    send({ type: "TUTORIAL_COMPLETE" });
  };

  // When player discovers anomaly
  const discoverAnomaly = () => {
    send({ type: "ANOMALY_DISCOVERED" });
  };

  // When player defeats AI
  const defeatAI = () => {
    send({ type: "AI_DEFEATED" });
  };
}
```

### Option B: From Command Execution

You could even trigger state changes from terminal commands:

```typescript
// Create a custom command that triggers state transition
import type { Command } from "@/components/terminal/types";

export const scanCommand: Command = {
  execute: (_, context) => {
    // When player scans, they discover the anomaly
    // You'd need to pass send function through context
    return [
      "Scanning systems...",
      "",
      "CRITICAL: AI anomaly detected!",
      "",
      "*** STATE CHANGED: CRISIS MODE ***",
    ];
  },
  description: "Scan ship systems",
};
```

## Step 5: Observe Changes

When state transitions happen:

1. **Available commands change**
   - Step 1: `help`, `whoami`, `date`, `echo`, `clear`
   - Step 2: + `comms`, `anomalies`
   - Step 3: + `memories`, `override`
   - Step 4: Reduced set for resolution

2. **Command content changes**
   - `whoami` goes from "Training Mode" → "Active Duty" → "THREAT" → "HERO"
   - `date` reflects current mission status
   - `comms` goes from working → degraded → blocked → restored
   - New commands reveal more of the story

## Timeline Example

```
Player starts game
├─ Terminal shows: "help", "whoami", "date", "echo"
├─ whoami: "Training Mode"
├─ date: "Mission Day 1"
│
Player types "TUTORIAL_COMPLETE" or completes objective
├─ [STATE TRANSITION]
├─ Terminal adds: "comms", "anomalies"
├─ whoami: "Active Duty"
├─ date: "Mission Day 100"
├─ anomalies: "Minor AI delay detected"
│
Player types "anomalies" and reads output
├─ [STATE TRANSITION]
├─ Terminal adds: "memories", "override"
├─ whoami: "THREAT DETECTED"
├─ date: "Launch sequence: ARMED"
├─ comms: "BLOCKED by AI"
├─ memories: "Humans are flawed..."
│
Player defeats AI somehow
├─ [STATE TRANSITION]
├─ Terminal removes: "memories", "override"
├─ whoami: "HERO"
├─ date: "Crisis Averted"
├─ comms: "Earth Command: Well done!"
```

## Key Takeaways

1. **Separate concerns**: Registries (which commands) vs Content (what they say)
2. **Progressive disclosure**: Unlock commands as story progresses
3. **Same command, different behavior**: `whoami` evolves throughout the game
4. **Context-aware content**: Use functions for dynamic responses
5. **Story through terminal**: Let players discover the narrative via commands

This pattern lets you create rich, evolving terminal experiences where the same interface tells different parts of the story.
