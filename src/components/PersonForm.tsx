import { useEffect, useState } from "react";
import type { Person, PersonFormData, Page } from "../types";
import { nextPersonCode } from "../utils";
type Props = {
  people: Person[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
  currentId: string | null;
  setPage: (p: Page) => void;
  toast: (m: string) => void;
};
const blank: PersonFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  dob: "",
  gender: "Male",
  civilStatus: "Single",
  nationalId: "",
  passport: "",
  mobile: "",
  email: "",
  address: "",
  city: "",
  province: "",
  postal: "",
  emergencyName: "",
  emergencyRel: "",
  emergencyPhone: "",
  photo: "",
};
export default function PersonForm({
  people,
  setPeople,
  currentId,
  setPage,
  toast,
}: Props) {
  const [form, setForm] = useState<PersonFormData>(blank);
  useEffect(() => {
    const p = people.find((x) => x.id === currentId);
    if (p) setForm({ ...p });
    else setForm({ ...blank });
  }, [currentId, people]);
  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const photo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setForm((f) => ({ ...f, photo: String(r.result) }));
    r.readAsDataURL(file);
  };
  const submit = (
    e: React.FormEvent<HTMLFormElement>,
    intent: "save" | "preview",
  ) => {
    e.preventDefault();
    const code = form.code || nextPersonCode(people);
    if (
      !form.firstName ||
      !form.lastName ||
      !form.dob ||
      !form.mobile ||
      !form.email ||
      !form.address
    )
      return;
    const person: Person = {
      ...blank,
      ...form,
      id: form.id || code,
      code,
      status: form.status || "Active",
    } as Person;
    if (form.id) {
      setPeople((prev) => prev.map((p) => (p.id === form.id ? person : p)));
      toast("Person record updated");
    } else {
      setPeople((prev) => [person, ...prev]);
      toast("Person record saved");
    }
    if (intent === "preview") {
      setPage("preview");
    } else {
      setPage("people");
    }
  };
  return (
    <section>
      <h1>
        {currentId ? "Update Person Information" : "Enter Person Information"}
      </h1>
      <p className="sub">
        Fill in personal details. You can list, view, update, delete, and print
        this record later.
      </p>
      <form onSubmit={(e) => submit(e, "save")}>
        <div className="form-grid">
          <div className="card section">
            <h2>Personal details</h2>
            <div className="fields g4">
              <Field
                label="First Name"
                name="firstName"
                required
                value={form.firstName}
                onChange={change}
              />
              <Field
                label="Middle Name"
                name="middleName"
                value={form.middleName}
                onChange={change}
              />
              <Field
                label="Last Name"
                name="lastName"
                required
                value={form.lastName}
                onChange={change}
              />
              <div>
                <label>Suffix</label>
                <select name="suffix" value={form.suffix} onChange={change}>
                  <option value=""></option>
                  <option>Jr.</option>
                  <option>Sr.</option>
                  <option>III</option>
                </select>
              </div>
            </div>
            <div className="fields g2" style={{ marginTop: 12 }}>
              <Field
                label="Date of Birth"
                name="dob"
                type="date"
                required
                value={form.dob}
                onChange={change}
              />
              <div>
                <label>
                  Gender <span className="req">*</span>
                </label>
                <div className="radios">
                  {(["Male", "Female", "Other"] as const).map((g) => (
                    <label key={g}>
                      <input
                        type="radio"
                        name="gender"
                        checked={form.gender === g}
                        onChange={() => setForm((f) => ({ ...f, gender: g }))}
                      />{" "}
                      {g}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <label>
                Civil Status <span className="req">*</span>
              </label>
              <select
                name="civilStatus"
                required
                value={form.civilStatus}
                onChange={change}
              >
                <option>Single</option>
                <option>Married</option>
                <option>Widowed</option>
                <option>Separated</option>
              </select>
            </div>
            <h2 style={{ marginTop: 22 }}>Identification</h2>
            <div className="fields g3">
              <div>
                <label>Person ID</label>
                <input
                  disabled
                  value={form.code || "Auto-generated"}
                  readOnly
                />
              </div>
              <Field
                label="National ID"
                name="nationalId"
                value={form.nationalId}
                onChange={change}
              />
              <Field
                label="Passport No."
                name="passport"
                value={form.passport}
                onChange={change}
              />
            </div>
          </div>
          <div className="card section">
            <h2>Contact</h2>
            <div className="fields g2">
              <Field
                label="Mobile"
                name="mobile"
                required
                value={form.mobile}
                onChange={change}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={change}
              />
            </div>
            <div style={{ marginTop: 12 }}>
              <Field
                label="Address"
                name="address"
                required
                value={form.address}
                onChange={change}
              />
            </div>
            <div className="fields g3" style={{ marginTop: 12 }}>
              <Field
                label="City"
                name="city"
                value={form.city}
                onChange={change}
              />
              <Field
                label="Province"
                name="province"
                value={form.province}
                onChange={change}
              />
              <Field
                label="Postal Code"
                name="postal"
                value={form.postal}
                onChange={change}
              />
            </div>
            <h2 style={{ marginTop: 22 }}>ID photo</h2>
            <label className="upload">
              Click to choose a photo (optional)
              <input type="file" accept="image/*" hidden onChange={photo} />
            </label>
            {form.photo && (
              <div style={{ marginTop: 10 }}>
                <img
                  src={form.photo}
                  alt="Preview"
                  style={{ height: 72, borderRadius: 8 }}
                />
              </div>
            )}
            <h2 style={{ marginTop: 22 }}>Emergency contact</h2>
            <div className="fields g3">
              <Field
                label="Name"
                name="emergencyName"
                value={form.emergencyName}
                onChange={change}
              />
              <Field
                label="Relationship"
                name="emergencyRel"
                value={form.emergencyRel}
                onChange={change}
              />
              <Field
                label="Phone"
                name="emergencyPhone"
                value={form.emergencyPhone}
                onChange={change}
              />
            </div>
          </div>
        </div>
        <div className="form-foot">
          <span className="sub" style={{ margin: 0 }}>
            Required fields marked with *
          </span>
          <div className="row">
            <button
              className="btn"
              type="button"
              onClick={() => setForm({ ...blank })}
            >
              Reset
            </button>
            <button
              className="btn outline"
              type="button"
              onClick={(e) =>
                submit(
                  e as unknown as React.FormEvent<HTMLFormElement>,
                  "preview",
                )
              }
            >
              Save &amp; Preview
            </button>
            <button className="btn primary" type="submit">
              Save Person
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
function Field({
  label,
  name,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label>
        {label} {required && <span className="req">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
