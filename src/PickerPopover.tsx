import { useEffect, useMemo, useRef, useState } from 'react';
import { FluentIcon } from './FluentIcon';
import { ICON_CATEGORIES, ICONS } from './icons-catalog';
import type { PickerProps } from './types';

export function PickerPopover({ recents, onPick, onClose, anchor }: PickerProps) {
  const [cat, setCat] = useState('recent');
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const t = setTimeout(() => document.addEventListener('mousedown', onDoc), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', onDoc);
    };
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const filtered = useMemo(() => {
    if (q.trim()) {
      const needle = q.toLowerCase().trim();
      return ICONS.filter(i => i.t.toLowerCase().includes(needle) || i.e.includes(needle));
    }
    if (cat === 'recent') {
      return recents.map(e => ICONS.find(i => i.e === e)).filter((i): i is NonNullable<typeof i> => !!i);
    }
    return ICONS.filter(i => i.c === cat);
  }, [cat, q, recents]);

  const style: React.CSSProperties = {};
  if (anchor) {
    const r = anchor.getBoundingClientRect();
    const shell = document.querySelector('.rp-modal-shell')?.getBoundingClientRect();
    if (shell) {
      style.position = 'absolute';
      style.top = (r.bottom - shell.top + 8) + 'px';
      style.left = Math.max(16, r.left - shell.left - 8) + 'px';
    }
  }

  return (
    <div className="picker-pop" ref={ref} style={style}>
      <div className="pop-head">
        <input
          autoFocus
          className="pop-search"
          placeholder="Поиск иконки…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          type="button"
          className="pop-close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </button>
      </div>

      {!q.trim() && (
        <div className="pop-tabs">
          {ICON_CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`pop-tab${cat === c.id ? ' active' : ''}`}
              onClick={() => setCat(c.id)}
              title={c.name}
            >
              <span className="pop-tab-glyph">{c.short}</span>
            </button>
          ))}
        </div>
      )}

      <div className="pop-grid-wrap">
        {filtered.length === 0 ? (
          <div className="pop-empty">Ничего не найдено</div>
        ) : (
          <div className="pop-grid">
            {filtered.map((icon, idx) => (
              <button
                key={icon.e + idx}
                className="pop-cell"
                onClick={() => onPick(icon.e)}
                title={icon.s}
              >
                <FluentIcon icon={icon} size={24} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pop-foot">
        <span>{filtered.length} иконок</span>
        <span className="pop-hint">Fluent Emoji Flat · Microsoft</span>
      </div>
    </div>
  );
}
