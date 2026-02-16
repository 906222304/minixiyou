// 人物面板页面组件

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  player,
  playerHp,
  playerMp,
  playerMaxHp,
  playerMaxMp,
  playerLevel,
  playerGold,
  playerExp,
  playerAttributePoints,
  playerAllocatedPoints,
  allocateAttributePoint,
  deallocateAttributePoint,
  resetAttributePoints,
  calculateResetCost,
} from '@/signals/playerSignals';
import { showToast, showConfirm, returnToExplore } from '@/signals';
import { activePet } from '@/signals/petSignals';
import { activeCompanions } from '@/signals/companionSignals';
import { getRace } from '@/constants/races';
import { getFaction } from '@/constants/factions';
import { getTrait } from '@/constants/traits';
import { getSkill } from '@/constants/skills';
import type { EquipmentSlot, Player, LearnedSkill, Faction, Race, EquipmentSlots, Item, BaseStats } from '@/types';
import { ATTRIBUTE_EFFECTS } from '@/types';
import { EquipmentDetail } from '@/components/inventory/EquipmentDetail';
import type { Equipment } from '@/types';

const SLOT_NAMES: Record<EquipmentSlot, string> = {
  weapon: '武器',
  helmet: '头盔',
  armor: '衣服',
  boots: '鞋子',
  belt: '腰带',
  necklace: '项链',
  charm: '护符',
  ring1: '戒指1',
  ring2: '戒指2',
};

const SLOT_ICONS: Record<EquipmentSlot, string> = {
  weapon: '⚔️',
  helmet: '🪖',
  armor: '🛡️',
  boots: '👢',
  belt: '🎒',
  necklace: '📿',
  charm: '🔮',
  ring1: '💍',
  ring2: '💍',
};

const SLOT_ORDER: EquipmentSlot[] = ['weapon', 'helmet', 'armor', 'boots', 'belt', 'necklace', 'charm', 'ring1', 'ring2'];

