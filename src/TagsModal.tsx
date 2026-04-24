import { useEffect, useRef, useState } from 'react';
import { ChevronDown, CirclePlus, Trash2, X } from 'lucide-react';
import { TagIcon } from './FluentIcon';
import { PickerPopover } from './PickerPopover';
import type { Comment, Tag, TagsModalProps } from './types';

// ─── Icons ────────────────────────────────────────────────────────────────────

function CloseIcon() {
  return <X size={22} strokeWidth={1.8} />;
}

function TrashIcon() {
  return <Trash2 size={18} strokeWidth={1.6} />;
}

function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" fill="none" stroke="#c02956" strokeWidth="1.4" />
      <text x="10" y="14" textAnchor="middle" fontSize="11" fontWeight="600" fill="#c02956">?</text>
    </svg>
  );
}

function PlusIcon() {
  return <CirclePlus size={20} strokeWidth={1.8} className="rp-add-plus" />;
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
            <span className="rp-icon-placeholder" aria-hidden />
          )}
          <ChevronDown className="rp-icon-chevron" size={12} strokeWidth={2.25} aria-hidden />
        </button>
        <span className="rp-icon-sep" aria-hidden />
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
              <PlusIcon />
              <span>Добавить метку</span>
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
              <PlusIcon />
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
