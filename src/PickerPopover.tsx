import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Flag,
  Heart,
  House,
  Leaf,
  Package,
  PartyPopper,
  Search,
  Smile,
  Star,
  Users,
  Wine,
  type LucideIcon,
} from 'lucide-react';
import { FluentIcon } from './FluentIcon';
import { ICON_CATEGORIES, ICONS } from './icons-catalog';
import type { PickerProps } from './types';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  restoplace: Star,
  smileys:    Smile,
  people:     Users,
  nature:     Leaf,
  food:       Wine,
  travel:     House,
  activity:   PartyPopper,
  objects:    Package,
  symbols:    Heart,
  flags:      Flag,
};

export function PickerPopover({ onPick, onClose, anchor }: PickerProps) {
  const [q, setQ] = useState('');
  const [activeCat, setActiveCat] = useState(ICON_CATEGORIES[0].id);
  const popRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Close on click outside
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) onClose();
    };
    const t = setTimeout(() => document.addEventListener('mousedown', onDoc), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', onDoc);
    };
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Group icons by category (for the non-search view)
  const grouped = useMemo(() => {
    return ICON_CATEGORIES.map(c => ({
      ...c,
      items: ICONS.filter(i => i.c === c.id),
    }));
  }, []);

  // Search results (spans all categories)
  const searchResults = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return null;
    return ICONS.filter(i => i.t.toLowerCase().includes(needle) || i.e.includes(needle));
  }, [q]);

  // Track which section is currently visible — highlight its nav button
  useEffect(() => {
    if (searchResults !== null) return; // nav hidden during search
    const root = scrollRef.current;
    if (!root) return;
    const handler = () => {
      const top = root.scrollTop;
      const cutoff = top + 40; // a hair below the sticky header top
      let current = ICON_CATEGORIES[0].id;
      for (const c of ICON_CATEGORIES) {
        const el = sectionRefs.current[c.id];
        if (el && el.offsetTop <= cutoff) current = c.id;
      }
      setActiveCat(current);
    };
    handler();
    root.addEventListener('scroll', handler, { passive: true });
    return () => root.removeEventListener('scroll', handler);
  }, [searchResults]);

  // Click category nav → smooth-scroll to that section
  const scrollToCat = (catId: string) => {
    const root = scrollRef.current;
    const section = sectionRefs.current[catId];
    if (!root || !section) return;
    root.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
    setActiveCat(catId);
  };

  // Position relative to the modal shell
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
    <div className="picker-pop" ref={popRef} style={style}>
      <div className="pop-head">
        <div className="pop-search-wrap">
          <Search className="pop-search-icon" size={16} strokeWidth={1.75} aria-hidden />
          <input
            autoFocus
            className="pop-search"
            placeholder="Поиск иконки…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
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

      {!searchResults && (
        <div className="pop-nav" role="tablist">
          {ICON_CATEGORIES.map(c => {
            const Icon = CATEGORY_ICONS[c.id];
            const isActive = activeCat === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`pop-nav-btn${isActive ? ' active' : ''}`}
                onClick={() => scrollToCat(c.id)}
                title={c.name}
              >
                {Icon ? <Icon size={18} strokeWidth={1.75} /> : <span>{c.short}</span>}
              </button>
            );
          })}
        </div>
      )}

      <div className="pop-list" ref={scrollRef}>
        {searchResults ? (
          searchResults.length === 0 ? (
            <div className="pop-empty">Ничего не найдено</div>
          ) : (
            <div className="pop-grid">
              {searchResults.map((icon, idx) => (
                <button
                  key={`${icon.c}-${icon.s}-${idx}`}
                  type="button"
                  className="pop-cell"
                  onClick={() => onPick(`${icon.c}:${icon.s}`)}
                  title={icon.s}
                >
                  <FluentIcon icon={icon} size={24} />
                </button>
              ))}
            </div>
          )
        ) : (
          grouped.map(g => (
            <section
              key={g.id}
              className="pop-section"
              ref={(el) => { sectionRefs.current[g.id] = el; }}
            >
              <h4 className="pop-section-head">{g.name}</h4>
              <div className="pop-grid">
                {g.items.map((icon, idx) => (
                  <button
                    key={`${icon.c}-${icon.s}-${idx}`}
                    type="button"
                    className="pop-cell"
                    onClick={() => onPick(`${icon.c}:${icon.s}`)}
                    title={icon.s}
                  >
                    <FluentIcon icon={icon} size={24} />
                  </button>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
