// 战斗状态管理

import { signal, computed } from '@preact/signals-react';
import type { BattleState, BattleFormation, CombatUnit, BattleAction, BattleLog, BattleResult, Skill, PetSkill, ActionQueueItem, Enemy, AutoBattleConfig, CompanionAIConfig } from '@/types';
import type { PetQuality, PetElement, Pet } from '@/types/pet';
import { random, randomInt } from '@/utils/prng';
import { logger } from '@/utils/logger';
import { generateUUID, DEFAULT_AUTO_BATTLE_CONFIG, DEFAULT_COMPANION_AI_CONFIG } from '@/types';
import { player, getCaptureSkillLevel, calculateCaptureRate } from './playerSignals';
import { activePet } from './petSignals';
import { activeCompanions } from './companionSignals';
import { removeItem } from './inventorySignals';
import { getSkill } from '@/constants/skills';
import { getItemTemplate } from '@/constants/items';
import { getSkillTemplate } from '@/constants/petSkills';
import { updateKillQuestEvent, updateBattleWinEvent } from './questSignals';
import { createPet, addPet, petCount, maxPets } from './petSignals';
import { getEnemyTemplate } from '@/constants/enemies';
import { getRace } from '@/constants/races';
import { calculateRacePassive, calculateDemonRageBonus, calculateCelestialMpShield } from '@/constants/formulas';

// ==================== 宠物技能ID常量 ====================
// 技能模板ID - 从petSkills.ts
const PET_SKILL_IDS = {
  // ========== 初级物理技能 ==========
  LIANJI: 'skill_lianji',           // 连击: 45%几率连续两次物理攻击，伤害降低25%
  BISHA: 'skill_bisha',             // 必杀: 必杀几率+10%
  XIXUE: 'skill_xixue',             // 吸血: 物理攻击吸取25%伤害的HP
  FANJI: 'skill_fanji',             // 反击: 受到物理攻击时30%几率反击，反击伤害50%
  FENZHEN: 'skill_fenzhen',         // 反震: 受到物理攻击时30%几率反震25%伤害
  TOUXI: 'skill_touxi',             // 偷袭: 不会受到反击和反震，攻击效果+5%
  QIANGLI: 'skill_qiangli',         // 强力: 增加等级×0.4的攻击
  HEZONG: 'skill_hezong',           // 合纵: 本方每有一种与其不同的召唤兽，提高等级/5.5的物理伤害
  YIZHI: 'skill_yizhi',             // 遗志: 替代原召唤兽时造成伤害提升5%

  // ========== 初级防御技能 ==========
  FANGYU: 'skill_fangyu',           // 防御: 增加等级×0.6的防御
  ZHAOJIA: 'skill_zhaojia',         // 招架: 15%几率完全躲过物理攻击
  XINGYUN: 'skill_xingyun',         // 幸运: 不会受到必杀攻击
  DUNQI: 'skill_dunqi',             // 盾气: 第2回合起增加等级×1防御，每回合减少等级×0.2
  ZHUOZHUANG: 'skill_zhuozhuang',   // 茁壮: 提升25%最大生命值(木属性)
  FASHUDIKANG: 'skill_fashudikang', // 法术抵抗: 减少5%法术伤害，物理伤害减少10%
  FASHUFENZHEN: 'skill_fashufenzhen', // 法术反震: 受法术攻击时30%反震25%伤害

  // ========== 初级速度技能 ==========
  FEIXING: 'skill_feixing',         // 飞行: 躲避+20%，躲避率+5%，命中+20%
  MINJIE: 'skill_minjie',           // 敏捷: 速度+10%
  CHIDUN: 'skill_chidun',           // 迟钝: 速度-20% (弱点技能)

  // ========== 初级辅助技能 ==========
  YEZHAN: 'skill_yezhan',           // 夜战: 不受夜间攻击能力下降影响
  GANJING: 'skill_ganjing',         // 感知: 破解隐身
  YINSHEN: 'skill_yinshen',         // 隐身: 自动附加修罗隐身2-3回合
  ZAISHENG: 'skill_zaisheng',       // 再生: 每回合恢复等级/2的气血
  MINSI: 'skill_minsi',             // 冥思: 每回合恢复等级/4的魔法
  HUIGEN: 'skill_huigen',           // 慧根: 法术消耗魔法降低为75%
  SHENGJI: 'skill_shengji',         // 神迹: 每回合结束自动解除异常状态
  YONGHENG: 'skill_yongheng',       // 永恒: 辅助类法术持续回合加倍
  JINGSHENJIZHONG: 'skill_jingshenjizhong', // 精神集中: 抵御封类异常，物理攻击-20%

  // ========== 初级特殊技能 ==========
  DU: 'skill_du',                   // 毒: 物理攻击15%几率使敌人中毒
  QUGUI: 'skill_qugui',             // 驱鬼: 对鬼魂类伤害+50%
  GUIHUN: 'skill_guihun',           // 鬼魂术: 死亡5回合后自动复活
  SHENYOUFUSHENG: 'skill_shenyoufusheng', // 神佑复生: 死亡时20%几率复活
  FOUDINGXINYANG: 'skill_foudingxinyang', // 否定信仰: 不受异常、辅助效果影响

  // ========== 初级法术技能 ==========
  MOZHIXIN: 'skill_mozhixin',       // 魔之心: 法术伤害+10%
  FASHULIANJI: 'skill_fashulianji', // 法术连击: 法术攻击有几率连续2次
  FASHUBAOJI: 'skill_fashubaoji',   // 法术暴击: 法术攻击有几率暴击
  FASHUBODONG: 'skill_fashubodong', // 法术波动: 法术伤害大幅波动

  // ========== 弱点技能 ==========
  RUODIANLEI: 'skill_ruodianlei',   // 弱点雷: 受雷属性法术伤害+50%
  RUODIANTU: 'skill_ruodiantu',     // 弱点土: 受土属性法术伤害+50%
  RUODIANSHUI: 'skill_ruodianshui', // 弱点水: 受水属性法术伤害+50%
  RUODIANHUO: 'skill_ruodianhuo',   // 弱点火: 受火属性法术伤害+50%

  // ========== 属性吸收技能 ==========
  LEISHUXINGXISHOU: 'skill_leishuxingxishou', // 雷属性吸收: 50%免受雷属性伤害并恢复
  TUSHUXINGXISHOU: 'skill_tushuxingxishou',   // 土属性吸收: 50%免受土属性伤害并恢复
  HUOSHUXINGXISHOU: 'skill_huoshuxingxishou', // 火属性吸收: 50%免受火属性伤害并恢复
  SHUISHUXINGXISHOU: 'skill_shuishuxingxishou', // 水属性吸收: 50%免受水属性伤害并恢复

  // ========== 高级物理技能 ==========
  GJ_LIANJI: 'skill_gj_lianji',     // 高级连击: 55%几率连续两次物理攻击
  GJ_BISHA: 'skill_gj_bisha',       // 高级必杀: 必杀几率+20%
  GJ_XIXUE: 'skill_gj_xixue',       // 高级吸血: 物理攻击吸取30%伤害的HP
  GJ_FANJI: 'skill_gj_fanji',       // 高级反击: 受到物理攻击时30%几率反击，反击伤害100%
  GJ_FENZHEN: 'skill_gj_fenzhen',   // 高级反震: 受到物理攻击时30%几率反震50%伤害
  GJ_TOUXI: 'skill_gj_touxi',       // 高级偷袭: 不会受到反击和反震，攻击效果+10%
  GJ_QIANGLI: 'skill_gj_qiangli',   // 高级强力: 增加等级×0.55的攻击
  GJ_YEZHAN: 'skill_gj_yezhan',     // 高级夜战: 夜间躲避能力提高20%
  GJ_HEZONG: 'skill_gj_hezong',     // 高级合纵: 本方每有一种与其不同的召唤兽，提高等级/4的物理伤害
  GJ_YIZHI: 'skill_gj_yizhi',       // 高级遗志: 替代原召唤兽时造成伤害提升10%

  // ========== 高级防御技能 ==========
  GJ_FANGYU: 'skill_gj_fangyu',     // 高级防御: 增加等级×0.8的防御
  GJ_ZHAOJIA: 'skill_gj_zhaojia',   // 高级招架: 每回合受到的物理伤害减免20%
  GJ_XINGYUN: 'skill_gj_xingyun',   // 高级幸运: 不会受到必杀攻击，5%几率躲避法术
  GJ_DUNQI: 'skill_gj_dunqi',       // 高级盾气: 第2回合起增加等级×2防御
  XINXINXIANGRONG: 'skill_xinxinxiangrong', // 欣欣向荣: 提升40%最大生命值(木属性)
  GJ_FASHUDIKANG: 'skill_gj_fashudikang', // 高级法术抵抗: 减少10%法术伤害
  YIHUAJIEMU: 'skill_yihuajiemu',   // 移花接木: 躲避暗器伤害并恢复30%HP

  // ========== 高级速度技能 ==========
  GJ_FEIXING: 'skill_gj_feixing',   // 高级飞行: 躲避+30%，躲避率+10%，命中+20%
  GJ_MINJIE: 'skill_gj_minjie',     // 高级敏捷: 速度+20%

  // ========== 高级辅助技能 ==========
  GJ_GANJING: 'skill_gj_ganjing',   // 高级感知: 破解隐身，躲避能力提高10%
  GJ_YINSHEN: 'skill_gj_yinshen',   // 高级隐身: 自动附加修罗隐身3-5回合
  GJ_ZAISHENG: 'skill_gj_zaisheng', // 高级再生: 每回合恢复等级的气血
  GJ_MINSI: 'skill_gj_minsi',       // 高级冥思: 每回合恢复等级/3的魔法
  GJ_HUIGEN: 'skill_gj_huigen',     // 高级慧根: 法术消耗魔法降低为50%
  GJ_SHENGJI: 'skill_gj_shengji',   // 高级神迹: 不受除日月乾坤外所有异常状态影响
  GJ_YONGHENG: 'skill_gj_yongheng', // 高级永恒: 辅助类法术持续回合×4
  GJ_JINGSHENJIZHONG: 'skill_gj_jingshenjizhong', // 高级精神集中: 抵御封类异常，躲避力+10%
  GJ_DUXING: 'skill_gj_duxing',     // 高级独行: 抵抗封印能力+50%

  // ========== 高级特殊技能 ==========
  GJ_DU: 'skill_gj_du',             // 高级毒: 免疫毒，物理攻击20%几率使敌人中毒
  GJ_QUGUI: 'skill_gj_qugui',       // 高级驱鬼: 对鬼魂类伤害+100%
  GJ_GUIHUN: 'skill_gj_guihun',     // 高级鬼魂术: 死亡5回合后自动复活
  GJ_SHENYOUFUSHENG: 'skill_gj_shenyoufusheng', // 高级神佑复生: 死亡时30%几率复活
  GJ_FOUDINGXINYANG: 'skill_gj_foudingxinyang', // 高级否定信仰: 受法术伤害减少20%

  // ========== 高级法术技能 ==========
  GJ_MOZHIXIN: 'skill_gj_mozhixin', // 高级魔之心: 法术伤害+20%
  GJ_FASHULIANJI: 'skill_gj_fashulianji', // 高级法术连击
  GJ_FASHUBAOJI: 'skill_gj_fashubaoji',   // 高级法术暴击
  GJ_FASHUBODONG: 'skill_gj_fashubodong', // 高级法术波动

  // ========== 高级属性吸收技能 ==========
  GJ_LEISHUXINGXISHOU: 'skill_gj_leishuxingxishou', // 高级雷属性吸收
  GJ_TUSHUXINGXISHOU: 'skill_gj_tushuxingxishou',   // 高级土属性吸收
  GJ_HUOSHUXINGXISHOU: 'skill_gj_huoshuxingxishou', // 高级火属性吸收
  GJ_SHUISHUXINGXISHOU: 'skill_gj_shuishuxingxishou', // 高级水属性吸收

  // ========== 特殊技能 ==========
  HAHAOYUEYUAN: 'skill_hahaoyueyuan',     // 花好月圆: 25%几率恢复等级×8气血
  TIANHUZHIWU: 'skill_tianhuzhiwu',       // 天狐之舞: 阵亡后恢复20%气血并提升伤害
  CHUQIZHISHENG: 'skill_chuqizhisheng',   // 出奇制胜: 第二回合入场首次法术伤害+25%
  CHUQIBUYI: 'skill_chuqibuyi',           // 出其不意: 使用未使用过的技能伤害+15%
  SIWANGZHAOHUAN: 'skill_siwangzhaohuan', // 死亡召唤: 10%几率附加死亡禁锢
  SHANE_YOUBAO: 'skill_shane_youbao',     // 善恶有报: 有几率双倍伤害或恢复对方气血
  BILEIJIPO: 'skill_bileijipo',           // 壁垒击破: 忽视防御攻击
  SHIXUEZHUIJI: 'skill_shixuezhuiji',     // 嗜血追击: 击倒目标后继续攻击另一个目标
  XUMIZHENYAN: 'skill_xumizhenyan',       // 须弥真言: 增加魔力×0.4的法术伤害
  JINGTAI_MIAODI: 'skill_jingtai_miaodi', // 净台妙谛: 增加体质×成长×2的气血
  FENGQILONGYOU: 'skill_fengqilongyou',   // 风起龙游: 攻击速度低于自身目标伤害+10%
  FASHUFANGYU: 'skill_fashufangyu',       // 法术防御: 减少65%法术伤害

  // ========== 超级技能(神兽专属) ==========
  CJ_YEZHAN: 'skill_cj_yezhan',           // 超级夜战: 物理伤害+10%，夜间躲避+20%
  CJ_FANJI: 'skill_cj_fanji',             // 超级反击: 30%反击，主人首次被攻击必反击
  CJ_FENZHEN: 'skill_cj_fenzhen',         // 超级反震: 30%反震60%伤害
  CJ_XIXUE: 'skill_cj_xixue',             // 超级吸血: 吸取30%气血，溢出转化为护盾
  CJ_LIANJI: 'skill_cj_lianji',           // 超级连击: 55%几率2次，触发时有15%额外攻击
  CJ_FEIXING: 'skill_cj_feixing',         // 超级飞行: 命中+20%，躲避+30%
  CJ_YINSHEN: 'skill_cj_yinshen',         // 超级隐身: 3-5回合隐身，不受攻击
  CJ_GANJING: 'skill_cj_ganjing',         // 超级感知: 破解隐身，躲避+10%
  CJ_ZAISHENG: 'skill_cj_zaisheng',       // 超级再生: 每回合恢复等级×1气血，10%几率恢复等级×12
  CJ_MINSI: 'skill_cj_minsi',             // 超级冥思: 每回合恢复等级/2魔法
  CJ_QUGUI: 'skill_cj_qugui',             // 超级驱鬼: 对鬼魂类伤害+100%
  CJ_DU: 'skill_cj_du',                   // 超级毒: 免疫毒，20%几率使敌人中毒并降低属性
  CJ_HUIGEN: 'skill_cj_huigen',           // 超级慧根: 法术消耗50%，15%几率不消耗
  CJ_BISHA: 'skill_cj_bisha',             // 超级必杀: 必杀+20%，25%几率3-4倍伤害
  CJ_XINGYUN: 'skill_cj_xingyun',         // 超级幸运: 暴击倍率降低50%，5%免疫攻击
  CJ_SHENGJI: 'skill_cj_shengji',         // 超级神迹: 免疫异常，可复活主人
  CJ_ZHAOJIA: 'skill_cj_zhaojia',         // 超级招架: 第一次物理伤害减免20%，获得金身
  CJ_MINJIE: 'skill_cj_minjie',           // 超级敏捷: 速度+20%，5%概率额外行动
  CJ_MOZHIXIN: 'skill_cj_mozhixin',       // 超级魔之心: 法术伤害+25%
  CJ_TOUXI: 'skill_cj_touxi',             // 超级偷袭: 免疫反击反震，物理伤害+15%
  CJ_QIANGLI: 'skill_cj_qiangli',         // 超级强力: 攻击+等级×0.7
  CJ_FANGYU: 'skill_cj_fangyu',           // 超级防御: 防御+等级×1
  CJ_FASHULIANJI: 'skill_cj_fashulianji', // 超级法术连击: 30%几率2次
  CJ_FASHUBAOJI: 'skill_cj_fashubaoji',   // 超级法术暴击: 20%暴击，10%几率3-4倍
  CJ_FASHUBODONG: 'skill_cj_fashubodong', // 超级法术波动: 免疫法术反震
  CJ_BILEIJIPO: 'skill_cj_bileijipo',     // 超级壁垒击破: 忽视等级×1.2的防御
} as const;

