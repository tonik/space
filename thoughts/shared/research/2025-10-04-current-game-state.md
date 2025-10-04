---
date: 2025-10-04T20:08:08+02:00
researcher: Assistant
git_commit: edec2c33cbc1f4a9a60b3500e3429f7959749290
branch: main
repository: space
topic: "Current Game State Documentation"
tags: [research, codebase, game-state, state-management, xstate]
status: complete
last_updated: 2025-10-04
last_updated_by: Assistant
last_updated_note: "Added technical issue with useGame hook using useSelector directly causing unnecessary rerenders"
---

# Research: Current Game State Documentation

**Date**: 2025-10-04T20:08:08+02:00
**Researcher**: Assistant
**Git Commit**: edec2c33cbc1f4a9a60b3500e3429f7959749290
**Branch**: main
**Repository**: space

## Research Question

Please research current game state. It was cleaned by me manually from unnecessary generated code. There is not state yet because we havent described exact mechanics how game should work. Please document current state.

## Summary

The current game state implementation is a minimal but functional foundation using XState for state management. The system manages a comprehensive game context including system statuses, messages, logs, and mission data, but lacks specific game mechanics as noted by the user. Most features are standalone mini-games or read-only displays, with limited state mutation occurring primarily in messaging and logging systems. The codebase has been cleaned of unnecessary generated code, leaving a clean slate for implementing actual game mechanics. **⚠️ Technical Issue:** The useGame hook has a performance problem with direct useSelector usage causing unnecessary rerenders.

## Detailed Findings

### State Management Architecture

The game uses XState with a single "gameOrchestrator" actor that manages all state through event-driven transitions. Key files:

- `src/state/game.ts` - Core state machine with 32 event types and comprehensive GameContext
- `src/state/types.ts` - TypeScript interfaces for all game entities (SystemStatus, Message, LogEntry, etc.)
- `src/state/useGame.ts` - React hook providing state access and event dispatchers
- `src/state/index.ts` - Module exports

The state persists to localStorage and includes pre-populated intro messages and logs from data files.

### Game Constants and Data

Minimal constants defined:

- `src/data/game-constants.ts` - Single INITIAL_CURRENT_DATE (2425-10-14T08:03:00Z)
- `src/data/logs.ts` - 4 predefined intro log entries (crew offboarding, weapons status, dry dock prep, classified purpose)
- `src/data/messages.ts` - 3 predefined messages from EARTH BASE COMMAND

### Feature Analysis

#### Dashboard (Main Interface)

- Reads systems status, logs, mission data
- Auto-updates diagnostics every 2 seconds
- Displays SystemCard grid, MissionStatus, SystemAlerts, SystemDiagnostics
- Most active state consumer in the application

#### Messaging System

- Reads/writes messages to global state
- Tracks read/unread status via messageViews
- Supports sending new messages
- One of the few features that actively modifies state

#### System Log

- Displays logs with level-based color coding
- Includes button to add sample logs for testing
- Reads from and can write to global log state

#### Captain's Log

- Read-only display of captain's log entries
- Shows entries in reverse chronological order with mood-based styling
- Pure consumer of captainsLog state

#### Standalone Mini-Games

- **Arcade**: Complete Space Invaders implementation with canvas rendering, collision detection, scoring
- **Cipher Game**: Caesar cipher decryption challenge with timer, levels, hints
- Both operate entirely independently of global game state

### Current State Structure

The GameContext includes:

- Commander info and view state
- System statuses with metrics
- Messages and logs arrays
- Diagnostics data
- Mission information
- Captain's log entries

However, as noted by the user, there are no actual game mechanics implemented - the state exists but lacks purposeful gameplay logic.

## Code References

- `src/state/game.ts:14-70` - GameContext interface and GameEvent types
- `src/state/game.ts:250-370` - XState machine configuration with event handlers
- `src/state/useGame.ts:20` - useGame hook implementation
- `src/data/game-constants.ts:1` - INITIAL_CURRENT_DATE definition
- `src/features/dashboard/view.tsx:20-29` - Dashboard state integration
- `src/features/messaging/view.tsx:13-17` - Messaging state read/write operations

## Architecture Insights

- **Event-Driven State**: All state changes occur through typed XState events
- **Singleton Pattern**: Single gameActor instance shared across the app
- **Selector Usage Issue**: ⚠️ Current useSelector implementation causes unnecessary rerenders - needs refactoring (see Follow-up Research)
- **Persistence Layer**: Automatic localStorage saving on state changes
- **Feature Isolation**: Mini-games operate independently, main features integrate with state
- **Read-Heavy Design**: Most features consume state, few modify it

## Historical Context (from thoughts/)

No relevant historical documents found regarding game state or mechanics planning. Existing thoughts focus on UI color fixes and component extraction.

## Related Research

No related research documents found in the thoughts/shared/research/ directory.

## Open Questions

- What specific game mechanics should be implemented?
- How should the standalone mini-games integrate with main game progression?
- What role should the various state entities (systems, messages, logs) play in gameplay?
- Should the state machine be expanded with sub-states for different game phases?
- How should the useGame hook be refactored to avoid direct useSelector usage and prevent unnecessary rerenders?

## Follow-up Research 2025-10-04T20-09-15

### Clarification on Mini-Games Status

Additional context provided by the user: The cipher game and arcade features are explorations that do not match the game lore. These will be removed or embedded into later game stages (decision pending).

**Impact on Research:**

- The standalone mini-games (Arcade and Cipher Game) should be considered temporary/experimental features
- They operate completely independently of the main game state and lore
- Future development should focus on core game mechanics that align with the established narrative (Earth Base Command, classified ship purpose, dry dock preparation, etc.)
- The main game state infrastructure (dashboard, messaging, system logs, captain's log) represents the core gameplay foundation that should be built upon

**Updated Assessment:**
The core game state is even more focused than initially assessed - the mini-games are non-canonical explorations that will likely be removed or significantly modified to fit the lore. The true game state consists of the command center interface, communication systems, and ship systems monitoring that establish the space exploration/command narrative.

## Follow-up Research 2025-10-04T20-16-55

### Technical Issue: useGame Hook Selector Usage

**Issue Identified:** The `useGame` hook should not use `useSelector` directly. Using it this way triggers unnecessary rerenders throughout the application and misses the point of using selectors.

**Current Implementation Problem:**

- `src/state/useGame.ts` uses multiple `useSelector` calls to extract state slices
- This causes components to rerender whenever any part of the state changes, even if they only depend on specific slices
- Defeats the performance optimization that selectors are meant to provide

**Impact:**

- Poor performance due to excessive rerenders
- Components not properly isolated from irrelevant state changes
- Goes against React state management best practices

**Recommended Fix:**
The `useGame` hook should be refactored to avoid direct `useSelector` usage. Instead, it should either:

- Use a single selector that returns the entire state and let components destructure as needed
- Or provide memoized selectors that components can use directly
- Or restructure to use XState's built-in selector patterns more effectively

**Priority:** High - This is a fundamental performance issue that affects the entire application's responsiveness.
