import { useMemo, useState } from "react";
import type { Person, Page, Status } from "../types";
import { fullName, initials, colorFor } from "../utils";
import Stats from "./Stats";
type Props = {
  people: Person[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
  setPage: (p: Page) => void;
  setCurrentId: (id: string) => void;
  toast: (m: string) => void;
};
export default function People({
  people,
  setPeople,
  setPage,
  setCurrentId,
  toast,
}: Props) {
  const [filter, setFilter] = useState<"All" | Status>("All");
  const [pending, setPending] = useState<Person | null>(null);
  const [search, setLocalSearch] = useState("");
  const rows = useMemo(
    () =>
      people.filter(
        (p) =>
          (filter === "All" || p.status === filter) &&
          `${fullName(p)} ${p.code} ${p.email}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [people, filter, search],
  );
  const act = (p: Person, a: "view" | "edit" | "preview") => {
    setCurrentId(p.id);
    setPage(a === "view" ? "view" : a === "edit" ? "form" : "preview");
  };
  return (
    <section>
      <h1>People Records</h1>
      <p className="sub">
        Create, view, update, delete, and print person information.
      </p>
      <div className="row">
        <div className="chips">
          {(["All", "Active", "Inactive"] as const).map((f) => (
            <button
              key={f}
              className={`chip ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "Inactive" ? "Archived" : f}
            </button>
          ))}
        </div>
      </div>
      <Stats people={people} />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Person</th>
              <th>Person ID</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="person-cell">
                    <div
                      className="avatar"
                      style={{
                        background: p.photo
                          ? `url(${p.photo}) center/cover`
                          : colorFor(p.id),
                      }}
                    >
                      {p.photo ? "" : initials(p)}
                    </div>
                    <div>{fullName(p)}</div>
                  </div>
                </td>
                <td>{p.code}</td>
                <td>{p.dob}</td>
                <td>{p.gender}</td>
                <td>
                  {p.email}
                  <br />
                  <span style={{ color: "var(--muted)" }}>{p.mobile}</span>
                </td>
                <td>
                  <span
                    className={`badge ${p.status === "Active" ? "ok" : "off"}`}
                  >
                    {p.status}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button className="btn sm" onClick={() => act(p, "view")}>
                      View
                    </button>
                    <button className="btn sm" onClick={() => act(p, "edit")}>
                      Edit
                    </button>
                    <button
                      className="btn sm"
                      onClick={() => act(p, "preview")}
                    >
                      Preview
                    </button>
                    <button
                      className="btn sm danger"
                      onClick={() => setPending(p)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={7}>No matching records.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pager">
        <span>
          Showing {rows.length} of {people.length}
        </span>
        <span>Prototype list — all matching records shown</span>
      </div>
      <div className="local-search">
        <input
          value={search}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Filter this list..."
        />
      </div>
      {pending && (
        <div className="modal-back show">
          <div className="modal">
            <h2>Delete person?</h2>
            <p className="sub">
              Delete {fullName(pending)} ({pending.id}) from the list?
            </p>
            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button className="btn" onClick={() => setPending(null)}>
                Cancel
              </button>
              <button
                className="btn danger"
                onClick={() => {
                  setPeople((prev) => prev.filter((x) => x.id !== pending.id));
                  setPending(null);
                  toast("Person record deleted");
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
