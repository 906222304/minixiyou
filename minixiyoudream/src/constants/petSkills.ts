// 召唤兽技能数据 - 基于梦幻西游叶子猪技能查询器数据
// 来源: https://xyq.yzz.cn/special/zhsjn/

import type { PetSkillTemplate, SkillTier } from '@/types/pet';
import type { Element } from '@/types/common';

// ==================== 初级技能 ====================

const BASIC_SKILLS: PetSkillTemplate[] = [
  // 物理技能
  { id: 'skill_fanji', name: '反击', tier: 'basic', type: 'passive', category: '物理', effect: '受到物理攻击时有30%几率自动反击，反击伤害为正常伤害的50%' },
  { id: 'skill_fenzhen', name: '反震', tier: 'basic', type: 'passive', category: '物理', effect: '受到物理攻击时有30%几率给予对方反震，反震伤害为所受伤害的25%，避免被敌人连击' },
  { id: 'skill_xixue', name: '吸血', tier: 'basic', type: 'passive', category: '物理', effect: '物理攻击时，吸取对方所掉气血的25%，如果对方有异常状态，吸血后会中毒，攻击鬼魂类怪物时无效' },
  { id: 'skill_lianji', name: '连击', tier: 'basic', type: 'passive', category: '物理', effect: '45%的几率连续两次物理攻击，拥有此技能物理攻击效果会降低25%，如果对方有反震技能，只能攻击一次' },
  { id: 'skill_bisha', name: '必杀', tier: 'basic', type: 'passive', category: '物理', effect: '物理攻击时的必杀几率增加10%，出现必杀时伤害结果会加倍' },
  { id: 'skill_touxi', name: '偷袭', tier: 'basic', type: 'passive', category: '物理', effect: '身手灵敏，不会受到反击和反震。攻击效果增加5%' },
  { id: 'skill_qiangli', name: '强力', tier: 'basic', type: 'passive', category: '物理', effect: '增加(自身等级×0.4)的攻击，如果对方有防御或高级防御技能，伤害结果会减少20%' },

  // 防御技能
  { id: 'skill_fangyu', name: '防御', tier: 'basic', type: 'passive', category: '防御', effect: '增加(自身等级×0.6)的防御，但法术伤害能力会降低10%' },
  { id: 'skill_zhaojia', name: '招架', tier: 'basic', type: 'passive', category: '防御', effect: '15%的几率完全躲过敌人的物理攻击' },
  { id: 'skill_xingyun', name: '幸运', tier: 'basic', type: 'passive', category: '防御', effect: '不会受到必杀攻击' },
  { id: 'skill_dunqi', name: '盾气', tier: 'basic', type: 'passive', category: '防御', effect: '第2回合及以后进入战斗时临时增加自身等级×1的防御，此后每回合减少等级×0.2的防御，持续5回合' },

  // 速度技能
  { id: 'skill_feixing', name: '飞行', tier: 'basic', type: 'passive', category: '速度', effect: '躲避能力增加20%，躲避率增加5%，物理攻击命中增加20%，但受暗器攻击时伤害会增加30%' },
  { id: 'skill_minjie', name: '敏捷', tier: 'basic', type: 'passive', category: '速度', effect: '提升自身速度的10%' },

  // 辅助技能
  { id: 'skill_yezhan', name: '夜战', tier: 'basic', type: 'passive', category: '辅助', effect: '具备夜战能力，不受夜间攻击能力下降的影响（无夜战者夜间伤害将减少20%）' },
  { id: 'skill_ganjing', name: '感知', tier: 'basic', type: 'passive', category: '辅助', effect: '可以破解地府的修罗隐身、女儿村的楚楚可怜法术效果' },
  { id: 'skill_yinshen', name: '隐身', tier: 'basic', type: 'passive', category: '特殊', effect: '自动附加地府修罗隐身法术2～3回合，拥有此技能物理攻击能力会降低20%，隐身状态下无法使用法术' },
  { id: 'skill_zaisheng', name: '再生', tier: 'basic', type: 'passive', category: '辅助', effect: '战斗中每回合自动恢复(自身等级/2)的气血' },
  { id: 'skill_minsi', name: '冥思', tier: 'basic', type: 'passive', category: '法术', effect: '战斗中每回合自动恢复(自身等级/4)的魔法' },
  { id: 'skill_huigen', name: '慧根', tier: 'basic', type: 'passive', category: '法术', effect: '使用法术时所消耗的魔法降低为正常的75%' },
  { id: 'skill_shengji', name: '神迹', tier: 'basic', type: 'passive', category: '辅助', effect: '每回合结束时自动解除一切异常状态' },
  { id: 'skill_yongheng', name: '永恒', tier: 'basic', type: 'passive', category: '辅助', effect: '受到的辅助类法术效果持续回合加倍，如恢复气血、提升速度等' },
  { id: 'skill_jingshenjizhong', name: '精神集中', tier: 'basic', type: 'passive', category: '辅助', effect: '精神集中，可以抵御封类异常状态，但自己的物理攻击效果也会降低20%' },
  { id: 'skill_hezong', name: '合纵', tier: 'basic', type: 'passive', category: '物理', effect: '本方每有一种与其不同的召唤兽，则提高其等级/5.5的物理伤害结果。同时，被封印几率增加10%' },
  { id: 'skill_yizhi', name: '遗志', tier: 'basic', type: 'passive', category: '辅助', effect: '替代原召唤兽进入战斗时获得"遗志"：造成伤害提升5%，并获得原召唤兽的"遗志"(最多两层)' },

  // 特殊技能
  { id: 'skill_du', name: '毒', tier: 'basic', type: 'passive', category: '特殊', effect: '物理攻击时有15%的几率使敌人中毒，中毒后每回合减少10%的气血和5%的魔法' },
  { id: 'skill_qugui', name: '驱鬼', tier: 'basic', type: 'passive', category: '特殊', effect: '对鬼魂类怪物的物理、法术伤害效果增加50%，如果将鬼魂类怪物打死，对方将飞出场外而不能复活' },
  { id: 'skill_guihun', name: '鬼魂术', tier: 'basic', type: 'passive', category: '特殊', effect: '死亡5回合后自动复活，不受异常状态影响，但也不能使用药品和食物恢复气血' },
  { id: 'skill_mozhixin', name: '魔之心', tier: 'basic', type: 'passive', category: '法术', effect: '对敌人的法术伤害效果提高10%' },
  { id: 'skill_shenyoufusheng', name: '神佑复生', tier: 'basic', type: 'passive', category: '特殊', effect: '战斗死亡时有20%的几率复活，并恢复60%的气血，如果同时拥有鬼魂术，神佑复生的效果将取消' },
  { id: 'skill_foudingxinyang', name: '否定信仰', tier: 'basic', type: 'passive', category: '特殊', effect: '不受异常、辅助效果影响，受到鬼魂类怪物攻击时伤害增加20%，不能同时拥有某些信仰类技能' },
  { id: 'skill_zhuozhuang', name: '茁壮', tier: 'basic', type: 'passive', category: '防御', effect: '提升25%最大生命值，但是无法再触发神佑复生和鬼魂术，五行为木时生效' },

  // 法术技能
  { id: 'skill_leiji', name: '雷击', tier: 'basic', type: 'active', category: '法术', effect: '雷属性的攻击法术，按召唤兽等级附加一定的法术伤害', element: 'metal' as Element },
  { id: 'skill_luoyan', name: '落岩', tier: 'basic', type: 'active', category: '法术', effect: '土属性的攻击法术，按召唤兽等级附加一定的法术伤害', element: 'earth' as Element },
  { id: 'skill_shuigong', name: '水攻', tier: 'basic', type: 'active', category: '法术', effect: '水属性的攻击法术，按召唤兽等级附加一定的法术伤害', element: 'water' as Element },
  { id: 'skill_liehuo', name: '烈火', tier: 'basic', type: 'active', category: '法术', effect: '火属性的攻击法术，按召唤兽等级附加一定的法术伤害', element: 'fire' as Element },
  { id: 'skill_fashulianji', name: '法术连击', tier: 'basic', type: 'passive', category: '法术', effect: '使用法术攻击目标时会有一定几率出现连续2次攻击敌人' },
  { id: 'skill_fashubaoji', name: '法术暴击', tier: 'basic', type: 'passive', category: '法术', effect: '使用法术攻击目标时会有一定几率使法术伤害值加倍' },
  { id: 'skill_fashubodong', name: '法术波动', tier: 'basic', type: 'passive', category: '法术', effect: '使用法术攻击目标时伤害在原有伤害值基础上会有大幅度的波动' },
  { id: 'skill_fashudikang', name: '法术抵抗', tier: 'basic', type: 'passive', category: '防御', effect: '减少5%所受的法术伤害，但同时物理伤害能力减少10%' },
  { id: 'skill_fashufenzhen', name: '法术反震', tier: 'basic', type: 'passive', category: '防御', effect: '受到法术攻击时：30%反震对方，反震伤害为你所受伤害的25%' },

  // 属性吸收技能
  { id: 'skill_leishuxingxishou', name: '雷属性吸收', tier: 'basic', type: 'passive', category: '吸收', effect: '50%的几率免受雷属性法术伤害，并按应受伤害的大小恢复气血，但受到土属性法术攻击时伤害会增加30%' },
  { id: 'skill_tushuxingxishou', name: '土属性吸收', tier: 'basic', type: 'passive', category: '吸收', effect: '50%的几率免受土属性法术伤害，并按应受伤害的大小恢复气血，但受到雷属性法术攻击时伤害会增加30%' },
  { id: 'skill_huoshuxingxishou', name: '火属性吸收', tier: 'basic', type: 'passive', category: '吸收', effect: '50%的几率免受火属性法术伤害，并按应受伤害的大小恢复气血，但受到水属性法术攻击时伤害会增加30%' },
  { id: 'skill_shuishuxingxishou', name: '水属性吸收', tier: 'basic', type: 'passive', category: '吸收', effect: '50%的几率免受水属性法术伤害，并按应受伤害的大小恢复气血，但受到火属性法术攻击时伤害会增加30%' },
];

