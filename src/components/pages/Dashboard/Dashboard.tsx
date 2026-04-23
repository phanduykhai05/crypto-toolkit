import Link from "next/link";
import GiaHuySeedRsaRunner from "./GiaHuySeedRsaRunner";

export default function Dashboard() {
  return (
    <section style={{ display: "grid", gap: 16 }}>
      <h1 style={{ fontSize: 30 }}>Cryptography Toolkit</h1>
      <p style={{ color: "#6b7280" }}>
        Giu nguyen menu va dieu huong. Hien tai chi Asymmetric RSA dang hoat dong day du.
      </p>

      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <Link href="/symmetric" style={cardStyle}>
          <h2 style={titleStyle}>Symmetric</h2>
          <p style={descStyle}>Dang hoat dong: N23DVCN020 phat trien theo README.</p>
        </Link>

        <Link href="/asymmetric" style={cardStyle}>
          <h2 style={titleStyle}>Asymmetric</h2>
          <p style={descStyle}>Dang hoat dong: N23DVCN026 phat trien theo README.</p>
        </Link>

        <Link href="/hashing" style={cardStyle}>
          <h2 style={titleStyle}>Hashing</h2>
          <p style={descStyle}>Dang doi N23DVCN023 phat trien theo README.</p>
        </Link>
      </div>

      <GiaHuySeedRsaRunner />
    </section>
  );
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  background: "#fff",
  padding: 16,
  textDecoration: "none",
  color: "inherit",
  display: "grid",
  gap: 6,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 20,
};

const descStyle: React.CSSProperties = {
  margin: 0,
  color: "#6b7280",
  fontSize: 14,
};
