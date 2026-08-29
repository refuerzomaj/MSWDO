import { useMemo, useState } from "react";
import type { Person, Page, Status } from "../types";
import { fullName, initials, colorFor } from "../utils";
import Stats from "./Stats";

type Props = {
  people: Person[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
  setPage: (p: Page) => void;
  setCurrentId: (id: string) => void;
  onEdit: (id: string) => void;
  toast: (m: string) => void;
};

export default function People({
  people,
  setPeople,
  setPage,
  setCurrentId,
  onEdit,
  toast,
}: Props) {
  const [filter, setFilter] = useState<"All" | Status>("All");

  const [pending, setPending] = useState<Person | null>(null);

  const [search, setLocalSearch] = useState("");

  const rows = useMemo(() => {
    return people.filter((person) => {
      const matchesFilter = filter === "All" || person.status === filter;

      const text =
        `${fullName(person)} ${person.code} ${person.email}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [people, filter, search]);

  const act = (person: Person, action: "view" | "edit" | "preview") => {
    if (action === "edit") {
      onEdit(person.id);
      return;
    }

    setCurrentId(person.id);

    if (action === "view") {
      setPage("view");
    }

    if (action === "preview") {
      setPage("preview");
    }
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
            {rows.map((person) => (
              <tr key={person.id}>
                <td>
                  <div className="person-cell">
                    <div
                      className="avatar"
                      style={{
                        background: person.photo
                          ? `url(${person.photo}) center/cover`
                          : colorFor(person.id),
                      }}
                    >
                      {!person.photo && initials(person)}
                    </div>

                    <div>{fullName(person)}</div>
                  </div>
                </td>

                <td>{person.code}</td>

                <td>{person.dob}</td>

                <td>{person.gender}</td>

                <td>
                  {person.email}

                  <br />

                  <span
                    style={{
                      color: "var(--muted)",
                    }}
                  >
                    {person.mobile}
                  </span>
                </td>

                <td>
                  <span
                    className={`badge ${
                      person.status === "Active" ? "ok" : "off"
                    }`}
                  >
                    {person.status}
                  </span>
                </td>

                <td>
                  <div className="actions">
                    <button
                      className="btn sm"
                      onClick={() => act(person, "view")}
                    >
                      View
                    </button>

                    <button
                      className="btn sm"
                      onClick={() => act(person, "edit")}
                    >
                      Edit
                    </button>

                    <button
                      className="btn sm"
                      onClick={() => act(person, "preview")}
                    >
                      Preview
                    </button>

                    <button
                      className="btn sm danger"
                      onClick={() => setPending(person)}
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

            <div
              className="row"
              style={{
                justifyContent: "flex-end",
              }}
            >
              <button className="btn" onClick={() => setPending(null)}>
                Cancel
              </button>

              <button
                className="btn danger"
                onClick={() => {
                  setPeople((prev) =>
                    prev.filter((person) => person.id !== pending.id),
                  );

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
