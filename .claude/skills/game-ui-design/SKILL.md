---
name: game-ui-design
description: |
  Modern game UI design system inspired by Gemini's clean aesthetic philosophy.
  Creates fresh, immersive game interfaces with soft gradients, pastel colors, and smooth animations.

  Use when designing or implementing game-style UI components including buttons, modals, cards,
  progress bars, inventory panels, skill trees, HUD elements, and dialog systems.

  Triggers: "game UI", "game interface", "RPG UI", "game button", "game modal", "game card",
  "inventory UI", "skill panel", "game HUD", "fantasy UI", "fresh UI", "小清新", "游戏UI"
---

# Gemini-Inspired Game UI Design System

Design fresh, modern game interfaces that blend professional game aesthetics with clean, approachable design.

## Design Philosophy

**Clean & Fresh**: Soft colors, rounded corners, and breathing room create an inviting experience.
**Visual Clarity**: Clear hierarchy with subtle depth, not overwhelming effects.
**Smooth Motion**: Gentle, purposeful animations that feel natural and responsive.
**Accessibility**: High contrast text, readable fonts, and intuitive layouts.
**Consistency**: Unified design language across all components.

## Core Design Tokens

### Color System

```css
:root {
  /* Primary palette - Warm & Inviting */
  --game-primary: #6366f1;        /* Soft indigo */
  --game-primary-light: #818cf8;
  --game-primary-dark: #4f46e5;

  /* Accent - Golden warmth */
  --game-accent: #f59e0b;         /* Warm amber */
  --game-accent-light: #fbbf24;
  --game-accent-dark: #d97706;

  /* Background - Soft gradients */
  --game-bg-base: #faf5ff;        /* Very light purple tint */
  --game-bg-surface: #ffffff;
  --game-bg-elevated: #ffffff;
  --game-bg-overlay: rgba(255, 255, 255, 0.95);

  /* Text hierarchy */
  --game-text-primary: #1e1b4b;   /* Deep purple-black */
  --game-text-secondary: #6b7280;
  --game-text-muted: #9ca3af;
  --game-text-light: #d1d5db;

  /* Semantic colors */
  --game-success: #10b981;
  --game-warning: #f59e0b;
  --game-danger: #ef4444;
  --game-info: #3b82f6;

  /* Quality/Rarity colors - Soft & distinct */
  --quality-common: #6b7280;
  --quality-uncommon: #22c55e;
  --quality-rare: #3b82f6;
  --quality-epic: #a855f7;
  --quality-legendary: #f59e0b;
  --quality-mythic: #ec4899;

  /* Combat stats */
  --hp-color: #ef4444;
  --mp-color: #6366f1;
  --exp-color: #10b981;

  /* Surfaces & borders */
  --game-border: rgba(99, 102, 241, 0.15);
  --game-border-strong: rgba(99, 102, 241, 0.3);
  --game-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --game-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --game-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --game-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
}
```

### Typography

```css
:root {
  --font-sans: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
  --font-display: 'Outfit', 'Noto Sans SC', var(--font-sans);
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
}
```

## Quick Start

### 1. Base Layout

```css
.game-container {
  min-height: 100vh;
  background: linear-gradient(180deg,
    #faf5ff 0%,
    #f5f3ff 50%,
    #fdf4ff 100%
  );
}

.game-page {
  padding: 16px;
  max-width: 480px;
  margin: 0 auto;
}
```

### 2. Core Components

**Game Button**:
```css
.game-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--game-bg-surface);
  border: 1.5px solid var(--game-border-strong);
  border-radius: var(--radius-md);
  color: var(--game-text-primary);
  font-weight: 600;
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--game-shadow-sm);
}

.game-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--game-shadow-md);
  border-color: var(--game-primary);
}

.game-btn:active {
  transform: translateY(0);
}

.game-btn-primary {
  background: linear-gradient(135deg, var(--game-primary) 0%, var(--game-primary-dark) 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.game-btn-primary:hover {
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}
```

**Game Panel**:
```css
.game-panel {
  background: var(--game-bg-surface);
  border: 1px solid var(--game-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--game-shadow-md);
  position: relative;
  overflow: hidden;
}

.game-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg,
    var(--game-primary),
    var(--game-accent),
    var(--game-primary)
  );
}
```

**Game Card**:
```css
.game-card {
  background: var(--game-bg-surface);
  border: 1.5px solid var(--game-border);
  border-radius: var(--radius-md);
  padding: 16px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--game-shadow-lg);
  border-color: var(--game-primary-light);
}

.game-card[data-quality="epic"] {
  border-color: var(--quality-epic);
  box-shadow: 0 0 0 1px rgba(168, 85, 247, 0.1);
}
```

## Animation Guidelines

```css
/* Smooth entrance */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Subtle pulse for important elements */
@keyframes subtle-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* Shimmer effect for loading */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Damage number float */
@keyframes damage-float {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-40px) scale(1.1);
  }
}

/* Transitions */
.transition-smooth {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-bounce {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

## Component Reference

| Component | Description | Reference |
|-----------|-------------|-----------|
| Buttons | Primary, secondary, ghost, danger variants | [components.md](references/components.md) |
| Panels | Content containers, cards, list items | [components.md](references/components.md) |
| Progress | HP/MP bars, experience, cooldowns | [components.md](references/components.md) |
| Navigation | Tabs, bottom bar, headers | [components.md](references/components.md) |
| Modals | Dialogs, sheets, confirmations | [components.md](references/components.md) |
| Typography | Titles, stats, descriptions | [components.md](references/components.md) |

## Style Variants

| Style | Description | Reference |
|-------|-------------|-----------|
| Light Fresh | Clean, bright, minimal | [styles.md](references/styles.md) |
| Soft Fantasy | Pastel magic, gentle golds | [styles.md](references/styles.md) |
| Modern RPG | Clean with game depth | [styles.md](references/styles.md) |
| Card Collection | Crisp, collectible-focused | [styles.md](references/styles.md) |

## Implementation Workflow

1. **Set design tokens** - Copy CSS variables to your project
2. **Import base styles** - Use [game-ui-base.css](assets/game-ui-base.css)
3. **Build components** - Start with buttons, panels, then complex layouts
4. **Add animations** - Apply smooth transitions and micro-interactions
5. **Polish** - Adjust shadows, borders, and spacing for consistency

## Best Practices

- Use soft shadows instead of hard borders for depth
- Maintain consistent border radius across similar components
- Keep animations under 300ms for responsive feel
- Ensure text contrast meets WCAG AA standards
- Use semantic color tokens (success, danger) not raw colors
- Apply subtle gradients for visual interest without distraction