// ==================== 弱点技能 ====================

const WEAKNESS_SKILLS: PetSkillTemplate[] = [
  { id: 'skill_ruodianlei', name: '弱点雷', tier: 'weakness', type: 'passive', category: '弱点', effect: '弱点为雷，受到雷属性法术攻击时伤害增加50%' },
  { id: 'skill_ruodiantu', name: '弱点土', tier: 'weakness', type: 'passive', category: '弱点', effect: '弱点为土，受到土属性法术攻击时伤害增加50%' },
  { id: 'skill_ruodianshui', name: '弱点水', tier: 'weakness', type: 'passive', category: '弱点', effect: '弱点为水，受到水属性法术攻击时伤害增加50%' },
  { id: 'skill_ruodianhuo', name: '弱点火', tier: 'weakness', type: 'passive', category: '弱点', effect: '弱点为火，受到火属性法术攻击时伤害增加50%' },
  { id: 'skill_chidun', name: '迟钝', tier: 'weakness', type: 'passive', category: '弱点', effect: '天生行动缓慢，速度效果会降低20%' },
];

// ==================== 高级技能 ====================

const ADVANCED_SKILLS: PetSkillTemplate[] = [
  // 高级物理技能
  { id: 'skill_gj_fanji', name: '高级反击', tier: 'advanced', type: 'passive', category: '物理', effect: '受到物理攻击时有30%几率自动反击，反击的伤害与正常攻击相同' },
  { id: 'skill_gj_fenzhen', name: '高级反震', tier: 'advanced', type: 'passive', category: '物理', effect: '受到物理攻击时有30%几率给予对方反震，反震伤害为所受伤害的50%' },
  { id: 'skill_gj_xixue', name: '高级吸血', tier: 'advanced', type: 'passive', category: '物理', effect: '物理攻击时，吸取对方所掉气血的30%，攻击鬼魂类怪物时无效' },
  { id: 'skill_gj_lianji', name: '高级连击', tier: 'advanced', type: 'passive', category: '物理', effect: '55%的几率连续两次物理攻击，拥有此技能物理攻击效果会降低20%，如果对方有反震技能，只能攻击一次' },
  { id: 'skill_gj_bisha', name: '高级必杀', tier: 'advanced', type: 'passive', category: '物理', effect: '物理攻击时的必杀几率增加20%，出现必杀时伤害结果会加倍' },
  { id: 'skill_gj_touxi', name: '高级偷袭', tier: 'advanced', type: 'passive', category: '物理', effect: '身手灵敏，不会受到反击和反震，物理攻击效果提高10%' },
  { id: 'skill_gj_qiangli', name: '高级强力', tier: 'advanced', type: 'passive', category: '物理', effect: '增加(自身等级×0.55)的攻击，如果对方有防御或高级防御技能，伤害结果会减少20%' },

  // 高级防御技能
  { id: 'skill_gj_fangyu', name: '高级防御', tier: 'advanced', type: 'passive', category: '防御', effect: '增加(自身等级×0.8)的防御，但法术伤害能力会降低10%' },
  { id: 'skill_gj_zhaojia', name: '高级招架', tier: 'advanced', type: 'passive', category: '防御', effect: '每回合受到的物理伤害结果减免20%；若对方有高级强力，则高级招架技能的减免伤害效果无效' },
  { id: 'skill_gj_xingyun', name: '高级幸运', tier: 'advanced', type: 'passive', category: '防御', effect: '不会受到必杀攻击，并有5%几率躲避敌人的法术攻击' },
  { id: 'skill_gj_dunqi', name: '高级盾气', tier: 'advanced', type: 'passive', category: '防御', effect: '第2回合及以后进入战斗时临时增加自身等级×2的防御，此后每回合减少等级×0.4的防御，持续5回合' },
  { id: 'skill_xinxinxiangrong', name: '欣欣向荣', tier: 'advanced', type: 'passive', category: '防御', effect: '提升40%最大生命值，但是无法再触发神佑复生和鬼魂术，五行为木时生效' },

  // 高级速度技能
  { id: 'skill_gj_feixing', name: '高级飞行', tier: 'advanced', type: 'passive', category: '速度', effect: '躲避能力增加30%、躲避率增加10%，物理攻击命中几率增加20%' },
  { id: 'skill_gj_minjie', name: '高级敏捷', tier: 'advanced', type: 'passive', category: '速度', effect: '提升自身速度的20%' },

  // 高级辅助技能
  { id: 'skill_gj_yezhan', name: '高级夜战', tier: 'advanced', type: 'passive', category: '物理', effect: '具备夜战能力，不受夜间攻击能力下降的影响，夜间躲避能力提高20%' },
  { id: 'skill_gj_ganjing', name: '高级感知', tier: 'advanced', type: 'passive', category: '辅助', effect: '破解地府的修罗隐身、女儿村的楚楚可怜法术效果，躲避能力提高10%' },
  { id: 'skill_gj_yinshen', name: '高级隐身', tier: 'advanced', type: 'passive', category: '特殊', effect: '自动附加地府修罗隐身法术3～5回合，拥有此技能物理攻击能力会降低15%，隐身状态下无法使用法术' },
  { id: 'skill_gj_zaisheng', name: '高级再生', tier: 'advanced', type: 'passive', category: '辅助', effect: '战斗中每回合自动恢复气血，恢复数值与自身等级相同' },
  { id: 'skill_gj_minsi', name: '高级冥思', tier: 'advanced', type: 'passive', category: '法术', effect: '战斗中每回合自动恢复(自身等级/3)的魔法' },
  { id: 'skill_gj_huigen', name: '高级慧根', tier: 'advanced', type: 'passive', category: '法术', effect: '使用法术时所消耗的魔法降低为正常的50%' },
  { id: 'skill_gj_shengji', name: '高级神迹', tier: 'advanced', type: 'passive', category: '辅助', effect: '不受除日月乾坤外的所有异常状态影响' },
  { id: 'skill_gj_yongheng', name: '高级永恒', tier: 'advanced', type: 'passive', category: '辅助', effect: '受到的辅助类法术效果持续回合数×4' },
  { id: 'skill_gj_jingshenjizhong', name: '高级精神集中', tier: 'advanced', type: 'passive', category: '辅助', effect: '精神集中，可以抵御封类异常状态，躲避力提高10%，但物理攻击能力会降低20%' },
  { id: 'skill_gj_hezong', name: '高级合纵', tier: 'advanced', type: 'passive', category: '物理', effect: '本方每有一种与其不同的召唤兽，则提高其等级/4的物理伤害结果。同时，被封印几率增加10%' },
  { id: 'skill_gj_duxing', name: '高级独行', tier: 'advanced', type: 'passive', category: '辅助', effect: '抵抗封印的能力提高50%；不会触发合击' },
  { id: 'skill_gj_yizhi', name: '高级遗志', tier: 'advanced', type: 'passive', category: '辅助', effect: '替代原召唤兽进入战斗时获得"遗志"：造成伤害提升10%，并获得原召唤兽的"遗志"(最多两层)' },
  { id: 'skill_yihuajiemu', name: '移花接木', tier: 'advanced', type: 'passive', category: '防御', effect: '可以躲避暗器伤害，并按应受伤害的30%恢复HP' },

  // 高级特殊技能
  { id: 'skill_gj_du', name: '高级毒', tier: 'advanced', type: 'passive', category: '特殊', effect: '自身对毒免疫，物理攻击时有20%的几率使敌人中毒，中毒后每回合减少10%的气血和5%的魔法' },
  { id: 'skill_gj_qugui', name: '高级驱鬼', tier: 'advanced', type: 'passive', category: '特殊', effect: '对鬼魂类怪物的物理、法术伤害效果加倍，如果将鬼魂类怪物打死，对方将飞出场外而不能复活' },
  { id: 'skill_gj_guihun', name: '高级鬼魂术', tier: 'advanced', type: 'passive', category: '特殊', effect: '死亡5回合后自动复活，不受异常状态影响' },
  { id: 'skill_gj_mozhixin', name: '高级魔之心', tier: 'advanced', type: 'passive', category: '法术', effect: '对敌人的法术伤害效果提高20%' },
  { id: 'skill_gj_shenyoufusheng', name: '高级神佑复生', tier: 'advanced', type: 'passive', category: '特殊', effect: '战斗死亡时有30%的几率复活为正常状态，如果同时拥有鬼魂术，神佑复生的效果将取消' },
  { id: 'skill_gj_foudingxinyang', name: '高级否定信仰', tier: 'advanced', type: 'passive', category: '特殊', effect: '不受异常、辅助效果影响，受法术伤害减少20%，受到鬼魂类怪物攻击时伤害增加20%' },
  { id: 'skill_gj_fashudikang', name: '高级法术抵抗', tier: 'advanced', type: 'passive', category: '防御', effect: '减少10%所受的法术伤害，但同时物理伤害能力减少10%' },

  // 高级法术技能
  { id: 'skill_gj_bengleizhou', name: '奔雷咒', tier: 'advanced', type: 'active', category: '法术', effect: '雷属性的攻击法术，按召唤兽等级附加一定的法术伤害，攻击人数为(自身等级/30+1)，最多为3人', element: 'metal' as Element },
  { id: 'skill_gj_taishanyading', name: '泰山压顶', tier: 'advanced', type: 'active', category: '法术', effect: '土属性的攻击法术，按召唤兽等级附加一定的法术伤害，攻击人数为(自身等级/30+1)，最多为3人', element: 'earth' as Element },
  { id: 'skill_gj_shuimanjinshan', name: '水漫金山', tier: 'advanced', type: 'active', category: '法术', effect: '水属性的攻击法术，按召唤兽等级附加一定的法术伤害，攻击人数为(自身等级/30+1)，最多为3人', element: 'water' as Element },
  { id: 'skill_gj_diyuliehuo', name: '地狱烈火', tier: 'advanced', type: 'active', category: '法术', effect: '火属性的攻击法术，按召唤兽等级附加一定的法术伤害，攻击人数为(自身等级/30+1)，最多为3人', element: 'fire' as Element },
  { id: 'skill_gj_fashulianji', name: '高级法术连击', tier: 'advanced', type: 'passive', category: '法术', effect: '使用法术攻击目标时会有较大几率出现连续2次攻击敌人' },
  { id: 'skill_gj_fashubaoji', name: '高级法术暴击', tier: 'advanced', type: 'passive', category: '法术', effect: '使用法术攻击目标时会有较大几率使法术伤害值加倍' },
  { id: 'skill_gj_fashubodong', name: '高级法术波动', tier: 'advanced', type: 'passive', category: '法术', effect: '使用法术攻击目标时伤害在原有伤害值基础上会有较大幅度的上下波动' },

  // 高级属性吸收技能
  { id: 'skill_gj_leishuxingxishou', name: '高级雷属性吸收', tier: 'advanced', type: 'passive', category: '吸收', effect: '50%的几率免受雷属性法术伤害，并按应受伤害的大小恢复气血，吸收失败也可减少法术伤害的30%' },
  { id: 'skill_gj_tushuxingxishou', name: '高级土属性吸收', tier: 'advanced', type: 'passive', category: '吸收', effect: '50%的几率免受土属性法术伤害，并按应受伤害的大小恢复气血，吸收失败也可减少法术伤害的30%' },
  { id: 'skill_gj_huoshuxingxishou', name: '高级火属性吸收', tier: 'advanced', type: 'passive', category: '吸收', effect: '50%的几率免受火属性法术伤害，并按应受伤害的大小恢复气血，吸收失败也可减少法术伤害的30%' },
  { id: 'skill_gj_shuishuxingxishou', name: '高级水属性吸收', tier: 'advanced', type: 'passive', category: '吸收', effect: '50%的几率免受水属性法术伤害，并按应受伤害的大小恢复气血，吸收失败也可减少法术伤害的30%' },
];

