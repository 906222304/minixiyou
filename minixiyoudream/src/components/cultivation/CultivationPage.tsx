// 修炼主页面组件

import { useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { returnToExplore } from '@/signals';
import {
  cultivationData,
  activeCultivationType,
  isAutoCultivating,
  currentRealmName,
  totalCultivationLevel,
  cultivationBonus,
  setActiveCultivationType,
  startAutoCultivation,
  stopAutoCultivation,
  initCultivation,
} from '@/signals/cultivationSignals';
import { CULTIVATION_TYPES, REALMS } from '@/constants/cultivation';
import { RealmBreakthrough } from './RealmBreakthrough';

/** 修炼进度卡片 */
function CultivationCard({
  type,
  isActive,
  onSelect,
}: {
  type: typeof CULTIVATION_TYPES[0];
  isActive: boolean;
  onSelect: () => void;
}) {
  useSignals();

  const data = cultivationData.value;
  const progress = data.cultivations[type.type];
  const percent = (progress.exp / progress.expToNext) * 100;

  return (
    <div
      onClick={onSelect}
      className={`
        game-card p-4 cursor-pointer transition-all duration-200
        ${isActive ? 'ring-2 ring-[var(--game-gold)] bg-[var(--game-gold)]/5' : ''}
      `}
    >
      {/* 头部 */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`
          game-icon game-icon-sm
          ${isActive ? 'ring-2 ring-[var(--game-gold)]' : ''}
        `}>
          {type.icon}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-[var(--game-text)]">{type.name}</div>
          <div className="text-xs text-[var(--game-text-muted)]">{type.description}</div>
        </div>
        <div className="text-right">
          <div className="game-tag game-tag-gold">Lv.{progress.level}</div>
        </div>
      </div>

      {/* 经验条 */}
      <div className="mb-2">
        <div className="game-progress game-progress-exp" style={{ height: '10px' }}>
          <div className="game-progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-[var(--game-text-dim)]">
          <span>{progress.exp.toLocaleString()}</span>
          <span>{progress.expToNext.toLocaleString()}</span>
        </div>
      </div>

      {/* 属性加成 */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--game-border)]">
        <span className="text-xs text-[var(--game-text-muted)]">属性加成</span>
        <span className="text-sm font-semibold text-green-600">
          +{progress.bonus}
        </span>
      </div>
    </div>
  );
}