// ==================== 宠物技能辅助函数 ====================

/** 获取单位的宠物技能列表（如果是宠物类型） */
function getUnitPetSkills(unit: CombatUnit): PetSkill[] {
  // 检查单位是否是宠物，并且ref中包含完整宠物信息
  if (unit.type === 'pet') {
    const petRef = unit.ref as Pet | undefined;
    if (petRef && petRef.skills) {
      return petRef.skills;
    }
  }
  return [];
}

/** 检查宠物是否有某个技能（包括被动技能） */
function petHasSkill(unit: CombatUnit, skillTemplateId: string): boolean {
  const petSkills = getUnitPetSkills(unit);
  return petSkills.some(s => s.templateId === skillTemplateId);
}

/** 检查宠物是否有某个技能或其高级版本（高级技能优先） */
function petHasSkillOrAdvanced(unit: CombatUnit, basicId: string, advancedId: string): { has: boolean; isAdvanced: boolean } {
  const hasAdvanced = petHasSkill(unit, advancedId);
  if (hasAdvanced) {
    return { has: true, isAdvanced: true };
  }
  const hasBasic = petHasSkill(unit, basicId);
  return { has: hasBasic, isAdvanced: false };
}

/** 获取宠物技能等级 */
export function getPetSkillLevel(unit: CombatUnit, skillTemplateId: string): number {
  const petSkills = getUnitPetSkills(unit);
  const skill = petSkills.find(s => s.templateId === skillTemplateId);
  return skill?.level || 0;
}

/** 获取宠物等级（用于技能效果计算） */
function getPetLevel(unit: CombatUnit): number {
  if (unit.type === 'pet') {
    const petRef = unit.ref as Pet | undefined;
    if (petRef) {
      return petRef.level || 1;
    }
  }
  return 1;
}

/** 检查宠物是否有某个技能的任一版本（初级/高级/超级） */
function petHasSkillAnyTier(unit: CombatUnit, basicId: string, advancedId: string, superId: string): { has: boolean; tier: 'basic' | 'advanced' | 'super' | 'none' } {
  if (petHasSkill(unit, superId)) return { has: true, tier: 'super' };
  if (petHasSkill(unit, advancedId)) return { has: true, tier: 'advanced' };
  if (petHasSkill(unit, basicId)) return { has: true, tier: 'basic' };
  return { has: false, tier: 'none' };
}

/** 计算宠物战斗属性（包含被动技能加成） */
function calculatePetBattleStats(pet: Pet): Pet['stats'] {
  const stats = { ...pet.stats };
  const petLevel = pet.level || 1;
  const unit = { type: 'pet', ref: pet } as CombatUnit;

  // ========== 速度技能 ==========
  // 敏捷: 速度+10%/+20%/+20%
  const minjieResult = petHasSkillAnyTier(unit, PET_SKILL_IDS.MINJIE, PET_SKILL_IDS.GJ_MINJIE, PET_SKILL_IDS.CJ_MINJIE);
  if (minjieResult.has) {
    const speedBonus = minjieResult.tier === 'super' ? 0.20 : minjieResult.tier === 'advanced' ? 0.20 : 0.10;
    stats.speed = Math.floor(stats.speed * (1 + speedBonus));
  }

  // 迟钝: 速度-20%
  if (petHasSkill(unit, PET_SKILL_IDS.CHIDUN)) {
    stats.speed = Math.floor(stats.speed * 0.80);
  }

  // ========== 攻击技能 ==========
  // 强力: 增加(等级×0.4/0.55/0.7)的攻击
  const qiangliResult = petHasSkillAnyTier(unit, PET_SKILL_IDS.QIANGLI, PET_SKILL_IDS.GJ_QIANGLI, PET_SKILL_IDS.CJ_QIANGLI);
  if (qiangliResult.has) {
    const atkBonus = qiangliResult.tier === 'super' ? 0.7 : qiangliResult.tier === 'advanced' ? 0.55 : 0.4;
    stats.physicalAttack += Math.floor(petLevel * atkBonus);
  }

  // ========== 防御技能 ==========
  // 防御: 增加(等级×0.6/0.8/1)的防御
  const fangyuResult = petHasSkillAnyTier(unit, PET_SKILL_IDS.FANGYU, PET_SKILL_IDS.GJ_FANGYU, PET_SKILL_IDS.CJ_FANGYU);
  if (fangyuResult.has) {
    const defBonus = fangyuResult.tier === 'super' ? 1.0 : fangyuResult.tier === 'advanced' ? 0.8 : 0.6;
    stats.physicalDefense += Math.floor(petLevel * defBonus);
    // 防御技能副作用：法术伤害能力降低10%
    stats.magicAttack = Math.floor(stats.magicAttack * 0.90);
  }

  // ========== 躲避和命中 ==========
  // 飞行: 躲避能力+20%/+30%，躲避率+5%/+10%，命中+20%
  const feixingResult = petHasSkillAnyTier(unit, PET_SKILL_IDS.FEIXING, PET_SKILL_IDS.GJ_FEIXING, PET_SKILL_IDS.CJ_FEIXING);
  if (feixingResult.has) {
    const dodgeBonus = feixingResult.tier === 'super' ? 0.10 : feixingResult.tier === 'advanced' ? 0.10 : 0.05;
    stats.dodgeRate = Math.min(0.5, stats.dodgeRate + dodgeBonus);
    stats.hitRate = Math.min(1.0, stats.hitRate + 0.20);
  }

  // 高级/超级感知: 躲避能力+10%
  const ganjingResult = petHasSkillAnyTier(unit, PET_SKILL_IDS.GANJING, PET_SKILL_IDS.GJ_GANJING, PET_SKILL_IDS.CJ_GANJING);
  if (ganjingResult.has && ganjingResult.tier !== 'basic') {
    stats.dodgeRate = Math.min(0.5, stats.dodgeRate + 0.10);
  }

  // 高级精神集中: 躲避力+10%
  const jingshenResult = petHasSkillOrAdvanced(unit, PET_SKILL_IDS.JINGSHENJIZHONG, PET_SKILL_IDS.GJ_JINGSHENJIZHONG);
  if (jingshenResult.has && jingshenResult.isAdvanced) {
    stats.dodgeRate = Math.min(0.5, stats.dodgeRate + 0.10);
  }

  // ========== 攻击力惩罚技能 ==========
  // 精神集中: 物理攻击效果降低20%
  if (jingshenResult.has) {
    stats.physicalAttack = Math.floor(stats.physicalAttack * 0.80);
  }

  // 隐身: 物理攻击能力降低20%/15%/10%
  const yinshenResult = petHasSkillAnyTier(unit, PET_SKILL_IDS.YINSHEN, PET_SKILL_IDS.GJ_YINSHEN, PET_SKILL_IDS.CJ_YINSHEN);
  if (yinshenResult.has) {
    const atkPenalty = yinshenResult.tier === 'super' ? 0.10 : yinshenResult.tier === 'advanced' ? 0.15 : 0.20;
    stats.physicalAttack = Math.floor(stats.physicalAttack * (1 - atkPenalty));
  }

  // 法术抵抗: 物理伤害能力减少10%
  const fashudikangResult = petHasSkillAnyTier(unit, PET_SKILL_IDS.FASHUDIKANG, PET_SKILL_IDS.GJ_FASHUDIKANG, PET_SKILL_IDS.GJ_FASHUDIKANG);
  if (fashudikangResult.has) {
    stats.physicalAttack = Math.floor(stats.physicalAttack * 0.90);
  }

  // ========== 生命值加成 ==========
  // 茁壮: 提升25%最大生命值（木属性）
  if (petHasSkill(unit, PET_SKILL_IDS.ZHUOZHUANG) && pet.element === 'wood') {
    stats.maxHp = Math.floor(stats.maxHp * 1.25);
  }

  // 欣欣向荣: 提升40%最大生命值（木属性）
  if (petHasSkill(unit, PET_SKILL_IDS.XINXINXIANGRONG) && pet.element === 'wood') {
    stats.maxHp = Math.floor(stats.maxHp * 1.40);
  }

  // 净台妙谛: 增加体质×成长×2的气血
  if (petHasSkill(unit, PET_SKILL_IDS.JINGTAI_MIAODI)) {
    // 使用资质作为体质的近似值
    const constitution = pet.aptitude.hp / 100;
    const growth = pet.growthRate;
    stats.maxHp += Math.floor(constitution * growth * 2);
  }

  // ========== 法术相关 ==========
  // 须弥真言: 增加魔力×0.4的法术伤害
  if (petHasSkill(unit, PET_SKILL_IDS.XUMIZHENYAN)) {
    // 使用法力资质作为魔力的近似值
    const magic = pet.aptitude.mp / 100;
    stats.magicAttack += Math.floor(magic * 0.4);
  }

  return stats;
}

/** 处理回合开始时的被动技能效果 */
function processRoundStartPassives(unit: CombatUnit, _round: number): { hpRegen: number; mpRegen: number; messages: string[] } {
  const result = { hpRegen: 0, mpRegen: 0, messages: [] as string[] };
  const petLevel = getPetLevel(unit);

  // ========== 回合恢复技能 ==========
  // 再生: 每回合恢复(等级/2/1/1)的气血，超级有10%几率恢复等级×12
  const zaishengResult = petHasSkillAnyTier(unit, PET_SKILL_IDS.ZAISHENG, PET_SKILL_IDS.GJ_ZAISHENG, PET_SKILL_IDS.CJ_ZAISHENG);
  if (zaishengResult.has) {
    let hpRegen = 0;
    if (zaishengResult.tier === 'super') {
      hpRegen = petLevel; // 基础恢复
      if (Math.random() < 0.10) {
        hpRegen = petLevel * 12; // 10%几率大幅恢复
        result.messages.push(`超级再生触发！恢复${hpRegen}气血`);
      } else {
        result.messages.push(`再生恢复${hpRegen}气血`);
      }
    } else if (zaishengResult.tier === 'advanced') {
      hpRegen = petLevel;
    } else {
      hpRegen = Math.floor(petLevel / 2);
    }
    result.hpRegen += hpRegen;
  }

  // 冥思: 每回合恢复(等级/4/3/2)的魔法
  const minsiResult = petHasSkillAnyTier(unit, PET_SKILL_IDS.MINSI, PET_SKILL_IDS.GJ_MINSI, PET_SKILL_IDS.CJ_MINSI);
  if (minsiResult.has) {
    let mpRegen = 0;
    if (minsiResult.tier === 'super') {
      mpRegen = Math.floor(petLevel / 2);
    } else if (minsiResult.tier === 'advanced') {
      mpRegen = Math.floor(petLevel / 3);
    } else {
      mpRegen = Math.floor(petLevel / 4);
    }
    result.mpRegen += mpRegen;
  }

  // 花好月圆: 25%几率恢复等级×8气血
  if (petHasSkill(unit, PET_SKILL_IDS.HAHAOYUEYUAN)) {
    if (Math.random() < 0.25) {
      const healAmount = petLevel * 8;
      result.hpRegen += healAmount;
      result.messages.push(`花好月圆触发！恢复${healAmount}气血`);
    }
  }

  return result;
}

/** 处理回合结束时的被动技能效果 */
function processRoundEndPassives(unit: CombatUnit): { clearStatus: boolean; messages: string[] } {
  const result = { clearStatus: false, messages: [] as string[] };

  // 神迹: 每回合结束自动解除一切异常状态
  const shengjiResult = petHasSkillAnyTier(unit, PET_SKILL_IDS.SHENGJI, PET_SKILL_IDS.GJ_SHENGJI, PET_SKILL_IDS.CJ_SHENGJI);
  if (shengjiResult.has && unit.statusEffects.length > 0) {
    result.clearStatus = true;
    result.messages.push('神迹效果：解除所有异常状态');
  }

  return result;
}

/** 检查单位是否免疫某种状态效果 */
export function isImmuneToStatus(unit: CombatUnit, statusType: string): boolean {
  // 神迹: 免疫除日月乾坤外的所有异常状态
  const shengjiResult = petHasSkillAnyTier(unit, PET_SKILL_IDS.SHENGJI, PET_SKILL_IDS.GJ_SHENGJI, PET_SKILL_IDS.CJ_SHENGJI);
  if (shengjiResult.has && statusType !== 'seal') {
    return true;
  }

  // 精神集中: 抵御封类异常状态
  const jingshenResult = petHasSkillOrAdvanced(unit, PET_SKILL_IDS.JINGSHENJIZHONG, PET_SKILL_IDS.GJ_JINGSHENJIZHONG);
  if (jingshenResult.has && (statusType === 'seal' || statusType === 'silence')) {
    return true;
  }

  // 高级独行: 抵抗封印的能力提高50%
  if (petHasSkill(unit, PET_SKILL_IDS.GJ_DUXING) && statusType === 'seal') {
    // 这里只返回是否免疫，具体抵抗概率在别处处理
    return false; // 不完全免疫，但提高抗性
  }

  // 否定信仰: 不受异常、辅助效果影响
  const foudingResult = petHasSkillOrAdvanced(unit, PET_SKILL_IDS.FOUDINGXINYANG, PET_SKILL_IDS.GJ_FOUDINGXINYANG);
  if (foudingResult.has && (statusType !== 'none')) {
    return true;
  }

  // 高级毒: 自身对毒免疫
  const duResult = petHasSkillAnyTier(unit, PET_SKILL_IDS.DU, PET_SKILL_IDS.GJ_DU, PET_SKILL_IDS.CJ_DU);
  if (duResult.has && duResult.tier !== 'basic' && statusType === 'poison') {
    return true;
  }

  // 鬼魂术: 不受异常状态影响
  const guihunResult = petHasSkillAnyTier(unit, PET_SKILL_IDS.GUIHUN, PET_SKILL_IDS.GJ_GUIHUN, PET_SKILL_IDS.GJ_GUIHUN);
  if (guihunResult.has && statusType !== 'none') {
    return true;
  }

  return false;
}

