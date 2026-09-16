export function TopBar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.9rem 1.5rem",
        background: "white",
        borderBottom: "1px solid #eee",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: "#591AB2",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: "0.95rem",
        }}
      >
        f
      </div>
      <span style={{ fontWeight: 700 }}>famly</span>
      <span style={{ opacity: 0.3 }}>|</span>
      <span style={{ opacity: 0.6, fontSize: "0.95rem" }}>Hiring</span>
    </div>
  );
}