export function CharacterPage() {
  useSignals();

  const [selectedItem, setSelectedItem] = useState<Item | Equipment | null>(null);
  const [activeTab, setActiveTab] = useState<'attributes' | 'equipment' | 'skills'>('attributes');

  const currentPlayer = player.value;
  const hp = playerHp.value;
  const mp = playerMp.value;
  const maxHp = playerMaxHp.value;
  const maxMp = playerMaxMp.value;
  const level = playerLevel.value;
  const gold = playerGold.value;
  const exp = playerExp.value;
  const currentPet = activePet.value;
  const currentCompanions = activeCompanions.value;
  const attributePoints = playerAttributePoints.value;
  const allocatedPoints = playerAllocatedPoints.value;

  // 重置属性点
  const handleResetPoints = () => {
    const cost = calculateResetCost();
    const totalAllocated = Object.values(allocatedPoints).reduce((sum, v) => sum + v, 0);

    if (totalAllocated === 0) {
      showToast('没有可重置的属性点', 'info');
      return;
    }

    showConfirm(
      `重置属性点`,
      `确定要重置所有 ${totalAllocated} 点属性吗？\n需要消耗 ${cost} 金币。`,
      () => {
        if (resetAttributePoints(cost)) {
          showToast(`成功重置 ${totalAllocated} 点属性！`, 'success');
        } else {
          showToast('金币不足，无法重置', 'error');
        }
      }
    );
  };

  if (!currentPlayer) {
    return (
      <div className="game-panel p-8 text-center">
        <span className="text-4xl block mb-4">👤</span>
        <p className="text-[var(--game-text-muted)]">暂无角色信息</p>
      </div>
    );
  }

  const race = getRace(currentPlayer.race);
  const faction = getFaction(currentPlayer.factionId);

  // 经验条计算
  const expForLevel = level * 100;
  const expPercent = (exp / expForLevel) * 100;

  const hpPercent = (hp / maxHp) * 100;
  const mpPercent = (mp / maxMp) * 100;

  return (
    <div className="space-y-4">
      {/* 返回按钮 */}
      <button
        onClick={returnToExplore}
        className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--game-text-muted)] hover:text-[var(--game-text)] active:bg-white/10 rounded-lg transition-colors touch-manipulation"
      >
        <span className="text-lg">←</span>
        <span>返回西游</span>
      </button>

      {/* 角色基本信息卡片 */}
      <div className="game-panel p-4">
        <div className="flex items-start gap-4">
          {/* 头像 */}
          <div className="game-icon game-icon-lg flex-shrink-0 text-4xl">
            {race?.icon || '👤'}
          </div>

          {/* 基本信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-[var(--game-text)] truncate">
                {currentPlayer.name}
              </h2>
              <span className="game-tag game-tag-gold text-xs">
                Lv.{level}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-[var(--game-text-muted)] mb-3">
              <span>{race?.name || '未知种族'}</span>
              <span>·</span>
              <span>{faction?.name || '未知门派'}</span>
            </div>

            {/* HP/MP 条 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs w-8">❤️ HP</span>
                <div className="flex-1 game-progress game-progress-hp" style={{ height: '12px' }}>
                  <div className="game-progress-fill" style={{ width: `${hpPercent}%` }} />
                </div>
                <span className="text-xs text-[var(--game-text-muted)] w-20 text-right">
                  {hp}/{maxHp}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-8">💙 MP</span>
                <div className="flex-1 game-progress game-progress-mp" style={{ height: '12px' }}>
                  <div className="game-progress-fill" style={{ width: `${mpPercent}%` }} />
                </div>
                <span className="text-xs text-[var(--game-text-muted)] w-20 text-right">
                  {mp}/{maxMp}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-8">⭐ EXP</span>
                <div className="flex-1 game-progress game-progress-exp" style={{ height: '12px' }}>
                  <div className="game-progress-fill" style={{ width: `${expPercent}%` }} />
                </div>
                <span className="text-xs text-[var(--game-text-muted)] w-20 text-right">
                  {exp}/{expForLevel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 金币 */}
        <div className="mt-4 pt-4 border-t border-[var(--game-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">💰</span>
            <span className="text-sm text-[var(--game-text-muted)]">金币</span>
          </div>
          <span className="font-semibold text-[var(--game-gold)]">
            {gold.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 标签页切换 */}
      <div className="flex gap-2 p-1 bg-[var(--game-bg-hover)]/50 rounded-lg">
        {(['attributes', 'equipment', 'skills'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-all duration-200
              ${activeTab === tab
                ? 'bg-[var(--game-gold)] text-white'
                : 'text-[var(--game-text-muted)] hover:text-[var(--game-text)] hover:bg-white/20'
              }
            `}
          >
            {tab === 'attributes' ? '📊 属性' : tab === 'equipment' ? '🎒 装备' : '⚡ 技能'}
          </button>
        ))}
      </div>

      {/* 标签页内容 */}
      {activeTab === 'attributes' && (
        <AttributesPanel
          player={currentPlayer}
          race={race}
          attributePoints={attributePoints}
          allocatedPoints={allocatedPoints}
          onAllocate={allocateAttributePoint}
          onDeallocate={deallocateAttributePoint}
          onReset={handleResetPoints}
        />
      )}

      {activeTab === 'equipment' && (
        <EquipmentPanel
          equipment={currentPlayer.equipment}
          onSelectItem={setSelectedItem}
        />
      )}

      {activeTab === 'skills' && (
        <SkillsPanel skills={currentPlayer.skills} faction={faction} />
      )}

      {/* 出战信息 */}
      <div className="game-panel p-4">
        <h3 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
          <span>⚔️</span>
          <span>出战阵容</span>
        </h3>

        {/* 出战宠物 */}
        <div className="mb-4">
          <div className="text-xs text-slate-600 mb-2">出战宠物</div>
          {currentPet ? (
            <div className="game-card p-4 flex items-center gap-3">
              <span className="text-2xl">{currentPet.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-[var(--game-text)]">
                  {currentPet.nickname || currentPet.name}
                </div>
                <div className="text-xs text-[var(--game-text-muted)]">
                  Lv.{currentPet.level}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500 p-4 bg-[var(--game-bg-hover)]/30 rounded-lg text-center">
              未设置出战宠物
            </div>
          )}
        </div>

        {/* 出战伙伴 */}
        <div>
          <div className="text-xs text-slate-600 mb-2">出战伙伴</div>
          {currentCompanions.length > 0 ? (
            <div className="space-y-3">
              {currentCompanions.map((companion) => (
                <div key={companion.id} className="game-card p-4 flex items-center gap-3">
                  <span className="text-2xl">{companion.avatar}</span>
                  <div className="flex-1">
                    <div className="font-medium text-[var(--game-text)]">
                      {companion.name}
                    </div>
                    <div className="text-xs text-[var(--game-text-muted)]">
                      Lv.{companion.level} · {companion.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-500 p-4 bg-[var(--game-bg-hover)]/30 rounded-lg text-center">
              未设置出战伙伴
            </div>
          )}
        </div>
      </div>

      {/* 特性 */}
      {currentPlayer.traits.length > 0 && (
        <div className="game-panel p-4">
          <h3 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
            <span>✨</span>
            <span>特性</span>
          </h3>
          <div className="space-y-2">
            {currentPlayer.traits.map((trait, index) => {
              const traitData = getTrait(trait.traitId);
              if (!traitData) return null;
              return (
                <div key={index} className="game-affix">
                  <span className="text-base">{traitData.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{traitData.name}</div>
                    <div className="text-xs text-[var(--game-text-muted)]">
                      {traitData.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 装备详情弹窗 */}
      {selectedItem && (
        <EquipmentDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

// 属性面板组件
function AttributesPanel({
  player,
  race,
  attributePoints,
  allocatedPoints,
  onAllocate,
  onDeallocate,
  onReset,
}: {
  player: Player;
  race: Race | undefined;
  attributePoints: number;
  allocatedPoints: Record<keyof BaseStats, number>;
  onAllocate: (stat: keyof BaseStats) => boolean;
  onDeallocate: (stat: keyof BaseStats) => boolean;
  onReset: () => void;
}) {
  const stats = player.finalStats;
  const hasPointsToAllocate = attributePoints > 0;
  const hasAllocatedPoints = Object.values(allocatedPoints).some(v => v > 0);

  return (
    <div className="game-panel p-4 space-y-4">
      {/* 未分配属性点提示 */}
      {hasPointsToAllocate && (
        <div className="bg-[var(--game-gold)]/10 border border-[var(--game-gold)]/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <span className="text-sm font-medium text-[var(--game-gold-dark)]">
                可分配属性点
              </span>
            </div>
            <span className="text-xl font-bold text-[var(--game-gold)]">
              {attributePoints}
            </span>
          </div>
          <p className="text-xs text-[var(--game-text-muted)] mt-1">
            升级获得属性点，可自由分配到各项属性
          </p>
        </div>
      )}

      {/* 基础属性 - 可分配 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-[var(--game-text-muted)]">基础属性</h4>
          {hasAllocatedPoints && (
            <button
              onClick={onReset}
              className="text-xs text-[var(--game-text-muted)] hover:text-[var(--game-gold)] transition-colors"
            >
              重置属性点
            </button>
          )}
        </div>
        <div className="space-y-2">
          {ATTRIBUTE_EFFECTS.map((attr) => (
            <AttributeItem
              key={attr.stat}
              attr={attr}
              value={stats[attr.stat]}
              allocated={allocatedPoints[attr.stat]}
              canAllocate={hasPointsToAllocate}
              canDeallocate={allocatedPoints[attr.stat] > 0}
              onAllocate={() => onAllocate(attr.stat)}
              onDeallocate={() => onDeallocate(attr.stat)}
            />
          ))}
        </div>
      </div>

      <div className="game-divider" />

      {/* 战斗属性 */}
      <div>
        <h4 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3">战斗属性</h4>
        <div className="grid grid-cols-2 gap-3">
          <StatItem label="物理攻击" value={stats.physicalAttack} icon="⚔️" highlight />
          <StatItem label="物理防御" value={stats.physicalDefense} icon="🛡️" highlight />
          <StatItem label="法术攻击" value={stats.magicAttack} icon="✨" highlight />
          <StatItem label="法术防御" value={stats.magicDefense} icon="🔮" highlight />
          <StatItem label="速度" value={stats.speed} icon="💨" />
          <StatItem label="暴击率" value={`${(stats.critRate * 100).toFixed(1)}%`} icon="💥" />
          <StatItem label="暴击伤害" value={`${(stats.critDamage * 100).toFixed(0)}%`} icon="💢" />
          <StatItem label="命中率" value={`${(stats.hitRate * 100).toFixed(0)}%`} icon="🎯" />
          <StatItem label="闪避率" value={`${(stats.dodgeRate * 100).toFixed(1)}%`} icon="🌀" />
        </div>
      </div>

      {/* 种族被动 */}
      {race?.passiveSkill && (
        <>
          <div className="game-divider" />
          <div>
            <h4 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3">种族天赋</h4>
            <div className="game-card p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[var(--game-gold)]">⭐</span>
                <span className="font-medium text-[var(--game-gold-dark)]">
                  {race.passiveSkill.name}
                </span>
              </div>
              <p className="text-sm text-[var(--game-text-muted)]">
                {race.passiveSkill.description}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// 可分配属性项组件
function AttributeItem({
  attr,
  value,
  allocated,
  canAllocate,
  canDeallocate,
  onAllocate,
  onDeallocate,
}: {
  attr: typeof ATTRIBUTE_EFFECTS[0];
  value: number;
  allocated: number;
  canAllocate: boolean;
  canDeallocate: boolean;
  onAllocate: () => void;
  onDeallocate: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-[var(--game-bg-hover)]/30 rounded-lg p-3">
      <div className="flex items-center justify-between">
        {/* 属性信息 */}
        <div
          className="flex items-center gap-2 flex-1 cursor-pointer"
          onClick={() => setShowDetails(!showDetails)}
        >
          <span className="text-lg">{attr.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[var(--game-text)]">{attr.name}</span>
              {allocated > 0 && (
                <span className="text-xs bg-[var(--game-gold)]/20 text-[var(--game-gold-dark)] px-1.5 py-0.5 rounded">
                  +{allocated}
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500">{attr.description}</span>
          </div>
        </div>

        {/* 属性值和分配按钮 */}
        <div className="flex items-center gap-2">
          <button
            onClick={onDeallocate}
            disabled={!canDeallocate}
            className={`
              w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold
              transition-all duration-200
              ${canDeallocate
                ? 'bg-[var(--game-border)] text-[var(--game-text)] hover:bg-red-100 hover:text-red-600 active:scale-95'
                : 'bg-[var(--game-border)]/30 text-[var(--game-text-dim)] cursor-not-allowed'
              }
            `}
          >
            -
          </button>
          <span className="w-10 text-center font-semibold text-[var(--game-text)]">
            {value}
          </span>
          <button
            onClick={onAllocate}
            disabled={!canAllocate}
            className={`
              w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold
              transition-all duration-200
              ${canAllocate
                ? 'bg-[var(--game-gold)] text-white hover:bg-[var(--game-gold-dark)] active:scale-95 shadow-sm'
                : 'bg-[var(--game-border)]/30 text-[var(--game-text-dim)] cursor-not-allowed'
              }
            `}
          >
            +
          </button>
        </div>
      </div>

      {/* 属性效果详情 */}
      {showDetails && (
        <div className="mt-2 pt-2 border-t border-[var(--game-border)]">
          <div className="flex flex-wrap gap-1">
            {attr.effects.map((effect, idx) => (
              <span
                key={idx}
                className="text-xs bg-[var(--game-bg)] px-2 py-1 rounded text-[var(--game-text-muted)]"
              >
                {effect}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 属性项组件
function StatItem({ label, value, icon, highlight = false }: {
  label: string;
  value: string | number;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg ${highlight ? 'bg-[var(--game-gold)]/5' : ''}`}>
      <span className="text-sm">{icon}</span>
      <span className="text-xs text-[var(--game-text-muted)] flex-1">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-[var(--game-gold-dark)]' : 'text-[var(--game-text)]'}`}>
        {value}
      </span>
    </div>
  );
}

