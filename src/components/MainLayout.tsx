import FooterBar from "@/components/FooterBar";
import HeaderNav from "@/components/HeaderNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        background: "#f6f7fb",
      }}
    >
      <HeaderNav />
      <main style={{ maxWidth: 1000, width: "100%", margin: "0 auto", padding: 20 }}>{children}</main>
      <FooterBar />
    </div>
  );
}
