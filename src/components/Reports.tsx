import { useEffect, useMemo, useState } from "react";
import type { CertificationRecord } from "../types";

export default function Reports() {
  // =====================================================
  // STATE
  // =====================================================

  const [certifications, setCertifications] = useState<CertificationRecord[]>(
    [],
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedBarangay, setSelectedBarangay] = useState("All Barangays");

  // =====================================================
  // LOAD CERTIFICATIONS
  // =====================================================

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/certifications");

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load certifications.");
      }

      setCertifications(data.certificates || []);
    } catch (err) {
      console.error("REPORTS LOAD ERROR:", err);

      setError(
        err instanceof Error ? err.message : "Failed to load certifications.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE CERTIFICATION
  // =====================================================

  const handleDelete = async (personId: string | number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this certification?\n\n" +
        "This will permanently delete the certification and its person record.",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/certifications/${personId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || `Server returned ${response.status}`);
      }

      setCertifications((previous) =>
        previous.filter((cert) => String(cert.id) !== String(personId)),
      );

      alert("Certification deleted successfully.");
    } catch (err) {
      console.error("DELETE CERTIFICATION ERROR:", err);

      alert(
        err instanceof Error ? err.message : "Failed to delete certification.",
      );
    }
  };

  // =====================================================
  // BARANGAY LIST
  // =====================================================

  const barangays = useMemo(() => {
    const values = certifications
      .map((cert) => cert.barangay)
      .filter(
        (barangay): barangay is string =>
          typeof barangay === "string" && barangay.trim().length > 0,
      )
      .map((barangay) => barangay.trim());

    return Array.from(new Set(values)).sort();
  }, [certifications]);

  // =====================================================
  // FILTER CERTIFICATIONS
  // =====================================================

  const filteredCertifications = useMemo(() => {
    return certifications.filter((cert) => {
      const typeMatch =
        selectedType === "All Types" || cert.type === selectedType;

      const barangayMatch =
        selectedBarangay === "All Barangays" ||
        cert.barangay?.trim() === selectedBarangay;

      return typeMatch && barangayMatch;
    });
  }, [certifications, selectedType, selectedBarangay]);

  // =====================================================
  // COUNTS
  // =====================================================

  const socialCaseStudyCount = certifications.filter(
    (cert) => cert.type === "Social Case Study Report",
  ).length;

  const interAgencyCount = certifications.filter(
    (cert) => cert.type === "Inter-Agency Referral Form",
  ).length;

  const familyIncomeCount = certifications.filter(
    (cert) => cert.type === "Certificate of Family Income",
  ).length;

  // =====================================================
  // CREATE FULL NAME
  // =====================================================

  const getFullName = (cert: CertificationRecord) => {
    return [cert.firstName, cert.middleName, cert.lastName, cert.suffix]
      .filter(Boolean)
      .join(" ");
  };

  // =====================================================
  // FORMAT CREATED DATE
  // =====================================================

  const getCreatedDate = (cert: CertificationRecord) => {
    if (!cert.createdAt) {
      return "—";
    }

    const date = new Date(cert.createdAt);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString();
  };

  // =====================================================
  // CSV VALUE ESCAPER
  // =====================================================

  const escapeCSV = (value: unknown) => {
    const text = String(value ?? "");
    const escaped = text.replace(/"/g, '""');

    return `"${escaped}"`;
  };

  // =====================================================
  // DOWNLOAD CSV
  // =====================================================

  const downloadCSV = () => {
    if (filteredCertifications.length === 0) {
      alert("There are no records to download.");
      return;
    }

    const headers = [
      "Certificate ID",
      "Certificate Type",
      "Full Name",
      "First Name",
      "Middle Name",
      "Last Name",
      "Suffix",
      "Age",
      "Civil Status",
      "Barangay",
      "Address",
      "Contact Number",
      "Date of Birth",
      "Birthplace",
      "Occupation",
      "Educational Attainment",
      "Date Created",
    ];

    const rows = filteredCertifications.map((cert) => [
      cert.id,
      cert.type,
      getFullName(cert),
      cert.firstName,
      cert.middleName,
      cert.lastName,
      cert.suffix,
      cert.age,
      cert.civilStatus,
      cert.barangay,
      cert.address,
      cert.contactNo,
      cert.dateOfBirth,
      cert.birthplace,
      cert.occupation,
      cert.educationalAttainment,
      cert.createdAt ? new Date(cert.createdAt).toLocaleDateString() : "",
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\r\n");

    // UTF-8 BOM for Excel
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    const date = new Date().toISOString().slice(0, 10);

    link.download = `certification-report-${date}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section>
        <h1>Reports</h1>

        <p className="sub">Loading certification reports...</p>
      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <section>
        <h1>Reports</h1>

        <div className="card section">
          <h2>Unable to load reports</h2>

          <p
            style={{
              color: "#dc2626",
              marginTop: 8,
            }}
          >
            {error}
          </p>

          <button
            className="btn outline"
            style={{ marginTop: 14 }}
            onClick={loadCertifications}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <section>
      <h1>Reports</h1>

      <p className="sub">
        View and download reports of all saved certifications.
      </p>

      {/* SUMMARY CARDS */}

      <div className="dashboard-chart-grid" style={{ marginBottom: 20 }}>
        <div className="card section">
          <h2>Total Certifications</h2>

          <div className="chart-total">
            <strong>{certifications.length}</strong>
            <span>Certificates</span>
          </div>
        </div>

        <div className="card section">
          <h2>Social Case Study</h2>

          <div className="chart-total">
            <strong>{socialCaseStudyCount}</strong>
            <span>Reports</span>
          </div>
        </div>

        <div className="card section">
          <h2>Inter-Agency Referral</h2>

          <div className="chart-total">
            <strong>{interAgencyCount}</strong>
            <span>Forms</span>
          </div>
        </div>

        <div className="card section">
          <h2>Family Income</h2>

          <div className="chart-total">
            <strong>{familyIncomeCount}</strong>
            <span>Certificates</span>
          </div>
        </div>
      </div>

      {/* REPORT CONTROLS */}

      <div className="card section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2>Certification Reports</h2>

            <p className="sub">
              Filter the records and download them as a CSV file.
            </p>
          </div>

          <button
            className="btn primary"
            onClick={downloadCSV}
            disabled={filteredCertifications.length === 0}
          >
            Download CSV
          </button>
        </div>

        {/* FILTERS */}

        <div
          className="fields"
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          <div>
            <label htmlFor="report-type">Certification Type</label>

            <select
              id="report-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="All Types">All Types</option>

              <option value="Social Case Study Report">
                Social Case Study Report
              </option>

              <option value="Inter-Agency Referral Form">
                Inter-Agency Referral Form
              </option>

              <option value="Certificate of Family Income">
                Certificate of Family Income
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="report-barangay">Barangay</label>

            <select
              id="report-barangay"
              value={selectedBarangay}
              onChange={(e) => setSelectedBarangay(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="All Barangays">All Barangays</option>

              {barangays.map((barangay) => (
                <option key={barangay} value={barangay}>
                  {barangay}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* RESULT COUNT */}

        <div
          style={{
            marginTop: 18,
            marginBottom: 12,
            fontWeight: 600,
          }}
        >
          Showing {filteredCertifications.length} of {certifications.length}{" "}
          certification(s)
        </div>

        {/* TABLE */}

        {filteredCertifications.length === 0 ? (
          <div className="empty-chart" style={{ marginTop: 20 }}>
            <div className="empty-chart-number">0</div>

            <p>No certification records found.</p>
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
              marginTop: 10,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 10px",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    #
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 10px",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Name
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 10px",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Certification
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 10px",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Barangay
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 10px",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Date Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCertifications.map((cert, index) => (
                  <tr key={cert.id}>
                    <td
                      style={{
                        padding: "12px 10px",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {index + 1}
                    </td>

                    <td
                      style={{
                        padding: "12px 10px",
                        borderBottom: "1px solid #f1f5f9",
                        fontWeight: 600,
                      }}
                    >
                      {getFullName(cert)}
                    </td>

                    <td
                      style={{
                        padding: "12px 10px",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {cert.type}
                    </td>

                    <td
                      style={{
                        padding: "12px 10px",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {cert.barangay || "—"}
                    </td>

                    <td
                      style={{
                        padding: "12px 10px",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {getCreatedDate(cert)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
