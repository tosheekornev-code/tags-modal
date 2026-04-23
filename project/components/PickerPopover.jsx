// Variant A — Popover anchored to the tag row's icon button.
// Compact, fast, doesn't obscure the list.



function PickerPopover({ recents, onPick, onClose, anchor }) {
  const [cat, setCat] = React.useState('recent');
  const [q, setQ] = React.useState('');
  const ref = React.useRef(null);

  React.useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    setTimeout(() => document.addEventListener('mousedown', onDoc), 0);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const filtered = React.useMemo(() => {
    if (q.trim()) {
      const needle = q.toLowerCase().trim();
      return window.ICONS.filter(i => i.t.toLowerCase().includes(needle) || i.e.includes(needle));
    }
    if (cat === 'recent') {
      return recents.map(e => window.ICONS.find(i => i.e === e)).filter(Boolean);
    }
    return window.ICONS.filter(i => i.c === cat);
  }, [cat, q, recents]);

  // Position near anchor
  const style = {};
  if (anchor) {
    const r = anchor.getBoundingClientRect();
    const shell = document.querySelector('.rp-modal-shell').getBoundingClientRect();
    style.position = 'absolute';
    style.top = (r.bottom - shell.top + 8) + 'px';
    style.left = Math.max(16, r.left - shell.left - 8) + 'px';
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
      </div>
      {!q.trim() && (
        <div className="pop-tabs">
          {window.ICON_CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`pop-tab ${cat === c.id ? 'active' : ''}`}
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
            {filtered.map((i, idx) => (
              <button key={i.e + idx} className="pop-cell" onClick={() => onPick(i.e)} title={i.s}>
                <FluentIcon icon={i} size={24} />
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

window.PickerPopover = PickerPopover;
