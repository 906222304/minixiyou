// 挂机战斗控制组件

import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import {
  autoBattleEnabled,
  autoBattleStatus,
  autoBattleSettings,
  autoBattleStats,
  canAutoBattle,
  autoBattleRunTime,
  formatRunTime,
  startAutoBattle,
  stopAutoBattle,
  pauseAutoBattle,
  updateAutoBattleSettings,
  resetAutoBattleStats,
} from '@/signals/autoBattleSignals';
import { isInBattle } from '@/signals/battleSignals';
import { playerHp, playerMaxHp, playerMp, playerMaxMp } from '@/signals/playerSignals';

/** 状态图标映射 */
const STATUS_ICONS: Record<string, string> = {
  idle: '💤',
  searching: '🔍',
  battling: '⚔️',
  resting: '💤',
  stopped: '⏹️',
  dead: '💀',
};

/** 状态文本映射 */
const STATUS_TEXTS: Record<string, string> = {
  idle: '空闲',
  searching: '寻找怪物...',
  battling: '战斗中',
  resting: '休息中',
  stopped: '已停止',
  dead: '角色死亡',
};

/** 状态颜色映射 */
const STATUS_COLORS: Record<string, string> = {
  idle: 'text-gray-500',
  searching: 'text-blue-500',
  battling: 'text-red-500',
  resting: 'text-green-500',
  stopped: 'text-gray-600',
  dead: 'text-red-700',
};

