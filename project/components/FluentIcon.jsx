// FluentIcon — renders a Microsoft Fluent Emoji Flat SVG via jsDelivr CDN.
// Graceful fallback to the unicode emoji glyph if the SVG 404s.

function FluentIcon({ icon, size = 24, className = '', title }) {
  const [err, setErr] = React.useState(false);
  if (!icon) return null;
  const url = window.iconSvgUrl(icon);
  if (err || !url) {
    return (
      <span
        className={className + ' fi-fallback'}
        style={{ fontSize: size * 0.9, lineHeight: 1, display: 'inline-block' }}
        title={title || icon.s}
      >{icon.e}</span>
    );
  }
  return (
    <img
      src={url}
      alt={icon.e}
      title={title || icon.s}
      width={size}
      height={size}
      loading="lazy"
      draggable={false}
      className={className + ' fi-svg'}
      onError={() => setErr(true)}
      style={{ display: 'block', width: size, height: size, userSelect: 'none' }}
    />
  );
}

// Render by emoji character (lookup + FluentIcon).
function FluentIconByEmoji({ emoji, size = 24, className = '', title }) {
  const icon = window.iconByEmoji(emoji);
  if (!icon) {
    return <span className={className} style={{ fontSize: size * 0.9 }}>{emoji}</span>;
  }
  return <FluentIcon icon={icon} size={size} className={className} title={title} />;
}

window.FluentIcon = FluentIcon;
window.FluentIconByEmoji = FluentIconByEmoji;