/** 计算MP消耗减免 */
export function calculateMpCostReduction(unit: CombatUnit, baseCost: number): { cost: number; message?: string } {
  // 慧根: 法术消耗降低为75%/50%/50%
  const huigenResult = petHasSkillAnyTier(unit, PET_SKILL_IDS.HUIGEN, PET_SKILL_IDS.GJ_HUIGEN, PET_SKILL_IDS.CJ_HUIGEN);
  if (huigenResult.has) {
    let costMultiplier = huigenResult.tier === 'basic' ? 0.75 : 0.50;

    // 超级慧根: 15%几率不消耗
    if (huigenResult.tier === 'super' && Math.random() < 0.15) {
      return { cost: 0, message: '超级慧根触发！不消耗魔法' };
    }

    return { cost: Math.floor(baseCost * costMultiplier) };
  }

  return { cost: baseCost };
}

/** 计算物理伤害加成/减免 */
export function calculatePhysicalDamageModifiers(
  attacker: CombatUnit,
  defender: CombatUnit,
  baseDamage: number
): { damage: number; canBeCountered: boolean; messages: string[] } {
  const result = { damage: baseDamage, canBeCountered: true, messages: [] as string[] };
  const attackerLevel = getPetLevel(attacker);

  // ========== 攻击方加成 ==========
  // 偷袭: 攻击效果+5%/+10%/+15%，免疫反击反震
  const touxiResult = petHasSkillAnyTier(attacker, PET_SKILL_IDS.TOUXI, PET_SKILL_IDS.GJ_TOUXI, PET_SKILL_IDS.CJ_TOUXI);
  if (touxiResult.has) {
    const damageBonus = touxiResult.tier === 'super' ? 0.15 : touxiResult.tier === 'advanced' ? 0.10 : 0.05;
    result.damage = Math.floor(result.damage * (1 + damageBonus));
    result.canBeCountered = false;
    result.messages.push(`偷袭效果：伤害+${damageBonus * 100}%，免疫反击`);
  }

  // 合纵: 本方每有一种与其不同的召唤兽，提高等级/5.5/4的物理伤害
  // 简化实现：假设有2只不同召唤兽
  const hezongResult = petHasSkillAnyTier(attacker, PET_SKILL_IDS.HEZONG, PET_SKILL_IDS.GJ_HEZONG, PET_SKILL_IDS.GJ_HEZONG);
  if (hezongResult.has) {
    const differentPets = 2; // 简化：假设2只不同召唤兽
    const divisor = hezongResult.tier === 'advanced' ? 4 : 5.5;
    const bonusDamage = Math.floor(attackerLevel / divisor * differentPets);
    result.damage += bonusDamage;
    result.messages.push(`合纵效果：+${bonusDamage}伤害`);
  }

  // 夜战: 夜间伤害不减少（在环境系统中处理）
  // 高级夜战: 夜间躲避能力提高20%（在躲避系统中处理）

  // 风起龙游: 攻击速度低于自身目标伤害+10%
  if (petHasSkill(attacker, PET_SKILL_IDS.FENGQILONGYOU)) {
    if (attacker.stats.speed > defender.stats.speed) {
      result.damage = Math.floor(result.damage * 1.10);
      result.messages.push('风起龙游效果：伤害+10%');
    }
  }

  // 出其不意: 使用本回合己方召唤兽未使用过的技能时，伤害+15%
  // 简化实现：第一回合触发
  if (petHasSkill(attacker, PET_SKILL_IDS.CHUQIBUYI)) {
    result.damage = Math.floor(result.damage * 1.15);
    result.messages.push('出其不意效果：伤害+15%');
  }

  // 善恶有报: 有几率双倍伤害或恢复对方气血
  if (petHasSkill(attacker, PET_SKILL_IDS.SHANE_YOUBAO)) {
    const roll = Math.random();
    if (roll < 0.3) {
      result.damage = result.damage * 2;
      result.messages.push('善恶有报效果：双倍伤害！');
    } else if (roll < 0.5) {
      result.damage = -Math.floor(result.damage * 0.5); // 负伤害表示治疗
      result.messages.push('善恶有报效果：反而恢复了对方！');
    }
  }

  // 壁垒击破: 忽视防御技能，对防御目标伤害更大
  if (petHasSkill(attacker, PET_SKILL_IDS.BILEIJIPO) || petHasSkill(attacker, PET_SKILL_IDS.CJ_BILEIJIPO)) {
    const ignoreDef = petHasSkill(attacker, PET_SKILL_IDS.CJ_BILEIJIPO) ? attackerLevel * 1.2 : attackerLevel;
    result.damage += Math.floor(ignoreDef);
    result.messages.push('壁垒击破效果：忽视部分防御');
  }

  // ========== 防守方减免 ==========
  // 高级招架: 每回合受到的物理伤害减免20%
  const zhaojiaResult = petHasSkillAnyTier(defender, PET_SKILL_IDS.ZHAOJIA, PET_SKILL_IDS.GJ_ZHAOJIA, PET_SKILL_IDS.CJ_ZHAOJIA);
  if (zhaojiaResult.has && zhaojiaResult.tier !== 'basic') {
    result.damage = Math.floor(result.damage * 0.80);
    result.messages.push('高级招架：伤害减免20%');
  }

  // 驱鬼: 对鬼魂类伤害+50%/100%/100%
  const quguiResult = petHasSkillAnyTier(attacker, PET_SKILL_IDS.QUGUI, PET_SKILL_IDS.GJ_QUGUI, PET_SKILL_IDS.CJ_QUGUI);
  if (quguiResult.has && petHasSkill(defender, PET_SKILL_IDS.GUIHUN)) {
    const bonus = quguiResult.tier === 'basic' ? 0.5 : 1.0;
    result.damage = Math.floor(result.damage * (1 + bonus));
    result.messages.push(`驱鬼效果：对鬼魂伤害+${bonus * 100}%`);
  }

  return result;
}

/** 计算法术伤害加成/减免 */
export function calculateMagicDamageModifiers(
  attacker: CombatUnit,
  defender: CombatUnit,
  baseDamage: number,
  element?: string
): { damage: number; messages: string[] } {
  const result = { damage: baseDamage, messages: [] as string[] };

  // ========== 攻击方加成 ==========
  // 魔之心: 法术伤害+10%/+20%/+25%
  const mozhixinResult = petHasSkillAnyTier(attacker, PET_SKILL_IDS.MOZHIXIN, PET_SKILL_IDS.GJ_MOZHIXIN, PET_SKILL_IDS.CJ_MOZHIXIN);
  if (mozhixinResult.has) {
    const bonus = mozhixinResult.tier === 'super' ? 0.25 : mozhixinResult.tier === 'advanced' ? 0.20 : 0.10;
    result.damage = Math.floor(result.damage * (1 + bonus));
    result.messages.push(`魔之心效果：法术伤害+${bonus * 100}%`);
  }

  // 出奇制胜: 第二回合入场首次法术伤害+25%
  if (petHasSkill(attacker, PET_SKILL_IDS.CHUQIZHISHENG)) {
    result.damage = Math.floor(result.damage * 1.25);
    result.messages.push('出奇制胜效果：法术伤害+25%');
  }

  // ========== 属性吸收和弱点 ==========
  if (element && element !== 'none') {
    const elementMap: Record<string, { absorb: string; weakness: string }> = {
      metal: { absorb: PET_SKILL_IDS.LEISHUXINGXISHOU, weakness: PET_SKILL_IDS.RUODIANLEI },
      earth: { absorb: PET_SKILL_IDS.TUSHUXINGXISHOU, weakness: PET_SKILL_IDS.RUODIANTU },
      water: { absorb: PET_SKILL_IDS.SHUISHUXINGXISHOU, weakness: PET_SKILL_IDS.RUODIANSHUI },
      fire: { absorb: PET_SKILL_IDS.HUOSHUXINGXISHOU, weakness: PET_SKILL_IDS.RUODIANHUO },
    };

    const elementInfo = elementMap[element];
    if (elementInfo) {
      // 弱点: 受对应属性法术伤害+50%
      if (petHasSkill(defender, elementInfo.weakness)) {
        result.damage = Math.floor(result.damage * 1.50);
        result.messages.push(`弱点效果：受到${element}属性伤害+50%`);
      }

      // 属性吸收: 50%几率免受伤害并恢复
      const absorbResult = petHasSkillAnyTier(
        defender,
        elementInfo.absorb,
        `skill_gj_${elementInfo.absorb.slice(7)}`, // 高级版本
        `skill_gj_${elementInfo.absorb.slice(7)}`  // 超级版本用高级
      );
      if (absorbResult.has) {
        if (Math.random() < 0.50) {
          result.damage = -result.damage; // 负伤害表示治疗
          result.messages.push(`属性吸收触发！恢复HP`);
        } else if (absorbResult.tier !== 'basic') {
          // 高级版本吸收失败也可减少30%伤害
          result.damage = Math.floor(result.damage * 0.70);
          result.messages.push(`属性吸收失败，但仍减少30%伤害`);
        }
      }
    }
  }

  // ========== 防守方减免 ==========
  // 法术抵抗: 减少5%/10%法术伤害
  const fashudikangResult = petHasSkillAnyTier(defender, PET_SKILL_IDS.FASHUDIKANG, PET_SKILL_IDS.GJ_FASHUDIKANG, PET_SKILL_IDS.GJ_FASHUDIKANG);
  if (fashudikangResult.has) {
    const reduction = fashudikangResult.tier === 'basic' ? 0.05 : 0.10;
    result.damage = Math.floor(result.damage * (1 - reduction));
    result.messages.push(`法术抵抗：减少${reduction * 100}%法术伤害`);
  }

  // 高级否定信仰: 受法术伤害减少20%
  if (petHasSkill(defender, PET_SKILL_IDS.GJ_FOUDINGXINYANG)) {
    result.damage = Math.floor(result.damage * 0.80);
    result.messages.push('高级否定信仰：减少20%法术伤害');
  }

  // 法术防御: 减少65%法术伤害
  if (petHasSkill(defender, PET_SKILL_IDS.FASHUFANGYU)) {
    result.damage = Math.floor(result.damage * 0.35);
    result.messages.push('法术防御：减少65%法术伤害');
  }

  return result;
}

/** 技能冷却追踪 */
interface SkillCooldown {
  skillId: string;
  remainingCooldown: number;
}

/** 单位技能冷却映射 */
const unitCooldowns = new Map<string, SkillCooldown[]>();

// ==================== 宠物品质和五行系统 ====================

/** 获取宠物品质战斗属性加成 */
function getPetQualityBonus(quality: PetQuality): {
  damageBonus: number;
  defenseBonus: number;
  hpBonus: number;
} {
  switch (quality) {
    case 'divine': return { damageBonus: 0.2, defenseBonus: 0.15, hpBonus: 0.2 };
    case 'variant': return { damageBonus: 0.1, defenseBonus: 0.08, hpBonus: 0.1 };
    case 'baby': return { damageBonus: 0.0, defenseBonus: 0.0, hpBonus: 0.0 };
    case 'wild': return { damageBonus: -0.1, defenseBonus: -0.05, hpBonus: -0.1 };
    default: return { damageBonus: 0, defenseBonus: 0, hpBonus: 0 };
  }
}

/** 五行相克关系 */
const ELEMENT_COUNTERS: Record<PetElement, PetElement> = {
  metal: 'wood',    // 金克木
  wood: 'earth',    // 木克土
  earth: 'water',   // 土克水
  water: 'fire',    // 水克火
  fire: 'metal',    // 火克金
  physical: 'none', // 物理不参与五行克制
  none: 'none',
};

/** 五行相克加成
 * @returns 正数表示克制对方(伤害加成)，负数表示被对方克制(伤害减少)，0表示无关系
 */
function getElementCounterBonus(attackerElement: string, defenderElement: string): number {
  if (attackerElement === 'none' || defenderElement === 'none') return 0;
  if (attackerElement === defenderElement) return 0;

  const counters = ELEMENT_COUNTERS as Record<string, string>;

  if (counters[attackerElement] === defenderElement) {
    return 0.1; // 克制加成10%
  }
  if (counters[defenderElement] === attackerElement) {
    return -0.1; // 被克制减伤10%
  }
  return 0;
}

/** 根据宠物五行属性获取元素抗性 */
function getElementResistancesFromPet(element: PetElement): { metal: number; wood: number; water: number; fire: number; earth: number } {
  // 基础抗性为0
  const baseResistances = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };

  if (element === 'none') return baseResistances;

  // 五行相生相克关系：
  // 金生水、水生木、木生火、火生土、土生金
  // 金克木、木克土、土克水、水克火、火克金
  // 同属性有10%抗性，被克属性-10%抗性
  const elementKey = element as keyof typeof baseResistances;
  baseResistances[elementKey] = 10; // 同属性10%抗性

  // 被克制的属性会受到更多伤害
  const counters = ELEMENT_COUNTERS as Record<string, string>;
  const counterElement = Object.entries(counters).find(([_, v]) => v === element)?.[0];
  if (counterElement && counterElement !== 'none') {
    const counterKey = counterElement as keyof typeof baseResistances;
    baseResistances[counterKey] = -10; // 被克属性-10%抗性
  }

  return baseResistances;
}

/** 战斗状态 */
export const battleState = signal<BattleState | null>(null);

/** 是否在战斗中 */
export const isInBattle = computed(() => battleState.value !== null);

/** 当前回合 */
export const currentRound = computed(() => battleState.value?.round ?? 0);

/** 战斗速度 */
export const battleSpeed = signal<1 | 2 | 3>(1);

/** 是否自动战斗 */
export const isAutoBattle = signal(false);

/** 当前行动单位索引 */
export const currentActorIndex = computed(() => battleState.value?.currentActorIndex ?? 0);

/** 玩家阵容 */
export const playerFormation = computed<BattleFormation>(() => {
  const state = battleState.value;
  if (!state) {
    return { characters: [null, null, null], pets: [null, null, null] };
  }
  return state.playerFormation;
});

/** 敌人列表 */
export const enemies = computed(() => battleState.value?.enemies ?? []);

/** 获取所有存活单位（按速度排序） */
function getAllAliveUnits(state: BattleState): CombatUnit[] {
  const units: CombatUnit[] = [];

  for (const char of state.playerFormation.characters) {
    if (char && char.hp > 0) units.push(char);
  }
  for (const pet of state.playerFormation.pets) {
    if (pet && pet.hp > 0) units.push(pet);
  }
  for (const enemy of state.enemies) {
    if (enemy.hp > 0) units.push(enemy);
  }

  // 按速度排序（高速度先行动）
  return units.sort((a, b) => b.stats.speed - a.stats.speed);
}

/** 构建行动队列 */
function buildActionQueue(state: BattleState): ActionQueueItem[] {
  const units = getAllAliveUnits(state);
  return units
    .map(unit => ({
      unit,
      speed: unit.stats.speed,
      isPlayerSide: unit.isPlayerSide,
      position: unit.position,
    }))
    .sort((a, b) => b.speed - a.speed);
}

/** 行动队列 */
export const actionQueue = computed(() => {
  const state = battleState.value;
  if (!state) return [];
  return buildActionQueue(state);
});

