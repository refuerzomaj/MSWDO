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

  // null = ADD MODE
  // person ID = UPDATE MODE
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const toast = (m: string) => {
    setMessage(m);

    window.setTimeout(() => {
      setMessage("");
    }, 2200);
  };

  const current = people.find((person) => person.id === currentId);

  /*
   * Normal navigation
   */
  const navigate = (p: Page) => {
    setPage(p);

    if (p !== "people") {
      setSearch("");
    }

    window.scrollTo(0, 0);
  };

  /*
   * ADD PERSON
   *
   * Set currentId to null so PersonForm
   * knows it should show an empty form.
   */
  const addPerson = () => {
    setCurrentId(null);
    setPage("form");

    window.scrollTo(0, 0);
  };

  /*
   * EDIT PERSON
   *
   * Set currentId to the selected person's ID.
   */
  const editPerson = (id: string) => {
    setCurrentId(id);
    setPage("form");

    window.scrollTo(0, 0);
  };

  /*
   * DELETE PERSON
   */
  const deletePerson = (id: string) => {
    setPeople((prev) => prev.filter((person) => person.id !== id));

    setCurrentId(null);
    toast("Person record deleted");
    navigate("people");
  };

  return (
    <div className="app">
      <Sidebar page={page} setPage={navigate} onAddPerson={addPerson} />

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
          )}

          {page === "people" && (
            <People
              people={
                search
                  ? people.filter((person) =>
                      `${person.firstName} ${person.middleName} ${person.lastName} ${person.code} ${person.email}`
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                    )
                  : people
              }
              setPeople={setPeople}
              setPage={navigate}
              setCurrentId={setCurrentId}
              onEdit={editPerson}
              toast={toast}
            />
          )}

          {page === "form" && (
            <PersonForm
              people={people}
              setPeople={setPeople}
              currentId={currentId}
              setCurrentId={setCurrentId}
              setPage={navigate}
              toast={toast}
            />
          )}

          {page === "view" && (
            <PersonView
              person={current}
              setPage={navigate}
              setCurrentId={setCurrentId}
              onDelete={deletePerson}
            />
          )}

          {page === "preview" && (
            <PrintPreview person={current} setPage={navigate} />
          )}

          {page === "reports" && <Reports people={people} />}

          {page === "settings" && <Settings toast={toast} />}
        </div>
      </div>

      {message && <div className="toast show">{message}</div>}
    </div>
  );
}
