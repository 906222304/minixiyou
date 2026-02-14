// NPC交互弹窗组件

import { useState, useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { player } from '@/signals/playerSignals';
import {
  triggerQuestEvent,
  questProgress,
  showQuestDialog,
  acceptQuest,
} from '@/signals/questSignals';
import { showSuccess, showError } from '@/signals/uiSignals';
import type { NPC, NPCType } from '@/types';

/** NPC类型的中文名称 */
const NPC_TYPE_NAMES: Record<NPCType, string> = {
  merchant: '商人',
  quest: '任务发布者',
  trainer: '训练师',
  story: '剧情人物',
  healer: '治疗师',
  teleporter: '传送员',
  blacksmith: '铁匠',
  alchemist: '炼金师',
  stable: '马厩管理员',
  banker: '仓库管理员',
};

/** NPC类型的图标 */
const NPC_TYPE_ICONS: Record<NPCType, string> = {
  merchant: '🛒',
  quest: '📋',
  trainer: '📚',
  story: '📖',
  healer: '💊',
  teleporter: '✨',
  blacksmith: '🔨',
  alchemist: '⚗️',
  stable: '🐴',
  banker: '🏦',
};

interface NPCInteractionModalProps {
  npc: NPC;
  onClose: () => void;
}

export function NPCInteractionModal({ npc, onClose }: NPCInteractionModalProps) {
  useSignals();

  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showServices, setShowServices] = useState(false);
  const [hasTriggeredEvent, setHasTriggeredEvent] = useState(false);

  const currentPlayer = player.value;

  // 安全获取对话内容，防止undefined错误
  const dialogues = npc.dialogues?.default ?? ['你好，有什么可以帮助你的吗？'];
  const currentDialogue = dialogues[currentDialogueIndex];
  const hasMoreDialogue = currentDialogueIndex < dialogues.length - 1;

  // 获取此NPC可提供的任务列表
  const npcQuests = npc.questIds
    ? questProgress.value.filter(
        (p) => npc.questIds?.includes(p.quest.id)
      )
    : [];

  // 可接取的任务
  const availableQuests = npcQuests.filter((p) => p.canAccept);
  // 进行中的任务
  const inProgressQuests = npcQuests.filter(
    (p) => p.playerData.status === 'in_progress'
  );
  // 可领取的任务
  const claimableQuests = npcQuests.filter((p) => p.canClaim);

  useEffect(() => {
    // 重置对话索引
    setCurrentDialogueIndex(0);
    setShowServices(false);
    setHasTriggeredEvent(false);
  }, [npc.id]);

  const handleNextDialogue = async () => {
    if (hasMoreDialogue) {
      setCurrentDialogueIndex((prev) => prev + 1);
    } else {
      // 对话结束，触发任务事件
      if (!hasTriggeredEvent && currentPlayer) {
        setHasTriggeredEvent(true);
        await triggerQuestEvent(currentPlayer.id, {
          type: 'npc_talked',
          targetId: npc.id,
        });
      }
      // 显示服务选项
      setShowServices(true);
    }
  };

  // 接取任务
  const handleAcceptQuest = async (questId: string) => {
    if (!currentPlayer) return;

    // 先获取任务信息以显示开始对话
    const questInfo = questProgress.value.find((p) => p.quest.id === questId);

    const result = await acceptQuest(currentPlayer.id, questId);
    if (result.success) {
      // 显示任务开始对话
      if (questInfo?.quest.startDialog && questInfo.quest.startDialog.length > 0) {
        showQuestDialog(questInfo.quest.startDialog);
      } else {
        showSuccess(`接取任务「${questInfo?.quest.name}」成功！`);
      }
    } else {
      showError(result.message);
    }
  };

  const handleServiceClick = (service: string) => {
    console.log(`NPC服务: ${service}`);
    alert(`功能「${service}」开发中...`);
  };

  const handleShopClick = () => {
    if (npc.shopId) {
      alert(`商店「${npc.shopId}」功能开发中...`);
    }
  };

  const handleHealClick = () => {
    if (npc.healCost) {
      alert(`治疗功能开发中...（费用: ${npc.healCost}金币）`);
    }
  };

  const handleTeleportClick = (destination: { mapId: string; name: string; cost: number }) => {
    alert(`传送到「${destination.name}」功能开发中...（费用: ${destination.cost}金币）`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* NPC头部信息 */}
        <div className="bg-gradient-to-r from-[var(--game-primary)] to-[var(--game-secondary)] p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
              {npc.avatar}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold">{npc.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm opacity-90">
                  {NPC_TYPE_ICONS[npc.type]} {NPC_TYPE_NAMES[npc.type]}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 对话内容 */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {!showServices ? (
            <div className="space-y-4">
              {/* 对话框 */}
              <div className="bg-gray-50 rounded-xl p-4 relative">
                <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-50 transform rotate-45"></div>
                <p className="text-gray-700 leading-relaxed">{currentDialogue}</p>
              </div>

              {/* 继续按钮 */}
              <button
                onClick={handleNextDialogue}
                className="w-full py-3 bg-[var(--game-primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                {hasMoreDialogue ? '继续' : '查看服务'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* 可领取奖励的任务 */}
              {claimableQuests.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-green-600 mb-2 flex items-center gap-2">
                    <span>🎁</span>
                    <span>奖励待领取</span>
                  </div>
                  {claimableQuests.map((p) => (
                    <button
                      key={p.quest.id}
                      onClick={() => {
                        showSuccess(`请前往任务页面领取「${p.quest.name}」的奖励`);
                        onClose();
                      }}
                      className="w-full p-3 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 hover:bg-green-100 transition-colors border-2 border-green-300"
                    >
                      <span className="text-2xl">{p.quest.icon}</span>
                      <div className="text-left flex-1">
                        <div className="font-medium">{p.quest.name}</div>
                        <div className="text-xs opacity-70">任务已完成，点击领取奖励</div>
                      </div>
                      <span className="text-green-500 animate-pulse">领取</span>
                    </button>
                  ))}
                </div>
              )}

              {/* 进行中的任务 */}
              {inProgressQuests.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-blue-600 mb-2 flex items-center gap-2">
                    <span>📝</span>
                    <span>进行中的任务</span>
                  </div>
                  {inProgressQuests.map((p) => (
                    <div
                      key={p.quest.id}
                      className="w-full p-3 bg-blue-50 text-blue-700 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.quest.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{p.quest.name}</div>
                          <div className="text-xs opacity-70">
                            {p.conditionDetails.find((cd) => !cd.completed)?.condition.description || '已完成条件'}
                          </div>
                        </div>
                        <div className="text-sm font-medium">{Math.round(p.progressPercent)}%</div>
                      </div>
                      {/* 进度条 */}
                      <div className="mt-2 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${p.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 可接取的任务 */}
              {availableQuests.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-yellow-600 mb-2 flex items-center gap-2">
                    <span>📋</span>
                    <span>可接取的任务</span>
                  </div>
                  {availableQuests.map((p) => (
                    <button
                      key={p.quest.id}
                      onClick={() => handleAcceptQuest(p.quest.id)}
                      className="w-full p-3 bg-yellow-50 text-yellow-700 rounded-xl flex items-center gap-3 hover:bg-yellow-100 transition-colors"
                    >
                      <span className="text-2xl">{p.quest.icon}</span>
                      <div className="text-left flex-1">
                        <div className="font-medium">{p.quest.name}</div>
                        <div className="text-xs opacity-70 line-clamp-1">{p.quest.description}</div>
                      </div>
                      <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs font-medium">
                        接取
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* 商店服务 */}
              {npc.type === 'merchant' && npc.shopId && (
                <button
                  onClick={handleShopClick}
                  className="w-full p-3 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 hover:bg-green-100 transition-colors"
                >
                  <span className="text-2xl">🛒</span>
                  <div className="text-left">
                    <div className="font-medium">打开商店</div>
                    <div className="text-xs opacity-70">购买物品和装备</div>
                  </div>
                </button>
              )}

              {/* 治疗服务 */}
              {npc.type === 'healer' && (
                <button
                  onClick={handleHealClick}
                  className="w-full p-3 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 hover:bg-red-100 transition-colors"
                >
                  <span className="text-2xl">💊</span>
                  <div className="text-left flex-1">
                    <div className="font-medium">治疗</div>
                    <div className="text-xs opacity-70">恢复HP和MP，消除负面状态</div>
                  </div>
                  {npc.healCost && (
                    <div className="text-sm font-medium">{npc.healCost} 金币</div>
                  )}
                </button>
              )}

              {/* 传送服务 */}
              {npc.type === 'teleporter' && npc.teleportDestinations && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-[var(--game-text-muted)] mb-2">
                    选择传送目的地：
                  </div>
                  {npc.teleportDestinations.map((dest, index) => (
                    <button
                      key={index}
                      onClick={() => handleTeleportClick(dest)}
                      className="w-full p-3 bg-indigo-50 text-indigo-700 rounded-xl flex items-center gap-3 hover:bg-indigo-100 transition-colors"
                    >
                      <span className="text-2xl">✨</span>
                      <div className="text-left flex-1">
                        <div className="font-medium">{dest.name}</div>
                      </div>
                      <div className="text-sm font-medium">{dest.cost} 金币</div>
                    </button>
                  ))}
                </div>
              )}

              {/* 其他服务 */}
              {npc.services && npc.services.length > 0 && !['merchant', 'healer', 'teleporter', 'quest'].includes(npc.type) && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-[var(--game-text-muted)] mb-2">
                    可用服务：
                  </div>
                  {npc.services.map((service, index) => (
                    <button
                      key={index}
                      onClick={() => handleServiceClick(service)}
                      className="w-full p-3 bg-blue-50 text-blue-700 rounded-xl flex items-center gap-3 hover:bg-blue-100 transition-colors"
                    >
                      <span className="text-xl">📌</span>
                      <span className="font-medium">{service}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* 关闭按钮 */}
              <button
                onClick={onClose}
                className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors mt-4"
              >
                关闭
              </button>
            </div>
          )}
        </div>

        {/* NPC服务提示 */}
        {npc.services && npc.services.length > 0 && !showServices && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-1">
              {npc.services.slice(0, 3).map((service, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"
                >
                  {service}
                </span>
              ))}
              {npc.services.length > 3 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  +{npc.services.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
