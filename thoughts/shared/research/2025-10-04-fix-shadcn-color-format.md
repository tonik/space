---
date: 2025-10-04T16:04:37+02:00
researcher: goszczu
git_commit: 802e40e4d6b665b157a93f0bea7c8d9cc0a7bb73
branch: main
repository: space
topic: "How to fix color format issues in shadcn theming (hex vs OKLCH, wrong CSS file)"
tags: [shadcn, theming, colors, oklch, css-variables, index.css, globals.css]
status: complete
last_updated: 2025-10-04
last_updated_by: goszczu
---

# Research: How to fix color format issues in shadcn theming (hex vs OKLCH, wrong CSS file)

**Date**: 2025-10-04T16:04:37+02:00
**Researcher**: goszczu
**Git Commit**: 802e40e4d6b665b157a93f0bea7c8d9cc0a7bb73
**Branch**: main
**Repository**: space

## Research Question

How to fix the color format issues where previous research used hex color values in app/globals.css, but the project uses index.css with OKLCH colors, and shadcn/ui recommends OKLCH for better theming.

## Summary

The previous research document incorrectly focused on hex color values in `app/globals.css`, but the project's actual color definitions are in `src/index.css` using OKLCH format, which aligns with shadcn/ui best practices. To fix this:

1. Use `src/index.css` as the source of truth for color variables (already correctly using OKLCH)
2. Convert any hex colors from `app/globals.css` to OKLCH format using online tools or libraries
3. Ensure consistent use of OKLCH for better perceptual uniformity and theming
4. Update any hardcoded colors in components to use the CSS variables from index.css

## Detailed Findings

### Current Color Setup Analysis

The project has two CSS files with different color approaches:

**src/index.css (Correct - OKLCH)**:

- Uses OKLCH color space: `oklch(0.1448 0 0)` for background, `oklch(0.9851 0 0)` for foreground
- Includes standard shadcn/ui color tokens (primary, secondary, accent, etc.)
- Properly mapped to Tailwind via `@theme inline` block
- Already follows shadcn theming conventions

**app/globals.css (Incorrect - Hex)**:

- Uses hex colors: `#000000` for background, `#00ff41` for foreground
- Terminal-themed green-on-black palette
- Includes custom terminal-specific variables
- Computed shadows using color-mix

The issue is that previous research analyzed `globals.css` but the project actually uses `index.css` for theming.

### Shadcn/ui Color System and OKLCH Usage

Shadcn/ui uses OKLCH for several reasons:

- **Perceptual uniformity**: Equal numerical changes produce equal perceived color differences
- **Better interpolation**: Smooth transitions between light/dark themes without banding
- **Improved accessibility**: Easier to maintain contrast ratios
- **Future-proof**: Supports wide color gamuts (P3, Rec.2020)

All shadcn themes define colors as OKLCH values in CSS variables, using the background-foreground naming convention for consistent theming.

### Converting Hex to OKLCH

Several methods available:

**Online Tools**:

- oklch.com: Interactive converter with 3D visualization
- Paste hex values to get OKLCH output (e.g., `#00ff41` → `oklch(0.832 0.189 142.5)`)

**JavaScript Libraries**:

- Color.js: `new Color("#00ff41").to("oklch")` → `oklch(0.832 0.189 142.5)`
- Supports programmatic conversion for build processes

**CSS Relative Color Syntax**:

- `oklch(from #00ff41 L C H)` to derive OKLCH from hex

### Correct CSS File for Color Definitions

According to shadcn/ui theming best practices:

- Define CSS variables in global CSS file under `:root` for light theme
- Use `.dark` selector for dark theme variables
- Map to Tailwind using `@theme inline { --color-[name]: var(--[name]); }`

In this project, `src/index.css` is the correct file since:

- It's imported in `src/main.tsx` (likely via Vite)
- Already contains proper OKLCH variables
- Follows shadcn conventions

`app/globals.css` appears to be an alternative or outdated theme file.

### Shadcn Theming Best Practices

**Color Setup**:

- Use background/foreground pairs: `--primary` and `--primary-foreground`
- Define in `:root` for light theme, `.dark` for dark theme
- Use OKLCH format for all color values

**Integration**:

- Set `cssVariables: true` in `components.json`
- Map variables to Tailwind in `@theme inline` block
- Use semantic class names (primary, secondary) rather than appearance-based

**Dark Mode**:

- Implement ThemeProvider for state management
- Persist preference in localStorage
- Respect system preference with `prefers-color-scheme`

## Architecture Insights

The project has redundant color definitions across two files. The proper architecture should be:

```
src/index.css (Primary Theme File)
├── :root { OKLCH variables }
├── @theme inline { Tailwind mapping }
└── @layer base { Global styles }

app/globals.css (Alternative/Unused)
└── Could be removed or used for specific themes
```

Components already use CSS variables correctly via shadcn/ui patterns. The main issue is ensuring all colors use OKLCH format and the correct file is referenced.

## Code References

- `src/index.css:4-37` - OKLCH color variable definitions
- `src/index.css:57-113` - Tailwind theme mapping with OKLCH variables
- `app/globals.css:4-47` - Hex color variable definitions (outdated)
- `components.json:1-22` - shadcn configuration with CSS variables enabled
- `src/components/ui/button.tsx:8-37` - Component using CSS variables correctly

## Historical Context (from thoughts/)

- `thoughts/shared/research/2025-10-04-ui-layer-extraction.md` - Previous research that incorrectly focused on hex colors in globals.css
- `thoughts/shared/plans/2025-10-04-ui-component-extraction.md` - Plan referencing the UI layer extraction

## Related Research

- `thoughts/shared/research/2025-10-04-ui-layer-extraction.md` - Original research on UI layer extraction (needs correction regarding color file and format)

## Open Questions

1. Should `app/globals.css` be removed entirely, or kept as an alternative theme?
2. How to handle the terminal-specific colors that are only in globals.css?
3. Whether to migrate any unique colors from globals.css to index.css in OKLCH format?
