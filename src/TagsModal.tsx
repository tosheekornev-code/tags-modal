import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { TagIcon } from './FluentIcon';
import { PickerPopover } from './PickerPopover';
import type { Comment, Tag, TagsModalProps } from './types';

// ─── Icons ────────────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 3h6M4 6h16M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14M10 11v6M14 11v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" fill="none" stroke="#D63384" strokeWidth="1.4" />
      <text x="10" y="14" textAnchor="middle" fontSize="11" fontWeight="600" fill="#D63384">?</text>
    </svg>
  );
}

function PlusCircle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill="#2DB856" />
      <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      className={`rp-toggle${on ? ' on' : ''}`}
      onClick={() => onChange(!on)}
      aria-label={on ? 'Выключить' : 'Включить'}
      type="button"
    >
      <span className="rp-toggle-thumb" />
    </button>
  );
}

function DragHandle() {
  return (
    <div className="rp-drag" aria-hidden>
      <span /><span />
      <span /><span />
      <span /><span />
    </div>
  );
}

// ─── Tag row ──────────────────────────────────────────────────────────────────

interface TagRowProps {
  tag: Tag;
  onToggle: (id: string, v: boolean) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onIconClick: (tag: Tag, anchor: HTMLElement) => void;
  onCommit: (id: string) => void;
  isNew?: boolean;
}

function TagRow({ tag, onToggle, onRename, onDelete, onIconClick, onCommit, isNew }: TagRowProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const iconBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isNew) inputRef.current?.focus();
  }, [isNew]);

  return (
    <div className="rp-row">
      <DragHandle />
      <div className="rp-input">
        <button
          ref={iconBtnRef}
          type="button"
          className={`rp-icon-btn editable${!tag.icon ? ' empty' : ''}`}
          onClick={() => {
            if (iconBtnRef.current) onIconClick(tag, iconBtnRef.current);
          }}
          title="Сменить иконку"
        >
          {tag.icon ? (
            <TagIcon reference={tag.icon} size={24} className="rp-emoji" />
          ) : (
            <span className="rp-icon-placeholder">?</span>
          )}
          {tag.icon && (
            <ChevronDown className="rp-icon-chevron" size={12} strokeWidth={2.25} aria-hidden />
          )}
        </button>
        <input
          ref={inputRef}
          value={tag.name}
          onChange={(e) => onRename(tag.id, e.target.value)}
          onBlur={() => onCommit(tag.id)}
          onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
          placeholder="Название метки"
        />
      </div>
      <Toggle on={tag.on} onChange={(v) => onToggle(tag.id, v)} />
      <span className="rp-toggle-label">{tag.on ? 'ВКЛ' : 'ВЫКЛ'}</span>
      <button className="rp-trash" type="button" onClick={() => onDelete(tag.id)} title="Удалить">
        <TrashIcon />
      </button>
    </div>
  );
}

// ─── Comment row ──────────────────────────────────────────────────────────────

