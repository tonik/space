---
date: 2025-10-04T18:22:36+02:00
researcher: goszczu
git_commit: e7ee84f1acfa849acaade3f8138125d19956b93a
branch: main
repository: space
topic: "Check what files are still using old coloring (hardcoded colors instead of CSS variables)"
tags: [color-migration, hardcoded-colors, css-variables, terminal-theme, oklch]
status: complete
last_updated: 2025-10-04
last_updated_by: goszczu
---

# Research: Check what files are still using old coloring (hardcoded colors instead of CSS variables)

**Date**: 2025-10-04T18:22:36+02:00
**Researcher**: goszczu
**Git Commit**: e7ee84f1acfa849acaade3f8138125d19956b93a
**Branch**: main
**Repository**: space

## Research Question

After implementing the color update plan, what files are still using old coloring (hardcoded hex/RGBA colors) instead of the new OKLCH CSS variables defined in src/index.css?

## Summary

Despite the implementation of color update plans, several files still contain hardcoded color values that bypass the CSS variable system. The OKLCH color definitions in `src/index.css` are properly configured, but application components continue to use hardcoded `#00ff41` (terminal green) and other colors instead of semantic CSS variables like `text-primary`, `bg-primary`, etc. This creates inconsistency and prevents proper theming.

## Detailed Findings

### Current CSS Variable State

**src/index.css** contains properly defined OKLCH color variables:

- `--primary: oklch(0.832 0.189 142.5)` (equivalent to #00ff41)
- `--background: oklch(0 0 0)` (equivalent to #000000)
- `--secondary: oklch(0.051 0.046 145.4)` (equivalent to #001a0d)
- All variables are mapped to Tailwind via `@theme inline` block

### Files Still Using Hardcoded Colors

#### 1. src/features/dashboard/view.tsx (High Priority - 30+ instances)

**Issue**: Extensive use of hardcoded `#00ff41` colors throughout the dashboard components.

**Specific instances**:

- Lines 19-117: Multiple `text-[#00ff41]`, `bg-[#00ff41]`, `border-[#00ff41]/30` classes
- Affects card borders, text colors, background highlights, and interactive states
- Should use: `text-primary`, `bg-primary`, `border-border`, etc.

#### 2. src/components/navigation.tsx (High Priority - 6 instances + 1 RGBA)

**Issue**: Navigation sidebar uses hardcoded terminal green colors.

**Specific instances**:

- Lines 19-20: `border-[#00ff41]/30`, `border-[#00ff41]`
- Lines 32-35: `hover:bg-[#00ff41]/10 hover:text-[#00ff41]`, `border-[#00ff41] bg-[#00ff41]/20 text-[#00ff41]`, `text-[#00ff41]/60`
- Line 41: `shadow-[0_0_6px_rgba(239,68,68,0.6)]` (red RGBA shadow - incorrect color)

**Should use**: `border-border`, `hover:bg-primary/10 hover:text-primary`, `bg-primary/20 text-primary`, etc.

#### 3. src/components/top-nav.tsx (Medium Priority - 6 instances)

**Issue**: Top navigation bar uses hardcoded colors.

**Specific instances**:

- Line 7: `border-[#00ff41]/30`
- Line 16: `border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41]`
- Lines 22-24: Multiple `text-[#00ff41]/60` instances

**Should use**: `border-border`, `border-primary bg-primary/10 text-primary`, `text-muted-foreground`

#### 4. src/features/notifications/store.ts (Medium Priority - 2 instances)

**Issue**: Notification store uses hardcoded colors in JavaScript objects.

**Specific instances**:

- Lines 42-43: `color: "#00ff41"`, `border: "1px solid #00ff41"`

**Should use**: CSS variables or theme-aware color resolution

### Color Usage Patterns Found

1. **Tailwind Arbitrary Values**: `text-[#00ff41]`, `bg-[#00ff41]`, `border-[#00ff41]/30`
2. **Hex Colors in JS**: `"#00ff41"` in notification store
3. **RGBA Values**: `rgba(239,68,68,0.6)` (incorrect red color in navigation)

### Missing Files from Previous Plans

The research found additional files not mentioned in the original plans:

- `src/features/dashboard/view.tsx` (major offender)
- `src/features/notifications/store.ts` (JS color definitions)

## Architecture Insights

The issue stems from incomplete implementation of the UI component extraction plan. While `src/index.css` has proper OKLCH variables and the shadcn/ui components use them correctly, application-specific components bypass the theme system entirely.

**Current Architecture (Broken)**:

```
src/index.css (OKLCH variables) ← Not used by application components
shadcn/ui components (CSS variables) ← Properly implemented
Application components (Hardcoded colors) ← Problem area
```

**Target Architecture (from plans)**:

```
src/index.css (OKLCH variables)
    ↓
shadcn/ui components (CSS variables)
    ↓
Application components (Semantic classes)
```

## Code References

- `src/index.css:4-41` - OKLCH color variable definitions
- `src/features/dashboard/view.tsx:19-117` - Hardcoded color usage in dashboard
- `src/components/navigation.tsx:19-41` - Hardcoded colors in navigation
- `src/components/top-nav.tsx:7-24` - Hardcoded colors in top navigation
- `src/features/notifications/store.ts:42-43` - Hardcoded colors in notification store

## Historical Context (from thoughts/)

- `thoughts/shared/plans/2025-10-04-fix-terminal-colors-oklch.md` - Plan to convert colors to OKLCH
- `thoughts/shared/plans/2025-10-04-ui-component-extraction.md` - Plan to extract hardcoded colors to CSS variables
- `thoughts/shared/research/2025-10-04-fix-shadcn-color-format.md` - Research on color format issues
- `thoughts/shared/research/2025-10-04-ui-layer-extraction.md` - Research on UI layer extraction

## Open Questions

1. Why was the dashboard component (`src/features/dashboard/view.tsx`) not included in the original conversion plans?
2. Should the notification store colors be moved to CSS variables or handled differently?
3. What caused the "unpulled code changes" mentioned by the user - were some commits not pushed/pulled?

## Related Research

- `thoughts/shared/research/2025-10-04-fix-shadcn-color-format.md` - Color format conversion research
- `thoughts/shared/research/2025-10-04-ui-layer-extraction.md` - UI component extraction research