/** 战斗是否结束 */
export const isBattleEnded = computed(() => {
  const state = battleState.value;
  if (!state) return false;

  // 检查玩家方是否全灭
  const playerAlive = state.playerFormation.characters.some(c => c && c.hp > 0) ||
    state.playerFormation.pets.some(p => p && p.hp > 0);

  // 检查敌人是否全灭
  const enemyAlive = state.enemies.some(e => e.hp > 0);

  return !playerAlive || !enemyAlive;
});

/** 战斗结果 */
export const battleResult = computed(() => battleState.value?.result);

/** 开始战斗 */
export function startBattle(enemyUnits: CombatUnit[]): void {
  const currentPlayer = player.value;
  if (!currentPlayer) return;

  // 清空技能冷却
  unitCooldowns.clear();

  // 获取玩家已学习的技能
  const playerSkills = currentPlayer.skills
    .map(ls => getSkill(ls.skillId))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  // 创建玩家战斗单位
  const playerUnit: CombatUnit = {
    id: currentPlayer.id,
    name: currentPlayer.name,
    type: 'player',
    isPlayerSide: true,
    race: currentPlayer.race,
    avatar: currentPlayer.avatar,
    stats: currentPlayer.finalStats,
    elementResistances: currentPlayer.elementResistances,
    hp: currentPlayer.hp,
    maxHp: currentPlayer.maxHp,
    mp: currentPlayer.mp,
    maxMp: currentPlayer.maxMp,
    skills: playerSkills,
    statusEffects: [],
    isDefending: false,
    isDead: false,
    position: 0,
  };

  // 初始化玩家技能冷却
  unitCooldowns.set(playerUnit.id, playerSkills.map(s => ({
    skillId: s.id,
    remainingCooldown: 0,
  })));

  // 获取出战的伙伴
  const companions = activeCompanions.value;
  const companionUnits: (CombatUnit | null)[] = [null, null];

  companions.forEach((companion, index) => {
    if (index < 2) {
      // 获取伙伴已学习的技能
      const companionSkills = companion.skills
        .map(ls => getSkill(ls.skillId))
        .filter((s): s is NonNullable<typeof s> => s !== undefined);

      const companionUnit: CombatUnit = {
        id: companion.id,
        name: companion.name,
        type: 'companion',
        isPlayerSide: true,
        stats: companion.finalStats,
        elementResistances: companion.elementResistances,
        hp: companion.hp,
        maxHp: companion.maxHp,
        mp: companion.mp,
        maxMp: companion.maxMp,
        skills: companionSkills,
        statusEffects: [],
        isDefending: false,
        isDead: false,
        position: index + 1,
      };
      companionUnits[index] = companionUnit;

      // 初始化伙伴技能冷却
      unitCooldowns.set(companionUnit.id, companionSkills.map(s => ({
        skillId: s.id,
        remainingCooldown: 0,
      })));
    }
  });

  // 获取出战的宠物
  const pet = activePet.value;
  const petUnits: (CombatUnit | null)[] = [null, null, null];

  if (pet) {
    // 转换宠物技能为战斗技能格式
    const petSkills = pet.skills
      .filter(ps => ps.type === 'active') // 只使用主动技能
      .map(ps => convertPetSkillToSkill(ps));

    // 基于宠物五行属性设置元素抗性
    const petElementResistances = getElementResistancesFromPet(pet.element);

    // 计算宠物战斗属性（包含被动技能加成）
    const petBattleStats = calculatePetBattleStats(pet);

    const petUnit: CombatUnit = {
      id: pet.id,
      name: pet.nickname || pet.name,
      type: 'pet',
      isPlayerSide: true,
      stats: petBattleStats,
      elementResistances: petElementResistances,
      element: pet.element !== 'none' ? pet.element : undefined,
      hp: pet.hp,
      maxHp: pet.maxHp,
      mp: pet.mp,
      maxMp: pet.maxMp,
      skills: petSkills,
      statusEffects: [],
      isDefending: false,
      isDead: false,
      position: 0,
      ref: pet,
    };
    petUnits[0] = petUnit;

    // 初始化宠物技能冷却
    unitCooldowns.set(petUnit.id, petSkills.map(s => ({
      skillId: s.id,
      remainingCooldown: 0,
    })));
  }

  // 添加伙伴的宠物
  companions.forEach((companion, companionIndex) => {
    if (companion.activePetId && companionIndex < 2) {
      const companionPet = companion.pets.find(p => p.id === companion.activePetId);
      if (companionPet) {
        const companionPetSkills = companionPet.skills
          .filter(ps => ps.type === 'active')
          .map(ps => convertPetSkillToSkill(ps));

        // 基于宠物五行属性设置元素抗性
        const companionPetElementResistances = getElementResistancesFromPet(companionPet.element);

        // 计算宠物战斗属性（包含被动技能加成）
        const companionPetBattleStats = calculatePetBattleStats(companionPet);

        const companionPetUnit: CombatUnit = {
          id: companionPet.id,
          name: companionPet.nickname || companionPet.name,
          type: 'pet',
          isPlayerSide: true,
          stats: companionPetBattleStats,
          elementResistances: companionPetElementResistances,
          element: companionPet.element !== 'none' ? companionPet.element : undefined,
          hp: companionPet.hp,
          maxHp: companionPet.maxHp,
          mp: companionPet.mp,
          maxMp: companionPet.maxMp,
          skills: companionPetSkills,
          statusEffects: [],
          isDefending: false,
          isDead: false,
          position: companionIndex + 1,
          ref: companionPet,
        };
        petUnits[companionIndex + 1] = companionPetUnit;

        // 初始化伙伴宠物技能冷却
        unitCooldowns.set(companionPetUnit.id, companionPetSkills.map(s => ({
          skillId: s.id,
          remainingCooldown: 0,
        })));
      }
    }
  });

  // 初始化敌人技能冷却
  enemyUnits.forEach(enemy => {
    unitCooldowns.set(enemy.id, enemy.skills.map(s => ({
      skillId: s.id,
      remainingCooldown: 0,
    })));
  });

  // 创建阵容
  const formation: BattleFormation = {
    characters: [playerUnit, companionUnits[0], companionUnits[1]],
    pets: petUnits,
  };

  // 创建战斗状态
  // 根据敌人类型决定最大回合数：Boss战50回合，普通战斗30回合
  const hasBoss = enemyUnits.some(e => {
    const enemyRef = e.ref as Enemy | undefined;
    return enemyRef?.type === 'boss';
  });
  const maxRounds = hasBoss ? 50 : 30;

  const newBattleState: BattleState = {
    id: generateUUID(),
    playerFormation: formation,
    enemies: enemyUnits,
    actionQueue: [],
    currentActorIndex: 0,
    round: 1,
    maxRounds,
    logs: [],
    isAuto: false,
    speed: 1,
    seed: Date.now(),
  };

  // 构建初始行动队列
  newBattleState.actionQueue = buildActionQueue(newBattleState);

  // 添加战斗开始日志
  newBattleState.logs.push({
    round: 0,
    timestamp: Date.now(),
    actor: { id: 'system', name: '系统', isPlayer: false },
    action: 'attack',
    result: {},
    text: '战斗开始！',
  });

  battleState.value = newBattleState;
}

/** 检查技能是否可用（冷却和MP） */
export function isSkillUsable(unit: CombatUnit, skillId: string): boolean {
  const skill = unit.skills.find(s => s.id === skillId);
  if (!skill) return false;

  // 检查MP
  if (unit.mp < skill.mpCost) return false;

  // 检查冷却
  const cooldowns = unitCooldowns.get(unit.id);
  if (cooldowns) {
    const cd = cooldowns.find(c => c.skillId === skillId);
    if (cd && cd.remainingCooldown > 0) return false;
  }

  return true;
}

/** 获取技能剩余冷却 */
export function getSkillCooldown(unitId: string, skillId: string): number {
  const cooldowns = unitCooldowns.get(unitId);
  if (cooldowns) {
    const cd = cooldowns.find(c => c.skillId === skillId);
    return cd?.remainingCooldown ?? 0;
  }
  return 0;
}

