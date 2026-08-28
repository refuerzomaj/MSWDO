import type { Person } from "../types";
export default function Stats({ people }: { people: Person[] }) {
  return (
    <div className="stats">
      <div className="stat">
        <div className="k">Total People</div>
        <div className="v">{people.length}</div>
      </div>
      <div className="stat">
        <div className="k">Active</div>
        <div className="v">
          {people.filter((p) => p.status === "Active").length}
        </div>
      </div>
      <div className="stat">
        <div className="k">Archived</div>
        <div className="v">
          {people.filter((p) => p.status === "Inactive").length}
        </div>
      </div>
    </div>
  );
}