interface CommentRowProps {
  item: Comment;
  onToggle: (id: string, v: boolean) => void;
  onRename: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

function CommentRow({ item, onToggle, onRename, onDelete }: CommentRowProps) {
  return (
    <div className="rp-row">
      <DragHandle />
      <div className="rp-input simple">
        <input
          value={item.text}
          onChange={(e) => onRename(item.id, e.target.value)}
        />
      </div>
      <Toggle on={item.on} onChange={(v) => onToggle(item.id, v)} />
      <span className="rp-toggle-label">{item.on ? 'ВКЛ' : 'ВЫКЛ'}</span>
      <button className="rp-trash" type="button" onClick={() => onDelete(item.id)} title="Удалить">
        <TrashIcon />
      </button>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export function TagsModal({
  initialTags,
  comments: initialComments,
  onChangeTags,
  onChangeComments,
  onClose,
}: TagsModalProps) {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [cms, setCms] = useState<Comment[]>(initialComments);
  const [pickerTagId, setPickerTagId] = useState<string | null>(null);
  const [pickerAnchor, setPickerAnchor] = useState<HTMLElement | null>(null);

  useEffect(() => { onChangeTags?.(tags); }, [tags]);
  useEffect(() => { onChangeComments?.(cms); }, [cms]);

  // ── Tag actions ──
  const addTag = () => {
    const id = 'new-' + Date.now();
    setTags(prev => [...prev, { id, name: '', icon: null, on: true, isNew: true }]);
  };
  const toggleTag = (id: string, v: boolean) => setTags(prev => prev.map(t => t.id === id ? { ...t, on: v } : t));
  const renameTag = (id: string, name: string) => setTags(prev => prev.map(t => t.id === id ? { ...t, name } : t));
  const commitTag = (id: string) => setTags(prev => prev.map(t => t.id === id ? { ...t, isNew: false } : t));
  const deleteTag = (id: string) => setTags(prev => prev.filter(t => t.id !== id));

  // ── Picker ──
  const openPicker = (tag: Tag, anchor: HTMLElement) => {
    setPickerTagId(tag.id);
    setPickerAnchor(anchor);
  };
  const pickIcon = (emoji: string) => {
    setTags(prev => prev.map(t => t.id === pickerTagId ? { ...t, icon: emoji } : t));
    setPickerTagId(null);
    setPickerAnchor(null);
  };
  const closePicker = () => {
    setPickerTagId(null);
    setPickerAnchor(null);
  };

  // ── Comment actions ──
  const addComment = () => {
    const id = 'c-' + Date.now();
    setCms(prev => [...prev, { id, text: '', on: true }]);
  };
  const toggleComment = (id: string, v: boolean) => setCms(prev => prev.map(c => c.id === id ? { ...c, on: v } : c));
  const renameComment = (id: string, text: string) => setCms(prev => prev.map(c => c.id === id ? { ...c, text } : c));
  const deleteComment = (id: string) => setCms(prev => prev.filter(c => c.id !== id));

  const currentTag = tags.find(t => t.id === pickerTagId);

  return (
    <div className="rp-modal-shell">
      <div className="rp-modal" onClick={(e) => e.stopPropagation()}>
        <button className="rp-close" type="button" onClick={onClose} aria-label="Закрыть">
          <CloseIcon />
        </button>
        <h2 className="rp-title">РЕДАКТИРОВАНИЕ МЕТОК И БЫСТРЫХ КОММЕНТАРИЕВ</h2>

        {/* Tags section */}
        <div className="rp-section">
          <div className="rp-section-head">
            <h3>Метки</h3>
            <HelpIcon />
          </div>
          <div className="rp-rows">
            {tags.map(tag => (
              <TagRow
                key={tag.id}
                tag={tag}
                onToggle={toggleTag}
                onRename={renameTag}
                onDelete={deleteTag}
                onCommit={commitTag}
                isNew={tag.isNew}
                onIconClick={openPicker}
              />
            ))}
            <button className="rp-add-btn" type="button" onClick={addTag}>
              <PlusCircle />
              <span>Создать метку</span>
            </button>
          </div>
        </div>

        {/* Comments section */}
        <div className="rp-section">
          <div className="rp-section-head">
            <h3>Быстрые комментарии</h3>
            <HelpIcon />
          </div>
          <div className="rp-rows">
            {cms.map(c => (
              <CommentRow
                key={c.id}
                item={c}
                onToggle={toggleComment}
                onRename={renameComment}
                onDelete={deleteComment}
              />
            ))}
            <button className="rp-add-btn" type="button" onClick={addComment}>
              <PlusCircle />
              <span>Добавить комментарий</span>
            </button>
          </div>
        </div>
      </div>

      {pickerTagId && (
        <PickerPopover
          onPick={pickIcon}
          onClose={closePicker}
          anchor={pickerAnchor}
          currentTag={currentTag}
        />
      )}
    </div>
  );
}
