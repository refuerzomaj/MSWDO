import type { Person } from "../types";
export default function Reports({ people }: { people: Person[] }) {
  const active = people.filter((p) => p.status === "Active").length;
  return (
    <section>
      <h1>Reports</h1>
      <p className="sub">Summary reports for the prototype.</p>
      <div className="card section">
        <p>
          Active share:{" "}
          {people.length ? Math.round((active / people.length) * 100) : 0}%
        </p>
        <p>Records in prototype memory: {people.length}</p>
        <p>
          Use People to view, update, or delete, then return here to see counts
          change.
        </p>
      </div>
    </section>
  );
}
