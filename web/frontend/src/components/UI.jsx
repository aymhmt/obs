export const Card = ({ children, style = {} }) => (
  <div style={{
    background: "var(--surface)",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow)",
    padding: "24px",
    ...style,
  }}>{children}</div>
);

export const PageHeader = ({ title, subtitle, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
    <div>
      <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--text)" }}>{title}</h1>
      {subtitle && <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const Button = ({ children, onClick, variant = "primary", size = "md", disabled, style = {} }) => {
  const variants = {
    primary: { background: "var(--primary)", color: "#fff", border: "none" },
    secondary: { background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" },
    danger: { background: "var(--danger)", color: "#fff", border: "none" },
    ghost: { background: "transparent", color: "var(--text-muted)", border: "none" },
  };
  const sizes = {
    sm: { padding: "6px 12px", fontSize: "12px" },
    md: { padding: "9px 18px", fontSize: "14px" },
    lg: { padding: "12px 24px", fontSize: "15px" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...variants[variant],
      ...sizes[size],
      borderRadius: "8px",
      fontWeight: "600",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      display: "inline-flex", alignItems: "center", gap: "6px",
      transition: "opacity 0.15s",
      ...style,
    }}>{children}</button>
  );
};

export const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue:   { bg: "#eff6ff", text: "#1d4ed8" },
    green:  { bg: "#f0fdf4", text: "#15803d" },
    red:    { bg: "#fef2f2", text: "#dc2626" },
    yellow: { bg: "#fefce8", text: "#ca8a04" },
    purple: { bg: "#faf5ff", text: "#7c3aed" },
    gray:   { bg: "#f8fafc", text: "#475569" },
  };
  const c = colors[color] || colors.blue;
  return (
    <span style={{
      background: c.bg, color: c.text,
      padding: "3px 10px", borderRadius: "20px",
      fontSize: "12px", fontWeight: "600",
      display: "inline-block",
    }}>{children}</span>
  );
};

export const Table = ({ columns, data, loading }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid var(--border)" }}>
          {columns.map((col) => (
            <th key={col.key} style={{
              padding: "10px 16px", textAlign: "left",
              fontSize: "12px", fontWeight: "600",
              color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em",
            }}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan={columns.length} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Yükleniyor...</td></tr>
        ) : data.length === 0 ? (
          <tr><td colSpan={columns.length} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Kayıt bulunamadı</td></tr>
        ) : data.map((row, i) => (
          <tr key={i} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {columns.map((col) => (
              <td key={col.key} style={{ padding: "12px 16px", fontSize: "14px" }}>
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const Input = ({ label, value, onChange, placeholder, type = "text", style = {} }) => (
  <div style={{ marginBottom: "16px", ...style }}>
    {label && <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px", color: "var(--text)" }}>{label}</label>}
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{
        width: "100%", padding: "9px 12px",
        border: "1px solid var(--border)", borderRadius: "8px",
        fontSize: "14px", outline: "none",
        transition: "border-color 0.15s",
      }}
      onFocus={e => e.target.style.borderColor = "var(--primary)"}
      onBlur={e => e.target.style.borderColor = "var(--border)"}
    />
  </div>
);

export const Select = ({ label, value, onChange, options, style = {} }) => (
  <div style={{ marginBottom: "16px", ...style }}>
    {label && <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px", color: "var(--text)" }}>{label}</label>}
    <select value={value} onChange={onChange} style={{
      width: "100%", padding: "9px 12px",
      border: "1px solid var(--border)", borderRadius: "8px",
      fontSize: "14px", outline: "none", background: "var(--surface)",
    }}>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export const Modal = ({ open, onClose, title, children, width = "500px" }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
    }} onClick={onClose}>
      <div style={{
        background: "var(--surface)",
        borderRadius: "var(--radius)",
        width: "100%", maxWidth: width,
        boxShadow: "var(--shadow-lg)",
        animation: "fadeIn 0.2s ease",
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <h3 style={{ fontWeight: "700", fontSize: "16px" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", color: "var(--text-muted)", cursor: "pointer" }}>×</button>
        </div>
        <div style={{ padding: "24px" }}>{children}</div>
      </div>
    </div>
  );
};

export const StatCard = ({ label, value, icon, color = "var(--primary)" }) => (
  <Card>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "6px" }}>{label}</p>
        <p style={{ fontSize: "28px", fontWeight: "700", color: "var(--text)" }}>{value}</p>
      </div>
      <div style={{
        width: "48px", height: "48px", borderRadius: "12px",
        background: color + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "22px",
      }}>{icon}</div>
    </div>
  </Card>
);
