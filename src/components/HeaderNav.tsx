"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/symmetric", label: "Symmetric" },
  { href: "/asymmetric", label: "Asymmetric" },
  { href: "/hashing", label: "Hashing" },
];

export default function HeaderNav() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "#ffffffee",
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "12px 20px",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "#0f172a",
            fontWeight: 700,
            letterSpacing: 0.2,
          }}
        >
          CryptoToolkit
        </Link>

        <nav style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {NAV_LINKS.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: "none",
                  color: isActive ? "#111827" : "#6b7280",
                  background: isActive ? "#f3f4f6" : "transparent",
                  border: "1px solid #e5e7eb",
                  borderRadius: 999,
                  padding: "6px 12px",
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}