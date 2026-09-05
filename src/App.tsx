import { useState } from "react";

import type { Page, CertificationRecord } from "./types";

import { initialPeople } from "./data";

import Certification from "./components/Certfication";
import SavedCertificates from "./components/SavedCertificates";
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
  // =====================================================
  // PEOPLE STATE
  // =====================================================

  const [people, setPeople] = useState(initialPeople);

  const [page, setPage] = useState<Page>("dashboard");

  const [currentId, setCurrentId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [message, setMessage] = useState("");

  // =====================================================
  // CERTIFICATION EDIT STATE
  // =====================================================

  const [editCertification, setEditCertification] =
    useState<CertificationRecord | null>(null);

  // =====================================================
  // TOAST MESSAGE
  // =====================================================

  const toast = (m: string) => {
    setMessage(m);

    window.setTimeout(() => {
      setMessage("");
    }, 2200);
  };

  // =====================================================
  // CURRENT PERSON
  // =====================================================

  const current = people.find((person) => person.id === currentId);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigate = (p: Page) => {
    setPage(p);

    // Clear search when leaving People page
    if (p !== "people") {
      setSearch("");
    }

    window.scrollTo(0, 0);
  };

  // =====================================================
  // ADD PERSON
  // =====================================================

  const addPerson = () => {
    setCurrentId(null);
    setPage("form");

    window.scrollTo(0, 0);
  };

  // =====================================================
  // EDIT PERSON
  // =====================================================

  const editPerson = (id: string) => {
    setCurrentId(id);
    setPage("form");

    window.scrollTo(0, 0);
  };

  // =====================================================
  // DELETE PERSON
  // =====================================================

  const deletePerson = (id: string) => {
    setPeople((prev) => prev.filter((person) => person.id !== id));

    setCurrentId(null);

    toast("Person record deleted");

    navigate("people");
  };

  // =====================================================
  // EDIT CERTIFICATION
  // =====================================================

  const editCertificate = (certificate: CertificationRecord) => {
    setEditCertification(certificate);

    navigate("certification");
  };

  // =====================================================
  // FINISHED EDITING CERTIFICATION
  // =====================================================

  const finishedEditingCertificate = () => {
    setEditCertification(null);

    navigate("savedcertificates");
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="app">
      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar page={page} setPage={navigate} onAddPerson={addPerson} />

      <div className="main">
        {/* =================================================
            TOPBAR
        ================================================= */}

        <Topbar
          page={page}
          setPage={navigate}
          search={search}
          setSearch={setSearch}
        />

        <div className="content">
          {/* =================================================
              DASHBOARD
          ================================================= */}

          {page === "dashboard" && (
            <Dashboard
              people={people}
              setPage={navigate}
              setCurrentId={setCurrentId}
            />
          )}

          {/* =================================================
              CERTIFICATION
          ================================================= */}

          {page === "certification" && (
            <Certification
              setPage={navigate}
              toast={toast}
              editCertification={editCertification}
              onFinishedEditing={finishedEditingCertificate}
            />
          )}

          {/* =================================================
              SAVED CERTIFICATIONS
          ================================================= */}

          {page === "savedcertificates" && (
            <SavedCertificates
              setPage={navigate}
              onEditCertificate={editCertificate}
            />
          )}

          {/* =================================================
              PEOPLE
          ================================================= */}

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

          {/* =================================================
              PERSON FORM
          ================================================= */}

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

          {/* =================================================
              PERSON VIEW
          ================================================= */}

          {page === "view" && (
            <PersonView
              person={current}
              setPage={navigate}
              setCurrentId={setCurrentId}
              onDelete={deletePerson}
            />
          )}

          {/* =================================================
              PRINT PREVIEW
          ================================================= */}

          {page === "preview" && (
            <PrintPreview person={current} setPage={navigate} />
          )}

          {/* =================================================
              REPORTS
              
              IMPORTANT:
              Reports now loads certifications directly
              from the backend, so DON'T pass people.
          ================================================= */}

          {page === "reports" && <Reports />}

          {/* =================================================
              SETTINGS
          ================================================= */}

          {page === "settings" && <Settings toast={toast} />}
        </div>
      </div>

      {/* =================================================
          TOAST
      ================================================= */}

      {message && <div className="toast show">{message}</div>}
    </div>
  );
}
