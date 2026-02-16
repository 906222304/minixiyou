// 通用图标组件 - 支持emoji和图片

import React from 'react';
import { IconConfig, isImageIcon, getIconDisplay } from '@/constants/iconConfig';

interface IconProps {
  config: IconConfig;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const SIZE_MAP = {
  xs: 'text-xs w-4 h-4',      // 16px
  sm: 'text-sm w-5 h-5',      // 20px
  md: 'text-base w-6 h-6',    // 24px
  lg: 'text-lg w-8 h-8',      // 32px
  xl: 'text-xl w-12 h-12',    // 48px
};

const EMOJI_SIZE_MAP = {
  xs: 'text-xs',      // 12px
  sm: 'text-sm',      // 14px
  md: 'text-base',    // 16px
  lg: 'text-lg',      // 18px
  xl: 'text-2xl',     // 24px
};

export const Icon: React.FC<IconProps> = ({
  config,
  size = 'md',
  className = '',
  onClick,
}) => {
  if (isImageIcon(config)) {
    const src = getIconDisplay(config);
    return (
      <img
        src={src}
        alt={config.alt || ''}
        className={`${SIZE_MAP[size]} object-contain ${className}`}
        onClick={onClick}
      />
    );
  }

  return (
    <span
      className={`${EMOJI_SIZE_MAP[size]} ${className}`}
      onClick={onClick}
      role="img"
      aria-label={config.alt || ''}
    >
      {config.value}
    </span>
  );
};

// 预设图标组件
interface PresetIconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

// 门派图标
export const FactionIcon: React.FC<PresetIconProps & { factionId: string }> = ({
  factionId,
  ...props
}) => {
  const { getFactionIcon } = require('@/constants/iconConfig');
  return <Icon config={getFactionIcon(factionId)} {...props} />;
};

// 套装图标
export const SetIcon: React.FC<PresetIconProps & { setId: string }> = ({
  setId,
  ...props
}) => {
  const { getSetIcon } = require('@/constants/iconConfig');
  return <Icon config={getSetIcon(setId)} {...props} />;
};

// 神兽图标
export const DivineBeastIcon: React.FC<PresetIconProps & { petId: string }> = ({
  petId,
  ...props
}) => {
  const { getDivineBeastIcon } = require('@/constants/iconConfig');
  return <Icon config={getDivineBeastIcon(petId)} {...props} />;
};

// 特效图标
export const EffectIcon: React.FC<PresetIconProps & { effectId: string }> = ({
  effectId,
  ...props
}) => {
  const { getEffectIcon } = require('@/constants/iconConfig');
  return <Icon config={getEffectIcon(effectId)} {...props} />;
};

// 特技图标
export const SkillIcon: React.FC<PresetIconProps & { skillId: string }> = ({
  skillId,
  ...props
}) => {
  const { getSkillIcon } = require('@/constants/iconConfig');
  return <Icon config={getSkillIcon(skillId)} {...props} />;
};

export default Icon;
