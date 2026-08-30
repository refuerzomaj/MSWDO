import type { Page } from "../types";
type Props = {
  page: Page;
  setPage: (p: Page) => void;
  search: string;
  setSearch: (s: string) => void;
};
const crumbs: Record<Page, string> = {
  dashboard: "Home / Dashboard",
  certification: "Home / Certification",
  people: "People / All Records",
  form: "People / Add Person",
  view: "People / View",
  preview: "People / Print Preview",
  reports: "Home / Reports",
  settings: "Home / Settings",
};
export default function Topbar({ page, setPage, search, setSearch }: Props) {
  return (
    <header className="topbar">
      <div className="crumbs">{crumbs[page]}</div>
      <div className="top-actions">
        <input
          className="search"
          placeholder="Search name, ID, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="bell" title="Notifications" type="button">
          MG
        </button>
        <button className="btn primary" onClick={() => setPage("form")}>
          + Add Person
        </button>
      </div>
    </header>
  );
}
