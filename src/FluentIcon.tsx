import { useState } from 'react';
import type { IconEntry } from './types';
import { iconByEmoji, iconCdnUrl, iconLocalUrl } from './icons-catalog';

interface FluentIconProps {
  icon: IconEntry;
  size?: number;
  className?: string;
  title?: string;
}

// Renders a Microsoft Fluent Emoji Flat SVG. Tries the locally-hosted copy
// first (/icons/<c>/<s>.svg); on failure, falls back to jsDelivr CDN; on
// failure again, shows the unicode glyph as a last resort.
export function FluentIcon({ icon, size = 24, className = '', title }: FluentIconProps) {
  const [step, setStep] = useState<0 | 1 | 2>(0);

  if (step === 2) {
    return (
      <span
        className={`${className} fi-fallback`}
        style={{ fontSize: size * 0.9, lineHeight: 1, display: 'inline-block' }}
        title={title ?? icon.s}
      >
        {icon.e}
      </span>
    );
  }

  const url = step === 0 ? iconLocalUrl(icon) : iconCdnUrl(icon);

  return (
    <img
      src={url}
      alt={icon.e}
      title={title ?? icon.s}
      width={size}
      height={size}
      loading="lazy"
      draggable={false}
      className={`${className} fi-svg`}
      onError={() => setStep((s) => (s === 0 ? 1 : 2))}
      style={{ display: 'block', width: size, height: size, userSelect: 'none' }}
    />
  );
}

interface FluentIconByEmojiProps {
  emoji: string;
  size?: number;
  className?: string;
  title?: string;
}

export function FluentIconByEmoji({ emoji, size = 24, className = '', title }: FluentIconByEmojiProps) {
  const icon = iconByEmoji(emoji);
  if (!icon) {
    return (
      <span className={className} style={{ fontSize: size * 0.9 }}>
        {emoji}
      </span>
    );
  }
  return <FluentIcon icon={icon} size={size} className={className} title={title} />;
}