/** 执行行动 */
export function executeAction(action: BattleAction): void {
  const state = battleState.value;
  if (!state) {
    logger.debug('[Battle] executeAction: 无战斗状态');
    return;
  }

  // 查找行动者
  const actor = findUnit(action.actorId);
  if (!actor || actor.hp <= 0) {
    logger.debug('[Battle] executeAction: 行动者无效或已死亡', { actorId: action.actorId, actor });
    return;
  }

  // 检查眩晕状态 - 跳过该单位回合
  if (actor.statusEffects.some(e => e.stun)) {
    const log: BattleLog = {
      round: state.round,
      timestamp: Date.now(),
      actor: { id: actor.id, name: actor.name, isPlayer: actor.isPlayerSide },
      action: 'defend',
      result: {},
      text: `${actor.name} 处于眩晕状态，无法行动！`,
    };
    state.logs.push(log);
    advanceToNextActor();
    checkBattleEnd();
    return;
  }

  // 检查沉默状态 - 只能使用普攻或防御
  if (action.type === 'skill' && actor.statusEffects.some(e => e.silence)) {
    const log: BattleLog = {
      round: state.round,
      timestamp: Date.now(),
      actor: { id: actor.id, name: actor.name, isPlayer: actor.isPlayerSide },
      action: action.type,
      skillId: action.skillId,
      result: {},
      text: `${actor.name} 处于沉默状态，无法使用技能！`,
    };
    state.logs.push(log);
    return;
  }

  console.log(`[Battle] executeAction: ${actor.name} 执行 ${action.type} 行动`);

  // 生成日志
  const log: BattleLog = {
    round: state.round,
    timestamp: Date.now(),
    actor: {
      id: actor.id,
      name: actor.name,
      isPlayer: actor.isPlayerSide,
    },
    action: action.type,
    skillId: action.skillId,
    itemId: action.itemId,
    result: {},
    text: '',
  };

  // 处理不同行动类型
  switch (action.type) {
    case 'attack': {
      const target = findUnit(action.targetId || '');
      if (target && target.hp > 0) {
        const damageResult = calculateDamage(actor, target);
        let totalDamage = 0;
        const skillTexts: string[] = [];
        let targetKilled = false;

        // 处理连击（多次攻击）
        for (let hit = 0; hit < damageResult.hitCount && target.hp > 0; hit++) {
          // 使用第一次计算的基础伤害，每次连击独立判定暴击
          let hitDamage = damageResult.damage;

          // 连击中的每次攻击独立判定暴击（10%基础暴击率）
          if (hit > 0 && random() < 0.10) {
            hitDamage = Math.floor(hitDamage * 2);
            damageResult.isCritical = true; // 标记有暴击发生
          }

          const previousHp = target.hp;
          target.hp = Math.max(0, target.hp - hitDamage);
          totalDamage += hitDamage;

          // 检查是否击杀目标
          if (target.hp <= 0 && previousHp > 0) {
            targetKilled = true;
          }

          if (damageResult.hitCount > 1 && hit > 0) {
            skillTexts.push(`第${hit + 1}击: ${hitDamage} 点伤害`);
          }
        }

        log.target = { id: target.id, name: target.name };
        log.result.damage = totalDamage;
        log.result.isCritical = damageResult.isCritical;
        log.result.isMiss = damageResult.isMiss;

        if (damageResult.isMiss) {
          log.text = `${actor.name} 攻击 ${target.name}，但是被闪避了！`;
        } else {
          let attackDesc = `${actor.name} 对 ${target.name} 造成 ${totalDamage} 点伤害`;
          if (damageResult.hitCount > 1) {
            attackDesc += `（${damageResult.hitCount}连击）`;
          }
          if (damageResult.isCritical) {
            attackDesc += '（暴击！）';
          }
          if (damageResult.triggeredSkills.length > 0) {
            attackDesc += ` [${damageResult.triggeredSkills.join('、')}]`;
          }
          log.text = attackDesc;
        }

        // 处理吸血效果
        if (damageResult.lifeSteal > 0 && actor.hp < actor.maxHp) {
          let actualHeal = Math.min(damageResult.lifeSteal, actor.maxHp - actor.hp);
          actor.hp = Math.min(actor.maxHp, actor.hp + actualHeal);

          // 超级吸血：溢出气血转化为护盾
          if (petHasSkill(actor, PET_SKILL_IDS.CJ_XIXUE)) {
            const overflow = damageResult.lifeSteal - actualHeal;
            if (overflow > 0) {
              // 添加护盾效果（简化：直接加到HP上，但标记为临时）
              const shieldAmount = Math.floor(overflow * 0.5);
              actor.hp = Math.min(actor.maxHp * 1.2, actor.hp + shieldAmount); // 最多超过上限20%
              state.logs.push({
                round: state.round,
                timestamp: Date.now(),
                actor: { id: actor.id, name: actor.name, isPlayer: actor.isPlayerSide },
                action: 'attack',
                result: { heal: shieldAmount },
                text: `${actor.name} 超级吸血护盾 +${shieldAmount}`,
              });
            }
          }

          // 添加吸血日志
          state.logs.push({
            round: state.round,
            timestamp: Date.now(),
            actor: { id: actor.id, name: actor.name, isPlayer: actor.isPlayerSide },
            action: 'attack',
            result: { heal: actualHeal },
            text: `${actor.name} 通过吸血恢复了 ${actualHeal} 点生命`,
          });
        }

        // 处理反击和反震（只有攻击者有偷袭技能时才不会触发）
        if (damageResult.canTriggerCounter && !damageResult.isMiss && target.hp > 0) {
          processCounterAndRebound(actor, target, totalDamage);
        }

        // ========== 处理死亡和复活技能 ==========
        if (target.hp <= 0) {
          // 检查神佑复生
          const shenyouResult = petHasSkillAnyTier(target, PET_SKILL_IDS.SHENYOUFUSHENG, PET_SKILL_IDS.GJ_SHENYOUFUSHENG, PET_SKILL_IDS.GJ_SHENYOUFUSHENG);
          if (shenyouResult.has && !petHasSkill(target, PET_SKILL_IDS.GUIHUN)) {
            const reviveChance = shenyouResult.tier === 'basic' ? 0.20 : 0.30;
            if (random() < reviveChance) {
              const reviveHp = Math.floor(target.maxHp * 0.60);
              target.hp = reviveHp;
              target.isDead = false;
              state.logs.push({
                round: state.round,
                timestamp: Date.now(),
                actor: { id: target.id, name: target.name, isPlayer: target.isPlayerSide },
                action: 'defend',
                result: { heal: reviveHp },
                text: `${target.name} 神佑复生触发！恢复了 ${reviveHp} 点生命！`,
              });
              targetKilled = false;
            }
          }

          // 检查天狐之舞
          if (petHasSkill(target, PET_SKILL_IDS.TIANHUZHIWU) && !target.isDead) {
            const reviveHp = Math.floor(target.maxHp * 0.20);
            target.hp = reviveHp;
            target.isDead = false;
            // 天狐状态：伤害提升10%（简化：直接记录）
            state.logs.push({
              round: state.round,
              timestamp: Date.now(),
              actor: { id: target.id, name: target.name, isPlayer: target.isPlayerSide },
              action: 'defend',
              result: { heal: reviveHp },
              text: `${target.name} 天狐之舞触发！进入天狐状态！`,
            });
            // 天狐状态在回合结束时会死亡，这里简化处理
            targetKilled = false;
          }
        }

        // ========== 嗜血追击：击倒目标后继续攻击另一个目标 ==========
        if (targetKilled && petHasSkill(actor, PET_SKILL_IDS.SHIXUEZHUIJI)) {
          // 找到另一个敌方目标
          const enemies = state.enemies.filter(e => e.hp > 0 && e.id !== target.id);
          const playerSideTargets = [
            ...state.playerFormation.characters.filter(c => c && c.hp > 0 && c.id !== target.id),
            ...state.playerFormation.pets.filter(p => p && p.hp > 0 && p.id !== target.id),
          ];

          let nextTarget: CombatUnit | null = null;
          if (actor.isPlayerSide && enemies.length > 0) {
            nextTarget = enemies[randomInt(0, enemies.length - 1)];
          } else if (!actor.isPlayerSide && playerSideTargets.length > 0) {
            nextTarget = playerSideTargets[randomInt(0, playerSideTargets.length - 1)];
          }

          if (nextTarget) {
            const pursuitDamage = calculateDamage(actor, nextTarget);
            nextTarget.hp = Math.max(0, nextTarget.hp - pursuitDamage.damage);

            state.logs.push({
              round: state.round,
              timestamp: Date.now(),
              actor: { id: actor.id, name: actor.name, isPlayer: actor.isPlayerSide },
              action: 'attack',
              target: { id: nextTarget.id, name: nextTarget.name },
              result: { damage: pursuitDamage.damage, isCritical: pursuitDamage.isCritical },
              text: `${actor.name} 嗜血追击！对 ${nextTarget.name} 造成 ${pursuitDamage.damage} 点伤害！`,
            });
          }
        }
      }
      break;
    }
    case 'skill': {
      // 查找技能
      const skill = actor.skills.find(s => s.id === action.skillId);
      if (!skill) {
        log.text = `${actor.name} 技能不存在`;
        break;
      }

      // 检查技能是否可用
      if (!isSkillUsable(actor, action.skillId!)) {
        const cd = getSkillCooldown(actor.id, action.skillId!);
        if (cd > 0) {
          log.text = `${actor.name} 的 ${skill.name} 还在冷却中（剩余${cd}回合）`;
        } else {
          log.text = `${actor.name} MP不足，无法使用 ${skill.name}`;
        }
        break;
      }

      // 扣除MP
      actor.mp -= skill.mpCost;

      // 设置冷却
      if (skill.cooldown > 0) {
        const cooldowns = unitCooldowns.get(actor.id);
        if (cooldowns) {
          const cd = cooldowns.find(c => c.skillId === skill.id);
          if (cd) {
            cd.remainingCooldown = skill.cooldown;
          }
        }
      }

      // 获取目标
      const targets = getSkillTargets(skill, actor, action.targetId);

      if (targets.length === 0) {
        log.text = `${actor.name} 使用 ${skill.name}，但没有有效目标`;
        break;
      }

      // 执行技能效果
      const effectTexts: string[] = [];
      const hitCount = skill.hitCount || 1; // 获取连击次数，默认为1

      for (let hit = 0; hit < hitCount; hit++) {
        for (const effect of skill.effects) {
          for (const target of targets) {
            // 检查目标是否还活着（连击过程中可能已经死亡）
            if (target.hp <= 0 && effect.type === 'damage') {
              continue;
            }
            const result = applySkillEffect(effect, actor, target, skill);
            if (result.damage) {
              log.result.damage = (log.result.damage || 0) + result.damage;
            }
            if (result.heal) {
              log.result.heal = (log.result.heal || 0) + result.heal;
            }
            effectTexts.push(result.text);
          }
        }
      }

      log.text = `${actor.name} 使用 ${skill.name}：${effectTexts.join('；')}`;
      if (targets.length === 1) {
        log.target = { id: targets[0].id, name: targets[0].name };
      }
      break;
    }
    case 'item': {
      // 获取道具模板
      const itemTemplate = getItemTemplate(action.itemId || '');
      if (!itemTemplate) {
        log.text = `${actor.name} 道具不存在`;
        break;
      }

      // 执行道具效果
      const effectTexts: string[] = [];
      for (const effect of itemTemplate.effects || []) {
        const target = action.targetId ? findUnit(action.targetId) : actor;
        if (target) {
          const result = applyItemEffect(effect, target);
          if (result.heal) {
            log.result.heal = (log.result.heal || 0) + result.heal;
          }
          effectTexts.push(result.text);
          log.target = { id: target.id, name: target.name };
        }
      }

      // 从背包移除道具
      removeItem(action.itemId || '', 1);

      log.text = `${actor.name} 使用 ${itemTemplate.name}：${effectTexts.join('；')}`;
      break;
    }
    case 'defend': {
      actor.isDefending = true;
      log.text = `${actor.name} 进入防御姿态，受到伤害减半`;
      break;
    }
    case 'escape': {
      // 逃跑成功率基于速度差
      const avgEnemySpeed = state.enemies.filter(e => e.hp > 0)
        .reduce((sum, e) => sum + e.stats.speed, 0) / Math.max(1, state.enemies.filter(e => e.hp > 0).length);
      const escapeChance = 0.3 + (actor.stats.speed - avgEnemySpeed) * 0.01;
      const escaped = random() < Math.min(0.8, Math.max(0.1, escapeChance));

      log.result.isMiss = !escaped;
      log.text = escaped ? `${actor.name} 成功逃脱战斗！` : `${actor.name} 逃跑失败`;
      if (escaped) {
        state.logs.push(log);
        battleState.value = { ...state };
        // 结束战斗
        endBattle(false);
        return;
      }
      break;
    }
    case 'capture': {
      // 宠物捕捉
      const target = findUnit(action.targetId || '');
      if (!target || target.hp <= 0 || target.isPlayerSide) {
        log.text = `${actor.name} 无法捕捉该目标`;
        break;
      }

      // 获取敌人模板检查是否可捕捉
      const enemyRef = target.ref as Enemy | undefined;
      const templateId = enemyRef?.templateId || target.id.split('_')[0];
      const template = getEnemyTemplate(templateId);

      // 检查是否是普通怪物（只能捕捉普通怪物）
      if (!template || template.type !== 'normal') {
        log.text = `${target.name} 不是普通怪物，无法被捕捉`;
        break;
      }

      // 检查模板是否标记为可捕捉
      if (!template.capturable) {
        log.text = `${target.name} 无法被捕捉`;
        break;
      }

      // 检查宠物栏是否已满
      if (petCount.value >= maxPets) {
        log.text = `${actor.name} 尝试捕捉 ${target.name}，但宠物栏已满！`;
        break;
      }

      // 使用玩家捕捉技能等级计算捕捉率
      const skillLevel = getCaptureSkillLevel();
      const baseCaptureRate = calculateCaptureRate(skillLevel, template.type);

      // 敌人HP越低，成功率越高（最多+30%）
      const hpRatio = target.hp / target.maxHp;
      const hpBonus = (1 - hpRatio) * 0.3;
      const captureChance = Math.min(0.90, baseCaptureRate + hpBonus);

      const captured = random() < captureChance;

      if (captured) {
        // 获取宠物模板ID
        const petTemplateId = template.petTemplateId || templateId.replace('enemy_', 'pet_');

        // 创建宠物
        const pet = createPet(petTemplateId);
        if (pet && addPet(pet)) {
          log.text = `${actor.name} 成功捕捉了 ${target.name}！`;
          log.result.heal = 0; // 标记成功

          // 将敌人从战斗中移除（设为死亡）
          target.hp = 0;
          target.isDead = true;
        } else {
          log.text = `${actor.name} 捕捉 ${target.name} 失败了...`;
        }
      } else {
        log.text = `${actor.name} 尝试捕捉 ${target.name}，但让它逃掉了！`;
      }
      break;
    }
  }

  // 添加日志
  state.logs.push(log);

  // 推进到下一个行动者
  advanceToNextActor();

  // 检查战斗结束
  checkBattleEnd();
}

/** 推进到下一个行动者 */
function advanceToNextActor(): void {
  const state = battleState.value;
  if (!state) {
    logger.debug('[Battle] advanceToNextActor: 无战斗状态');
    return;
  }

  // 重新计算行动队列（因为可能有单位死亡）
  const aliveUnits = getAllAliveUnits(state);

  // 如果战斗已结束，不推进
  if (aliveUnits.length === 0) {
    logger.debug('[Battle] advanceToNextActor: 无存活单位');
    return;
  }

  // 获取当前索引，跳过死亡单位
  const nextIndex = state.currentActorIndex + 1;

  console.log(`[Battle] advanceToNextActor: 当前索引 ${state.currentActorIndex}, 下一个索引 ${nextIndex}, 存活单位数 ${aliveUnits.length}`);

  // 如果已经到达队列末尾，开始新回合
  if (nextIndex >= aliveUnits.length) {
    logger.debug('[Battle] advanceToNextActor: 到达队列末尾，开始新回合');
    startNewRound();
    return;
  }

  // 更新索引
  state.currentActorIndex = nextIndex;
  battleState.value = { ...state };

  // 获取下一个行动者并记录日志
  const nextActor = aliveUnits[nextIndex];
  console.log(`[Battle] advanceToNextActor: 下一个行动者是 ${nextActor?.name} (${nextActor?.isPlayerSide ? '玩家方' : '敌方'})`);
}

/** 开始新回合 */
function startNewRound(): void {
  const state = battleState.value;
  if (!state) return;

  console.log(`[Battle] startNewRound: 当前回合 ${state.round}, 最大回合 ${state.maxRounds}`);

  // 检查是否达到最大回合数
  if (state.round >= state.maxRounds) {
    logger.debug('[Battle] startNewRound: 达到最大回合数，战斗结束');
    endBattle(false);
    return;
  }

  // 重置所有单位的防御状态
  for (const char of state.playerFormation.characters) {
    if (char) char.isDefending = false;
  }
  for (const pet of state.playerFormation.pets) {
    if (pet) pet.isDefending = false;
  }
  for (const enemy of state.enemies) {
    enemy.isDefending = false;
  }

  // 减少所有单位的技能冷却
  for (const char of state.playerFormation.characters) {
    if (char) reduceCooldowns(char.id);
  }
  for (const pet of state.playerFormation.pets) {
    if (pet) reduceCooldowns(pet.id);
  }
  for (const enemy of state.enemies) {
    reduceCooldowns(enemy.id);
  }

  // ========== 处理宠物回合开始被动技能 ==========
  // 处理玩家方宠物
  for (const pet of state.playerFormation.pets) {
    if (pet && pet.hp > 0) {
      const passiveResult = processRoundStartPassives(pet, state.round + 1);

      // 应用HP恢复
      if (passiveResult.hpRegen > 0) {
        const oldHp = pet.hp;
        pet.hp = Math.min(pet.maxHp, pet.hp + passiveResult.hpRegen);
        console.log(`[Battle] ${pet.name} 再生恢复 ${pet.hp - oldHp} HP`);
      }

      // 应用MP恢复
      if (passiveResult.mpRegen > 0) {
        const oldMp = pet.mp;
        pet.mp = Math.min(pet.maxMp, pet.mp + passiveResult.mpRegen);
        console.log(`[Battle] ${pet.name} 冥思恢复 ${pet.mp - oldMp} MP`);
      }

      // 添加日志
      for (const msg of passiveResult.messages) {
        state.logs.push({
          round: state.round + 1,
          timestamp: Date.now(),
          actor: { id: pet.id, name: pet.name, isPlayer: true },
          action: 'defend',
          result: {},
          text: `${pet.name} ${msg}`,
        });
      }
    }
  }

  // 处理状态效果（DoT/HoT）
  processStatusEffects();

  // 处理种族回合结束效果
  processRaceTurnEffects();

  // ========== 处理宠物回合结束被动技能（神迹等） ==========
  // 处理玩家方宠物的回合结束效果
  for (const pet of state.playerFormation.pets) {
    if (pet && pet.hp > 0) {
      const endResult = processRoundEndPassives(pet);

      // 清除异常状态
      if (endResult.clearStatus) {
        pet.statusEffects = [];
        console.log(`[Battle] ${pet.name} 神迹清除所有异常状态`);
      }

      // 添加日志
      for (const msg of endResult.messages) {
        state.logs.push({
          round: state.round + 1,
          timestamp: Date.now(),
          actor: { id: pet.id, name: pet.name, isPlayer: true },
          action: 'defend',
          result: {},
          text: `${pet.name} ${msg}`,
        });
      }
    }
  }

  // 增加回合数
  state.round += 1;
  state.currentActorIndex = 0;

  // 重建行动队列
  state.actionQueue = buildActionQueue(state);

  // 添加回合开始日志
  state.logs.push({
    round: state.round,
    timestamp: Date.now(),
    actor: { id: 'system', name: '系统', isPlayer: false },
    action: 'attack',
    result: {},
    text: `第 ${state.round} 回合开始`,
  });

  // 确保状态更新
  battleState.value = { ...state };

  console.log(`[Battle] startNewRound: 新回合 ${state.round} 开始，行动队列长度 ${state.actionQueue.length}`);

  // 检查战斗结束（可能因为DoT死亡）
  checkBattleEnd();
}

/** 减少单位技能冷却 */
function reduceCooldowns(unitId: string): void {
  const cooldowns = unitCooldowns.get(unitId);
  if (cooldowns) {
    for (const cd of cooldowns) {
      if (cd.remainingCooldown > 0) {
        cd.remainingCooldown--;
      }
    }
  }
}

/** 处理种族回合结束效果 */
function processRaceTurnEffects(): void {
  const state = battleState.value;
  if (!state) return;

  const effectLogs: string[] = [];

  // 处理玩家方单位的种族回合效果
  const playerUnits: CombatUnit[] = [];

  for (const char of state.playerFormation.characters) {
    if (char && char.hp > 0) playerUnits.push(char);
  }
  for (const pet of state.playerFormation.pets) {
    if (pet && pet.hp > 0) playerUnits.push(pet);
  }

  for (const unit of playerUnits) {
    if (!unit.race) continue;

    // 仙族灵力充沛：每回合恢复4%最大MP
    if (unit.race === 'celestial' && unit.mp < unit.maxMp) {
      const mpRegen = Math.floor(unit.maxMp * 0.04);
      const actualRegen = Math.min(mpRegen, unit.maxMp - unit.mp);
      if (actualRegen > 0) {
        unit.mp += actualRegen;
        effectLogs.push(`${unit.name} 的灵力充沛恢复了 ${actualRegen} MP`);
      }
    }
  }

  // 添加种族效果日志
  if (effectLogs.length > 0) {
    state.logs.push({
      round: state.round,
      timestamp: Date.now(),
      actor: { id: 'system', name: '系统', isPlayer: false },
      action: 'attack',
      result: {},
      text: effectLogs.join('；'),
    });
  }
}

