import type { Person, Page } from "../types";
import { fullName, initials, colorFor } from "../utils";
type Props = {
  person: Person | undefined;
  setPage: (p: Page) => void;
  setCurrentId: (id: string) => void;
  onDelete: (id: string) => void;
};
export default function PersonView({
  person,
  setPage,
  setCurrentId,
  onDelete,
}: Props) {
  if (!person)
    return (
      <section>
        <h1>Person not found</h1>
        <button className="btn" onClick={() => setPage("people")}>
          Back
        </button>
      </section>
    );
  return (
    <section>
      <h1>View Person</h1>
      <p className="sub">Read-only record details.</p>
      <div className="detail">
        <div className="card profile-card">
          <div
            className="avatar big"
            style={{
              background: person.photo
                ? `url(${person.photo}) center/cover`
                : colorFor(person.id),
            }}
          >
            {person.photo ? "" : initials(person)}
          </div>
          <h2 style={{ margin: "0 0 4px", fontSize: 18 }}>
            {fullName(person)}
          </h2>
          <div className="sub">{person.code}</div>
          <span
            className={`badge ${person.status === "Active" ? "ok" : "off"}`}
          >
            {person.status}
          </span>
          <div className="fields" style={{ marginTop: 16 }}>
            <button
              className="btn primary"
              onClick={() => {
                setCurrentId(person.id);
                setPage("form");
              }}
            >
              Update
            </button>
            <button
              className="btn outline"
              onClick={() => {
                setCurrentId(person.id);
                setPage("preview");
              }}
            >
              Print preview
            </button>
            <button className="btn danger" onClick={() => onDelete(person.id)}>
              Delete
            </button>
          </div>
        </div>
        <div className="card section">
          <h2>Record details</h2>
          <div className="kv">
            <Row a="Date of birth" b={person.dob} />
            <Row a="Gender" b={person.gender} />
            <Row a="Civil status" b={person.civilStatus} />
            <Row a="Mobile" b={person.mobile} />
            <Row a="Email" b={person.email} />
            <Row
              a="Address"
              b={[person.address, person.city, person.province, person.postal]
                .filter(Boolean)
                .join(", ")}
            />
            <Row a="National ID" b={person.nationalId || "—"} />
            <Row a="Passport" b={person.passport || "—"} />
            <Row
              a="Emergency contact"
              b={
                [
                  person.emergencyName,
                  person.emergencyRel,
                  person.emergencyPhone,
                ]
                  .filter(Boolean)
                  .join(" · ") || "—"
              }
            />
          </div>
          <br></br>
          <h2>Family Members</h2>
          {person.familyMembers?.length > 0 && (
            <div>
              <div className="family-header">
                <div>
                  <p className="sub">
                    Family and household information linked to this person.
                  </p>
                </div>
                <span className="badge">
                  {person.familyMembers.length} member
                  {person.familyMembers.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Relationship</th>
                      <th>Age</th>
                      <th>Civil Status</th>
                      <th>Occupation</th>
                      <th>Income</th>
                      <th>Educational Attainment</th>
                      <th>Target Institution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {person.familyMembers.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <strong>{member.name}</strong>
                        </td>
                        <td>{member.relationship}</td>
                        <td>{member.age}</td>
                        <td>{member.civilStatus}</td>
                        <td>{member.occupation || "—"}</td>
                        <td>
                          {member.income > 0
                            ? `₱${member.income.toLocaleString()}`
                            : "—"}
                        </td>
                        <td>{member.educationalAttainment || "—"}</td>
                        <td>{member.targetInstitution || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
function Row({ a, b }: { a: string; b: string }) {
  return (
    <>
      <div>{a}</div>
      <div>{b}</div>
    </>
  );
}
