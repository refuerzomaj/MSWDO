import type { Person, Page } from "../types";
import { fullName, initials, colorFor } from "../utils";
export default function PrintPreview({
  person,
  setPage,
}: {
  person: Person | undefined;
  setPage: (p: Page) => void;
}) {
  if (!person)
    return (
      <section>
        <h1>Print Preview</h1>
        <p>No record to preview. Add a person first.</p>
        <button className="btn" onClick={() => setPage("form")}>
          Add person
        </button>
      </section>
    );
  return (
    <section>
      <h1>Print Preview</h1>
      <p className="sub">This is how the record will appear on paper.</p>
      <div className="toolbar">
        <span>Zoom 100% · Page 1 of 1</span>
        <div className="row">
          <button className="btn" onClick={() => setPage("people")}>
            Close
          </button>
          <button
            className="btn outline"
            onClick={() => alert("Use Print and choose Save as PDF")}
          >
            Download PDF
          </button>
          <button className="btn primary" onClick={() => window.print()}>
            Print
          </button>
        </div>
      </div>
      <div className="preview-stage">
        <article className="sheet">
          <div className="sheet-head">
            <div>
              <div className="logo" style={{ marginBottom: 8 }}>
                PRP
              </div>
              <h3>PERSON INFORMATION RECORD</h3>
              <div className="sub" style={{ margin: "6px 0 0" }}>
                Person Registry Portal · system-generated print view
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                className="idphoto"
                style={{
                  background: person.photo
                    ? `url(${person.photo}) center/cover`
                    : colorFor(person.id),
                }}
              >
                {person.photo ? "" : initials(person)}
              </div>
              <div style={{ marginTop: 8, fontSize: 12 }}>
                Record No. {person.code}
                <br />
                Printed{" "}
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
          <Block title="Personal details">
            <Row a="Full name" b={fullName(person)} />
            <Row a="Sex" b={person.gender} />
            <Row a="Date of birth" b={person.dob} />
            <Row a="Civil status" b={person.civilStatus} />
            <Row a="Nationality" b="Filipino" />
          </Block>
          <Block title="Contact information">
            <Row a="Mobile" b={person.mobile} />
            <Row a="Email" b={person.email} />
            <Row
              a="Complete address"
              b={[person.address, person.city, person.province, person.postal]
                .filter(Boolean)
                .join(", ")}
            />
          </Block>
          <Block title="Identification">
            <Row a="Person ID" b={person.code} />
            <Row a="National ID" b={person.nationalId || "—"} />
            <Row a="Passport No." b={person.passport || "—"} />
          </Block>
          <Block title="Emergency contact">
            <Row a="Name" b={person.emergencyName || "—"} />
            <Row a="Relationship" b={person.emergencyRel || "—"} />
            <Row a="Phone" b={person.emergencyPhone || "—"} />
          </Block>
          <p className="sub">
            This document is a system-generated print view. Verify details
            before issuance.
          </p>
          <div className="sig">
            <div>
              <div className="line">
                Prepared by · Signature over printed name
              </div>
            </div>
            <div>
              <div className="line">
                Reviewed by · Signature over printed name
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <h4>{title}</h4>
      <div className="kv">{children}</div>
    </div>
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
