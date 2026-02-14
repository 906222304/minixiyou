// 词条显示组件 - 游戏风格

import { useSignals } from '@preact/signals-react/runtime';
import { isAffixLocked } from '@/signals';
import type { Affix, ConditionalAffix, SpecialAffix, AffixRarity } from '@/types/affix';
import { isConditionalAffix, isSpecialAffix, isBaseAffix } from '@/types/affix';

interface AffixDisplayProps {
  affix: Affix;
  index: number;
  equipmentId: string;
  showLock?: boolean;
  isActive?: boolean;
  onToggleLock?: () => void;
}

/** 稀有度对应的CSS类名 */
const RARITY_CLASSES: Record<AffixRarity, string> = {
  common: 'affix-rarity-common',
  rare: 'affix-rarity-rare',
  epic: 'affix-rarity-epic',
  legendary: 'affix-rarity-legendary',
  mythic: 'affix-rarity-mythic',
};

/** 获取词条图标 */
function getAffixIcon(affix: Affix): string {
  if (isConditionalAffix(affix)) return '⚡';
  if (isSpecialAffix(affix)) return '✨';
  return '◆';
}

/** 获取词条描述 */
function getAffixDescription(affix: Affix): string {
  if (isBaseAffix(affix)) {
    const baseAffix = affix as { name: string; value: number; isPercent: boolean };
    const suffix = baseAffix.isPercent ? '%' : '';
    return `${baseAffix.name} +${baseAffix.value}${suffix}`;
  }

  if (isConditionalAffix(affix)) {
    return (affix as ConditionalAffix).description;
  }

  if (isSpecialAffix(affix)) {
    const special = affix as SpecialAffix;
    const chance = (special.trigger.chance * 100).toFixed(1);
    return `${special.description} (${chance}%)`;
  }

  return '';
}

/** 获取词条类型样式类名 */
function getAffixTypeClass(affix: Affix): string {
  if (isConditionalAffix(affix)) return 'game-affix-conditional';
  if (isSpecialAffix(affix)) return 'game-affix-special';
  return 'game-affix-basic';
}

/** 获取稀有度样式类名 */
function getRarityClass(affix: Affix): string {
  if ('rarity' in affix) {
    return RARITY_CLASSES[affix.rarity as AffixRarity];
  }
  return '';
}

export function AffixDisplay({
  affix,
  index,
  equipmentId,
  showLock = false,
  isActive = false,
  onToggleLock,
}: AffixDisplayProps) {
  useSignals();

  const isLocked = isAffixLocked(equipmentId, index);

  const containerClass = [
    'game-affix',
    getAffixTypeClass(affix),
    getRarityClass(affix),
    isLocked ? 'game-affix-locked' : '',
    isActive ? 'game-affix-active' : '',
    showLock ? 'cursor-pointer' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={containerClass}
      onClick={showLock ? onToggleLock : undefined}
    >
      {/* 词条图标 */}
      <span className="text-sm opacity-80">{getAffixIcon(affix)}</span>

      {/* 词条描述 */}
      <span className="flex-1">
        {getAffixDescription(affix)}
      </span>

      {/* 生效状态 */}
      {isActive && (
        <span className="game-tag game-tag-green text-xs">
          生效中
        </span>
      )}

      {/* 锁定图标 */}
      {showLock && (
        <span className={`text-xs ${isLocked ? 'text-yellow-400' : 'text-gray-500'}`}>
          {isLocked ? '🔒' : '🔓'}
        </span>
      )}
    </div>
  );
}

/** 词条列表组件 */
interface AffixListProps {
  affixes: Affix[];
  equipmentId: string;
  showLock?: boolean;
  activeConditionalIndices?: number[];
  onToggleLock?: (index: number) => void;
}

export function AffixList({
  affixes,
  equipmentId,
  showLock = false,
  activeConditionalIndices = [],
  onToggleLock,
}: AffixListProps) {
  if (affixes.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center py-4">
        暂无词条
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {affixes.map((affix, index) => (
        <AffixDisplay
          key={`${affix.templateId}-${index}`}
          affix={affix}
          index={index}
          equipmentId={equipmentId}
          showLock={showLock}
          isActive={activeConditionalIndices.includes(index)}
          onToggleLock={() => onToggleLock?.(index)}
        />
      ))}
    </div>
  );
}

/** 词条类型标签 */
interface AffixTypeTagProps {
  type: 'conditional' | 'special';
}

export function AffixTypeTag({ type }: AffixTypeTagProps) {
  if (type === 'conditional') {
    return (
      <span className="game-tag game-tag-gold">
        ⚡ 条件触发
      </span>
    );
  }

  return (
    <span className="game-tag game-tag-purple">
      ✨ 特殊效果
    </span>
  );
}

export default AffixDisplay;
