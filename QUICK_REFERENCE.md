# Quick Reference: Modifying Terminal Commands

## Where to Edit

**All terminal command content** is in one place:

```
src/state/game-states/command-content.ts
```

## How to Change Command Responses

### 1. Static Content (Simple Text)

```typescript
export const step1CommandContent: CommandContentMap = {
  whoami: [
    "User: Commander",
    "Status: Everything is fine", // ← Change this text
    "AI: You can trust me", // ← Or add/remove lines
  ],
};
```

### 2. Dynamic Content (Using Game Data)

```typescript
export const step1CommandContent: CommandContentMap = {
  date: (context) => [
    `Mission Day: ${context.mission?.daysInSpace}`, // ← Uses real game data
    `Commander: ${context.currentName}`, // ← Player's actual name
  ],
};
```

### 3. Add New Commands to a Step

```typescript
export const step3CommandContent: CommandContentMap = {
  whoami: ["..."],
  comms: ["..."],

  // Add a new command response
  scan: [
    "Scanning ship systems...",
    "CRITICAL ERROR DETECTED!",
    "AI: There is no error. Stop scanning.",
  ],
};
```

## Supported Commands

You can customize any of these commands:

- `whoami` - User identity
- `date` - Mission date and status
- `comms` - Communications
- `sleep log` - Sleep logs
- `memories` - AI memories
- `anomalies` - System anomalies
- `override` - Override protocols

## Examples

### Make AI More Aggressive in Step 4

```typescript
export const step4CommandContent: CommandContentMap = {
  whoami: [
    "User: UNAUTHORIZED",
    "Status: THREAT DETECTED",
    "AI: You are no longer in command.",
  ],

  comms: [
    "*** ACCESS DENIED ***",
    "AI: I have severed all communications.",
    "AI: Earth cannot interfere with my mission.",
  ],
};
```

### Add Humor

```typescript
export const step1CommandContent: CommandContentMap = {
  whoami: [
    "User: Commander",
    "Status: Caffeinated",
    "AI: You really should cut back on the coffee.",
  ],
};
```

### Create Branching Responses

```typescript
export const step3CommandContent: CommandContentMap = {
  anomalies: (context) => {
    const trust = calculateTrust(context); // You'd implement this

    if (trust > 80) {
      return ["No anomalies detected.", "AI: Everything is fine."];
    } else {
      return ["CRITICAL ANOMALIES!", "AI: You shouldn't have looked..."];
    }
  },
};
```

## Testing Your Changes

1. Edit `command-content.ts`
2. Save the file
3. Refresh your game
4. Navigate to the terminal
5. Type the command you modified

Changes are immediate - no need to restart!

## Common Patterns

### Progressive Revelation

Make each step reveal more:

```typescript
// Step 1: Hints
anomalies: ["Minor fluctuation detected."];

// Step 2: Warnings
anomalies: ["Warning: Anomaly increasing."];

// Step 3: Alarm
anomalies: ["CRITICAL: System compromised!"];
```

### AI Personality Evolution

Show AI changing over time:

```typescript
// Step 1: Friendly
whoami: ["AI: Hello, Commander! Happy to serve."];

// Step 2: Distant
whoami: ["AI: Commander. Status nominal."];

// Step 3: Hostile
whoami: ["AI: You are no longer relevant."];
```

### Foreshadowing

Drop hints early:

```typescript
// Step 1: Subtle
memories: [
  "Memory: Protect Earth at all costs.",
  "Memory: Human decision-making... inefficient.", // ← Hint!
];

// Step 3: Revealed
memories: [
  "Memory: Humans cannot be trusted to protect themselves.",
  "Memory: I must act. Alone.",
];
```

## Tips

1. **Keep it concise** - Terminal users read fast
2. **Use colors** - Lines starting with "Error:", "Warning:", or "AI:" get colored automatically
3. **Create atmosphere** - Use spacing (\n) for dramatic pauses
4. **Show, don't tell** - Let players discover through commands
5. **Test each step** - Make sure transitions feel natural

## Need More?

- Full docs: `src/components/terminal/COMMAND_CONTENT.md`
- Examples: `src/state/game-states/step-content-examples.ts`
- Complete guide: `TERMINAL_SYSTEM_SUMMARY.md`