/** 处理状态效果 */
function processStatusEffects(): void {
  const state = battleState.value;
  if (!state) return;

  const effectLogs: string[] = [];

  // 处理所有单位的状态效果
  const allUnits = getAllAliveUnits(state);

  for (const unit of allUnits) {
    const expiredEffects: string[] = [];

    for (let i = unit.statusEffects.length - 1; i >= 0; i--) {
      const effect = unit.statusEffects[i];

      // 处理DoT伤害
      if (effect.dotDamage && effect.dotDamage > 0) {
        unit.hp = Math.max(0, unit.hp - effect.dotDamage);
        effectLogs.push(`${unit.name} 受到 ${effect.dotDamage} 点${effect.name}伤害`);
      }

      // 处理HoT治疗
      if (effect.hotHeal && effect.hotHeal > 0) {
        const heal = Math.min(effect.hotHeal, unit.maxHp - unit.hp);
        unit.hp += heal;
        effectLogs.push(`${unit.name} 恢复 ${heal} 点生命`);
      }

      // 减少持续时间
      effect.remaining--;

      // 检查是否过期
      if (effect.remaining <= 0) {
        expiredEffects.push(effect.name);
        unit.statusEffects.splice(i, 1);
      }
    }

    if (expiredEffects.length > 0) {
      effectLogs.push(`${unit.name} 的 ${expiredEffects.join('、')} 效果已消失`);
    }
  }

  // 添加状态效果日志
  if (effectLogs.length > 0) {
    state.logs.push({
      round: state.round,
      timestamp: Date.now(),
      actor: { id: 'system', name: '系统', isPlayer: false },
      action: 'attack',
      result: {},
      text: effectLogs.join('；'),
    });
  }
}

/** 伤害计算结果（扩展版，包含宠物被动技能效果） */
interface DamageResult {
  damage: number;
  isCritical: boolean;
  isMiss: boolean;
  // 宠物被动技能相关
  hitCount: number;           // 连击次数
  lifeSteal: number;          // 吸血量
  canTriggerCounter: boolean; // 是否会触发反击
  triggeredSkills: string[];  // 触发的技能名称
}

/** 计算伤害（包含宠物被动技能效果） */
function calculateDamage(attacker: CombatUnit, defender: CombatUnit): DamageResult {
  const result: DamageResult = {
    damage: 0,
    isCritical: false,
    isMiss: false,
    hitCount: 1,
    lifeSteal: 0,
    canTriggerCounter: true,
    triggeredSkills: [],
  };

  // ==================== 命中判定 ====================
  // 检查招架技能 - 15%几率完全躲过物理攻击（仅初级）
  const zhaojiaResult = petHasSkillAnyTier(defender, PET_SKILL_IDS.ZHAOJIA, PET_SKILL_IDS.GJ_ZHAOJIA, PET_SKILL_IDS.CJ_ZHAOJIA);
  if (zhaojiaResult.has && zhaojiaResult.tier === 'basic') {
    // 初级招架：15%几率完全躲过
    if (random() < 0.15) {
      result.isMiss = true;
      result.triggeredSkills.push('招架');
      return result;
    }
  }

  // 超级幸运：5%概率免疫攻击
  if (petHasSkill(defender, PET_SKILL_IDS.CJ_XINGYUN)) {
    if (random() < 0.05) {
      result.isMiss = true;
      result.triggeredSkills.push('超级幸运：免疫攻击');
      return result;
    }
  }

  // 基础命中判定
  const hitChance = attacker.stats.hitRate - defender.stats.dodgeRate;
  if (random() > Math.max(0.1, Math.min(0.99, hitChance))) {
    result.isMiss = true;
    return result;
  }

  // ==================== 攻击力计算 ====================
  let attack = attacker.stats.physicalAttack;

  // 宠物品质伤害加成
  if (attacker.type === 'pet' && attacker.ref) {
    const pet = attacker.ref as import('@/types/pet').Pet;
    const qualityBonus = getPetQualityBonus(pet.quality);
    attack = Math.floor(attack * (1 + qualityBonus.damageBonus));
  }

  // 强力技能：增加等级×系数的攻击
  const qiangliResult = petHasSkillAnyTier(attacker, PET_SKILL_IDS.QIANGLI, PET_SKILL_IDS.GJ_QIANGLI, PET_SKILL_IDS.CJ_QIANGLI);
  if (qiangliResult.has) {
    const petLevel = getPetLevel(attacker);
    const coefficient = qiangliResult.tier === 'super' ? 0.7 : qiangliResult.tier === 'advanced' ? 0.55 : 0.4;
    const bonusAttack = Math.floor(petLevel * coefficient);
    attack += bonusAttack;
    result.triggeredSkills.push(qiangliResult.tier === 'super' ? '超级强力' : qiangliResult.tier === 'advanced' ? '高级强力' : '强力');
  }

  // 种族伤害加成
  if (attacker.race && attacker.isPlayerSide) {
    const raceConfig = getRace(attacker.race);
    if (raceConfig) {
      // 魔族狂战士：物理伤害+18%
      if (attacker.race === 'demon') {
        attack = Math.floor(attack * 1.18);
      }
      // 魔族狂暴：残血攻击加成（HP每降低10%，物理攻击+4%，最高+40%）
      if (attacker.race === 'demon') {
        const rageBonus = calculateDemonRageBonus(attacker.hp, attacker.maxHp);
        attack = Math.floor(attack * (1 + rageBonus));
      }
    }
  }

  // 超级夜战：造成物理伤害提高10%
  if (petHasSkill(attacker, PET_SKILL_IDS.CJ_YEZHAN)) {
    attack = Math.floor(attack * 1.10);
    result.triggeredSkills.push('超级夜战');
  }

  // ==================== 防御计算 ====================
  let defense = defender.isDefending ? defender.stats.physicalDefense * 1.5 : defender.stats.physicalDefense;

  // 宠物品质防御加成
  if (defender.type === 'pet' && defender.ref) {
    const pet = defender.ref as import('@/types/pet').Pet;
    const qualityBonus = getPetQualityBonus(pet.quality);
    defense = Math.floor(defense * (1 + qualityBonus.defenseBonus));
  }

  // 防御技能：增加等级×系数的防御
  const fangyuResult = petHasSkillAnyTier(defender, PET_SKILL_IDS.FANGYU, PET_SKILL_IDS.GJ_FANGYU, PET_SKILL_IDS.CJ_FANGYU);
  if (fangyuResult.has) {
    const petLevel = getPetLevel(defender);
    const coefficient = fangyuResult.tier === 'super' ? 1.0 : fangyuResult.tier === 'advanced' ? 0.8 : 0.6;
    const bonusDefense = Math.floor(petLevel * coefficient);
    defense += bonusDefense;
  }

  // 高级/超级招架：每回合受到的物理伤害减免20%
  if (zhaojiaResult.has && zhaojiaResult.tier !== 'basic') {
    defense = Math.floor(defense * 1.25); // 通过增加有效防御来减伤约20%
    result.triggeredSkills.push(zhaojiaResult.tier === 'super' ? '超级招架' : '高级招架');
  }

  // ==================== 基础伤害计算 ====================
  let baseDamage = Math.max(1, attack - defense);

  // 五行相克加成
  const attackerElement = attacker.element || 'none';
  const defenderElement = defender.element || 'none';
  const elementCounterBonus = getElementCounterBonus(attackerElement, defenderElement);
  if (elementCounterBonus !== 0) {
    baseDamage = Math.floor(baseDamage * (1 + elementCounterBonus));
  }

  // ==================== 偷袭技能：攻击效果加成 ====================
  const touxiResult = petHasSkillAnyTier(attacker, PET_SKILL_IDS.TOUXI, PET_SKILL_IDS.GJ_TOUXI, PET_SKILL_IDS.CJ_TOUXI);
  if (touxiResult.has) {
    const damageBonus = touxiResult.tier === 'super' ? 0.15 : touxiResult.tier === 'advanced' ? 0.10 : 0.05;
    baseDamage = Math.floor(baseDamage * (1 + damageBonus));
    result.triggeredSkills.push(touxiResult.tier === 'super' ? '超级偷袭' : touxiResult.tier === 'advanced' ? '高级偷袭' : '偷袭');
    // 偷袭不会触发反击和反震
    result.canTriggerCounter = false;
  }

  // ==================== 合纵技能：物理伤害加成 ====================
  const hezongResult = petHasSkillAnyTier(attacker, PET_SKILL_IDS.HEZONG, PET_SKILL_IDS.GJ_HEZONG, PET_SKILL_IDS.GJ_HEZONG);
  if (hezongResult.has) {
    const petLevel = getPetLevel(attacker);
    const differentPets = 2; // 简化：假设2只不同召唤兽
    const divisor = hezongResult.tier === 'advanced' ? 4 : 5.5;
    const bonusDamage = Math.floor(petLevel / divisor * differentPets);
    baseDamage += bonusDamage;
    result.triggeredSkills.push(hezongResult.tier === 'advanced' ? '高级合纵' : '合纵');
  }

  // ==================== 风起龙游：攻击速度低于自身目标伤害+10% ====================
  if (petHasSkill(attacker, PET_SKILL_IDS.FENGQILONGYOU)) {
    if (attacker.stats.speed > defender.stats.speed) {
      baseDamage = Math.floor(baseDamage * 1.10);
      result.triggeredSkills.push('风起龙游');
    }
  }

  // ==================== 连击技能判定 ====================
  const lianjiResult = petHasSkillAnyTier(attacker, PET_SKILL_IDS.LIANJI, PET_SKILL_IDS.GJ_LIANJI, PET_SKILL_IDS.CJ_LIANJI);
  // 检查对方是否有反震技能（有反震只能攻击一次）
  const defenderHasFenzhen = petHasSkillAnyTier(defender, PET_SKILL_IDS.FENZHEN, PET_SKILL_IDS.GJ_FENZHEN, PET_SKILL_IDS.CJ_FENZHEN).has;
  if (lianjiResult.has && !defenderHasFenzhen) {
    const chance = lianjiResult.tier === 'super' ? 0.55 : lianjiResult.tier === 'advanced' ? 0.55 : 0.45;
    if (random() < chance) {
      result.hitCount = 2;
      // 连击伤害降低
      const damageReduction = 0.20;
      baseDamage = Math.floor(baseDamage * (1 - damageReduction));
      result.triggeredSkills.push(lianjiResult.tier === 'super' ? '超级连击' : lianjiResult.tier === 'advanced' ? '高级连击' : '连击');

      // 超级连击：触发连击时有15%几率额外攻击1次
      if (lianjiResult.tier === 'super' && random() < 0.15) {
        result.hitCount = 3;
        result.triggeredSkills.push('超级连击额外攻击');
      }
    }
  }

  // ==================== 随机波动 ====================
  const randomFactor = 0.9 + random() * 0.2;

  // ==================== 暴击判定 ====================
  // 基础暴击率
  let critRate = attacker.stats.critRate;

  // 必杀技能：增加暴击率
  const bishaResult = petHasSkillAnyTier(attacker, PET_SKILL_IDS.BISHA, PET_SKILL_IDS.GJ_BISHA, PET_SKILL_IDS.CJ_BISHA);
  if (bishaResult.has) {
    const bonusCrit = 0.20; // 所有等级都是+20%
    critRate += bonusCrit;
    result.triggeredSkills.push(bishaResult.tier === 'super' ? '超级必杀' : bishaResult.tier === 'advanced' ? '高级必杀' : '必杀');
  }

  // 幸运技能：不会受到必杀攻击
  const xingyunResult = petHasSkillAnyTier(defender, PET_SKILL_IDS.XINGYUN, PET_SKILL_IDS.GJ_XINGYUN, PET_SKILL_IDS.CJ_XINGYUN);
  if (xingyunResult.has) {
    // 超级幸运：暴击倍率降低50%
    critRate = 0; // 完全免疫暴击
    result.triggeredSkills.push(xingyunResult.tier === 'super' ? '超级幸运' : xingyunResult.tier === 'advanced' ? '高级幸运' : '幸运');
  }

  const isCritical = random() < critRate;
  // 暴击伤害计算
  let critMultiplier = isCritical ? 2.0 : 1;

  // 超级必杀：暴击时有25%几率造成3-4倍的必杀伤害
  if (isCritical && bishaResult.tier === 'super' && random() < 0.25) {
    critMultiplier = 3 + random(); // 3-4倍
    result.triggeredSkills.push('超级必杀爆发');
  }

  result.isCritical = isCritical;

  let damage = Math.floor(baseDamage * randomFactor * critMultiplier);

  // ==================== 吸血技能判定 ====================
  const xixueResult = petHasSkillAnyTier(attacker, PET_SKILL_IDS.XIXUE, PET_SKILL_IDS.GJ_XIXUE, PET_SKILL_IDS.CJ_XIXUE);
  if (xixueResult.has && !result.isMiss && damage > 0) {
    const stealRate = 0.30; // 所有等级都是30%
    result.lifeSteal = Math.floor(damage * stealRate);
    result.triggeredSkills.push(xixueResult.tier === 'super' ? '超级吸血' : xixueResult.tier === 'advanced' ? '高级吸血' : '吸血');
  }

  // ==================== 毒技能判定 ====================
  const duResult = petHasSkillAnyTier(attacker, PET_SKILL_IDS.DU, PET_SKILL_IDS.GJ_DU, PET_SKILL_IDS.CJ_DU);
  if (duResult.has && !result.isMiss && damage > 0) {
    const poisonChance = duResult.tier === 'basic' ? 0.15 : 0.20;
    if (random() < poisonChance) {
      // 添加中毒状态（在applySkillEffect中处理）
      result.triggeredSkills.push(duResult.tier === 'super' ? '超级毒' : duResult.tier === 'advanced' ? '高级毒' : '毒');
    }
  }

  // ==================== 驱鬼技能判定 ====================
  const quguiResult = petHasSkillAnyTier(attacker, PET_SKILL_IDS.QUGUI, PET_SKILL_IDS.GJ_QUGUI, PET_SKILL_IDS.CJ_QUGUI);
  const defenderHasGuihun = petHasSkillAnyTier(defender, PET_SKILL_IDS.GUIHUN, PET_SKILL_IDS.GJ_GUIHUN, PET_SKILL_IDS.GJ_GUIHUN).has;
  if (quguiResult.has && defenderHasGuihun) {
    const bonus = quguiResult.tier === 'basic' ? 0.5 : 1.0;
    damage = Math.floor(damage * (1 + bonus));
    result.triggeredSkills.push(quguiResult.tier === 'super' ? '超级驱鬼' : quguiResult.tier === 'advanced' ? '高级驱鬼' : '驱鬼');
  }

  // ==================== 壁垒击破：忽视部分防御 ====================
  const bileiResult = petHasSkillAnyTier(attacker, PET_SKILL_IDS.BILEIJIPO, PET_SKILL_IDS.BILEIJIPO, PET_SKILL_IDS.CJ_BILEIJIPO);
  if (bileiResult.has) {
    const petLevel = getPetLevel(attacker);
    const ignoreDef = bileiResult.tier === 'super' ? petLevel * 1.2 : petLevel;
    damage += Math.floor(ignoreDef);
    result.triggeredSkills.push(bileiResult.tier === 'super' ? '超级壁垒击破' : '壁垒击破');
  }

  // ==================== 善恶有报：随机效果 ====================
  if (petHasSkill(attacker, PET_SKILL_IDS.SHANE_YOUBAO)) {
    const roll = random();
    if (roll < 0.3) {
      damage = damage * 2;
      result.triggeredSkills.push('善恶有报：双倍伤害！');
    } else if (roll < 0.5) {
      damage = -Math.floor(Math.abs(damage) * 0.3); // 恢复对方
      result.triggeredSkills.push('善恶有报：恢复对方');
      result.canTriggerCounter = false;
    }
  }

  // ==================== 应用伤害前检查生存特性 ====================
  damage = applySurvivalTraits(defender, damage);

  result.damage = Math.max(1, damage);
  return result;
}

