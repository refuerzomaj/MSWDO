import { useState } from "react";
import type { Page } from "./types";
import { initialPeople } from "./data";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import People from "./components/People";
import PersonForm from "./components/PersonForm";
import PersonView from "./components/PersonView";
import PrintPreview from "./components/PrintPreview";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
export default function App() {
  const [people, setPeople] = useState(initialPeople);
  const [page, setPage] = useState<Page>("people");
  const [currentId, setCurrentId] = useState<string | null>(
    initialPeople[0]?.id ?? null,
  );
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const toast = (m: string) => {
    setMessage(m);
    window.setTimeout(() => setMessage(""), 2200);
  };
  const current = people.find((p) => p.id === currentId);
  const navigate = (p: Page) => {
    setPage(p);
    if (p !== "people") setSearch("");
    window.scrollTo(0, 0);
  };
  const deletePerson = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
    toast("Person record deleted");
    navigate("people");
  };
  return (
    <div className="app">
      <Sidebar page={page} setPage={navigate} />
      <div className="main">
        <Topbar
          page={page}
          setPage={navigate}
          search={search}
          setSearch={setSearch}
        />
        <div className="content">
          {page === "dashboard" && (
            <Dashboard
              people={people}
              setPage={navigate}
              setCurrentId={setCurrentId}
            />
          )}{" "}
          {page === "people" && (
            <People
              people={
                search
                  ? people.filter((p) =>
                      `${p.firstName} ${p.middleName} ${p.lastName} ${p.code} ${p.email}`
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                    )
                  : people
              }
              setPeople={setPeople}
              setPage={navigate}
              setCurrentId={setCurrentId}
              toast={toast}
            />
          )}{" "}
          {page === "form" && (
            <PersonForm
              people={people}
              setPeople={setPeople}
              currentId={currentId}
              setPage={navigate}
              toast={toast}
            />
          )}{" "}
          {page === "view" && (
            <PersonView
              person={current}
              setPage={navigate}
              setCurrentId={setCurrentId}
              onDelete={deletePerson}
            />
          )}{" "}
          {page === "preview" && (
            <PrintPreview person={current} setPage={navigate} />
          )}{" "}
          {page === "reports" && <Reports people={people} />}{" "}
          {page === "settings" && <Settings toast={toast} />}
        </div>
      </div>
      {message && <div className="toast show">{message}</div>}
    </div>
  );
}
