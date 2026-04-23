import { useState } from 'react';
import type { IconEntry } from './types';
import { iconByEmoji, iconLocalUrl } from './icons-catalog';

interface FluentIconProps {
  icon: IconEntry;
  size?: number;
  className?: string;
  title?: string;
}

// Renders a Microsoft Fluent Emoji Flat SVG from /icons/<c>/<s>.svg.
// If the SVG can't load, falls back to the unicode glyph.
export function FluentIcon({ icon, size = 24, className = '', title }: FluentIconProps) {
  const [err, setErr] = useState(false);

  if (err) {
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

  return (
    <img
      src={iconLocalUrl(icon)}
      alt={icon.e}
      title={title ?? icon.s}
      width={size}
      height={size}
      loading="lazy"
      draggable={false}
      className={`${className} fi-svg`}
      onError={() => setErr(true)}
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