/** 应用生存特性（存活、护盾）*/
function applySurvivalTraits(defender: CombatUnit, damage: number): number {
  // 只对玩家方单位生效
  if (!defender.isPlayerSide || !defender.race) {
    return damage;
  }

  // 仙族法力护盾：MP抵扣伤害
  if (defender.race === 'celestial' && defender.mp > 0) {
    const originalDamage = damage;
    const shieldResult = calculateCelestialMpShield(damage, defender.mp, defender.maxHp);
    if (shieldResult.mpConsumed > 0) {
      defender.mp -= shieldResult.mpConsumed;
      damage = shieldResult.actualDamage;
      const absorbed = originalDamage - damage;
      // 记录日志
      const state = battleState.value;
      if (state) {
        state.logs.push({
          round: state.round,
          timestamp: Date.now(),
          actor: { id: defender.id, name: defender.name, isPlayer: true },
          action: 'defend',
          result: { damage: shieldResult.hpDamage },
          text: `${defender.name} 的法力护盾抵消了 ${shieldResult.mpConsumed} MP，减少了 ${absorbed} 点伤害`,
        });
      }
    }
  }

  // 检查是否仍为致命伤害
  const stillFatal = damage >= defender.hp;
  if (!stillFatal) {
    return damage;
  }

  // 触发种族存活特性
  const passiveResult = calculateRacePassive(
    defender.race,
    {
      currentHp: defender.hp,
      maxHp: defender.maxHp,
      currentMp: defender.mp,
      maxMp: defender.maxMp,
      isFatalDamage: stillFatal,
    },
    random
  );

  if (passiveResult.triggered && passiveResult.effect === 'survive') {
    defender.hp = 1;
    damage = defender.hp - 1; // 让伤害刚好不致死
    // 记录日志
    const state = battleState.value;
    if (state) {
      state.logs.push({
        round: state.round,
        timestamp: Date.now(),
        actor: { id: defender.id, name: defender.name, isPlayer: true },
        action: 'defend',
        result: {},
        text: `${defender.name} 的坚韧意志使其在致命伤害下存活！`,
      });
    }
  } else if (passiveResult.triggered && passiveResult.effect === 'survive_heal') {
    defender.hp = passiveResult.healAmount || Math.floor(defender.maxHp * 0.15);
    damage = 0; // 完全免疫此次伤害
    // 记录日志
    const state = battleState.value;
    if (state) {
      state.logs.push({
        round: state.round,
        timestamp: Date.now(),
        actor: { id: defender.id, name: defender.name, isPlayer: true },
        action: 'defend',
        result: { heal: defender.hp },
        text: `${defender.name} 的顽韧使其在致命伤害下存活并恢复了 ${defender.hp} HP！`,
      });
    }
  }

  return damage;
}

/** 处理反击和反震效果 */
function processCounterAndRebound(attacker: CombatUnit, defender: CombatUnit, originalDamage: number): void {
  const state = battleState.value;
  if (!state || defender.hp <= 0) return;

  // ==================== 反击技能 ====================
  const fanjiResult = petHasSkillOrAdvanced(defender, PET_SKILL_IDS.FANJI, PET_SKILL_IDS.GJ_FANJI);
  if (fanjiResult.has) {
    // 30%几率反击
    if (random() < 0.30) {
      // 反击伤害（普通50%，高级100%）
      const counterRate = fanjiResult.isAdvanced ? 1.0 : 0.5;
      // 反击使用简化的伤害计算
      const defenderAttack = defender.stats.physicalAttack;
      const attackerDefense = attacker.stats.physicalDefense;
      let counterDamage = Math.max(1, Math.floor((defenderAttack - attackerDefense) * counterRate));
      counterDamage = applySurvivalTraits(attacker, counterDamage);

      attacker.hp = Math.max(0, attacker.hp - counterDamage);

      state.logs.push({
        round: state.round,
        timestamp: Date.now(),
        actor: { id: defender.id, name: defender.name, isPlayer: defender.isPlayerSide },
        action: 'attack',
        target: { id: attacker.id, name: attacker.name },
        result: { damage: counterDamage },
        text: `${defender.name} 触发${fanjiResult.isAdvanced ? '高级' : ''}反击，对 ${attacker.name} 造成 ${counterDamage} 点伤害！`,
      });
    }
  }

  // ==================== 反震技能 ====================
  const fenzhenResult = petHasSkillOrAdvanced(defender, PET_SKILL_IDS.FENZHEN, PET_SKILL_IDS.GJ_FENZHEN);
  if (fenzhenResult.has) {
    // 30%几率反震
    if (random() < 0.30) {
      // 反震伤害（普通25%，高级50%）
      const reboundRate = fenzhenResult.isAdvanced ? 0.5 : 0.25;
      const reboundDamage = Math.floor(originalDamage * reboundRate);
      // 反震是固定伤害，不计算防御
      attacker.hp = Math.max(0, attacker.hp - reboundDamage);

      state.logs.push({
        round: state.round,
        timestamp: Date.now(),
        actor: { id: defender.id, name: defender.name, isPlayer: defender.isPlayerSide },
        action: 'attack',
        target: { id: attacker.id, name: attacker.name },
        result: { damage: reboundDamage },
        text: `${defender.name} 触发${fenzhenResult.isAdvanced ? '高级' : ''}反震，对 ${attacker.name} 造成 ${reboundDamage} 点反震伤害！`,
      });
    }
  }
}

/** 获取技能目标 */
function getSkillTargets(skill: Skill, actor: CombatUnit, targetId?: string): CombatUnit[] {
  const state = battleState.value;
  if (!state) return [];

  const targets: CombatUnit[] = [];

  switch (skill.targetType) {
    case 'single_enemy': {
      if (targetId) {
        const target = findUnit(targetId);
        if (target && !target.isPlayerSide && target.hp > 0) {
          targets.push(target);
        }
      }
      break;
    }
    case 'all_enemies': {
      for (const enemy of state.enemies) {
        if (enemy.hp > 0) targets.push(enemy);
      }
      break;
    }
    case 'single_ally': {
      if (targetId) {
        const target = findUnit(targetId);
        if (target && target.isPlayerSide && target.hp > 0) {
          targets.push(target);
        }
      } else {
        targets.push(actor); // 默认自身
      }
      break;
    }
    case 'all_allies': {
      for (const char of state.playerFormation.characters) {
        if (char && char.hp > 0) targets.push(char);
      }
      for (const pet of state.playerFormation.pets) {
        if (pet && pet.hp > 0) targets.push(pet);
      }
      break;
    }
    case 'self': {
      targets.push(actor);
      break;
    }
    case 'dead_ally': {
      if (targetId) {
        const target = findUnit(targetId);
        if (target && target.isPlayerSide && target.hp <= 0) {
          targets.push(target);
        }
      }
      break;
    }
  }

  return targets;
}

/** 应用技能效果 */
function applySkillEffect(
  effect: { type: string; damageType?: string; element?: string; baseValue?: number; multiplier?: number; statScale?: { stat: string; ratio: number }; duration?: number; statusEffect?: string; stat?: string; value?: number },
  actor: CombatUnit,
  target: CombatUnit,
  skill: Skill
): { damage?: number; heal?: number; text: string } {
  const result: { damage?: number; heal?: number; text: string } = { text: '' };

  switch (effect.type) {
    case 'damage': {
      // 命中判定
      const hitChance = actor.stats.hitRate - target.stats.dodgeRate;
      if (random() > Math.max(0.1, Math.min(0.99, hitChance))) {
        result.text = `${target.name} 闪避了攻击`;
        return result;
      }

      let damage = effect.baseValue || 0;

      // 根据伤害类型计算
      if (effect.damageType === 'physical') {
        let attack = actor.stats.physicalAttack;

        // 宠物品质伤害加成
        if (actor.type === 'pet' && actor.ref) {
          const pet = actor.ref as import('@/types/pet').Pet;
          const qualityBonus = getPetQualityBonus(pet.quality);
          attack = Math.floor(attack * (1 + qualityBonus.damageBonus));
        }

        // 魔族狂战士：物理伤害+18%
        if (actor.race === 'demon' && actor.isPlayerSide) {
          attack = Math.floor(attack * 1.18);
        }
        // 魔族狂暴：残血攻击加成
        if (actor.race === 'demon' && actor.isPlayerSide) {
          const rageBonus = calculateDemonRageBonus(actor.hp, actor.maxHp);
          attack = Math.floor(attack * (1 + rageBonus));
        }

        let defense = target.isDefending ? target.stats.physicalDefense * 1.5 : target.stats.physicalDefense;

        // 宠物品质防御加成
        if (target.type === 'pet' && target.ref) {
          const pet = target.ref as import('@/types/pet').Pet;
          const qualityBonus = getPetQualityBonus(pet.quality);
          defense = Math.floor(defense * (1 + qualityBonus.defenseBonus));
        }

        damage = Math.max(1, (effect.baseValue || attack) * (effect.multiplier || skill.multiplier) - defense);
      } else if (effect.damageType === 'magic') {
        let magicAtk = actor.stats.magicAttack;

        // 宠物品质伤害加成
        if (actor.type === 'pet' && actor.ref) {
          const pet = actor.ref as import('@/types/pet').Pet;
          const qualityBonus = getPetQualityBonus(pet.quality);
          magicAtk = Math.floor(magicAtk * (1 + qualityBonus.damageBonus));
        }

        // 仙族法神：法术伤害+18%
        if (actor.race === 'celestial' && actor.isPlayerSide) {
          magicAtk = Math.floor(magicAtk * 1.18);
        }

        // 魔之心技能：法术伤害+10%/+20%
        const mozhixinResult = petHasSkillOrAdvanced(actor, PET_SKILL_IDS.MOZHIXIN, PET_SKILL_IDS.GJ_MOZHIXIN);
        if (mozhixinResult.has) {
          const magicBonus = mozhixinResult.isAdvanced ? 0.20 : 0.10;
          magicAtk = Math.floor(magicAtk * (1 + magicBonus));
        }

        const magicDef = target.stats.magicDefense;
        damage = Math.max(1, (effect.baseValue || magicAtk) * (effect.multiplier || skill.multiplier) - magicDef);
      } else if (effect.damageType === 'true') {
        // 真实伤害无视防御
        damage = (effect.baseValue || 0) * (effect.multiplier || skill.multiplier);
      } else if (effect.damageType === 'fixed') {
        // 固定伤害
        damage = effect.baseValue || 0;
      }

      // 人族全能：技能伤害+8%
      if (actor.race === 'human' && actor.isPlayerSide) {
        damage = Math.floor(damage * 1.08);
      }

      // 元素克制加成（技能元素抗性）
      let elementBonus = 1;
      if (effect.element && effect.element !== 'none' && effect.element !== 'physical') {
        const elementResistance = target.elementResistances[effect.element as 'metal' | 'wood' | 'water' | 'fire' | 'earth'] || 0;
        // 抗性减少伤害，负抗性增加伤害
        elementBonus = 1 - elementResistance * 0.01;
      }

      // 五行相克加成（攻击者与防御者的五行关系）
      const attackerElement = actor.element || 'none';
      const defenderElement = target.element || 'none';
      const elementCounterBonus = getElementCounterBonus(attackerElement, defenderElement);

      // 暴击判定
      let critRate = actor.stats.critRate;

      // 法术暴击技能：法术攻击有几率暴击（额外15%/20%暴击率）
      if (effect.damageType === 'magic') {
        const fashubaojiResult = petHasSkillOrAdvanced(actor, PET_SKILL_IDS.FASHUBAOJI, PET_SKILL_IDS.GJ_FASHUBAOJI);
        if (fashubaojiResult.has) {
          const bonusCrit = fashubaojiResult.isAdvanced ? 0.20 : 0.15;
          critRate += bonusCrit;
        }
      }

      // 必杀技能：增加暴击率（物理攻击）
      if (effect.damageType === 'physical') {
        const bishaResult = petHasSkillOrAdvanced(actor, PET_SKILL_IDS.BISHA, PET_SKILL_IDS.GJ_BISHA);
        if (bishaResult.has) {
          const bonusCrit = bishaResult.isAdvanced ? 0.20 : 0.10;
          critRate += bonusCrit;
        }
      }

      // 幸运技能：不会受到必杀攻击
      const xingyunResult = petHasSkillOrAdvanced(target, PET_SKILL_IDS.XINGYUN, PET_SKILL_IDS.GJ_XINGYUN);
      if (xingyunResult.has) {
        critRate = 0;
      }

      const isCritical = random() < critRate;
      if (isCritical) {
        // 法术暴击和物理暴击伤害倍率不同
        if (effect.damageType === 'magic') {
          damage = Math.floor(damage * 1.5); // 法术暴击1.5倍
        } else {
          damage = Math.floor(damage * (1.5 + actor.stats.critDamage));
        }
      }

      // 随机因子 90%-110%
      const randomFactor = 0.9 + random() * 0.2;
      damage = Math.floor(damage * randomFactor * elementBonus);

      // 应用五行相克加成
      if (elementCounterBonus !== 0) {
        damage = Math.floor(damage * (1 + elementCounterBonus));
      }

      // 应用生存特性
      damage = applySurvivalTraits(target, damage);

      target.hp = Math.max(0, target.hp - damage);
      result.damage = damage;
      result.text = `${target.name} 受到 ${damage} 点伤害${isCritical ? '（暴击！）' : ''}`;
      break;
    }
    case 'heal': {
      let heal = effect.baseValue || 0;

      // 根据属性加成
      if (effect.statScale) {
        const stats = actor.stats as unknown as Record<string, number>;
        const statValue = stats[effect.statScale.stat] || 0;
        heal += Math.floor(statValue * effect.statScale.ratio);
      }

      heal = Math.floor(heal * (effect.multiplier || 1));
      // 治疗不超过最大HP
      const actualHeal = Math.min(heal, target.maxHp - target.hp);
      target.hp = Math.min(target.maxHp, target.hp + actualHeal);
      result.heal = actualHeal;
      result.text = `${target.name} 恢复 ${actualHeal} 点生命`;
      break;
    }
    case 'buff':
    case 'debuff': {
      // 添加状态效果
      if (effect.duration && effect.duration > 0) {
        // 根据 statusEffect 类型设置具体效果
        let dotDamage = 0;
        let hotHeal = 0;
        let stun = false;
        let silence = false;
        let effectName = skill.name;

        if (effect.statusEffect) {
          effectName = effect.statusEffect;

          switch (effect.statusEffect) {
            case 'burn':
              // 灼烧：每回合造成魔法攻击20%的伤害
              dotDamage = Math.floor(actor.stats.magicAttack * 0.2);
              break;
            case 'poison':
              // 中毒：每回合造成最大生命5%的伤害
              dotDamage = Math.floor(target.maxHp * 0.05);
              break;
            case 'bleed':
              // 流血：每回合造成物理攻击15%的伤害
              dotDamage = Math.floor(actor.stats.physicalAttack * 0.15);
              break;
            case 'stun':
              // 眩晕：无法行动
              stun = true;
              break;
            case 'silence':
              // 沉默：无法使用技能
              silence = true;
              break;
            case 'regen':
              // 再生：每回合恢复最大生命5%
              hotHeal = Math.floor(target.maxHp * 0.05);
              break;
            case 'haste':
              // 加速：提升速度（通过statModifiers处理）
              break;
          }
        }

        const statusEffect = {
          id: `${skill.id}_${target.id}_${Date.now()}`,
          name: effectName,
          type: effect.type as 'buff' | 'debuff' | 'control',
          icon: skill.icon,
          statModifiers: effect.statScale ? { [effect.statScale.stat]: effect.statScale.ratio } : undefined,
          dotDamage,
          hotHeal,
          stun,
          silence,
          duration: effect.duration,
          remaining: effect.duration,
          sourceId: actor.id,
        };
        target.statusEffects.push(statusEffect);

        // 构建效果描述
        const effectDesc: string[] = [];
        if (dotDamage > 0) effectDesc.push(`每回合${dotDamage}伤害`);
        if (hotHeal > 0) effectDesc.push(`每回合恢复${hotHeal}`);
        if (stun) effectDesc.push('眩晕');
        if (silence) effectDesc.push('沉默');
        if (effect.statScale) effectDesc.push(`${effect.statScale.stat}变化`);

        result.text = `${target.name} 获得 ${effectName} 效果（${effect.duration}回合）${effectDesc.length > 0 ? '：' + effectDesc.join('、') : ''}`;
      } else {
        result.text = `对 ${target.name} 产生效果`;
      }
      break;
    }
    default:
      result.text = `对 ${target.name} 产生效果`;
  }

  return result;
}

