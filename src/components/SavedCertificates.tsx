import { useEffect, useState } from "react";

import CertificationPreviewModal from "./CertificationPreviewModal";

import type {
  Page,
  CertificationType,
  CertificationRecord,
  CertificationFamilyMember,
} from "../types";

type SavedCertificate = {
  personId: number;

  fullName: string;

  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;

  age: number;

  barangay: string;
  address: string;
  contactNo: string;

  civilStatus: string;
  dateOfBirth: string;
  birthplace: string;

  occupation: string;
  educationalAttainment: string;

  date: string;
  createdAt: string;

  type: CertificationType;

  socialcaseId: number | null;
  interagencyId: number | null;
  familyIncomeId: number | null;

  requestedDate?: string;

  referredTo?: string;
  reasonForReferral?: string;
  servicesNeeded?: string;
  referralRemarks?: string;

  presentingProblem?: string;
  familySituation?: string;
  assessment?: string;
  recommendation?: string;

  monthlyFamilyIncome?: number;
  incomeSource?: string;
  numberOfFamilyMembers?: number;
  incomeRemarks?: string;
};

type Props = {
  setPage: (page: Page) => void;

  onEditCertificate: (certificate: CertificationRecord) => void;
};

export default function SavedCertificates({
  setPage,
  onEditCertificate,
}: Props) {
  const [certificates, setCertificates] = useState<SavedCertificate[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState("All");

  /*
   * Certificate used by the SAME preview modal
   * used on the Certification page.
   */
  const [previewCertification, setPreviewCertification] =
    useState<CertificationRecord | null>(null);

  /*
   * =====================================================
   * LOAD CERTIFICATES
   * =====================================================
   */

  const loadCertificates = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/certifications");

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const certificatesData: SavedCertificate[] = data.certificates || [];

      // NEWEST FIRST
      const sortedCertificates = [...certificatesData].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return dateB - dateA;
      });

      setCertificates(sortedCertificates);
    } catch (error) {
      console.error("LOAD CERTIFICATES ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  /*
   * =====================================================
   * FILTER
   * =====================================================
   */

  const filteredCertificates = certificates.filter((certificate) => {
    const searchText = search.toLowerCase().trim();

    const fullName = certificate.fullName?.toLowerCase() || "";

    const barangay = certificate.barangay?.toLowerCase() || "";

    const matchesSearch =
      fullName.includes(searchText) || barangay.includes(searchText);

    const matchesType = typeFilter === "All" || certificate.type === typeFilter;

    return matchesSearch && matchesType;
  });

  /*
   * =====================================================
   * DATE
   * =====================================================
   */

  const formatDate = (date?: string) => {
    if (!date) {
      return "-";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /*
   * =====================================================
   * CONVERT DATABASE DATA
   * INTO CertificationRecord
   * =====================================================
   */

  const convertToCertificationRecord = (cert: any): CertificationRecord => {
    const familyMembers: CertificationFamilyMember[] = Array.isArray(
      cert.familyMembers,
    )
      ? cert.familyMembers.map((member: any) => ({
          id: member.id?.toString() || crypto.randomUUID(),

          name: member.name || "",

          age:
            member.age !== null && member.age !== undefined
              ? Number(member.age)
              : 0,

          civilStatus: member.civilStatus || "",

          relationship: member.relationship || "",

          educationalAttainment: member.educationalAttainment || "",

          occupation: member.occupation || "",

          income:
            member.income !== null && member.income !== undefined
              ? Number(member.income)
              : 0,
        }))
      : [];

    return {
      ...cert,

      id: cert.id?.toString() || `${cert.personId}-${cert.type}`,

      personId: Number(cert.personId),

      type: cert.type as CertificationType,

      firstName: cert.firstName || "",

      middleName: cert.middleName || "",

      lastName: cert.lastName || "",

      suffix: cert.suffix || "",

      age: cert.age !== null && cert.age !== undefined ? Number(cert.age) : 0,

      dateOfBirth: cert.dateOfBirth || "",

      birthplace: cert.birthplace || "",

      gender: cert.gender || "",

      civilStatus: cert.civilStatus || "",

      educationalAttainment: cert.educationalAttainment || "",

      occupation: cert.occupation || "",

      contactNo: cert.contactNo || "",

      barangay: cert.barangay || "",

      address: cert.address || "",

      targetInstitution: cert.targetInstitution || "",

      purpose: cert.purpose || "",

      requestedDate:
        cert.requestedDate ||
        cert.date ||
        new Date().toISOString().slice(0, 10),

      familyMembers,

      presentingProblem: cert.presentingProblem || "",

      familySituation: cert.familySituation || "",

      assessment: cert.assessment || "",

      recommendation: cert.recommendation || "",

      referredTo: cert.referredTo || "",

      reasonForReferral: cert.reasonForReferral || "",

      servicesNeeded: cert.servicesNeeded || "",

      referralRemarks: cert.referralRemarks || "",

      monthlyFamilyIncome:
        cert.monthlyFamilyIncome !== null &&
        cert.monthlyFamilyIncome !== undefined
          ? Number(cert.monthlyFamilyIncome)
          : 0,

      incomeSource: cert.incomeSource || "",

      numberOfFamilyMembers:
        cert.numberOfFamilyMembers !== null &&
        cert.numberOfFamilyMembers !== undefined
          ? Number(cert.numberOfFamilyMembers)
          : 0,

      incomeRemarks: cert.incomeRemarks || "",
    };
  };

  /*
   * =====================================================
   * PREVIEW
   *
   * Load the COMPLETE certificate from the backend,
   * then show the same CertificationPreviewModal
   * used by Certification.tsx.
   * =====================================================
   */

  const handlePreview = async (certificate: SavedCertificate) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/certifications/${certificate.personId}`,
      );

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const cert = data.certificate;

      if (!cert) {
        throw new Error("Certificate data was not returned by the server.");
      }

      const certification = convertToCertificationRecord(cert);

      console.log("PREVIEW CERTIFICATE:", certification);

      setPreviewCertification(certification);
    } catch (error) {
      console.error("LOAD CERTIFICATE FOR PREVIEW ERROR:", error);

      /*
       * Fallback using the information already
       * available in the saved certificate table.
       */

      try {
        const certification: CertificationRecord = {
          id: `${certificate.personId}-${certificate.type}`,

          personId: Number(certificate.personId),

          type: certificate.type,

          firstName: certificate.firstName || "",

          middleName: certificate.middleName || "",

          lastName: certificate.lastName || "",

          suffix: certificate.suffix || "",

          age:
            certificate.age !== null && certificate.age !== undefined
              ? Number(certificate.age)
              : 0,

          dateOfBirth: certificate.dateOfBirth || "",

          birthplace: certificate.birthplace || "",

          gender: "",

          civilStatus: certificate.civilStatus || "",

          educationalAttainment: certificate.educationalAttainment || "",

          occupation: certificate.occupation || "",

          contactNo: certificate.contactNo || "",

          barangay: certificate.barangay || "",

          address: certificate.address || "",

          targetInstitution: "",

          purpose: "",

          requestedDate:
            certificate.requestedDate ||
            certificate.date ||
            new Date().toISOString().slice(0, 10),

          familyMembers: [],

          presentingProblem: certificate.presentingProblem || "",

          familySituation: certificate.familySituation || "",

          assessment: certificate.assessment || "",

          recommendation: certificate.recommendation || "",

          referredTo: certificate.referredTo || "",

          reasonForReferral: certificate.reasonForReferral || "",

          servicesNeeded: certificate.servicesNeeded || "",

          referralRemarks: certificate.referralRemarks || "",

          monthlyFamilyIncome:
            certificate.monthlyFamilyIncome !== null &&
            certificate.monthlyFamilyIncome !== undefined
              ? Number(certificate.monthlyFamilyIncome)
              : 0,

          incomeSource: certificate.incomeSource || "",

          numberOfFamilyMembers:
            certificate.numberOfFamilyMembers !== null &&
            certificate.numberOfFamilyMembers !== undefined
              ? Number(certificate.numberOfFamilyMembers)
              : 0,

          incomeRemarks: certificate.incomeRemarks || "",
        };

        setPreviewCertification(certification);
      } catch (fallbackError) {
        console.error("PREVIEW FALLBACK ERROR:", fallbackError);

        alert("Unable to load the certificate preview.");
      }
    }
  };

  /*
   * =====================================================
   * CLOSE PREVIEW
   * =====================================================
   */

  const closePreview = () => {
    setPreviewCertification(null);
  };

  /*
   * =====================================================
   * EDIT
   * =====================================================
   *
   * Loads the complete certificate and sends it
   * to the Certification page.
   * =====================================================
   */

  const handleEdit = async (certificate: SavedCertificate) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/certifications/${certificate.personId}`,
      );

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const cert = data.certificate;

      if (!cert) {
        throw new Error("Certificate data was not returned by the server.");
      }

      const certification = convertToCertificationRecord(cert);

      console.log("EDITING CERTIFICATE:", certification);

      onEditCertificate(certification);

      setPage("certification");
    } catch (error) {
      console.error("LOAD CERTIFICATE FOR EDIT ERROR:", error);

      /*
       * Fallback using the data already shown
       * in the saved certificates table.
       */

      const certification: CertificationRecord = {
        id: `${certificate.personId}-${certificate.type}`,

        personId: Number(certificate.personId),

        type: certificate.type,

        firstName: certificate.firstName || "",

        middleName: certificate.middleName || "",

        lastName: certificate.lastName || "",

        suffix: certificate.suffix || "",

        age:
          certificate.age !== null && certificate.age !== undefined
            ? Number(certificate.age)
            : 0,

        dateOfBirth: certificate.dateOfBirth || "",

        birthplace: certificate.birthplace || "",

        gender: "",

        civilStatus: certificate.civilStatus || "",

        educationalAttainment: certificate.educationalAttainment || "",

        occupation: certificate.occupation || "",

        contactNo: certificate.contactNo || "",

        barangay: certificate.barangay || "",

        address: certificate.address || "",

        targetInstitution: "",

        purpose: "",

        requestedDate:
          certificate.requestedDate ||
          certificate.date ||
          new Date().toISOString().slice(0, 10),

        familyMembers: [],

        presentingProblem: certificate.presentingProblem || "",

        familySituation: certificate.familySituation || "",

        assessment: certificate.assessment || "",

        recommendation: certificate.recommendation || "",

        referredTo: certificate.referredTo || "",

        reasonForReferral: certificate.reasonForReferral || "",

        servicesNeeded: certificate.servicesNeeded || "",

        referralRemarks: certificate.referralRemarks || "",

        monthlyFamilyIncome:
          certificate.monthlyFamilyIncome !== null &&
          certificate.monthlyFamilyIncome !== undefined
            ? Number(certificate.monthlyFamilyIncome)
            : 0,

        incomeSource: certificate.incomeSource || "",

        numberOfFamilyMembers:
          certificate.numberOfFamilyMembers !== null &&
          certificate.numberOfFamilyMembers !== undefined
            ? Number(certificate.numberOfFamilyMembers)
            : 0,

        incomeRemarks: certificate.incomeRemarks || "",
      };

      onEditCertificate(certification);

      setPage("certification");
    }
  };

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <section className="saved-certificates-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page-title-row">
        <div>
          <h1>Saved Certificates</h1>

          <p className="sub">View and manage all submitted certificates.</p>
        </div>

        <button
          type="button"
          className="btn primary"
          onClick={() => setPage("certification")}
        >
          + New Certificate
        </button>
      </div>

      {/* =====================================================
          FILTER
      ===================================================== */}

      <div className="card section">
        <div className="saved-certificates-toolbar">
          <div className="search-box">
            <label>Search</label>

            <input
              type="text"
              placeholder="Search by name or barangay..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <label>Certificate Type</label>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Certificates</option>

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

          <button
            type="button"
            className="btn outline"
            onClick={loadCertificates}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="card section">
        <div className="saved-certificates-header">
          <div>
            <h2>Submitted Certificates</h2>

            <p className="sub">
              {filteredCertificates.length} certificate
              {filteredCertificates.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="certificates-empty">
            <p>Loading certificates...</p>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="certificates-empty">
            <h3>No saved certificates</h3>

            <p className="sub">Submitted certificates will appear here.</p>

            <button
              type="button"
              className="btn primary"
              onClick={() => setPage("certification")}
            >
              Create Certificate
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="saved-certificates-table">
              <thead>
                <tr>
                  <th>Full Name</th>

                  <th>Date Created</th>

                  <th>Certificate Type</th>

                  <th>Age</th>

                  <th>Barangay</th>

                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCertificates.map((certificate) => (
                  <tr key={`${certificate.personId}-${certificate.type}`}>
                    <td>
                      <strong>{certificate.fullName || "-"}</strong>
                    </td>

                    <td>{formatDate(certificate.createdAt)}</td>

                    <td>
                      <span className="certificate-type">
                        {certificate.type}
                      </span>
                    </td>

                    <td>{certificate.age || "-"}</td>

                    <td>{certificate.barangay || "-"}</td>

                    <td>
                      <div className="certificate-actions">
                        {/* ============================
                              PREVIEW
                          ============================ */}

                        <button
                          type="button"
                          className="btn outline"
                          onClick={() => handlePreview(certificate)}
                        >
                          Preview
                        </button>

                        {/* ============================
                              EDIT
                          ============================ */}

                        <button
                          type="button"
                          className="btn small"
                          onClick={() => handleEdit(certificate)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =====================================================
          SAME CERTIFICATION PREVIEW MODAL
          USED BY Certification.tsx
      ===================================================== */}

      {previewCertification && (
        <CertificationPreviewModal
          isOpen={true}
          certification={previewCertification}
          onClose={closePreview}
        />
      )}
    </section>
  );
}
