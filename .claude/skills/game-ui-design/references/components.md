# Game UI Component Library

Complete reference for all game UI components.

## Table of Contents

1. [Buttons](#buttons)
2. [Modals](#modals)
3. [Cards](#cards)
4. [Progress Bars](#progress-bars)
5. [Lists & Inventory](#lists--inventory)
6. [Typography](#typography)
7. [Tooltips](#tooltips)
8. [Tabs & Navigation](#tabs--navigation)

---

## Buttons

### Button Variants

```css
/* Base button */
.game-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(180deg, #3a3a5a 0%, #2a2a3a 50%, #1a1a2a 100%);
  border: 2px solid #5a5a7a;
  border-radius: 6px;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  cursor: pointer;
  transition: all 0.15s ease;
  overflow: hidden;
}

.game-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%);
  pointer-events: none;
}

.game-btn:hover {
  background: linear-gradient(180deg, #4a4a6a 0%, #3a3a4a 50%, #2a2a3a 100%);
  border-color: #7a7a9a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}

.game-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0,0,0,0.4);
}

/* Primary (Gold) */
.game-btn-primary {
  background: linear-gradient(180deg, #4a3a2a 0%, #3a2a1a 50%, #2a1a0a 100%);
  border-color: #8a6a3a;
  color: #ffd700;
}

.game-btn-primary:hover {
  background: linear-gradient(180deg, #5a4a3a 0%, #4a3a2a 50%, #3a2a1a 100%);
  border-color: #aa8a5a;
  box-shadow: 0 4px 12px rgba(255,215,0,0.2);
}

/* Success (Green) */
.game-btn-success {
  background: linear-gradient(180deg, #1a3a2a 0%, #0a2a1a 50%, #001a0a 100%);
  border-color: #3a6a4a;
  color: #4ade80;
}

.game-btn-success:hover {
  border-color: #5a8a6a;
  box-shadow: 0 4px 12px rgba(74,222,128,0.2);
}

/* Danger (Red) */
.game-btn-danger {
  background: linear-gradient(180deg, #4a2a2a 0%, #3a1a1a 50%, #2a0a0a 100%);
  border-color: #8a4a4a;
  color: #f87171;
}

.game-btn-danger:hover {
  border-color: #aa6a6a;
  box-shadow: 0 4px 12px rgba(248,113,113,0.2);
}

/* Magic (Purple) */
.game-btn-magic {
  background: linear-gradient(180deg, #3a2a4a 0%, #2a1a3a 50%, #1a0a2a 100%);
  border-color: #7a5a9a;
  color: #d8b4fe;
}

.game-btn-magic:hover {
  border-color: #9a7aba;
  box-shadow: 0 4px 12px rgba(216,180,254,0.2);
}

/* Disabled */
.game-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Sizes */
.game-btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.game-btn-lg {
  padding: 16px 32px;
  font-size: 16px;
}

/* Icon button */
.game-btn-icon {
  padding: 10px;
  width: 44px;
  height: 44px;
}
```

### React Component

```tsx
interface GameButtonProps {
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'magic';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function GameButton({
  variant = 'default',
  size = 'md',
  disabled = false,
  icon,
  children,
  onClick,
}: GameButtonProps) {
  const classes = [
    'game-btn',
    variant !== 'default' && `game-btn-${variant}`,
    size !== 'md' && `game-btn-${size}`,
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={disabled} onClick={onClick}>
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
}
```

---

## Modals

### Modal Structure

```css
/* Backdrop */
.game-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Modal container */
.game-modal {
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
  border: 2px solid #4a4a6a;
  border-radius: 12px;
  box-shadow:
    0 0 0 1px rgba(0,0,0,0.8),
    inset 0 1px 0 rgba(255,255,255,0.1),
    0 20px 60px rgba(0,0,0,0.8);
  max-width: 90vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  animation: modal-enter 0.3s ease-out;
}

@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Header */
.game-modal-header {
  background: linear-gradient(180deg, #2a2a4a 0%, #1a1a2e 100%);
  border-bottom: 1px solid #3a3a5a;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px 10px 0 0;
}

.game-modal-title {
  font-size: 18px;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255,215,0,0.3);
  display: flex;
  align-items: center;
  gap: 8px;
}

.game-modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  border: 1px solid #3a3a5a;
  border-radius: 6px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.15s ease;
}

.game-modal-close:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

/* Body */
.game-modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

/* Footer */
.game-modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #3a3a5a;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Variants */
.game-modal-sm { max-width: 360px; }
.game-modal-md { max-width: 480px; }
.game-modal-lg { max-width: 640px; }
.game-modal-xl { max-width: 800px; }

/* Quality-colored header */
.game-modal-header-quality {
  border-top: 3px solid var(--quality-color);
}
```

---

## Cards

### Item Card

```css
.game-card {
  background: linear-gradient(180deg, #1e1e2e 0%, #14141e 100%);
  border: 2px solid #3a3a4a;
  border-radius: 8px;
  padding: 12px;
  position: relative;
  transition: all 0.2s ease;
  cursor: pointer;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}

.game-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 20px;
  right: 20px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
}

/* Quality variants */
.game-card.quality-common {
  border-color: #6b7280;
}

.game-card.quality-rare {
  border-color: #60a5fa;
  box-shadow: 0 0 15px rgba(96,165,250,0.15);
}

.game-card.quality-epic {
  border-color: #c084fc;
  box-shadow: 0 0 15px rgba(192,132,252,0.15);
}

.game-card.quality-legendary {
  border-color: #fb923c;
  box-shadow: 0 0 20px rgba(251,146,60,0.2);
}

.game-card.quality-mythic {
  border-color: #fbbf24;
  box-shadow: 0 0 25px rgba(251,191,36,0.25);
  animation: mythic-glow 2s ease-in-out infinite;
}

@keyframes mythic-glow {
  0%, 100% { box-shadow: 0 0 25px rgba(251,191,36,0.25); }
  50% { box-shadow: 0 0 35px rgba(251,191,36,0.4); }
}

/* Card icon */
.game-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.1);
}

/* Card name */
.game-card-name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.game-card-name.quality-common { color: #9ca3af; }
.game-card-name.quality-rare { color: #60a5fa; }
.game-card-name.quality-epic { color: #c084fc; }
.game-card-name.quality-legendary { color: #fb923c; }
.game-card-name.quality-mythic { color: #fbbf24; text-shadow: 0 0 8px rgba(251,191,36,0.4); }

/* Card level badge */
.game-card-level {
  font-size: 11px;
  color: #9ca3af;
  padding: 2px 6px;
  background: rgba(0,0,0,0.3);
  border-radius: 4px;
}
```

---

## Progress Bars

### HP/MP Bars

```css
.game-progress {
  width: 100%;
  height: 20px;
  background: rgba(0,0,0,0.5);
  border: 1px solid #3a3a5a;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.game-progress-fill {
  height: 100%;
  transition: width 0.3s ease;
  position: relative;
}

.game-progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.2), transparent);
}

/* HP bar */
.game-progress-hp .game-progress-fill {
  background: linear-gradient(180deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
}

/* MP bar */
.game-progress-mp .game-progress-fill {
  background: linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%);
}

/* EXP bar */
.game-progress-exp .game-progress-fill {
  background: linear-gradient(180deg, #22c55e 0%, #16a34a 50%, #15803d 100%);
}

/* Cooldown bar */
.game-progress-cooldown .game-progress-fill {
  background: linear-gradient(180deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%);
}

/* Label */
.game-progress-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

/* Compact variant */
.game-progress-sm {
  height: 8px;
}

.game-progress-sm .game-progress-label {
  display: none;
}

/* Animated pulse for low HP */
.game-progress-hp.low .game-progress-fill {
  animation: hp-low-pulse 1s ease-in-out infinite;
}

@keyframes hp-low-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

---

## Lists & Inventory

### Item List

```css
.game-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.game-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: rgba(0,0,0,0.2);
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.game-list-item:hover {
  background: rgba(255,255,255,0.05);
  border-color: #3a3a5a;
}

.game-list-item.selected {
  background: rgba(255,215,0,0.1);
  border-color: #8a6a3a;
}

/* Inventory grid */
.game-inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
  gap: 8px;
}

.game-inventory-slot {
  aspect-ratio: 1;
  background: rgba(0,0,0,0.3);
  border: 2px solid #3a3a5a;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

.game-inventory-slot:hover {
  border-color: #5a5a7a;
  background: rgba(255,255,255,0.05);
}

.game-inventory-slot.has-item {
  border-color: var(--item-quality-color, #5a5a7a);
}

.game-inventory-slot.empty {
  opacity: 0.5;
}

/* Item count badge */
.game-item-count {
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 10px;
  font-weight: bold;
  color: #fff;
  background: rgba(0,0,0,0.7);
  padding: 1px 4px;
  border-radius: 3px;
}
```

---

## Typography

```css
/* Title styles */
.game-title {
  font-size: 24px;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255,215,0,0.3);
}

.game-subtitle {
  font-size: 16px;
  color: #9ca3af;
}

/* Stat labels */
.game-stat-label {
  font-size: 12px;
  color: #6b7280;
}

.game-stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #4ade80;
}

.game-stat-value.negative {
  color: #f87171;
}

/* Description text */
.game-description {
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.5;
}

/* Flavor text */
.game-flavor {
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
}

/* Quality text colors */
.game-text-common { color: #9ca3af; }
.game-text-rare { color: #60a5fa; }
.game-text-epic { color: #c084fc; }
.game-text-legendary { color: #fb923c; }
.game-text-mythic { color: #fbbf24; text-shadow: 0 0 8px rgba(251,191,36,0.4); }
```

---

## Tooltips

```css
.game-tooltip {
  position: absolute;
  z-index: 1100;
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
  border: 2px solid #4a4a6a;
  border-radius: 8px;
  padding: 12px 16px;
  min-width: 200px;
  max-width: 320px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.6);
  pointer-events: none;
  animation: tooltip-enter 0.15s ease-out;
}

@keyframes tooltip-enter {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.game-tooltip-title {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
}

.game-tooltip-description {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 8px;
}

.game-tooltip-stats {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 8px;
  border-top: 1px solid #3a3a5a;
}

.game-tooltip-stat {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.game-tooltip-stat-label {
  color: #6b7280;
}

.game-tooltip-stat-value {
  color: #4ade80;
}
```

---

## Tabs & Navigation

```css
.game-tabs {
  display: flex;
  gap: 4px;
  background: rgba(0,0,0,0.3);
  padding: 4px;
  border-radius: 8px;
}

.game-tab {
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #9ca3af;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.game-tab:hover {
  color: #fff;
  background: rgba(255,255,255,0.05);
}

.game-tab.active {
  background: linear-gradient(180deg, #3a3a5a 0%, #2a2a3a 100%);
  color: #ffd700;
}

/* Navigation bar */
.game-nav {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
  border-bottom: 1px solid #3a3a5a;
}

.game-nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  color: #9ca3af;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.game-nav-item:hover {
  color: #fff;
  background: rgba(255,255,255,0.05);
}

.game-nav-item.active {
  color: #ffd700;
  background: rgba(255,215,0,0.1);
}
```