// ==================== 特殊技能 ====================

const SPECIAL_SKILLS: PetSkillTemplate[] = [
  { id: 'skill_hahaoyueyuan', name: '花好月圆', tier: 'special', type: 'passive', category: '特殊', effect: '每回合结束时，有25%几率增添自身颜色并恢复自身等级×8气血（只有长乐灵仙拥有此技能）' },
  { id: 'skill_tianhuzhiwu', name: '天狐之舞', tier: 'special', type: 'passive', category: '特殊', effect: '阵亡后进入天狐状态：恢复（20%×气血上限）的气血值，主动技能造成的伤害提升10%，回合结束阵亡' },
  { id: 'skill_chuqizhisheng', name: '出奇制胜', tier: 'special', type: 'passive', category: '法术', effect: '第二回合及之后入场后，使用的第一个法术造成的法术伤害提升25%（仅狐族召唤兽携带生效）' },
  { id: 'skill_chuqibuyi', name: '出其不意', tier: 'special', type: 'passive', category: '特殊', effect: '使用本回合己方召唤兽未使用过的技能时，造成的伤害结果提升15%' },
  { id: 'skill_siwangzhaohuan', name: '死亡召唤', tier: 'special', type: 'passive', category: '特殊', effect: '攻击的同时有一定几率降低对手的气血上限；另有10%使敌人附加死亡禁锢效果，效果持续10回合' },
  { id: 'skill_shane_youbao', name: '善恶有报', tier: 'special', type: 'passive', category: '特殊', effect: '攻击时有一定几率给予对手造成双倍的伤害，也有可能为对方恢复一定气血' },
  { id: 'skill_lipihuashan', name: '力劈华山', tier: 'special', type: 'active', category: '物理', effect: '以强大的伤害力给敌人猛烈的攻击，命中临时提高LV×2+10' },
  { id: 'skill_yewuqingcheng', name: '夜舞倾城', tier: 'special', type: 'active', category: '物理', effect: '按自身力量点×1.5+自己速度/3对对方造成伤害（攻击目标为人物时效果减半）' },
  { id: 'skill_fashufangyu', name: '法术防御', tier: 'special', type: 'active', category: '防御', effect: '极强的法术防御技能。可以防御法术攻击，减少65%的法术伤害，但无法防御物理攻击。效果可以持续6回合' },
  { id: 'skill_bileijipo', name: '壁垒击破', tier: 'special', type: 'passive', category: '物理', effect: '忽视防御的攻击。攻击的目标防御，则会受到更大伤害。会忽视"高级防御"和"防御"这两个召唤兽技能产生的技能效果' },
  { id: 'skill_shixuezhuiji', name: '嗜血追击', tier: 'special', type: 'passive', category: '物理', effect: '使用物理攻击击倒目标时，会继续攻击另一个目标一次，此效果每回合只会触发一次' },
  { id: 'skill_xumizhenyan', name: '须弥真言', tier: 'special', type: 'passive', category: '法术', effect: '增加魔力×0.4的法术伤害力' },
  { id: 'skill_jingtai_miaodi', name: '净台妙谛', tier: 'special', type: 'passive', category: '防御', effect: '增加自身体质×成长×2的气血' },
  { id: 'skill_guanzhaowanxiang', name: '观照万象', tier: 'special', type: 'active', category: '特殊', effect: '使用所有的主动技能进攻目标，冷却回合数150，回合数＞10可以使用（唯有谛听可拥有此技能）' },
  { id: 'skill_shanggulingfu', name: '上古灵符', tier: 'special', type: 'active', category: '法术', effect: '随机施展冰冻(水属性法术)、流沙(土属性法术)、心火(火属性法术)、怒雷(雷属性法术)' },
  { id: 'skill_fengqilongyou', name: '风起龙游', tier: 'special', type: 'passive', category: '特殊', effect: '仅龙族召唤兽携带生效，攻击速度低于自身的目标，提升10%的伤害效果' },
];

