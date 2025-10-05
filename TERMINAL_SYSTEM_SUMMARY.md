# Terminal System - Summary

## What Changed

The terminal command system now supports **dynamic command registries** and **dynamic command content**, allowing you to:

1. **Control which commands are available** for each game step
2. **Control what each command says/does** for each game step

## Key Concepts

### 1. Command Registry (Which Commands?)

Controls which commands are available in the terminal.

```typescript
availableCommands: CommandRegistry;
```

**Example:**

- Step 1: Only `help`, `whoami`, `date`
- Step 2: Add `comms`, `anomalies`
- Step 3: Add `memories`, `override`

### 2. Command Content (What Do They Say?)

Controls what each command outputs.

```typescript
commandContent: CommandContentMap;
```

**Example:**

- Step 1: `whoami` → "Training Mode"
- Step 2: `whoami` → "Active Duty"
- Step 3: `whoami` → "THREAT DETECTED"

## Quick Usage

### In Game States

```typescript
import { assign } from "xstate";
import { emergencyCommandRegistry } from "@/components/terminal/registries";
import { step3CommandContent } from "./step-content-examples";

entry: assign({
  availableCommands: () => emergencyCommandRegistry,
  commandContent: () => step3CommandContent,
}),
```

### Programmatically

```typescript
const { setAvailableCommands, setCommandContent } = useGame();

setAvailableCommands(emergencyCommandRegistry);
setCommandContent({
  whoami: ["User: UNAUTHORIZED", "AI: You are a threat"],
  comms: ["Error: Communications blocked"],
});
```

## File Structure

```
src/components/terminal/
├── commands.tsx              # Main executor
├── types.ts                  # Type definitions
├── commandContent.ts         # Content system types
├── registries.ts             # Pre-built command registries
├── content.ts                # Default static responses
├── README.md                 # Registry documentation
├── COMMAND_CONTENT.md        # Content system documentation
└── commands/                 # Individual command handlers
    ├── whoami.ts
    ├── date.ts
    ├── comms.ts
    └── ...

src/state/game-states/
├── step-content-examples.ts  # Example content for each step
├── EXAMPLE_USAGE.md          # State machine integration examples
└── COMPLETE_EXAMPLE.md       # Full walkthrough example
```

## Examples

### Pre-built Registries

- `commandRegistry` - Full access (all commands)
- `tutorialCommandRegistry` - Basic commands only
- `emergencyCommandRegistry` - Crisis-relevant commands
- `restrictedCommandRegistry` - Minimal commands (AI takeover)

### Creating Custom Registry

```typescript
import { createCommandRegistry } from "@/components/terminal/registries";

const myRegistry = createCommandRegistry({
  clear: clearCommand,
  whoami: whoamiCommand,
  custom: myCustomCommand,
});
```

### Defining Command Content

```typescript
export const myContent: CommandContentMap = {
  // Static content
  whoami: ["User: Commander", "Status: All good"],

  // Dynamic content based on context
  date: (context) => [
    `Mission Day: ${context.mission?.daysInSpace || 0}`,
    `Status: ${context.systems.aiCore.status}`,
  ],
};
```

## Documentation

- **[Terminal README](src/components/terminal/README.md)** - Command registry system
- **[Command Content Guide](src/components/terminal/COMMAND_CONTENT.md)** - Command content system
- **[Example Usage](src/state/game-states/EXAMPLE_USAGE.md)** - State machine integration
- **[Complete Example](src/state/game-states/COMPLETE_EXAMPLE.md)** - Full 4-step game example
- **[Content Examples](src/state/game-states/step-content-examples.ts)** - Ready-to-use content

## API Reference

### Game Context

```typescript
const { setAvailableCommands, setCommandContent } = useGame();

// Change available commands
setAvailableCommands(registry);

// Change command content
setCommandContent(contentMap);
```

### State Machine

```typescript
entry: assign({
  availableCommands: () => myRegistry,
  commandContent: () => myContent,
}),
```

### Creating Commands

```typescript
export const myCommand: Command = {
  execute: (input, context) => {
    // Check for custom content
    if (context.commandContent?.myCommand) {
      return executeCommandContent(context.commandContent.myCommand, context);
    }
    // Default behavior
    return ["Default output"];
  },
  description: "My command description",
};
```

## Benefits

1. **Separation of Concerns**: Commands (what's available) vs Content (what they do)
2. **Reusability**: Same commands, different behaviors across game steps
3. **Progressive Disclosure**: Unlock commands as story progresses
4. **Context-Aware**: Commands can respond to game state dynamically
5. **Type Safety**: Full TypeScript support
6. **Maintainability**: Each command is a separate module

## Migration

Old code using static registry still works via backward compatibility layer in `registry.ts`.

For new code:

```typescript
// Old ❌
import { commandRegistry } from "@/components/terminal/registry";

// New ✅
import { commandRegistry } from "@/components/terminal/registries";
```

## Next Steps

1. Review examples in `step-content-examples.ts`
2. Define content for your game steps
3. Update your state machine to use `assign()` with new registries/content
4. Test the progression in your game

The system is fully backward compatible - existing functionality continues to work while you migrate to the new system.
