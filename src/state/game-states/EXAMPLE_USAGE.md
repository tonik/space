# Using Dynamic Command Registries in Game States

This file demonstrates how to use different command registries for different game scenes/stages.

## Example 1: Setting Commands on State Entry

```typescript
import { assign } from "xstate";
import { gameSetup } from "../game-setup";
import {
  tutorialCommandRegistry,
  emergencyCommandRegistry,
} from "@/components/terminal/registries";

export const exampleState = gameSetup.createStateConfig({
  initial: "tutorial",
  states: {
    tutorial: {
      // Set limited commands when entering tutorial
      entry: assign({
        availableCommands: () => tutorialCommandRegistry,
      }),
      on: {
        TUTORIAL_COMPLETE: {
          target: "emergency",
        },
      },
    },
    emergency: {
      // Change to emergency commands when crisis starts
      entry: assign({
        availableCommands: () => emergencyCommandRegistry,
      }),
      on: {
        CRISIS_RESOLVED: {
          target: "normal",
        },
      },
    },
  },
});
```

## Example 2: Conditional Command Registry

```typescript
import { assign } from "xstate";
import {
  fullAccessCommandRegistry,
  restrictedCommandRegistry,
} from "@/components/terminal/registries";

export const aiControlState = gameSetup.createStateConfig({
  initial: "checkAiStatus",
  states: {
    checkAiStatus: {
      entry: assign({
        availableCommands: ({ context }) => {
          // Give different commands based on AI status
          const aiCompromised = context.systems.aiCore.status === "compromised";
          return aiCompromised
            ? restrictedCommandRegistry
            : fullAccessCommandRegistry;
        },
      }),
    },
  },
});
```

## Example 3: Progressive Command Unlocking

```typescript
import { assign } from "xstate";
import { createCommandRegistry } from "@/components/terminal/registries";
import {
  clearCommand,
  whoamiCommand,
  dateCommand,
  commsCommand,
  overrideCommand,
} from "@/components/terminal/commands";

// Define registries for each level
const level1Registry = createCommandRegistry({
  clear: clearCommand,
  whoami: whoamiCommand,
  date: dateCommand,
});

const level2Registry = createCommandRegistry({
  ...level1Registry,
  comms: commsCommand,
});

const level3Registry = createCommandRegistry({
  ...level2Registry,
  override: overrideCommand,
});

export const progressiveUnlockState = gameSetup.createStateConfig({
  initial: "level1",
  states: {
    level1: {
      entry: assign({
        availableCommands: () => level1Registry,
      }),
      on: {
        LEVEL_UP: { target: "level2" },
      },
    },
    level2: {
      entry: assign({
        availableCommands: () => level2Registry,
      }),
      on: {
        LEVEL_UP: { target: "level3" },
      },
    },
    level3: {
      entry: assign({
        availableCommands: () => level3Registry,
      }),
    },
  },
});
```

## Example 4: Custom Commands for Specific Scene

```typescript
import { assign } from "xstate";
import { createCommandRegistry } from "@/components/terminal/registries";
import { clearCommand, whoamiCommand } from "@/components/terminal/commands";
import type { Command } from "@/components/terminal/types";

// Create a custom command for this specific scene
const hackAiCommand: Command = {
  execute: (input, context) => {
    return [
      "Attempting to hack AI core...",
      "Access denied.",
      "AI: I'm afraid I can't let you do that.",
    ];
  },
  description: "Attempt to hack the AI core",
};

const aiSceneRegistry = createCommandRegistry({
  clear: clearCommand,
  whoami: whoamiCommand,
  "hack ai": hackAiCommand, // Custom command only for this scene
});

export const aiConfrontationState = gameSetup.createStateConfig({
  initial: "confrontation",
  states: {
    confrontation: {
      entry: assign({
        availableCommands: () => aiSceneRegistry,
      }),
    },
  },
});
```

## Example 5: Updating Commands Mid-State

Sometimes you want to change commands without changing state:

```typescript
import { gameSetup } from "../game-setup";
import {
  restrictedCommandRegistry,
  fullAccessCommandRegistry,
} from "@/components/terminal/registries";

export const dynamicCommandState = gameSetup.createStateConfig({
  initial: "active",
  states: {
    active: {
      on: {
        AI_TAKES_CONTROL: {
          actions: assign({
            availableCommands: () => restrictedCommandRegistry,
          }),
        },
        AI_DEFEATED: {
          actions: assign({
            availableCommands: () => fullAccessCommandRegistry,
          }),
        },
      },
    },
  },
});
```

## Best Practices

1. **Set commands on entry**: Use `entry: assign({ availableCommands: ... })` to set commands when entering a state
2. **Use pre-built registries**: Start with `tutorialCommandRegistry`, `emergencyCommandRegistry`, etc.
3. **Create scene-specific registries**: For unique scenes, create custom registries with scene-specific commands
4. **Progressive disclosure**: Start with fewer commands and unlock more as the game progresses
5. **Context-aware**: Use context data to conditionally set different registries

## Common Patterns

### Tutorial → Normal → Emergency → Restricted

```typescript
tutorial: {
  entry: assign({ availableCommands: () => tutorialCommandRegistry }),
  on: { COMPLETE: "normal" }
},
normal: {
  entry: assign({ availableCommands: () => fullAccessCommandRegistry }),
  on: { CRISIS: "emergency" }
},
emergency: {
  entry: assign({ availableCommands: () => emergencyCommandRegistry }),
  on: {
    RESOLVE: "normal",
    AI_TAKEOVER: "restricted"
  }
},
restricted: {
  entry: assign({ availableCommands: () => restrictedCommandRegistry }),
}
```

### Branching Based on Player Actions

```typescript
checkPlayerChoice: {
  entry: assign({
    availableCommands: ({ context }) => {
      if (context.playerTrustsAI) {
        return aiAllyCommandRegistry;
      } else {
        return aiEnemyCommandRegistry;
      }
    },
  }),
}
```
