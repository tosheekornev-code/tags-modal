// Variant B — Second modal overlay with top tabs.
// Familiar Notion/Telegram-style picker. Bigger canvas, easier to browse.



function PickerTabs({ recents, onPick, onClose, currentTag }) {
  const [cat, setCat] = React.useState('recent');
  const [q, setQ] = React.useState('');
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const sections = React.useMemo(() => {
    if (q.trim()) {
      const needle = q.toLowerCase().trim();
      const list = window.ICONS.filter(i => i.t.toLowerCase().includes(needle));
      return [{ id: 'search', name: `Результаты поиска (${list.length})`, items: list }];
    }
    if (cat === 'recent') {
      const list = recents.map(e => window.ICONS.find(i => i.e === e)).filter(Boolean);
      return [{ id: 'recent', name: 'Часто используемые', items: list }];
    }
    const found = window.ICON_CATEGORIES.find(c => c.id === cat);
    return [{ id: cat, name: found.name, items: window.ICONS.filter(i => i.c === cat) }];
  }, [cat, q, recents]);

  const total = sections.reduce((a, s) => a + s.items.length, 0);

  return (
    <div className="picker-tabs-backdrop" onClick={onClose}>
      <div className="picker-tabs" onClick={(e) => e.stopPropagation()}>
        <div className="tabs-head">
          <div className="tabs-title">
            <span>Выбор иконки</span>
            {currentTag?.name && <span className="tabs-subtitle">· для «{currentTag.name}»</span>}
          </div>
          <button className="tabs-close" onClick={onClose}>×</button>
        </div>

        <div className="tabs-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#9BA0AA" strokeWidth="1.8"/>
            <path d="M20 20l-3.5-3.5" stroke="#9BA0AA" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input
            autoFocus
            placeholder="Поиск — «торт», «vip», «рождения»…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && <button className="tabs-clear" onClick={() => setQ('')}>×</button>}
        </div>

        {!q.trim() && (
          <div className="tabs-tabs">
            {window.ICON_CATEGORIES.map(c => (
              <button
                key={c.id}
                className={`tabs-tab ${cat === c.id ? 'active' : ''}`}
                onClick={() => setCat(c.id)}
              >
                <span className="tabs-tab-glyph">{c.short}</span>
                <span className="tabs-tab-name">{c.name}</span>
              </button>
            ))}
          </div>
        )}

        <div className="tabs-scroll" ref={scrollRef}>
          {sections.map(s => (
            <div key={s.id} className="tabs-section">
              <div className="tabs-section-head">{s.name}</div>
              {s.items.length === 0 ? (
                <div className="tabs-empty">Ничего не найдено. Попробуйте другой запрос.</div>
              ) : (
                <div className="tabs-grid">
                  {s.items.map((i, idx) => (
                    <button key={i.e + idx} className="tabs-cell" onClick={() => onPick(i.e)} title={i.s}>
                      <FluentIcon icon={i} size={30} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="tabs-foot">
          <span>Иконок доступно: <b>{window.ICONS.length}</b></span>
          <span className="tabs-foot-hint">Fluent Emoji Flat · Microsoft · MIT</span>
        </div>
      </div>
    </div>
  );
}

window.PickerTabs = PickerTabs;
