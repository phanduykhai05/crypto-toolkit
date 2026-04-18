export default function FooterBar() {
  return (
    <footer
      style={{
        borderTop: "1px solid #e5e7eb",
        background: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "14px 20px",
          fontSize: 12,
          color: "#6b7280",
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span>CryptoToolkit</span>
        <span>Nhóm 4 Project © 2026</span>
        <span>PTIT Security Lab</span>
      </div>
    </footer>
  );
}
