// The main tags modal — reusable shell. Picker variant is passed in as prop.

// using React.* directly to avoid name collisions when inlined

function Toggle({ on, onChange }) {
  return (
    <button
      className={`rp-toggle ${on ? 'on' : 'off'}`}
      onClick={() => onChange(!on)}
      aria-label={on ? 'Выключить' : 'Включить'}
    >
      <span className="rp-toggle-thumb" />
    </button>
  );
}

function DragHandle() {
  return (
    <div className="rp-drag" aria-hidden>
      <span></span><span></span>
      <span></span><span></span>
      <span></span><span></span>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 3h6M4 6h16M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14M10 11v6M14 11v6"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" fill="none" stroke="#D63384" strokeWidth="1.4"/>
      <text x="10" y="14" textAnchor="middle" fontSize="11" fontWeight="600" fill="#D63384">?</text>
    </svg>
  );
}

function PlusCircle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill="#2DB856"/>
      <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function TagRow({ tag, onToggle, onRename, onDelete, onIconClick, isNew, onCommit }) {
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (isNew && inputRef.current) inputRef.current.focus();
  }, [isNew]);

  return (
    <div className="rp-row">
      <DragHandle />
      <div className="rp-input">
        <button
          className={`rp-icon-btn ${!tag.icon ? 'empty' : ''} ${tag.custom ? 'editable' : ''}`}
          onClick={() => tag.custom && onIconClick(tag)}
          disabled={!tag.custom}
          title={tag.custom ? 'Сменить иконку' : 'Системная иконка'}
        >
          {tag.icon ? (
            <FluentIconByEmoji emoji={tag.icon} size={24} className="rp-emoji" />
          ) : (
            <span className="rp-icon-placeholder">?</span>
          )}
        </button>
        <input
          ref={inputRef}
          value={tag.name}
          onChange={(e) => onRename(tag.id, e.target.value)}
          onBlur={() => onCommit && onCommit(tag.id)}
          onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
          placeholder="Название метки"
        />
      </div>
      <Toggle on={tag.on} onChange={(v) => onToggle(tag.id, v)} />
      <span className="rp-toggle-label">{tag.on ? 'ВКЛ' : 'ВЫКЛ'}</span>
      {tag.custom ? (
        <button className="rp-trash" onClick={() => onDelete(tag.id)} title="Удалить">
          <TrashIcon />
        </button>
      ) : (
        <span className="rp-trash-placeholder" />
      )}
    </div>
  );
}

function CommentRow({ item, onToggle, onRename, onDelete }) {
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
      <button className="rp-trash" onClick={() => onDelete(item.id)} title="Удалить">
        <TrashIcon />
      </button>
    </div>
  );
}

function TagsModal({ variant, pickerComponent: Picker, initialTags, comments, onChangeTags, onChangeComments }) {
  const [tags, setTags] = React.useState(initialTags);
  const [cms, setCms] = React.useState(comments);
  const [pickerTagId, setPickerTagId] = React.useState(null);
  const [pickerAnchor, setPickerAnchor] = React.useState(null);
  const [recents, setRecents] = React.useState(['⭐','🎂','💎','🎁','🍷','🔒']);

  React.useEffect(() => { onChangeTags && onChangeTags(tags); }, [tags]);
  React.useEffect(() => { onChangeComments && onChangeComments(cms); }, [cms]);

  const addTag = () => {
    const id = 'new-' + Date.now();
    setTags([...tags, { id, name: '', icon: null, on: true, custom: true, isNew: true }]);
  };

  const toggle = (id, v) => setTags(tags.map(t => t.id === id ? { ...t, on: v } : t));
  const rename = (id, name) => setTags(tags.map(t => t.id === id ? { ...t, name } : t));
  const commit = (id) => setTags(tags.map(t => t.id === id ? { ...t, isNew: false } : t));
  const del = (id) => setTags(tags.filter(t => t.id !== id));

  const openPicker = (tag, anchor) => {
    setPickerTagId(tag.id);
    setPickerAnchor(anchor || null);
  };
  const pickIcon = (emoji) => {
    setTags(tags.map(t => t.id === pickerTagId ? { ...t, icon: emoji } : t));
    setRecents([emoji, ...recents.filter(r => r !== emoji)].slice(0, 12));
    setPickerTagId(null);
  };

  const togC = (id, v) => setCms(cms.map(c => c.id === id ? { ...c, on: v } : c));
  const renC = (id, text) => setCms(cms.map(c => c.id === id ? { ...c, text } : c));
  const delC = (id) => setCms(cms.filter(c => c.id !== id));
  const addComment = () => {
    const id = 'c-' + Date.now();
    setCms([...cms, { id, text: '', on: true }]);
  };

  return (
    <div className="rp-modal-shell">
      <div className="rp-modal" onClick={(e) => e.stopPropagation()}>
        <button className="rp-close"><CloseIcon/></button>
        <h2 className="rp-title">РЕДАКТИРОВАНИЕ МЕТОК И БЫСТРЫХ КОММЕНТАРИЕВ</h2>

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
                onToggle={toggle}
                onRename={rename}
                onDelete={del}
                onCommit={commit}
                isNew={tag.isNew}
                onIconClick={(t) => {
                  const el = document.querySelector(`[data-tag-id="${t.id}"] .rp-icon-btn`);
                  openPicker(t, el);
                }}
              />
            ))}

            <button className="rp-add-btn" onClick={addTag} type="button">
              <PlusCircle/>
              <span>Создать метку</span>
            </button>
          </div>
        </div>

        <div className="rp-section">
          <div className="rp-section-head">
            <h3>Быстрые комментарии</h3>
            <HelpIcon />
          </div>
          <div className="rp-rows">
            {cms.map(c => (
              <CommentRow key={c.id} item={c} onToggle={togC} onRename={renC} onDelete={delC}/>
            ))}
            <button className="rp-add-btn" onClick={addComment} type="button">
              <PlusCircle/>
              <span>Добавить комментарий</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invisible anchor wrapper for tag rows */}
      <style>{`
        [data-tag-id] { display: contents; }
      `}</style>

      {pickerTagId && (
        <Picker
          recents={recents}
          onPick={pickIcon}
          onClose={() => setPickerTagId(null)}
          anchor={pickerAnchor}
          currentTag={tags.find(t => t.id === pickerTagId)}
        />
      )}
    </div>
  );
}

window.TagsModal = TagsModal;
window.HelpIcon = HelpIcon;
window.PlusCircle = PlusCircle;