// 装备面板组件
function EquipmentPanel({
  equipment,
  onSelectItem
}: {
  equipment: EquipmentSlots;
  onSelectItem: (item: Equipment) => void;
}) {
  return (
    <div className="game-panel p-4">
      <h4 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3">装备槽位</h4>
      <div className="space-y-3">
        {SLOT_ORDER.map((slot) => {
          const equip = equipment[slot];
          return (
            <div
              key={slot}
              onClick={() => equip && onSelectItem(equip)}
              className={`
                game-card p-4 flex items-center gap-3
                ${equip ? 'cursor-pointer' : 'opacity-60'}
              `}
            >
              <div className="game-icon game-icon-sm">
                {SLOT_ICONS[slot]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-600 mb-1">
                  {SLOT_NAMES[slot]}
                </div>
                {equip ? (
                  <div className="font-medium text-[var(--game-text)] truncate">
                    {equip.name}
                    {equip.enhanceLevel > 0 && (
                      <span className="text-[var(--game-gold)] ml-1">+{equip.enhanceLevel}</span>
                    )}
                  </div>
                ) : (
                  <div className="text-slate-500 text-sm">空</div>
                )}
              </div>
              {equip && (
                <span className="text-[var(--game-text-muted)] text-xs">点击查看</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 技能面板组件
function SkillsPanel({
  skills,
  faction
}: {
  skills: LearnedSkill[];
  faction: Faction | undefined;
}) {
  if (skills.length === 0) {
    return (
      <div className="game-panel p-8 text-center">
        <span className="text-4xl block mb-3">⚡</span>
        <p className="text-[var(--game-text-muted)]">尚未学习技能</p>
        <p className="text-sm text-slate-500 mt-1">
          升级后可获得技能点
        </p>
      </div>
    );
  }

  return (
    <div className="game-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-[var(--game-text-muted)]">已学技能</h4>
        {faction && (
          <span className="text-xs text-slate-500">
            {faction.shortName}门派
          </span>
        )}
      </div>
      <div className="space-y-2">
        {skills.map((learnedSkill, index) => {
          const skillData = getSkill(learnedSkill.skillId);
          if (!skillData) return null;

          return (
            <div key={index} className="game-card p-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{skillData.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--game-text)]">
                      {skillData.name}
                    </span>
                    <span className="game-tag game-tag-blue text-xs">
                      Lv.{learnedSkill.level}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--game-text-muted)] mt-1 line-clamp-2">
                    {skillData.description}
                  </p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-[var(--game-border)] flex items-center gap-4 text-xs text-slate-600">
                <span>消耗: {skillData.mpCost} MP</span>
                <span>冷却: {skillData.cooldown} 回合</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CharacterPage;