// ==================== 超级技能（神兽专属） ====================

const SUPER_SKILLS: PetSkillTemplate[] = [
  { id: 'skill_cj_yezhan', name: '超级夜战', tier: 'super', type: 'passive', category: '物理', effect: '造成物理伤害提高10%；夜间物理伤害效果不会减少，物理躲避能力增加20%，且在攻击时显示目标的气血条' },
  { id: 'skill_cj_fanji', name: '超级反击', tier: 'super', type: 'passive', category: '物理', effect: '受普通物理攻击后：30%几率用物理攻击反击；在场时主人首次被敌方物理攻击时，必定用物理攻击进行反击' },
  { id: 'skill_cj_fenzhen', name: '超级反震', tier: 'super', type: 'passive', category: '物理', effect: '受到物理攻击时：30%反震对方，反震伤害为你所受伤害的60%；避免被敌人连击' },
  { id: 'skill_cj_xixue', name: '超级吸血', tier: 'super', type: 'passive', category: '物理', effect: '物理攻击时：获得对方损失气血的30%；并将获得的溢出气血的50%转化为护盾' },
  { id: 'skill_cj_lianji', name: '超级连击', tier: 'super', type: 'passive', category: '物理', effect: '普通攻击时：55%几率攻击2次，触发连击时有15%几率额外攻击1次；物理伤害效果降低20%' },
  { id: 'skill_cj_feixing', name: '超级飞行', tier: 'super', type: 'passive', category: '速度', effect: '物理攻击命中几率增加20%；物理躲避能力提高30%；物理躲避率提高10%；天气为"风"时造成的物理伤害提升20%' },
  { id: 'skill_cj_yinshen', name: '超级隐身', tier: 'super', type: 'passive', category: '特殊', effect: '进入战斗后，获得修罗隐身状态3~5回合；隐身时不会被攻击；物理攻击能力降低10%；受到的伤害也降低10%' },
  { id: 'skill_cj_ganjing', name: '超级感知', tier: 'super', type: 'passive', category: '辅助', effect: '可攻击修罗隐身、楚楚可怜状态之敌；物理躲避能力提高10%；在场时主人也获得"感知"，最多持续5回合' },
  { id: 'skill_cj_zaisheng', name: '超级再生', tier: 'super', type: 'passive', category: '辅助', effect: '每回合恢复自身等级×1的气血；有10%几率回复自身等级×12的气血' },
  { id: 'skill_cj_minsi', name: '超级冥思', tier: 'super', type: 'passive', category: '法术', effect: '每回合恢复自身等级/2的魔法；在场时主人获得"冥思"，最多持续5回合' },
  { id: 'skill_cj_qugui', name: '超级驱鬼', tier: 'super', type: 'passive', category: '特殊', effect: '对有鬼魂术之敌，物理及法术伤害效果增加100%；可将鬼魂术之敌击飞，使其不能复活' },
  { id: 'skill_cj_du', name: '超级毒', tier: 'super', type: 'passive', category: '特殊', effect: '自身对毒免疫；物理攻击后：20%几率使敌人中毒；且随机降低中毒目标的攻击、防御、法伤或法防' },
  { id: 'skill_cj_huigen', name: '超级慧根', tier: 'super', type: 'passive', category: '法术', effect: '使用法术时所消耗的魔法降低为正常的50%，且有15%的几率不消耗魔法' },
  { id: 'skill_cj_bisha', name: '超级必杀', tier: 'super', type: 'passive', category: '物理', effect: '物理攻击的必杀几率增加20%；且必杀时有25%的几率造成3-4倍的必杀伤害' },
  { id: 'skill_cj_xingyun', name: '超级幸运', tier: 'super', type: 'passive', category: '防御', effect: '受到的物理/法术伤害暴击倍率降低50%；且有5%的概率免疫受到的攻击' },
  { id: 'skill_cj_shengji', name: '超级神迹', tier: 'super', type: 'passive', category: '辅助', effect: '不受除日月乾坤外的所有异常状态影响；回合结束时，若主人倒地，尝试复活并解除其封印，恢复其自身等级×12的气血后自己离场' },
  { id: 'skill_cj_zhaojia', name: '超级招架', tier: 'super', type: 'passive', category: '防御', effect: '每回合受到的第1次物理伤害结果减免20%；且进战斗时，获得一层"金身"' },
  { id: 'skill_cj_minjie', name: '超级敏捷', tier: 'super', type: 'passive', category: '速度', effect: '速度增加20%；5%概率额外行动一次' },
  { id: 'skill_cj_mozhixin', name: '超级魔之心', tier: 'super', type: 'passive', category: '法术', effect: '法术伤害效果提高25%' },
  { id: 'skill_cj_touxi', name: '超级偷袭', tier: 'super', type: 'passive', category: '物理', effect: '避免被敌人反击；避免被敌人反震；物理伤害效果提升15%' },
  { id: 'skill_cj_qiangli', name: '超级强力', tier: 'super', type: 'passive', category: '物理', effect: '物理攻击能力增加自己等级×0.7；攻击有招架类技能的敌人时不会减少伤害结果' },
  { id: 'skill_cj_fangyu', name: '超级防御', tier: 'super', type: 'passive', category: '防御', effect: '提高自身等级×1的防御' },
  { id: 'skill_cj_fashulianji', name: '超级法术连击', tier: 'super', type: 'passive', category: '法术', effect: '法术攻击时：30%几率攻击2次；（第二次伤害效果降低25%）' },
  { id: 'skill_cj_fashubaoji', name: '超级法术暴击', tier: 'super', type: 'passive', category: '法术', effect: '法术攻击时：20%几率出现暴击；且暴击时有10%的几率造成3-4倍的暴击伤害' },
  { id: 'skill_cj_fashubodong', name: '超级法术波动', tier: 'super', type: 'passive', category: '法术', effect: '法术伤害效果巨幅波动；避免被敌人法术反震' },
  { id: 'skill_cj_bileijipo', name: '超级壁垒击破', tier: 'super', type: 'passive', category: '物理', effect: '发动物理攻击敌人，并略提高伤害；若敌人防御，则伤害巨幅提高；忽视等级×1.2的防御' },
];