/** 修炼加成汇总面板 */
function CultivationBonusSummary() {
  useSignals();

  const bonus = cultivationBonus.value;
  const realmName = currentRealmName.value;
  const multiplier = bonus.realmMultiplier;

  const bonusItems = [
    { type: 'strength', name: '力量', icon: '💪', value: bonus.strength },
    { type: 'intelligence', name: '灵力', icon: '🔮', value: bonus.intelligence },
    { type: 'vitality', name: '体质', icon: '❤️', value: bonus.vitality },
    { type: 'agility', name: '敏捷', icon: '💨', value: bonus.agility },
    { type: 'willpower', name: '魔力', icon: '💙', value: bonus.willpower },
  ];

  return (
    <div className="game-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--game-text-muted)] flex items-center gap-2">
          <span>📊</span>
          <span>修炼加成</span>
        </h3>
        <span className="game-tag game-tag-purple text-xs">
          {realmName} ({multiplier}倍)
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {bonusItems.map((item) => (
          <div
            key={item.type}
            className="text-center p-2 bg-[var(--game-bg-hover)]/50 rounded-lg"
          >
            <div className="text-lg mb-1">{item.icon}</div>
            <div className="text-[10px] text-[var(--game-text-dim)]">{item.name}</div>
            <div className="text-sm font-bold text-green-600">+{item.value.toFixed(0)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 修炼控制面板 */
function CultivationControl() {
  useSignals();

  const activeType = activeCultivationType.value;
  const isCultivating = isAutoCultivating.value;
  const data = cultivationData.value;
  const progress = data.cultivations[activeType];
  const typeConfig = CULTIVATION_TYPES.find(c => c.type === activeType);

  const toggleCultivation = () => {
    if (isCultivating) {
      stopAutoCultivation();
    } else {
      startAutoCultivation();
    }
  };

  return (
    <div className="game-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--game-text-muted)] flex items-center gap-2">
          <span>🧘</span>
          <span>修炼控制</span>
        </h3>
        {isCultivating && (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            修炼中
          </span>
        )}
      </div>

      {/* 当前修炼项 */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{typeConfig?.icon}</span>
          <div className="flex-1">
            <div className="font-semibold text-[var(--game-text)]">
              {typeConfig?.name}
            </div>
            <div className="text-xs text-[var(--game-text-muted)]">
              Lv.{progress.level} · 经验 {progress.exp}/{progress.expToNext}
            </div>
          </div>
        </div>

        {/* 进度条 */}
        <div className="game-progress game-progress-exp" style={{ height: '16px' }}>
          <div
            className="game-progress-fill"
            style={{ width: `${(progress.exp / progress.expToNext) * 100}%` }}
          />
          <div className="game-progress-label">
            {((progress.exp / progress.expToNext) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* 控制按钮 */}
      <button
        onClick={toggleCultivation}
        className={`
          w-full py-3 rounded-lg font-semibold transition-all duration-300
          ${isCultivating
            ? 'game-btn game-btn-danger'
            : 'game-btn game-btn-success'
          }
        `}
      >
        {isCultivating ? (
          <span className="flex items-center justify-center gap-2">
            <span>⏸️</span>
            <span>停止修炼</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>▶️</span>
            <span>开始修炼</span>
          </span>
        )}
      </button>

      <div className="mt-3 text-xs text-center text-[var(--game-text-dim)]">
        自动修炼每3秒获得5点经验
      </div>
    </div>
  );
}

/** 修炼主页面 */
export function CultivationPage() {
  useSignals();

  const activeType = activeCultivationType.value;
  const totalLevel = totalCultivationLevel.value;
  const realmName = currentRealmName.value;

  // 初始化修炼数据
  useEffect(() => {
    initCultivation();
  }, []);

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

      {/* 顶部状态栏 */}
      <div className="game-panel p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="game-icon game-icon-lg bg-gradient-to-br from-amber-100 to-orange-100">
              🧘
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--game-text)]">修炼系统</h2>
              <div className="text-xs text-[var(--game-text-muted)]">
                通过修炼获得永久属性加成
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="game-tag game-tag-gold mb-1">{realmName}</div>
            <div className="text-xs text-[var(--game-text-muted)]">
              总等级: {totalLevel}
            </div>
          </div>
        </div>
      </div>

      {/* 修炼加成汇总 */}
      <CultivationBonusSummary />

      {/* 修炼类型选择 */}
      <div className="game-panel p-4">
        <h3 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
          <span>🎯</span>
          <span>选择修炼类型</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CULTIVATION_TYPES.map((config) => (
            <CultivationCard
              key={config.type}
              type={config}
              isActive={activeType === config.type}
              onSelect={() => setActiveCultivationType(config.type)}
            />
          ))}
        </div>
      </div>

      {/* 修炼控制 */}
      <CultivationControl />

      {/* 境界突破 */}
      <RealmBreakthrough />

      {/* 修炼说明 */}
      <div className="game-panel p-4">
        <h3 className="text-sm font-semibold text-[var(--game-text-muted)] mb-3 flex items-center gap-2">
          <span>📖</span>
          <span>修炼说明</span>
        </h3>
        <div className="space-y-2 text-xs text-[var(--game-text-muted)]">
          <p>• 选择要修炼的属性类型，点击开始修炼即可自动获得经验</p>
          <p>• 修炼等级越高，获得的属性加成越多</p>
          <p>• 当总修炼等级达到要求后，可以尝试突破境界</p>
          <p>• 境界越高，修炼加成的倍率越高</p>
          <p>• 使用修炼丹药可以快速获得大量经验</p>
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--game-border)]">
          <h4 className="text-xs font-semibold text-[var(--game-text-muted)] mb-2">境界列表</h4>
          <div className="grid grid-cols-5 gap-2">
            {REALMS.map((realm) => (
              <div
                key={realm.level}
                className="text-center p-2 bg-[var(--game-bg-hover)]/30 rounded-lg"
              >
                <div className="text-[10px] text-[var(--game-text-dim)]">第{realm.level}境</div>
                <div className="text-xs font-medium text-[var(--game-text)]">{realm.name}</div>
                <div className="text-[10px] text-purple-600">{realm.bonusMultiplier}x</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CultivationPage;