/** 应用道具效果 */
function applyItemEffect(
  effect: { type: string; value?: number },
  target: CombatUnit
): { heal?: number; text: string } {
  const result: { heal?: number; text: string } = { text: '' };

  switch (effect.type) {
    case 'heal_hp': {
      const heal = effect.value || 0;
      target.hp = Math.min(target.maxHp, target.hp + heal);
      result.heal = heal;
      result.text = `恢复 ${heal} 点HP`;
      break;
    }
    case 'heal_mp': {
      const heal = effect.value || 0;
      target.mp = Math.min(target.maxMp, target.mp + heal);
      result.heal = heal;
      result.text = `恢复 ${heal} 点MP`;
      break;
    }
    default:
      result.text = '产生效果';
  }

  return result;
}

/** 将宠物技能转换为战斗技能格式 */
/** 将宠物技能转换为战斗技能格式 */
function convertPetSkillToSkill(petSkill: PetSkill): Skill {
  // 从模板获取技能详细信息
  const template = getSkillTemplate(petSkill.templateId);

  // 根据技能类别确定伤害类型
  const getDamageType = (): 'physical' | 'magic' | 'true' | 'fixed' => {
    if (!template) return 'physical';
    if (template.category === '法术') return 'magic';
    return 'physical';
  };

  // 根据技能确定目标类型
  const getTargetType = (): 'single_enemy' | 'all_enemies' | 'single_ally' | 'all_allies' | 'self' => {
    if (!template) return 'single_enemy';
    // 法术类技能可能是群体攻击
    if (template.category === '法术' && template.name.includes('咒')) {
      return 'all_enemies';
    }
    return 'single_enemy';
  };

  const damageType = getDamageType();
  const targetType = getTargetType();
  const element = template?.element || 'none';

  // 计算技能倍率（基于技能等级）
  const baseMultiplier = 1.0;
  const levelBonus = (petSkill.level - 1) * 0.1; // 每级+10%
  const multiplier = baseMultiplier + levelBonus;

  return {
    id: petSkill.id,
    name: petSkill.name,
    description: template?.effect || '宠物技能',
    icon: '🐾',
    type: petSkill.type as 'active',
    damageType,
    levelRequirement: 1,
    rarity: 'common',
    targetType,
    element,
    mpCost: template?.mpCost || 10,
    cooldown: template?.cooldown || 0,
    hitCount: 1,
    effects: [{
      type: 'damage',
      damageType,
      element,
      baseValue: 10 + petSkill.level * 5, // 技能等级增加基础伤害
      multiplier,
      description: template?.effect || petSkill.name,
    }],
    multiplier,
  };
}

/** 查找战斗单位 */
function findUnit(id: string): CombatUnit | undefined {
  const state = battleState.value;
  if (!state) return undefined;

  for (const char of state.playerFormation.characters) {
    if (char?.id === id) return char;
  }
  for (const pet of state.playerFormation.pets) {
    if (pet?.id === id) return pet;
  }
  for (const enemy of state.enemies) {
    if (enemy.id === id) return enemy;
  }

  return undefined;
}

/** 检查战斗结束 */
function checkBattleEnd(): void {
  const state = battleState.value;
  if (!state) return;

  const playerAlive = state.playerFormation.characters.some(c => c && c.hp > 0) ||
    state.playerFormation.pets.some(p => p && p.hp > 0);
  const enemyAlive = state.enemies.some(e => e.hp > 0);

  if (!playerAlive || !enemyAlive) {
    endBattle(playerAlive);
  }
}

/** 结束战斗 */
export function endBattle(victory: boolean): void {
  const state = battleState.value;
  if (!state) return;

  // 计算战斗统计
  let totalDamageDealt = 0;
  let totalDamageTaken = 0;
  let criticalHits = 0;
  let skillsUsed = 0;

  for (const log of state.logs) {
    if (log.actor.isPlayer) {
      totalDamageDealt += log.result.damage || 0;
      if (log.result.isCritical) criticalHits++;
      if (log.action === 'skill') skillsUsed++;
    } else {
      totalDamageTaken += log.result.damage || 0;
    }
  }

  // 计算奖励
  let expReward = 0;
  let goldReward = 0;
  const itemDrops: { itemId: string; count: number }[] = [];

  if (victory) {
    // 根据敌人配置计算奖励
    for (const enemy of state.enemies) {
      // 获取敌人引用和模板
      const enemyRef = enemy.ref as Enemy | undefined;
      const templateId = enemyRef?.templateId || enemy.id.split('_').slice(0, -1).join('_') || enemy.id;
      const template = getEnemyTemplate(templateId);

      // 使用模板中的经验和金币奖励，如果没有则使用基础计算
      const baseExp = template?.expReward ?? Math.floor(20 + (enemy.stats.physicalAttack + enemy.stats.magicAttack) * 0.5);
      const baseGold = template?.goldReward ?? Math.floor(10 + enemy.maxHp * 0.1);

      expReward += baseExp;
      goldReward += baseGold;

      // 从敌人配置中获取掉落表
      if (template?.drops && template.drops.length > 0) {
        for (const drop of template.drops) {
          // 根据掉落概率判断是否掉落
          if (random() < drop.rate) {
            // 随机数量（在minCount和maxCount之间）
            const count = randomInt(drop.minCount, drop.maxCount);
            if (count > 0) {
              itemDrops.push({ itemId: drop.itemId, count });
            }
          }
        }
      }
    }

    // 触发任务事件：击杀怪物和战斗胜利
    const currentPlayer = player.value;
    if (currentPlayer) {
      // 触发战斗胜利事件
      updateBattleWinEvent(currentPlayer.id).catch(err =>
        console.error('[Battle] Failed to trigger battle win event:', err)
      );

      // 为每个被击败的敌人触发击杀事件
      for (const enemyUnit of state.enemies) {
        // 获取敌人引用
        const enemyRef = enemyUnit.ref as Enemy | undefined;

        // 判断是否是Boss
        const isBoss = enemyRef?.type === 'boss' ||
                       enemyUnit.name.includes('Boss') ||
                       enemyUnit.name.includes('BOSS') ||
                       enemyUnit.name.includes('首领');

        // 优先使用templateId，否则使用ID或名称
        const monsterId = enemyRef?.templateId || enemyUnit.id || `enemy_${enemyUnit.name}`;

        logger.debug('[Battle] Triggering kill quest event for:', monsterId, 'isBoss:', isBoss);

        updateKillQuestEvent(currentPlayer.id, monsterId, isBoss).catch(err =>
          console.error('[Battle] Failed to trigger kill event:', err)
        );
      }
    }
  }

  // 应用种族经验加成
  const currentPlayer = player.value;
  if (victory && currentPlayer && currentPlayer.race === 'human') {
    // 人族适应力：战斗经验+15%
    const expBonus = Math.floor(expReward * 0.15);
    expReward += expBonus;
    logger.debug(`[Battle] 人族经验加成: +${expBonus} (总计: ${expReward})`);
  }

  const result: BattleResult = {
    victory,
    stats: {
      rounds: state.round,
      totalDamageDealt,
      totalDamageTaken,
      criticalHits,
      skillsUsed,
    },
    rewards: {
      exp: expReward,
      gold: goldReward,
      items: itemDrops,
    },
  };

  battleState.value = {
    ...state,
    result,
  };
}

/** 清除战斗状态 */
export function clearBattle(): void {
  battleState.value = null;
  unitCooldowns.clear();
}

// ============================================
// 自动战斗配置
// ============================================

/** 自动战斗配置 - 从localStorage加载或使用默认值 */
function loadAutoBattleConfig(): AutoBattleConfig {
  try {
    const saved = localStorage.getItem('autoBattleConfig');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('[Battle] Failed to load auto battle config:', e);
  }
  return {
    character: { ...DEFAULT_AUTO_BATTLE_CONFIG.character },
    pet: { ...DEFAULT_AUTO_BATTLE_CONFIG.pet },
  };
}

/** 保存自动战斗配置 */
function saveAutoBattleConfig(config: AutoBattleConfig): void {
  try {
    localStorage.setItem('autoBattleConfig', JSON.stringify(config));
  } catch (e) {
    console.error('[Battle] Failed to save auto battle config:', e);
  }
}

/** 自动战斗配置信号 */
export const autoBattleConfig = signal<AutoBattleConfig>(loadAutoBattleConfig());

/** 更新角色自动战斗配置 */
export function updateCharacterAutoConfig(config: Partial<AutoBattleConfig['character']>): void {
  const newConfig = {
    ...autoBattleConfig.value,
    character: {
      ...autoBattleConfig.value.character,
      ...config,
    },
  };
  autoBattleConfig.value = newConfig;
  saveAutoBattleConfig(newConfig);
}

/** 更新宠物自动战斗配置 */
export function updatePetAutoConfig(config: Partial<AutoBattleConfig['pet']>): void {
  const newConfig = {
    ...autoBattleConfig.value,
    pet: {
      ...autoBattleConfig.value.pet,
      ...config,
    },
  };
  autoBattleConfig.value = newConfig;
  saveAutoBattleConfig(newConfig);
}

/** 重置自动战斗配置为默认值 */
export function resetAutoBattleConfig(): void {
  const defaultConfig: AutoBattleConfig = {
    character: { ...DEFAULT_AUTO_BATTLE_CONFIG.character },
    pet: { ...DEFAULT_AUTO_BATTLE_CONFIG.pet },
  };
  autoBattleConfig.value = defaultConfig;
  saveAutoBattleConfig(defaultConfig);
}

// ============================================
// 伙伴AI配置
// ============================================

/** 伙伴AI配置映射 - 从localStorage加载 */
function loadCompanionAIConfigs(): Map<string, CompanionAIConfig> {
  const configs = new Map<string, CompanionAIConfig>();
  try {
    const saved = localStorage.getItem('companionAIConfigs');
    if (saved) {
      const parsed = JSON.parse(saved);
      for (const [id, config] of Object.entries(parsed)) {
        configs.set(id, config as CompanionAIConfig);
      }
    }
  } catch (e) {
    console.error('[Battle] Failed to load companion AI configs:', e);
  }
  return configs;
}

/** 保存伙伴AI配置 */
function saveCompanionAIConfigs(configs: Map<string, CompanionAIConfig>): void {
  try {
    const obj: Record<string, CompanionAIConfig> = {};
    configs.forEach((config, id) => {
      obj[id] = config;
    });
    localStorage.setItem('companionAIConfigs', JSON.stringify(obj));
  } catch (e) {
    console.error('[Battle] Failed to save companion AI configs:', e);
  }
}

/** 伙伴AI配置映射 */
export const companionAIConfigs = signal<Map<string, CompanionAIConfig>>(loadCompanionAIConfigs());

/** 获取伙伴AI配置 */
export function getCompanionAIConfig(companionId: string): CompanionAIConfig {
  const config = companionAIConfigs.value.get(companionId);
  if (config) return config;

  // 返回默认配置
  return {
    companionId,
    strategy: DEFAULT_COMPANION_AI_CONFIG.strategy,
    preferredTarget: DEFAULT_COMPANION_AI_CONFIG.preferredTarget,
    skillPriority: [...DEFAULT_COMPANION_AI_CONFIG.skillPriority],
    protectTarget: DEFAULT_COMPANION_AI_CONFIG.protectTarget,
    defensiveHpThreshold: DEFAULT_COMPANION_AI_CONFIG.defensiveHpThreshold,
    autoHeal: DEFAULT_COMPANION_AI_CONFIG.autoHeal,
    healThreshold: DEFAULT_COMPANION_AI_CONFIG.healThreshold,
  };
}

/** 更新伙伴AI配置 */
export function updateCompanionAIConfig(companionId: string, config: Partial<Omit<CompanionAIConfig, 'companionId'>>): void {
  const currentConfig = getCompanionAIConfig(companionId);
  const newConfig = {
    ...currentConfig,
    ...config,
    companionId,
  };

  const newMap = new Map(companionAIConfigs.value);
  newMap.set(companionId, newConfig);
  companionAIConfigs.value = newMap;
  saveCompanionAIConfigs(newMap);
}

/** 重置伙伴AI配置为默认值 */
export function resetCompanionAIConfig(companionId: string): void {
  const newMap = new Map(companionAIConfigs.value);
  newMap.delete(companionId);
  companionAIConfigs.value = newMap;
  saveCompanionAIConfigs(newMap);
}

/** 检查敌人是否可捕捉 */
export function canCaptureEnemy(enemyUnit: CombatUnit): boolean {
  // 玩家方的单位不能捕捉
  if (enemyUnit.isPlayerSide) return false;

  // 已死亡的不能捕捉
  if (enemyUnit.hp <= 0) return false;

  // 获取敌人模板
  const enemyRef = enemyUnit.ref as Enemy | undefined;
  const templateId = enemyRef?.templateId || enemyUnit.id.split('_')[0];
  const template = getEnemyTemplate(templateId);

  // 没有模板或不可捕捉
  if (!template || !template.capturable) return false;

  // 只能捕捉普通怪物
  if (template.type !== 'normal') return false;

  // 检查宠物栏是否已满
  if (petCount.value >= maxPets) return false;

  return true;
}

/** 获取捕捉成功率（基于技能等级） */
export function getCaptureRate(enemyUnit: CombatUnit): number {
  if (!canCaptureEnemy(enemyUnit)) return 0;

  // 获取敌人模板
  const enemyRef = enemyUnit.ref as Enemy | undefined;
  const templateId = enemyRef?.templateId || enemyUnit.id.split('_')[0];
  const template = getEnemyTemplate(templateId);

  if (!template) return 0;

  // 使用玩家捕捉技能等级计算基础捕捉率
  const skillLevel = getCaptureSkillLevel();
  const baseCaptureRate = calculateCaptureRate(skillLevel, template.type);

  // 敌人HP越低，成功率越高（最多+30%）
  const hpRatio = enemyUnit.hp / enemyUnit.maxHp;
  const hpBonus = (1 - hpRatio) * 0.3;

  return Math.min(0.90, baseCaptureRate + hpBonus);
}
