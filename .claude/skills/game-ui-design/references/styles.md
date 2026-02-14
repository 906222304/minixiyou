# Game UI Style Variants

Detailed style guides for different game aesthetics, all inspired by clean, modern design principles.

## Table of Contents

1. [Light Fresh](#light-fresh)
2. [Soft Fantasy](#soft-fantasy)
3. [Modern RPG](#modern-rpg)
4. [Card Collection](#card-collection)

---

## Light Fresh

Clean, bright, and minimal - perfect for casual games and modern mobile experiences.

### Color Palette

```css
:root {
  /* Primary - Soft Indigo */
  --primary-50: #eef2ff;
  --primary-100: #e0e7ff;
  --primary-200: #c7d2fe;
  --primary-300: #a5b4fc;
  --primary-400: #818cf8;
  --primary-500: #6366f1;
  --primary-600: #4f46e5;

  /* Accent - Warm Amber */
  --accent-50: #fffbeb;
  --accent-100: #fef3c7;
  --accent-200: #fde68a;
  --accent-300: #fcd34d;
  --accent-400: #fbbf24;
  --accent-500: #f59e0b;

  /* Neutrals */
  --neutral-50: #fafafa;
  --neutral-100: #f4f4f5;
  --neutral-200: #e4e4e7;
  --neutral-300: #d4d4d8;
  --neutral-400: #a1a1aa;
  --neutral-500: #71717a;
  --neutral-600: #52525b;
  --neutral-700: #3f3f46;
  --neutral-800: #27272a;
  --neutral-900: #18181b;

  /* Semantic */
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #3b82f6;
}
```

### Component Styles

```css
/* Light panel with subtle shadow */
.panel-fresh {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: 16px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(0, 0, 0, 0.04);
}

/* Soft button */
.btn-fresh {
  padding: 12px 24px;
  background: white;
  border: 1.5px solid var(--neutral-200);
  border-radius: 10px;
  color: var(--neutral-700);
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-fresh:hover {
  border-color: var(--primary-300);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.12);
}

.btn-fresh-primary {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border: none;
  color: white;
}

/* Soft progress bar */
.progress-fresh {
  height: 8px;
  background: var(--neutral-100);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fresh-fill {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--primary-400), var(--primary-500));
  transition: width 0.3s ease;
}

/* Card with hover effect */
.card-fresh {
  background: white;
  border: 1px solid var(--neutral-100);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
}

.card-fresh:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: var(--primary-200);
}
```

---

## Soft Fantasy

Magical aesthetics with pastel colors, gentle glows, and ethereal elements.

### Color Palette

```css
:root {
  /* Magic purples */
  --magic-light: #e9d5ff;
  --magic-soft: #d8b4fe;
  --magic-medium: #c084fc;
  --magic-deep: #a855f7;
  --magic-dark: #7c3aed;

  /* Golden accents */
  --gold-light: #fef3c7;
  --gold-soft: #fde68a;
  --gold-medium: #fbbf24;
  --gold-deep: #f59e0b;

  /* Nature greens */
  --nature-light: #d1fae5;
  --nature-soft: #6ee7b7;
  --nature-medium: #34d399;

  /* Sky blues */
  --sky-light: #dbeafe;
  --sky-soft: #93c5fd;
  --sky-medium: #60a5fa;

  /* Backgrounds */
  --bg-mystical: linear-gradient(180deg, #fdf4ff 0%, #faf5ff 50%, #f5f3ff 100%);
}
```

### Component Styles

```css
/* Magical panel with glow */
.panel-fantasy {
  background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(250,245,255,0.95));
  border: 1px solid var(--magic-light);
  border-radius: 16px;
  box-shadow:
    0 0 0 1px rgba(168, 85, 247, 0.05),
    0 4px 16px rgba(168, 85, 247, 0.08);
  position: relative;
}

.panel-fantasy::before {
  content: '';
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold-medium), transparent);
}

/* Magic button */
.btn-magic {
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--magic-medium), var(--magic-deep));
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 12px rgba(168, 85, 247, 0.3);
  transition: all 0.2s ease;
}

.btn-magic:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4);
}

/* Skill card with glow effect */
.card-skill {
  background: white;
  border: 1.5px solid var(--magic-light);
  border-radius: 12px;
  padding: 16px;
  position: relative;
  transition: all 0.2s ease;
}

.card-skill:hover {
  border-color: var(--magic-soft);
  box-shadow: 0 0 20px rgba(192, 132, 252, 0.2);
}

.card-skill[data-rarity="legendary"] {
  border-color: var(--gold-soft);
  box-shadow: 0 0 24px rgba(251, 191, 36, 0.2);
}

/* HP bar with gradient */
.progress-hp-fantasy {
  height: 12px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
  overflow: hidden;
}

.progress-hp-fantasy-fill {
  height: 100%;
  background: linear-gradient(90deg, #f87171, #ef4444);
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
}

/* MP bar with magic gradient */
.progress-mp-fantasy {
  height: 12px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 6px;
  overflow: hidden;
}

.progress-mp-fantasy-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--sky-medium), var(--magic-medium));
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.4);
}
```

---

## Modern RPG

Clean professional look with enough depth for immersive RPG experiences.

### Color Palette

```css
:root {
  /* Core theme */
  --rpg-primary: #3b82f6;
  --rpg-primary-light: #60a5fa;
  --rpg-primary-dark: #2563eb;

  /* Gold for achievements/currency */
  --rpg-gold: #eab308;
  --rpg-gold-light: #facc15;
  --rpg-gold-dark: #ca8a04;

  /* Rarity colors */
  --rpg-common: #64748b;
  --rpg-uncommon: #22c55e;
  --rpg-rare: #3b82f6;
  --rpg-epic: #a855f7;
  --rpg-legendary: #f59e0b;

  /* Surfaces */
  --rpg-surface: #ffffff;
  --rpg-surface-elevated: #ffffff;
  --rpg-border: #e2e8f0;
  --rpg-border-strong: #cbd5e1;

  /* Text */
  --rpg-text: #0f172a;
  --rpg-text-secondary: #475569;
  --rpg-text-muted: #94a3b8;
}
```

### Component Styles

```css
/* Clean panel with accent bar */
.panel-rpg {
  background: white;
  border: 1px solid var(--rpg-border);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.panel-rpg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--rpg-primary), var(--rpg-gold));
}

/* Stat display */
.stat-rpg {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(59, 130, 246, 0.04);
  border-radius: 8px;
}

.stat-rpg-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 8px;
  font-size: 16px;
}

.stat-rpg-value {
  font-weight: 700;
  color: var(--rpg-text);
}

.stat-rpg-label {
  font-size: 12px;
  color: var(--rpg-text-muted);
}

/* Equipment slot */
.slot-equipment {
  aspect-ratio: 1;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border: 2px dashed var(--rpg-border-strong);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.slot-equipment:hover {
  border-style: solid;
  border-color: var(--rpg-primary-light);
  background: rgba(59, 130, 246, 0.04);
}

.slot-equipment.filled {
  border-style: solid;
  border-color: var(--rpg-border-strong);
  background: white;
}

/* Character info card */
.card-character {
  background: linear-gradient(135deg, white, #fafafa);
  border: 1px solid var(--rpg-border);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  gap: 16px;
}

.card-character-avatar {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--rpg-primary-light), var(--rpg-primary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.card-character-info {
  flex: 1;
}

.card-character-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--rpg-text);
}

.card-character-title {
  font-size: 13px;
  color: var(--rpg-text-muted);
  margin-bottom: 8px;
}
```

---

## Card Collection

Crisp, clean design optimized for card/collectible games.

### Color Palette

```css
:root {
  /* Card frame colors */
  --card-frame-common: #94a3b8;
  --card-frame-uncommon: #4ade80;
  --card-frame-rare: #38bdf8;
  --card-frame-epic: #c084fc;
  --card-frame-legendary: #fbbf24;
  --card-frame-mythic: #f472b6;

  /* Card background */
  --card-bg: #ffffff;
  --card-bg-dark: #f8fafc;

  /* Text */
  --card-text: #1e293b;
  --card-text-secondary: #64748b;
  --card-text-muted: #94a3b8;

  /* Accents */
  --card-accent: #6366f1;
}
```

### Component Styles

```css
/* Card base */
.card-collectible {
  width: 180px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
}

.card-collectible:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

/* Card frame by rarity */
.card-collectible[data-rarity="rare"] {
  box-shadow:
    0 0 0 3px var(--card-frame-rare),
    0 2px 8px rgba(56, 189, 248, 0.2);
}

.card-collectible[data-rarity="epic"] {
  box-shadow:
    0 0 0 3px var(--card-frame-epic),
    0 4px 16px rgba(192, 132, 252, 0.25);
}

.card-collectible[data-rarity="legendary"] {
  box-shadow:
    0 0 0 3px var(--card-frame-legendary),
    0 4px 20px rgba(251, 191, 36, 0.3);
  animation: legendary-shine 3s ease-in-out infinite;
}

@keyframes legendary-shine {
  0%, 100% { box-shadow: 0 0 0 3px var(--card-frame-legendary), 0 4px 20px rgba(251, 191, 36, 0.3); }
  50% { box-shadow: 0 0 0 3px var(--card-frame-legendary), 0 8px 32px rgba(251, 191, 36, 0.5); }
}

/* Card art area */
.card-art-area {
  height: 120px;
  background: linear-gradient(180deg, #f8fafc, #f1f5f9);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.card-art-area::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.03) 100%);
}

/* Card cost badge */
.card-cost-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, var(--card-accent), #4f46e5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: white;
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
}

/* Card info */
.card-info-area {
  padding: 12px;
  text-align: center;
}

.card-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--card-text);
  margin-bottom: 4px;
}

.card-type {
  font-size: 11px;
  color: var(--card-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Card stats bar */
.card-stats-bar {
  display: flex;
  justify-content: space-around;
  padding: 10px 12px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
}

.card-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 14px;
}

.card-stat-attack {
  color: #ef4444;
}

.card-stat-defense {
  color: #3b82f6;
}

/* Grid layout for collection */
.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  padding: 16px;
}
```

---

## Responsive Design

All styles support responsive breakpoints:

```css
/* Mobile first approach */
@media (min-width: 480px) {
  .game-page { max-width: 480px; }
}

@media (min-width: 640px) {
  .game-page { max-width: 640px; }
  .collection-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 768px) {
  .game-page { max-width: 768px; }
  .collection-grid { grid-template-columns: repeat(4, 1fr); }
}

/* Touch targets */
@media (pointer: coarse) {
  .game-btn {
    min-height: 44px;
    padding: 12px 20px;
  }

  .card-collectible {
    min-width: 160px;
  }
}
```
