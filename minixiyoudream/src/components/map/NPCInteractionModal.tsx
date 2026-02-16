// NPC交互弹窗组件

import { useState, useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { player, playerGold } from '@/signals/playerSignals';
import {
  triggerQuestEvent,
  questProgress,
  showQuestDialog,
  acceptQuest,
  claimQuestReward,
} from '@/signals/questSignals';
import { showSuccess, showError } from '@/signals/uiSignals';
import {
  openShop,
  closeShop,
  isShopOpen,
  getCurrentShopItems,
  buyItem,
  sellItem,
  healPlayer,
  teleportToMap,
} from '@/services/npcService';
import { getShopConfig } from '@/constants/shops';
import { inventoryItems } from '@/signals/inventorySignals';
import { getItemTemplate } from '@/constants/items';
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

  // 判断是否有可用的服务/任务选项
  const hasServices =
    claimableQuests.length > 0 ||
    availableQuests.length > 0 ||
    inProgressQuests.length > 0 ||
    (npc.type === 'merchant' && npc.shopId) ||
    npc.type === 'healer' ||
    (npc.type === 'teleporter' && npc.teleportDestinations) ||
    (npc.services && npc.services.length > 0);

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
      // 如果有服务选项则显示，否则直接关闭
      if (hasServices) {
        setShowServices(true);
      } else {
        onClose();
      }
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
    showError(`功能「${service}」开发中...`);
  };

  const handleShopClick = () => {
    if (npc.shopId) {
      const success = openShop(npc.shopId);
      if (!success) {
        showError('无法打开商店');
      }
    }
  };

  const handleHealClick = () => {
    if (npc.healCost) {
      const result = healPlayer(npc.healCost);
      if (!result.success) {
        showError(result.message);
      }
    }
  };

  const handleTeleportClick = (destination: { mapId: string; name: string; cost: number }) => {
    const result = teleportToMap(destination.mapId, destination.cost);
    if (result.success) {
      onClose();
    } else {
      showError(result.message);
    }
  };

  return (
    <>
      {/* NPC交互弹窗 */}
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
                {hasMoreDialogue ? '继续' : hasServices ? '查看服务' : '结束对话'}
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
                      onClick={async () => {
                        if (!currentPlayer) return;
                        const result = await claimQuestReward(currentPlayer.id, p.quest.id);
                        if (result.success) {
                          showSuccess(`成功领取「${p.quest.name}」的奖励！`);
                        } else {
                          showError(result.message);
                        }
                      }}
                      className="w-full p-3 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 hover:bg-green-100 transition-colors border-2 border-green-300"
                    >
                      <span className="text-2xl">{p.quest.icon}</span>
                      <div className="text-left flex-1">
                        <div className="font-medium">{p.quest.name}</div>
                        <div className="text-xs text-green-600">任务已完成，点击领取奖励</div>
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
                          <div className="text-xs text-blue-600">
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
                        <div className="text-xs text-yellow-600 line-clamp-1">{p.quest.description}</div>
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
                    <div className="text-xs text-green-600">购买物品和装备</div>
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
                    <div className="text-xs text-red-600">恢复HP和MP，消除负面状态</div>
                  </div>
                  {npc.healCost && (
                    <div className="text-sm font-medium">{npc.healCost} 金币</div>
                  )}
                </button>
              )}

              {/* 传送服务 */}
              {npc.type === 'teleporter' && npc.teleportDestinations && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-indigo-700 mb-2">
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
                  <div className="text-sm font-medium text-blue-700 mb-2">
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

    {/* 商店弹窗 */}
    {isShopOpen.value && (
      <ShopModal shopId={npc.shopId!} onClose={() => closeShop()} />
    )}
  </>
  );
}

/** 品质颜色映射 */
const QUALITY_COLORS: Record<string, string> = {
  common: 'text-gray-600',
  rare: 'text-blue-600',
  epic: 'text-purple-600',
  legendary: 'text-orange-500',
};

/** 品质背景颜色映射 */
const QUALITY_BG_COLORS: Record<string, string> = {
  common: 'bg-gray-50 hover:bg-gray-100',
  rare: 'bg-blue-50 hover:bg-blue-100',
  epic: 'bg-purple-50 hover:bg-purple-100',
  legendary: 'bg-orange-50 hover:bg-orange-100',
};

