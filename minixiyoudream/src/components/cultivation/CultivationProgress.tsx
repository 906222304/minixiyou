// 修炼进度组件

import { useSignals } from '@preact/signals-react/runtime';
import type { CultivationType, CultivationProgress as ICultivationProgress } from '@/types/cultivation';
import { getCultivationTypeName, getCultivationTypeIcon } from '@/types/cultivation';
import { CULTIVATION_TYPES } from '@/constants/cultivation';
import {
  activeCultivationType,
  isAutoCultivating,
  setActiveCultivationType,
  getProgressPercent,
  cultivationData,
} from '@/signals/cultivationSignals';

interface CultivationProgressProps {
  type: CultivationType;
  progress: ICultivationProgress;
  isActive: boolean;
  onSelect: () => void;
}

/** 单个修炼进度卡片 */
function CultivationProgressCard({ type, progress, isActive, onSelect }: CultivationProgressProps) {
  const config = CULTIVATION_TYPES.find(c => c.type === type);
  const percent = (progress.exp / progress.expToNext) * 100;

  return (
    <div
      onClick={onSelect}
      className={`
        game-card p-3 cursor-pointer transition-all duration-200
        ${isActive ? 'ring-2 ring-[var(--game-gold)] bg-[var(--game-gold)]/5' : ''}
      `}
    >
      {/* 头部信息 */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{config?.icon || getCultivationTypeIcon(type)}</span>
        <div className="flex-1">
          <div className="font-medium text-sm text-[var(--game-text)]">
            {config?.name || getCultivationTypeName(type)}
          </div>
          <div className="text-xs text-[var(--game-text-muted)]">
            Lv.{progress.level}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-[var(--game-gold)]">
            +{progress.bonus}
          </div>
          <div className="text-[10px] text-[var(--game-text-dim)]">
            属性加成
          </div>
        </div>
      </div>

      {/* 经验条 */}
      <div className="game-progress game-progress-exp" style={{ height: '8px' }}>
        <div className="game-progress-fill" style={{ width: `${percent}%` }} />
      </div>

      {/* 经验数值 */}
      <div className="flex justify-between mt-1 text-[10px] text-[var(--game-text-dim)]">
        <span>{progress.exp.toLocaleString()}</span>
        <span>{progress.expToNext.toLocaleString()}</span>
      </div>
    </div>
  );
}

/** 修炼进度列表 */
export function CultivationProgress() {
  useSignals();

  const currentType = activeCultivationType.value;
  const isCultivating = isAutoCultivating.value;
  const data = cultivationData.value;

  return (
    <div className="game-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--game-text-muted)] flex items-center gap-2">
          <span>🧘</span>
          <span>修炼进度</span>
        </h3>
        {isCultivating && (
          <span className="game-tag game-tag-green text-xs">
            修炼中
          </span>
        )}
      </div>

      <div className="space-y-3">
        {CULTIVATION_TYPES.map((config) => (
          <CultivationProgressCard
            key={config.type}
            type={config.type}
            progress={data.cultivations[config.type]}
            isActive={currentType === config.type}
            onSelect={() => setActiveCultivationType(config.type)}
          />
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--game-border)] text-xs text-[var(--game-text-dim)] text-center">
        点击选择要修炼的属性
      </div>
    </div>
  );
}

/** 修炼进度详情（带实时数据） */
export function CultivationProgressDetail() {
  useSignals();

  const currentType = activeCultivationType.value;
  const isCultivating = isAutoCultivating.value;

  return (
    <div className="space-y-4">
      {/* 当前修炼项高亮 */}
      <div className="game-panel p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold text-[var(--game-text-muted)]">当前修炼</span>
          {isCultivating && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CULTIVATION_TYPES.map((config) => {
            const isActive = currentType === config.type;
            const percent = getProgressPercent(config.type);

            return (
              <button
                key={config.type}
                onClick={() => setActiveCultivationType(config.type)}
                className={`
                  p-3 rounded-lg border transition-all duration-200 text-left
                  ${isActive
                    ? 'border-[var(--game-gold)] bg-[var(--game-gold)]/10 shadow-md'
                    : 'border-[var(--game-border)] bg-white hover:bg-[var(--game-bg-hover)]'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{config.icon}</span>
                  <span className="text-xs font-medium text-[var(--game-text)]">
                    {config.name}
                  </span>
                </div>
                <div className="h-1.5 bg-[var(--game-bg-hover)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CultivationProgress;
