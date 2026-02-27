// 头像常量定义

/** 头像尺寸 */
export type AvatarSize = 'small' | 'medium' | 'large';

/** 头像信息 */
export interface AvatarInfo {
  id: string;
  name: string;
  /** 描述/角色类型 */
  description: string;
}

/** 所有可用头像列表 */
export const AVATARS: AvatarInfo[] = [
  { id: 'avatar_01', name: '剑侠客', description: '人族·剑侠' },
  { id: 'avatar_02', name: '剑侠客', description: '人族·剑侠(渡劫)' },
  { id: 'avatar_03', name: '逍遥生', description: '人族·书生' },
  { id: 'avatar_04', name: '逍遥生', description: '人族·书生(渡劫)' },
  { id: 'avatar_05', name: '飞燕女', description: '人族·侠女' },
  { id: 'avatar_06', name: '飞燕女', description: '人族·侠女(渡劫)' },
  { id: 'avatar_07', name: '英女侠', description: '人族·女侠' },
  { id: 'avatar_08', name: '英女侠', description: '人族·女侠(渡劫)' },
  { id: 'avatar_09', name: '巨魔王', description: '魔族·战将' },
  { id: 'avatar_10', name: '巨魔王', description: '魔族·战将(渡劫)' },
  { id: 'avatar_11', name: '虎头怪', description: '魔族·猛将' },
  { id: 'avatar_12', name: '虎头怪', description: '魔族·猛将(渡劫)' },
  { id: 'avatar_13', name: '骨精灵', description: '魔族·妖女' },
  { id: 'avatar_14', name: '骨精灵', description: '魔族·妖女(渡劫)' },
  { id: 'avatar_15', name: '狐美人', description: '魔族·狐仙' },
  { id: 'avatar_16', name: '狐美人', description: '魔族·狐仙(渡劫)' },
  { id: 'avatar_17', name: '神天兵', description: '仙族·天将' },
  { id: 'avatar_18', name: '神天兵', description: '仙族·天将(渡劫)' },
  { id: 'avatar_19', name: '龙太子', description: '仙族·龙族' },
  { id: 'avatar_20', name: '龙太子', description: '仙族·龙族(渡劫)' },
  { id: 'avatar_21', name: '舞天姬', description: '仙族·天女' },
  { id: 'avatar_22', name: '舞天姬', description: '仙族·天女(渡劫)' },
  { id: 'avatar_23', name: '玄彩娥', description: '仙族·仙子' },
  { id: 'avatar_24', name: '玄彩娥', description: '仙族·仙子(渡劫)' },
  { id: 'avatar_25', name: '巫蛮儿', description: '人族·巫女' },
  { id: 'avatar_26', name: '巫蛮儿', description: '人族·巫女(渡劫)' },
  { id: 'avatar_27', name: '杀破狼', description: '魔族·刺客' },
  { id: 'avatar_28', name: '杀破狼', description: '魔族·刺客(渡劫)' },
  { id: 'avatar_29', name: '羽灵神', description: '仙族·羽族' },
  { id: 'avatar_30', name: '羽灵神', description: '仙族·羽族(渡劫)' },
  { id: 'avatar_31', name: '偃无师', description: '人族·机关' },
  { id: 'avatar_32', name: '偃无师', description: '人族·机关(渡劫)' },
  { id: 'avatar_33', name: '鬼潇潇', description: '魔族·鬼女' },
  { id: 'avatar_34', name: '鬼潇潇', description: '魔族·鬼女(渡劫)' },
];

/** 根据种族筛选头像 */
export const AVATARS_BY_RACE = {
  human: AVATARS.filter((_, i) => [0, 1, 2, 3, 4, 5, 6, 7, 24, 25, 30, 31].includes(i)),
  demon: AVATARS.filter((_, i) => [8, 9, 10, 11, 12, 13, 14, 15, 26, 27, 32, 33].includes(i)),
  immortal: AVATARS.filter((_, i) => [16, 17, 18, 19, 20, 21, 22, 23, 28, 29].includes(i)),
};

/** 获取头像URL */
export function getAvatarUrl(avatarId: string, size: AvatarSize = 'medium'): string {
  return `/avatars/${avatarId}_${size}.png`;
}

/** 获取头像信息 */
export function getAvatarInfo(avatarId: string): AvatarInfo | undefined {
  return AVATARS.find(a => a.id === avatarId);
}

/** 默认头像ID */
export const DEFAULT_AVATAR_ID = 'avatar_01';
