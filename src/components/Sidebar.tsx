import { useState } from "react";
import type { Page } from "../types";

type Props = {
  page: Page;
  setPage: (p: Page) => void;
  onAddPerson: () => void;
};

export default function Sidebar({ page, setPage, onAddPerson }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const items: [Page, string][] = [
    ["dashboard", "Dashboard"],
    ["certification", "Certification"],
    ["savedcertificates", "Saved Certificates"],
    ["people", "People"],
    ["form", "Add Person"],
    ["reports", "Reports"],
  ];

  const handleNavigation = (id: Page) => {
    if (id === "form") {
      onAddPerson();
    } else {
      setPage(id);
    }

    // Close mobile sidebar after navigation
    setMobileOpen(false);
  };

  const handleBrandClick = () => {
    setPage("dashboard");
    setMobileOpen(false);
  };

  return (
    <>
      {/* =========================================
          MOBILE HEADER
      ========================================= */}
      <header className="mobile-header">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <button
          type="button"
          className="mobile-brand"
          onClick={handleBrandClick}
        >
          <div className="logo">MRP</div>

          <div className="mobile-brand-text">
            MSWDO Registry
            <small>Web portal prototype</small>
          </div>
        </button>
      </header>

      {/* =========================================
          MOBILE OVERLAY
      ========================================= */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* =========================================
          SIDEBAR
      ========================================= */}
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Brand */}
        <button type="button" className="brand" onClick={handleBrandClick}>
          <div className="logo">MRP</div>

          <div>
            MSWDO Registry
            <small>Web portal prototype</small>
          </div>
        </button>

        {/* Navigation */}
        <nav className="nav">
          {items.map(([id, label]) => (
            <button
              type="button"
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => handleNavigation(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="userbox">
          <div className="avatar" style={{ background: "#1a9b8a" }}>
            MG
          </div>

          <div className="meta">
            MG Computing
            <span>Admin</span>
          </div>
        </div>
      </aside>
    </>
  );
}
