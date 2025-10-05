# Terminal Command System

## Overview

The terminal command system is now fully modular and supports:

1. **Dynamic command registries** - Control which commands are available per game scene/stage/step
2. **Dynamic command content** - Control what each command says/does per game scene/stage/step

This gives you complete control over both the **availability** and **behavior** of terminal commands throughout your game.

## Architecture

### Files Structure

```
src/components/terminal/
├── commands.tsx          # Main command executor
├── types.ts             # Type definitions
├── content.ts           # Static command responses
├── utils.ts             # Helper functions
├── registries.ts        # Pre-built command registries
├── registry.ts          # Legacy compatibility (deprecated)
└── commands/            # Individual command handlers
    ├── index.ts
    ├── clear.ts
    ├── comms.ts
    ├── date.ts
    ├── help.ts
    ├── whoami.ts
    ├── setname.ts
    ├── sleepLog.ts
    ├── echo.ts
    ├── memories.ts
    ├── anomalies.ts
    └── override.ts
```

## Quick Start

### Changing Available Commands

```typescript
import { useGame } from "@/state/context";
import { emergencyCommandRegistry } from "@/components/terminal/registries";

const { setAvailableCommands } = useGame();
setAvailableCommands(emergencyCommandRegistry);
```

### Changing Command Content

```typescript
import { useGame } from "@/state/context";

const { setCommandContent } = useGame();
setCommandContent({
  whoami: ["User: UNAUTHORIZED", "AI: You are not in control"],
  comms: ["Error: Communications blocked by AI"],
});
```

### Change Both Together

```typescript
import { assign } from "xstate";

entry: assign({
  availableCommands: () => emergencyCommandRegistry,
  commandContent: () => step3Content,
}),
```

## Detailed Documentation

- **Command Registries** - See below for registry usage
- **Command Content** - See [COMMAND_CONTENT.md](./COMMAND_CONTENT.md) for full content system documentation

## Usage

### 1. Using Pre-built Registries

```typescript
import { useGame } from "@/state/context";
import {
  tutorialCommandRegistry,
  emergencyCommandRegistry,
  fullAccessCommandRegistry,
  restrictedCommandRegistry,
} from "@/components/terminal/registries";

function MyComponent() {
  const { setAvailableCommands } = useGame();

  // Change commands based on game state
  const startTutorial = () => {
    setAvailableCommands(tutorialCommandRegistry);
  };

  const startEmergency = () => {
    setAvailableCommands(emergencyCommandRegistry);
  };
}
```

### 2. Creating Custom Command Registries

```typescript
import { createCommandRegistry } from "@/components/terminal/registries";
import {
  clearCommand,
  whoamiCommand,
  dateCommand,
} from "@/components/terminal/commands";

// Create a custom registry for a specific scene
const mySceneRegistry = createCommandRegistry({
  clear: clearCommand,
  whoami: whoamiCommand,
  date: dateCommand,
  // Add custom commands...
});
```

### 3. Creating Custom Commands

```typescript
// src/components/terminal/commands/myCommand.ts
import type { Command } from "../types";

export const myCommand: Command = {
  execute: (input, context) => {
    // Access context data
    const { currentName, mission, storeData } = context;

    // Return output
    return ["Command output line 1", "Command output line 2"];
  },
  description: "Description shown in help",
  usage: "mycommand <arg>", // Optional custom usage text
};
```

### 4. Using in Game States

```typescript
// In your game state machine (e.g., src/state/game-states/step-1.ts)
import { assign } from "xstate";
import { tutorialCommandRegistry } from "@/components/terminal/registries";

export const step1State = {
  initial: "intro",
  states: {
    intro: {
      entry: assign({
        availableCommands: () => tutorialCommandRegistry,
      }),
      // ... rest of state
    },
  },
};
```

## Pre-built Registries

### `commandRegistry` (Full Access)

All commands available. Use for normal gameplay.

### `tutorialCommandRegistry`

Limited commands for tutorial/intro:

- `clear` - Clear terminal
- `whoami` - Show user info
- `date` - Show mission date
- `echo` - Echo text
- `help` - Auto-generated help

### `emergencyCommandRegistry`

Commands for crisis scenarios:

- `clear`, `whoami`, `date` - Basic commands
- `comms` - Communications
- `anomalies` - System anomalies
- `override` - Emergency overrides
- `help` - Auto-generated help

### `restrictedCommandRegistry`

Minimal commands when AI has taken control:

- `clear` - Clear terminal
- `whoami` - Show user info
- `echo` - Echo text
- `help` - Auto-generated help

## API Reference

### `createCommandRegistry(commands)`

Creates a new command registry with auto-generated help.

**Parameters:**

- `commands` - Object mapping command names to Command objects

**Returns:**

- Complete CommandRegistry with help command

### `setAvailableCommands(commands)`

Updates available terminal commands in game context.

**Parameters:**

- `commands` - CommandRegistry to set as available

## Examples

### Example 1: Progressive Command Unlocking

```typescript
import { createCommandRegistry } from "@/components/terminal/registries";
import {
  clearCommand,
  whoamiCommand,
  commsCommand,
} from "@/components/terminal/commands";

// Level 1: Only basic commands
const level1Commands = createCommandRegistry({
  clear: clearCommand,
  whoami: whoamiCommand,
});

// Level 2: Add communications
const level2Commands = createCommandRegistry({
  clear: clearCommand,
  whoami: whoamiCommand,
  comms: commsCommand,
});

// Use in game progression
function unlockNextLevel(level: number) {
  const { setAvailableCommands } = useGame();

  if (level === 2) {
    setAvailableCommands(level2Commands);
  }
}
```

### Example 2: Context-Specific Commands

```typescript
// Create a command that only appears in specific situations
const scanCommand: Command = {
  execute: (input, context) => {
    if (!context.mission?.scannerOnline) {
      return ["Error: Scanner is offline"];
    }
    return ["Scanning...", "No anomalies detected"];
  },
  description: "Scan for anomalies",
};

const scannerOnlineRegistry = createCommandRegistry({
  ...tutorialCommandRegistry,
  scan: scanCommand,
});
```

## Best Practices

1. **Use `createCommandRegistry()`** - Always use this helper to ensure help is auto-generated
2. **Group by Scene** - Create registries that make sense for specific game scenes
3. **Reuse Commands** - Import and reuse existing commands rather than duplicating
4. **Progressive Disclosure** - Start with fewer commands and unlock more as players progress
5. **Context-Aware** - Use command context to provide dynamic responses based on game state

## Migration Guide

If you have existing code using the old static registry:

```typescript
// Old way ❌
import { commandRegistry } from "@/components/terminal/registry";

// New way ✅
import { commandRegistry } from "@/components/terminal/registries";

// Even better - use context ✅
const { availableCommands } = useTerminalState();
```
