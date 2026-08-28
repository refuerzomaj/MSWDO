import { useState } from "react";
export default function Settings({ toast }: { toast: (m: string) => void }) {
  const [org, setOrg] = useState("Person Registry Portal");
  const [layout, setLayout] = useState("Official A4 record");
  return (
    <section>
      <h1>Settings</h1>
      <p className="sub">Prototype preferences (not persisted).</p>
      <div className="card section">
        <div className="fields" style={{ maxWidth: 420 }}>
          <div>
            <label>Organization name</label>
            <input value={org} onChange={(e) => setOrg(e.target.value)} />
          </div>
          <div>
            <label>Default print layout</label>
            <select value={layout} onChange={(e) => setLayout(e.target.value)}>
              <option>Official A4 record</option>
              <option>Compact</option>
            </select>
          </div>
          <button
            className="btn primary"
            onClick={() => toast("Settings kept for this session")}
          >
            Save settings
          </button>
        </div>
      </div>
    </section>
  );
}