// ==================== 导出技能数据 ====================

/** 所有技能模板 */
export const PET_SKILL_TEMPLATES: Record<string, PetSkillTemplate> = {
  ...Object.fromEntries(BASIC_SKILLS.map(s => [s.id, s])),
  ...Object.fromEntries(WEAKNESS_SKILLS.map(s => [s.id, s])),
  ...Object.fromEntries(ADVANCED_SKILLS.map(s => [s.id, s])),
  ...Object.fromEntries(SPECIAL_SKILLS.map(s => [s.id, s])),
  ...Object.fromEntries(SUPER_SKILLS.map(s => [s.id, s])),
};

/** 按等级获取技能列表 */
export function getSkillsByTier(tier: SkillTier): PetSkillTemplate[] {
  switch (tier) {
    case 'basic': return BASIC_SKILLS;
    case 'weakness': return WEAKNESS_SKILLS;
    case 'advanced': return ADVANCED_SKILLS;
    case 'special': return SPECIAL_SKILLS;
    case 'super': return SUPER_SKILLS;
  }
}

/** 获取技能模板 */
export function getSkillTemplate(id: string): PetSkillTemplate | undefined {
  return PET_SKILL_TEMPLATES[id];
}

/** 获取所有技能模板 */
export function getAllSkillTemplates(): PetSkillTemplate[] {
  return Object.values(PET_SKILL_TEMPLATES);
}

/** 技能等级权重（用于随机抽取） */
export const SKILL_TIER_WEIGHTS: { tier: SkillTier; weight: number }[] = [
  { tier: 'basic', weight: 60 },
  { tier: 'advanced', weight: 25 },
  { tier: 'special', weight: 10 },
  { tier: 'super', weight: 5 },
];

/** 随机抽取技能等级 */
export function rollSkillTier(prng: () => number = Math.random): SkillTier {
  const roll = prng() * 100;
  let cumulative = 0;

  for (const { tier, weight } of SKILL_TIER_WEIGHTS) {
    cumulative += weight;
    if (roll < cumulative) {
      return tier;
    }
  }

  return 'basic';
}

/** 计算技能评分 */
export function calculateSkillScore(skill: PetSkillTemplate): number {
  const tierScores: Record<SkillTier, number> = {
    basic: 1,
    weakness: 0.5,
    advanced: 3,
    special: 8,
    super: 15,
  };
  return tierScores[skill.tier];
}