/** 商店弹窗组件 */
function ShopModal({ shopId, onClose }: { shopId: string; onClose: () => void }) {
  useSignals();

  const [buyQuantity, setBuyQuantity] = useState<Record<string, number>>({});
  const [sellQuantity, setSellQuantity] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  const shop = getShopConfig(shopId);
  const shopItems = getCurrentShopItems();
  const items = inventoryItems.value;
  const gold = playerGold.value;

  // 初始化购买数量
  useEffect(() => {
    const quantities: Record<string, number> = {};
    shopItems.forEach(item => {
      quantities[item.itemTemplateId] = 1;
    });
    setBuyQuantity(quantities);
  }, [shopItems]);

  // 初始化出售数量
  useEffect(() => {
    const quantities: Record<string, number> = {};
    items.forEach(item => {
      quantities[item.id] = 1;
    });
    setSellQuantity(quantities);
  }, [items]);

  if (!shop) return null;

  const handleBuy = (itemTemplateId: string) => {
    const quantity = buyQuantity[itemTemplateId] || 1;
    buyItem(itemTemplateId, quantity);
  };

  const handleSell = (itemId: string) => {
    const quantity = sellQuantity[itemId] || 1;
    sellItem(itemId, quantity);
  };

  // 可出售的背包物品（有sellPrice的物品）
  const sellableItems = items.filter(item => {
    const template = getItemTemplate(item.templateId);
    return template && template.sellPrice && template.sellPrice > 0;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden">
        {/* 商店头部 */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">{shop.name}</h3>
              <p className="text-sm opacity-90">{shop.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                <span>💰</span>
                <span className="font-bold">{gold}</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* 标签切换 */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex-1 py-3 font-medium transition-colors ${
              activeTab === 'buy'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            购买
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`flex-1 py-3 font-medium transition-colors ${
              activeTab === 'sell'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            出售
          </button>
        </div>

        {/* 商品列表 */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          {activeTab === 'buy' ? (
            <div className="space-y-2">
              {shopItems.map((shopItem) => {
                const { template } = shopItem;
                const discount = shopItem.discount ?? 1;
                const finalPrice = Math.floor((template.buyPrice ?? 0) * discount);
                const quantity = buyQuantity[shopItem.itemTemplateId] || 1;
                const totalPrice = finalPrice * quantity;
                const canAfford = gold >= totalPrice;
                const meetsLevelReq = !shopItem.levelRequirement || (player.value && player.value.level >= shopItem.levelRequirement);

                return (
                  <div
                    key={shopItem.itemTemplateId}
                    className={`p-3 rounded-xl flex items-center gap-3 ${QUALITY_BG_COLORS[template.quality] || 'bg-gray-50'}`}
                  >
                    <span className="text-2xl">{template.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${QUALITY_COLORS[template.quality] || 'text-gray-700'}`}>
                        {template.name}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1">{template.description}</div>
                      {shopItem.levelRequirement && (
                        <div className="text-xs text-red-500">需要等级 {shopItem.levelRequirement}</div>
                      )}
                    </div>

                    {/* 数量选择 */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setBuyQuantity(prev => ({
                          ...prev,
                          [shopItem.itemTemplateId]: Math.max(1, (prev[shopItem.itemTemplateId] || 1) - 1)
                        }))}
                        className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm">{quantity}</span>
                      <button
                        onClick={() => setBuyQuantity(prev => ({
                          ...prev,
                          [shopItem.itemTemplateId]: Math.min(99, (prev[shopItem.itemTemplateId] || 1) + 1)
                        }))}
                        className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                      >
                        +
                      </button>
                    </div>

                    {/* 价格和购买按钮 */}
                    <div className="text-right">
                      <div className="text-sm font-medium text-yellow-600">{totalPrice} 金币</div>
                      {shopItem.discount && shopItem.discount < 1 && (
                        <div className="text-xs text-gray-400 line-through">
                          {Math.floor((template.buyPrice ?? 0) * quantity)} 金币
                        </div>
                      )}
                      <button
                        onClick={() => handleBuy(shopItem.itemTemplateId)}
                        disabled={!canAfford || !meetsLevelReq}
                        className={`mt-1 px-3 py-1 rounded text-xs font-medium ${
                          canAfford && meetsLevelReq
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        购买
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {sellableItems.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  没有可出售的物品
                </div>
              ) : (
                sellableItems.map((item) => {
                  const template = getItemTemplate(item.templateId);
                  if (!template) return null;

                  const buyMultiplier = shop.buyMultiplier ?? 0.5;
                  const unitPrice = Math.floor((template.sellPrice ?? 0) * buyMultiplier);
                  const quantity = sellQuantity[item.id] || 1;
                  const totalPrice = unitPrice * quantity;

                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl flex items-center gap-3 ${QUALITY_BG_COLORS[template.quality] || 'bg-gray-50'}`}
                    >
                      <span className="text-2xl">{template.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${QUALITY_COLORS[template.quality] || 'text-gray-700'}`}>
                          {template.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          持有: {item.count}
                        </div>
                      </div>

                      {/* 数量选择 */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSellQuantity(prev => ({
                            ...prev,
                            [item.id]: Math.max(1, (prev[item.id] || 1) - 1)
                          }))}
                          className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm">{quantity}</span>
                        <button
                          onClick={() => setSellQuantity(prev => ({
                            ...prev,
                            [item.id]: Math.min(item.count, (prev[item.id] || 1) + 1)
                          }))}
                          className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                        >
                          +
                        </button>
                      </div>

                      {/* 价格和出售按钮 */}
                      <div className="text-right">
                        <div className="text-sm font-medium text-yellow-600">+{totalPrice} 金币</div>
                        <button
                          onClick={() => handleSell(item.id)}
                          disabled={quantity > item.count}
                          className={`mt-1 px-3 py-1 rounded text-xs font-medium ${
                            quantity <= item.count
                              ? 'bg-blue-500 text-white hover:bg-blue-600'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          出售
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* 底部提示 */}
        <div className="p-4 border-t bg-gray-50 text-center text-xs text-gray-500">
          {shop.buyMultiplier && (
            <span>本店收购价格: {Math.floor(shop.buyMultiplier * 100)}%</span>
          )}
        </div>
      </div>
    </div>
  );
}
