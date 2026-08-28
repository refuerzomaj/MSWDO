import type { Person, Page } from "../types";
import { fullName } from "../utils";
import Stats from "./Stats";
type Props = {
  people: Person[];
  setPage: (p: Page) => void;
  setCurrentId: (id: string) => void;
};
export default function Dashboard({ people, setPage, setCurrentId }: Props) {
  return (
    <section>
      <h1>Dashboard</h1>
      <p className="sub">Overview of person records in the registry.</p>
      <Stats people={people} />
      <div className="dash-grid">
        <div className="card section">
          <h2>Recent records</h2>
          <ul className="list-plain">
            {people.slice(0, 5).map((p) => (
              <li key={p.id}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentId(p.id);
                    setPage("view");
                  }}
                >
                  {fullName(p)}
                </a>
                <span>{p.code}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 14 }}>
            <button className="btn outline" onClick={() => setPage("people")}>
              Open people list
            </button>
          </div>
        </div>
        <div className="card section">
          <h2>Quick actions</h2>
          <div className="fields">
            <button className="btn primary" onClick={() => setPage("form")}>
              Enter person information
            </button>
            <button className="btn outline" onClick={() => setPage("people")}>
              List / view / update / delete
            </button>
            <button className="btn" onClick={() => setPage("preview")}>
              Open print preview
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
