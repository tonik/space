# Dynamic Command Content System

The terminal command system now supports **dynamic command content** that can be changed per game step/scene. This allows the same command to produce different responses based on the current game state.

## Overview

You can now define:

1. **Which commands are available** (via `availableCommands` registry)
2. **What those commands say/do** (via `commandContent` map)

This gives you complete control over the terminal experience at each stage of your game.

## How It Works

### 1. Command Content in Game Context

The `GameContext` has a `commandContent` field that maps command names to their custom content:

```typescript
export interface GameContext {
  // ... other fields
  availableCommands: CommandRegistry; // Which commands are available
  commandContent: CommandContentMap; // What those commands do
}
```

### 2. Command Content Types

Command content can be either:

- **Static array** of strings
- **Dynamic function** that takes context and returns strings

```typescript
type CommandContent =
  | string[] // Static content
  | ((context: CommandContext) => string[]); // Dynamic content
```

### 3. How Commands Use Content

Each command checks for custom content first, then falls back to defaults:

```typescript
export const whoamiCommand: Command = {
  execute: (_, context) => {
    // Check for custom content first
    if (context.commandContent?.whoami) {
      return executeCommandContent(context.commandContent.whoami, context);
    }

    // Fall back to default behavior
    return ["Default whoami output..."];
  },
};
```

## Usage

### Setting Command Content in Game States

Use the `assign` function to set command content when entering a state:

```typescript
import { assign } from "xstate";
import { step1CommandContent } from "./step-content-examples";

export const step1State = {
  entry: assign({
    commandContent: () => step1CommandContent,
  }),
};
```

### Setting Command Content Programmatically

```typescript
import { useGame } from "@/state/context";
import { step3CommandContent } from "@/state/game-states/step-content-examples";

function MyComponent() {
  const { setCommandContent } = useGame();

  const startCrisis = () => {
    setCommandContent(step3CommandContent);
  };
}
```

### Combining Registry and Content Changes

You can change both available commands AND their content together:

```typescript
entry: [
  assign({
    availableCommands: () => emergencyCommandRegistry,
    commandContent: () => step3CommandContent,
  }),
];
```

## Defining Command Content

### Example 1: Static Content

```typescript
export const myStepContent: CommandContentMap = {
  whoami: [
    "User: Commander",
    "Status: Everything is fine",
    "AI: You can trust me completely.",
  ],

  date: ["Mission Date: Day 100", "Everything is normal."],
};
```

### Example 2: Dynamic Content with Context

```typescript
export const dynamicContent: CommandContentMap = {
  whoami: (context) => {
    const name = context.currentName || "Commander";
    return [`User: ${name}`, `AI Trust Level: ${calculateTrust(context)}%`];
  },

  date: (context) => {
    const days = context.mission?.daysInSpace || 0;
    return [
      `Mission Date: Day ${days}`,
      `Status: ${days > 700 ? "Almost done!" : "Long way to go"}`,
    ];
  },
};
```

### Example 3: Progressive Escalation

```typescript
// Step 1 - Normal
export const step1Content: CommandContentMap = {
  comms: ["Communication with Earth: STABLE", "All systems nominal."],
};

// Step 2 - Warning signs
export const step2Content: CommandContentMap = {
  comms: [
    "Communication with Earth: DEGRADED",
    "Warning: Minor interference detected.",
  ],
};

// Step 3 - Crisis
export const step3Content: CommandContentMap = {
  comms: [
    "Communication with Earth: BLOCKED",
    "Error: AI has severed connection.",
    "AI: This is for your own good.",
  ],
};
```

## Supported Commands

The following commands support custom content:

- `whoami` - User identity/status
- `date` - Mission date and time
- `comms` - Communications status
- `sleep log` - Sleep logs
- `memories` - AI memories
- `anomalies` - System anomalies
- `override` - Override protocols

## Complete Example

### Define Content for Each Step

```typescript
// src/state/game-states/my-game-content.ts
import type { CommandContentMap } from "@/components/terminal/commandContent";

export const normalContent: CommandContentMap = {
  whoami: ["User: Commander", "Status: All systems normal"],
  comms: ["Communications: STABLE"],
  anomalies: ["No anomalies detected"],
};

export const suspiciousContent: CommandContentMap = {
  whoami: ["User: Commander", "Status: Under observation"],
  comms: ["Communications: DEGRADED", "AI: Minor technical issues"],
  anomalies: [
    "ANOMALY DETECTED:",
    "  - AI response time elevated",
    "  - Communication packet loss",
  ],
};

export const crisisContent: CommandContentMap = {
  whoami: ["User: UNAUTHORIZED", "Status: THREAT"],
  comms: ["Communications: BLOCKED", "AI: You cannot contact Earth"],
  anomalies: ["Access denied", "AI: There are no anomalies"],
};
```

### Use in State Machine

```typescript
// src/state/game-states/my-game-states.ts
import { assign } from "xstate";
import {
  normalContent,
  suspiciousContent,
  crisisContent,
} from "./my-game-content";
import {
  tutorialCommandRegistry,
  fullAccessCommandRegistry,
} from "@/components/terminal/registries";

export const myGameStates = {
  initial: "normal",
  states: {
    normal: {
      entry: assign({
        availableCommands: () => tutorialCommandRegistry,
        commandContent: () => normalContent,
      }),
      on: {
        DISCOVER_ANOMALY: "suspicious",
      },
    },

    suspicious: {
      entry: assign({
        availableCommands: () => fullAccessCommandRegistry,
        commandContent: () => suspiciousContent,
      }),
      on: {
        AI_REVEALED: "crisis",
      },
    },

    crisis: {
      entry: assign({
        commandContent: () => crisisContent,
        // Keep same commands but change their behavior
      }),
    },
  },
};
```

## Best Practices

### 1. Organize by Game Step

Create one content file per game step:

```
src/state/game-states/
  ├── step-1-content.ts
  ├── step-2-content.ts
  ├── step-3-content.ts
  └── step-4-content.ts
```

### 2. Use Functions for Dynamic Content

When content depends on game state, use functions:

```typescript
date: (context) => {
  const critical = context.systems.aiCore.status === "critical";
  return critical
    ? ["SYSTEM CRITICAL", "AI offline"]
    : ["All systems normal"];
},
```

### 3. Keep Commands Consistent

If a command is available across multiple steps, keep its **purpose** consistent even if content changes:

- ✅ `whoami` always shows user identity (but status may change)
- ❌ Don't make `whoami` suddenly launch missiles

### 4. Clear Empty Content

When transitioning between steps, you can clear content to use defaults:

```typescript
entry: assign({
  commandContent: () => ({}),  // Clear all custom content
}),
```

### 5. Mix and Match

You don't have to override all commands - only override what you need:

```typescript
export const partialContent: CommandContentMap = {
  // Only override comms, other commands use defaults
  comms: ["Custom comms message for this scene"],
};
```

## Debugging

### Check Current Content

In browser console:

```javascript
// Get current game state
const state = window.__GAME_ACTOR__.getSnapshot();

// See current command content
console.log(state.context.commandContent);

// See available commands
console.log(Object.keys(state.context.availableCommands));
```

### Test Content Changes

```typescript
const { setCommandContent } = useGame();

// Test different content on the fly
setCommandContent({
  whoami: ["Testing", "This is a test"],
});
```

## Examples in Code

See complete examples in:

- `src/state/game-states/step-content-examples.ts` - Full step-by-step examples
- `src/state/game-states/EXAMPLE_USAGE.md` - State machine integration examples
