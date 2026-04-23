import { useState } from 'react';
import type { IconEntry } from './types';
import { iconByRef, iconLocalUrl } from './icons-catalog';

interface FluentIconProps {
  icon: IconEntry;
  size?: number;
  className?: string;
  title?: string;
}

// Renders a catalog icon from /icons/<c>/<s>.svg.
// If the SVG can't load, falls back to the unicode glyph (or '?' if none).
export function FluentIcon({ icon, size = 24, className = '', title }: FluentIconProps) {
  const [err, setErr] = useState(false);

  if (err) {
    return (
      <span
        className={`${className} fi-fallback`}
        style={{ fontSize: size * 0.9, lineHeight: 1, display: 'inline-block' }}
        title={title ?? icon.s}
      >
        {icon.e || '?'}
      </span>
    );
  }

  return (
    <img
      src={iconLocalUrl(icon)}
      alt={icon.e || icon.s}
      title={title ?? icon.s}
      width={size}
      height={size}
      loading="lazy"
      draggable={false}
      className={`${className} fi-svg`}
      onError={() => setErr(true)}
      style={{ display: 'block', width: size, height: size, userSelect: 'none', objectFit: 'contain' }}
    />
  );
}

interface TagIconProps {
  /** Icon reference: unicode emoji char OR "<category>:<slug>". */
  reference: string;
  size?: number;
  className?: string;
  title?: string;
}

// Resolves a Tag.icon value (either unicode or "c:s" form) and renders it.
export function TagIcon({ reference, size = 24, className = '', title }: TagIconProps) {
  const icon = iconByRef(reference);
  if (!icon) {
    return (
      <span className={className} style={{ fontSize: size * 0.9 }}>
        {reference.includes(':') ? '?' : reference}
      </span>
    );
  }
  return <FluentIcon icon={icon} size={size} className={className} title={title} />;
}

// Backwards-compat alias for callers still using the old name.
export const FluentIconByEmoji = (props: { emoji: string } & Omit<TagIconProps, 'reference'>) => {
  const { emoji, ...rest } = props;
  return <TagIcon reference={emoji} {...rest} />;
};
