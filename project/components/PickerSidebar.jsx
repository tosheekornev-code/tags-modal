// Variant C — Sidebar layout à la Slack/Figma.
// Categories pinned on the left; continuous scroll with sticky headers on the right.



function PickerSidebar({ recents, onPick, onClose, currentTag }) {
  const [q, setQ] = React.useState('');
  const [activeCat, setActiveCat] = React.useState('recent');
  const scrollRef = React.useRef(null);
  const sectionRefs = React.useRef({});

  const grouped = React.useMemo(() => {
    const recentItems = recents.map(e => window.ICONS.find(i => i.e === e)).filter(Boolean);
    const groups = window.ICON_CATEGORIES.map(c => {
      if (c.id === 'recent') return { ...c, items: recentItems };
      return { ...c, items: window.ICONS.filter(i => i.c === c.id) };
    }).filter(g => g.items.length > 0);
    return groups;
  }, [recents]);

  const searchResults = React.useMemo(() => {
    if (!q.trim()) return null;
    const needle = q.toLowerCase().trim();
    return window.ICONS.filter(i => i.t.toLowerCase().includes(needle));
  }, [q]);

  React.useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const scrollToCat = (id) => {
    const el = sectionRefs.current[id];
    if (el && scrollRef.current) {
      scrollRef.current.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' });
      setActiveCat(id);
    }
  };

  // Observe scroll to highlight active sidebar entry
  React.useEffect(() => {
    const onScroll = () => {
      const top = scrollRef.current?.scrollTop ?? 0;
      let best = grouped[0]?.id;
      grouped.forEach(g => {
        const el = sectionRefs.current[g.id];
        if (el && el.offsetTop - 40 <= top) best = g.id;
      });
      setActiveCat(best);
    };
    const el = scrollRef.current;
    el?.addEventListener('scroll', onScroll);
    return () => el?.removeEventListener('scroll', onScroll);
  }, [grouped]);

  return (
    <div className="picker-sidebar-backdrop" onClick={onClose}>
      <div className="picker-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="sb-head">
          <div className="sb-title">
            Выбор иконки для метки
            {currentTag?.name && <span> «{currentTag.name}»</span>}
          </div>
          <button className="sb-close" onClick={onClose}>×</button>
        </div>

        <div className="sb-body">
          <aside className="sb-nav">
            <div className="sb-search">
              <input
                placeholder="Поиск…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="sb-nav-list">
              {grouped.map(g => (
                <button
                  key={g.id}
                  className={`sb-nav-item ${activeCat === g.id && !q ? 'active' : ''}`}
                  onClick={() => scrollToCat(g.id)}
                >
                  <span className="sb-nav-glyph">{g.short}</span>
                  <span className="sb-nav-name">{g.name}</span>
                  <span className="sb-nav-count">{g.items.length}</span>
                </button>
              ))}
            </div>
          </aside>

          <main className="sb-main" ref={scrollRef}>
            {searchResults ? (
              <div className="sb-section">
                <div className="sb-section-head sticky">
                  Результаты поиска · {searchResults.length}
                </div>
                {searchResults.length === 0 ? (
                  <div className="sb-empty">
                    <div className="sb-empty-glyph">🔎</div>
                    <div>По запросу «{q}» ничего не найдено</div>
                    <div className="sb-empty-hint">Попробуйте синоним или другой язык</div>
                  </div>
                ) : (
                  <div className="sb-grid">
                    {searchResults.map((i, idx) => (
                      <button key={i.e + idx} className="sb-cell" onClick={() => onPick(i.e)} title={i.t}>
                        <FluentIcon icon={i} size={30} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              grouped.map(g => (
                <div
                  key={g.id}
                  className="sb-section"
                  ref={el => sectionRefs.current[g.id] = el}
                >
                  <div className="sb-section-head sticky">{g.name}</div>
                  <div className="sb-grid">
                    {g.items.map((i, idx) => (
                      <button key={i.e + idx} className="sb-cell" onClick={() => onPick(i.e)} title={i.t}>
                        <FluentIcon icon={i} size={30} />
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </main>
        </div>

        <div className="sb-foot">
          <span className="sb-foot-hint">Fluent Emoji Flat · Microsoft · {window.ICONS.length} иконок</span>
          <button className="sb-cancel" onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
}

window.PickerSidebar = PickerSidebar;