export function AutoBattle() {
  useSignals();

  const [showSettings, setShowSettings] = useState(false);

  const enabled = autoBattleEnabled.value;
  const status = autoBattleStatus.value;
  const settings = autoBattleSettings.value;
  const stats = autoBattleStats.value;
  const canAuto = canAutoBattle.value;
  const runTime = autoBattleRunTime.value;
  const inBattle = isInBattle.value;

  const hpPercent = (playerHp.value / playerMaxHp.value) * 100;
  const mpPercent = (playerMp.value / playerMaxMp.value) * 100;

  // 不能挂机时显示提示
  if (!canAuto) {
    return null;
  }

  const handleToggle = () => {
    if (enabled) {
      stopAutoBattle();
    } else {
      startAutoBattle();
    }
  };

  const handlePause = () => {
    if (status === 'battling') {
      // 战斗中不能暂停
      return;
    }
    pauseAutoBattle();
  };

  return (
    <div className="game-panel p-4">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-[var(--game-gold-dark)] flex items-center gap-2">
          <span>🤖</span>
          <span>挂机打怪</span>
        </h4>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          {showSettings ? '收起' : '设置'}
        </button>
      </div>

      {/* 状态显示 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{STATUS_ICONS[status]}</span>
            <span className={`font-medium ${STATUS_COLORS[status]}`}>
              {STATUS_TEXTS[status]}
            </span>
          </div>
          {enabled && stats.startTime > 0 && (
            <span className="text-xs text-gray-500">
              运行: {formatRunTime(runTime)}
            </span>
          )}
        </div>

        {/* HP/MP 快速显示 */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">HP</span>
              <span className={hpPercent < 30 ? 'text-red-500' : ''}>
                {playerHp.value}/{playerMaxHp.value}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  hpPercent < 30 ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">MP</span>
              <span className={mpPercent < 20 ? 'text-red-500' : ''}>
                {playerMp.value}/{playerMaxMp.value}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  mpPercent < 20 ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: `${mpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex gap-2 mb-4">
        {!enabled ? (
          <button
            onClick={handleToggle}
            disabled={inBattle && status !== 'battling'}
            className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm
              bg-gradient-to-r from-green-400 to-green-500 text-white
              hover:from-green-500 hover:to-green-600
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all shadow-md hover:shadow-lg"
          >
            开始挂机
          </button>
        ) : (
          <>
            {status === 'battling' ? (
              <button
                disabled
                className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm
                  bg-gray-300 text-gray-500 cursor-not-allowed"
              >
                战斗中...
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm
                  bg-gradient-to-r from-yellow-400 to-yellow-500 text-white
                  hover:from-yellow-500 hover:to-yellow-600
                  transition-all shadow-md hover:shadow-lg"
              >
                暂停
              </button>
            )}
            <button
              onClick={handleToggle}
              className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm
                bg-gradient-to-r from-red-400 to-red-500 text-white
                hover:from-red-500 hover:to-red-600
                transition-all shadow-md hover:shadow-lg"
            >
              停止
            </button>
          </>
        )}
      </div>

      {/* 统计信息 */}
      {stats.battleCount > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-700">挂机统计</span>
            <button
              onClick={resetAutoBattleStats}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              重置
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">战斗次数:</span>
              <span className="font-medium">{stats.battleCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">击杀数:</span>
              <span className="font-medium text-red-600">{stats.killCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">获得经验:</span>
              <span className="font-medium text-green-600">{stats.totalExp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">获得金币:</span>
              <span className="font-medium text-yellow-600">{stats.totalGold}</span>
            </div>
          </div>
          {stats.totalItems.length > 0 && (
            <div className="mt-2 pt-2 border-t border-blue-100">
              <span className="text-xs text-gray-500">获得物品: </span>
              <span className="text-xs text-purple-600">
                {stats.totalItems.map(i => `${i.itemId}x${i.count}`).join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 设置面板 */}
      {showSettings && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
          <h5 className="text-xs font-bold text-gray-700">挂机设置</h5>

          {/* 自动使用药品 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">自动使用药品</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoHeal}
                onChange={(e) => updateAutoBattleSettings({ autoHeal: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer
                peer-checked:after:translate-x-full peer-checked:after:border-white
                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all
                peer-checked:bg-green-500"></div>
            </label>
          </div>

          {/* HP阈值 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">HP低于此值使用药品</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="10"
                max="50"
                value={settings.healHpThreshold}
                onChange={(e) => updateAutoBattleSettings({ healHpThreshold: Number(e.target.value) })}
                className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs font-medium w-8">{settings.healHpThreshold}%</span>
            </div>
          </div>

          {/* MP阈值 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">MP低于此值使用药品</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="10"
                max="50"
                value={settings.healMpThreshold}
                onChange={(e) => updateAutoBattleSettings({ healMpThreshold: Number(e.target.value) })}
                className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs font-medium w-8">{settings.healMpThreshold}%</span>
            </div>
          </div>

          {/* HP过低停止 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">HP过低时停止</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.stopOnHpLow}
                onChange={(e) => updateAutoBattleSettings({ stopOnHpLow: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer
                peer-checked:after:translate-x-full peer-checked:after:border-white
                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all
                peer-checked:bg-green-500"></div>
            </label>
          </div>

          {/* 停止HP阈值 */}
          {settings.stopOnHpLow && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">HP低于此值停止</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={settings.stopHpThreshold}
                  onChange={(e) => updateAutoBattleSettings({ stopHpThreshold: Number(e.target.value) })}
                  className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs font-medium w-8">{settings.stopHpThreshold}%</span>
              </div>
            </div>
          )}

          {/* 死亡后停止 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">死亡后停止</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.stopOnDeath}
                onChange={(e) => updateAutoBattleSettings({ stopOnDeath: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer
                peer-checked:after:translate-x-full peer-checked:after:border-white
                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all
                peer-checked:bg-green-500"></div>
            </label>
          </div>

          {/* 战斗间隙休息 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">战斗间隙休息</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.restBetweenBattles}
                onChange={(e) => updateAutoBattleSettings({ restBetweenBattles: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer
                peer-checked:after:translate-x-full peer-checked:after:border-white
                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all
                peer-checked:bg-green-500"></div>
            </label>
          </div>

          {/* 最大战斗次数 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">最大战斗次数</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="999"
                value={settings.maxBattles}
                onChange={(e) => updateAutoBattleSettings({ maxBattles: Number(e.target.value) })}
                className="w-16 px-2 py-1 text-xs border rounded text-center"
              />
              <span className="text-xs text-gray-400">(0=无限)</span>
            </div>
          </div>
        </div>
      )}

      {/* 提示信息 */}
      <div className="mt-3 text-xs text-gray-400 flex items-start gap-1">
        <span>💡</span>
        <span>挂机期间将自动寻找怪物并战斗。战斗结束后会自动继续，直到停止或角色死亡。</span>
      </div>
    </div>
  );
}
