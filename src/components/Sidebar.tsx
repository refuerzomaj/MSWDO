import type { Page } from "../types";

type Props = { page: Page; setPage: (p: Page) => void };
export default function Sidebar({ page, setPage }: Props) {
  const items: [Page, string][] = [
    ["dashboard", "Dashboard"],
    ["people", "People"],
    ["form", "Add Person"],
    ["preview", "Print Preview"],
    ["reports", "Reports"],
    ["settings", "Settings"],
  ];
  return (
    <aside className="sidebar">
      <a
        className="brand"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setPage("dashboard");
        }}
      >
        <div className="logo">MRP</div>
        <div>
          MSWDO Registry<small>Web portal prototype</small>
        </div>
      </a>
      <nav className="nav">
        {items.map(([id, label]) => (
          <button
            key={id}
            className={page === id ? "active" : ""}
            onClick={() => setPage(id)}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="userbox">
        <div className="avatar" style={{ background: "#1a9b8a" }}>
          MG
        </div>
        <div className="meta">
          MG Computing<span>Admin</span>
        </div>
      </div>
    </aside>
  );
}
