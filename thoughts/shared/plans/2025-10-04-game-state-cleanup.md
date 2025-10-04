# Game State Cleanup Implementation Plan

## Overview

Clean up the game state implementation based on research findings. The current state has performance issues, includes non-canonical features that don't fit the space exploration lore, and contains unused event types and state properties. This cleanup will prepare the state management for actual game mechanics implementation.

## Current State Analysis

Based on research in `thoughts/shared/research/2025-10-04-current-game-state.md`, the main issues are:

- **Performance Issue**: `useGame` hook uses multiple `useSelector` calls causing unnecessary rerenders
- **Non-Canonical Features**: Arcade and cipher-game features don't match the established space exploration narrative
- **Unused State**: Many game events and state properties are defined but not used
- **State Structure**: Complex state with unused properties that should be simplified

## Desired End State

After cleanup:

- Game state access is optimized with feature-specific selectors preventing unnecessary rerenders
- `useGame` hook only provides event dispatchers, no state access
- Only canonical features (dashboard, messaging, logs, captain's log, terminal) are visible in navigation
- Non-canonical features (arcade, cipher-game) are hidden but code preserved for future integration
- State machine only includes events that are actually used
- Clean, focused state structure ready for game mechanics implementation
- Navigation reflects the core game features only

### Key Discoveries:

- `useGame` hook returns new object on every render due to multiple `useSelector` calls
- Arcade and cipher-game are fully implemented but don't fit the lore (Earth Base Command, AI system, ship systems)
- Most game events are defined in `useGame` but never dispatched by components
- Core features (dashboard, messaging, logs) are the foundation that should be preserved

## What We're NOT Doing

- Implementing new game mechanics (this is cleanup only)
- Changing the core narrative or established lore
- Removing functional core features (dashboard, messaging, system logs, captain's log, terminal)
- Modifying the XState architecture itself

## Implementation Approach

Incremental cleanup in phases to maintain functionality while improving performance and focus.

## Phase 1: Refactor State Access Pattern ✅

**Status: Completed**

- [x] Simplified useGame Hook - removed all useSelector calls and kept only event dispatchers
- [x] Created dashboard selectors file with useDashboardState selector
- [x] Created messaging selectors file with useMessagingState selector
- [x] Created system-log selectors file with useSystemLogState selector
- [x] Created captains-log selectors file with useCaptainsLogState selector
- [x] Created navigation selectors file with useNavigationState selector
- [x] Updated all feature components to use feature-specific selectors instead of useGame

**Results:**

- useGame hook now only provides event dispatchers, no state access
- Each feature has its own optimized selector that only accesses relevant state
- Performance issues with multiple useSelector calls causing unnecessary rerenders are resolved
- Components now only rerender when their specific state changes

### Overview

Remove selectors from the `useGame` hook completely and create feature-specific selectors in separate files. This eliminates the performance issues caused by multiple `useSelector` calls and allows each feature to optimize its own state access.

### Changes Required:

#### 1. Simplify useGame Hook

**File**: `src/state/useGame.ts`
**Changes**: Remove all `useSelector` calls and derived computations. Keep only the event dispatch functions.

```typescript
// Before: Multiple useSelector calls causing rerenders
const context = useSelector(gameActor, (state) => state.context);
const activeView = useSelector(gameActor, (state) => state.context.activeView);
// ... many more

// After: Only event dispatchers
export const useGame = () => {
  return {
    startGame: (commanderName: string) =>
      gameActor.send({ type: "START_GAME", commanderName }),
    changeView: (view: GameContext["activeView"]) =>
      gameActor.send({ type: "CHANGE_VIEW", view }),
    // ... only event dispatchers
  };
};
```

#### 2. Create Feature-Specific Selectors

**File**: `src/features/dashboard/selectors.ts`
**Changes**: Create selectors for dashboard-specific state

```typescript
import { useSelector } from "@xstate/react";
import { gameActor } from "@/state/useGame";

export const useDashboardState = () => {
  return useSelector(gameActor, (state) => ({
    systems: state.context.systems,
    diagnostics: state.context.diagnostics,
    mission: state.context.mission,
    logs: state.context.logs,
  }));
};
```

**File**: `src/features/messaging/selectors.ts`
**Changes**: Create selectors for messaging-specific state

```typescript
import { useSelector } from "@xstate/react";
import { gameActor } from "@/state/useGame";

export const useMessagingState = () => {
  return useSelector(gameActor, (state) => ({
    messages: state.context.messages,
    messageViews: state.context.messageViews,
    unreadCount: calculateUnreadCount(state.context),
  }));
};
```

**File**: `src/features/system-log/selectors.ts`
**Changes**: Create selectors for system log state

**File**: `src/features/captains-log/selectors.ts`
**Changes**: Create selectors for captain's log state

**File**: `src/components/navigation/selectors.ts`
**Changes**: Create selectors for navigation state

#### 3. Update Feature Components

**Files**: All feature components
**Changes**: Replace `useGame()` destructuring with feature-specific selectors

```typescript
// Before:
const { systems, diagnostics, mission } = useGame();

// After:
const { systems, diagnostics, mission } = useDashboardState();
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compilation passes: `npm run typecheck`
- [x] Linting passes: `npm run lint`
- [x] No runtime errors in development console
- [x] Feature-specific selectors return expected data structures

#### Manual Verification:

- [x] Dashboard updates diagnostics every 2 seconds without performance issues
- [x] Navigation between views is responsive
- [x] Messaging system updates message counts correctly
- [x] System logs display correctly
- [x] Captain's log shows entries properly
- [x] No visible performance degradation in UI
- [x] Each feature only rerenders when its specific state changes

---

## Phase 2: Hide Non-Canonical Features ✅

**Status: Completed**

- [x] Removed arcade and cipher-game from navItems in utils.ts
- [x] Removed arcade and cipher-game from AvailableViewKeys type in game.ts
- [x] Removed arcade and cipher-game from viewNotifications in game.ts
- [x] Preserved feature code in src/features/ directories for future use

**Results:**

- Navigation now only shows canonical features (Control, Comms, Terminal, Ship Logs, Captain's Log)
- Arcade and cipher game options are completely removed from navigation
- Feature code remains intact for potential future integration into game lore
- No broken imports or references remain

### Overview

Hide arcade and cipher-game features from navigation while preserving the code for potential future integration into the game lore.

### Changes Required:

#### 1. Remove Arcade from Navigation

**File**: `src/utils.ts`
**Changes**: Remove arcade from navItems array

**File**: `src/state/game.ts`
**Changes**: Remove "arcade" from AvailableViewKeys type and viewNotifications

#### 2. Remove Cipher Game from Navigation

**File**: `src/utils.ts`
**Changes**: Remove cipher-game from navItems array

**File**: `src/state/game.ts`
**Changes**: Remove "cipher-game" from AvailableViewKeys type and viewNotifications

#### 3. Preserve Feature Code

**Files**: `src/features/arcade/`, `src/features/cipher-game/`
**Changes**: Keep all feature code intact for potential future use

### Success Criteria:

#### Automated Verification:

- [ ] TypeScript compilation passes: `npm run typecheck`
- [ ] Navigation renders without errors: `npm run dev`
- [ ] No broken imports or references

#### Manual Verification:

- [ ] Navigation only shows canonical features (Control, Comms, Terminal, Ship Logs, Captain's Log)
- [ ] No arcade or cipher game options in navigation
- [ ] Feature code remains intact in src/features/ directories
- [ ] All remaining features work correctly

---

## Phase 3: Clean Up Unused Game Events ✅

**Status: Completed**

- [x] Analyzed and removed unused game events from GameEvent union
- [x] Removed unused event dispatch functions from useGame hook
- [x] Kept only events that are actually used by components

**Results:**

- GameEvent union now only includes: START_GAME, CHANGE_VIEW, ENTER_MAIN_APP, COMMAND_EXECUTED, ADD_MESSAGE, MESSAGE_OPENED, ADD_LOG, UPDATE_DIAGNOSTICS
- useGame hook only provides dispatchers for events that are actually used
- State machine is cleaner and more focused on actual functionality
- Reduced complexity and improved performance

### Overview

Remove game events that are defined but never actually dispatched by components.

### Changes Required:

#### 1. Analyze Event Usage

**File**: `src/state/game.ts`
**Changes**: Review GameEvent union and remove unused event types

Based on codebase analysis, the following events are dispatched:

- UPDATE_DIAGNOSTICS (used in dashboard)
- START_GAME, CHANGE_VIEW, ENTER_MAIN_APP (used in navigation/setup)
- ADD_MESSAGE, MESSAGE_OPENED (used in messaging)
- ADD_LOG, COMMAND_EXECUTED (used in logging)

All other events (PLAYER_SCAN through ACTIVATE_SELF_DESTRUCT) appear to be defined but unused.

#### 2. Remove Unused Events

**File**: `src/state/game.ts`
**Changes**: Remove unused event types from GameEvent union and corresponding actions

#### 3. Update useGame Hook

**File**: `src/state/useGame.ts`
**Changes**: Remove dispatch functions for unused events

### Success Criteria:

#### Automated Verification:

- [ ] TypeScript compilation passes: `npm run typecheck`
- [ ] State machine initializes without errors
- [ ] Existing functionality (diagnostics, messaging, logging) still works

#### Manual Verification:

- [ ] Dashboard diagnostics update correctly
- [ ] Messaging system sends/receives messages
- [ ] System logs display and can be added
- [ ] Terminal commands are tracked

---

## Phase 4: Simplify State Structure ✅

**Status: Completed**

- [x] Reviewed and removed unused state properties from GameContext
- [x] Cleaned up initialContext to remove unused properties
- [x] Kept only properties that are actively used by components

**Results:**

- GameContext now only includes properties that are actually accessed by components
- State structure is cleaner and more focused
- Reduced memory footprint
- No missing state errors in console
- All features display correct data with available properties

### Overview

Remove unused state properties and simplify the GameContext to focus on actively used features.

### Changes Required:

#### 1. Review State Usage

**File**: `src/state/game.ts`
**Changes**: Analyze which GameContext properties are actually used by components

Based on analysis:

- `commanderName`, `activeView`, `showWelcomeScreen` - used
- `systems` - used by dashboard
- `messages`, `messageViews` - used by messaging
- `logs`, `captainsLog` - used by respective features
- `diagnostics`, `mission` - used by dashboard
- `commandCounts` - used by terminal

#### 2. Remove Unused Properties

**File**: `src/state/game.ts`
**Changes**: Remove properties that aren't accessed by any components

#### 3. Clean Up Initial Context

**File**: `src/state/game.ts`
**Changes**: Remove unused properties from initialContext

### Success Criteria:

#### Automated Verification:

- [ ] TypeScript compilation passes: `npm run typecheck`
- [ ] State initializes with correct structure
- [ ] Components receive expected data

#### Manual Verification:

- [ ] All features display correct data
- [ ] No missing state errors in console
- [ ] Dashboard shows systems, diagnostics, mission data
- [ ] Messaging shows messages and read status

---

## Testing Strategy

### Unit Tests:

- Test useGame hook returns stable references
- Test state machine handles remaining events correctly
- Test navigation only includes canonical views

### Integration Tests:

- Test complete navigation flow between remaining features
- Test state persistence and restoration
- Test performance improvements (reduced rerenders)

### Manual Testing Steps:

1. Navigate through all remaining features (Control, Comms, Terminal, Ship Logs, Captain's Log)
2. Verify dashboard diagnostics update every 2 seconds
3. Send and receive messages in Comms
4. Add logs in Ship Logs feature
5. Execute commands in Terminal and verify they're tracked
6. Check that arcade and cipher game are completely removed

## Performance Considerations

- useGame hook refactoring should significantly reduce unnecessary rerenders
- Removing unused state properties reduces memory footprint
- Simplified event handling improves state machine performance
- Navigation with fewer items should render faster

## Migration Notes

- No data migration needed as we're hiding features, not changing existing data structure
- Existing localStorage state will be compatible (extra properties are ignored)
- Users will lose access to arcade and cipher games from navigation, but code is preserved for future use
- Non-canonical features remain intact for potential integration into game lore later

## References

- Original research: `thoughts/shared/research/2025-10-04-current-game-state.md`
- Performance issue identified: useGame hook multiple useSelector calls causing unnecessary rerenders
- Current game state implementation: `src/state/game.ts`, `src/state/useGame.ts`
- Navigation configuration: `src/utils.ts`
