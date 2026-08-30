import { useState } from "react";

import type {
  Page,
  CertificationType,
  CertificationRecord,
  CertificationFamilyMember,
} from "../types";

import CertificationPreviewModal from "./CertificationPreviewModal";

type Props = {
  setPage: (page: Page) => void;
  toast?: (message: string) => void;
};

const certificationTypes: CertificationType[] = [
  "Social Case Study Report",
  "Inter-Agency Referral Form",
  "Certificate of Family Income",
];

const createFamilyMember = (): CertificationFamilyMember => ({
  id: crypto.randomUUID(),
  name: "",
  age: 0,
  civilStatus: "",
  relationship: "",
  educationalAttainment: "",
  occupation: "",
  income: 0,
});

const createCertification = (type: CertificationType): CertificationRecord => ({
  id: crypto.randomUUID(),

  type,

  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",

  age: 0,
  dateOfBirth: "",
  birthplace: "",
  gender: "",
  civilStatus: "",
  educationalAttainment: "",
  occupation: "",
  contactNo: "",
  address: "",

  targetInstitution: "",

  purpose: "",
  requestedDate: new Date().toISOString().slice(0, 10),

  familyMembers: [],

  presentingProblem: "",
  familySituation: "",
  assessment: "",
  recommendation: "",

  referredTo: "",
  reasonForReferral: "",
  servicesNeeded: "",
  referralRemarks: "",

  monthlyFamilyIncome: 0,
  incomeSource: "",
  numberOfFamilyMembers: 0,
  incomeRemarks: "",
});

export default function Certification({ setPage, toast }: Props) {
  /*
   * NULL means nothing has been selected yet.
   */
  const [selectedType, setSelectedType] = useState<CertificationType | "">("");

  const [form, setForm] = useState<CertificationRecord | null>(null);

  const [showPreview, setShowPreview] = useState(false);

  /*
   * Update certification field.
   */
  const updateField = <K extends keyof CertificationRecord>(
    field: K,
    value: CertificationRecord[K],
  ) => {
    setForm((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        [field]: value,
      };
    });
  };

  /*
   * Select certification.
   */
  const chooseCertification = (type: CertificationType | "") => {
    setSelectedType(type);

    if (type === "") {
      setForm(null);
      setShowPreview(false);
      return;
    }

    setForm(createCertification(type));
    setShowPreview(false);
  };

  /*
   * Add family member.
   */
  const addFamilyMember = () => {
    setForm((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        familyMembers: [...previous.familyMembers, createFamilyMember()],
      };
    });
  };

  /*
   * Update family member.
   */
  const updateFamilyMember = (
    id: string,
    field: keyof CertificationFamilyMember,
    value: string | number,
  ) => {
    setForm((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        familyMembers: previous.familyMembers.map((member) =>
          member.id === id
            ? {
                ...member,
                [field]: value,
              }
            : member,
        ),
      };
    });
  };

  /*
   * Remove family member.
   */
  const removeFamilyMember = (id: string) => {
    setForm((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        familyMembers: previous.familyMembers.filter(
          (member) => member.id !== id,
        ),
      };
    });
  };

  /*
   * Save certification.
   */
  const saveCertification = () => {
    if (!form) {
      toast?.("Please choose a certification first.");
      return;
    }

    try {
      const existing = localStorage.getItem("certifications");

      const certifications: CertificationRecord[] = existing
        ? JSON.parse(existing)
        : [];

      certifications.push(form);

      localStorage.setItem("certifications", JSON.stringify(certifications));

      toast?.("Certification saved successfully");
    } catch (error) {
      console.error("Failed to save certification:", error);

      toast?.("Failed to save certification");
    }
  };

  return (
    <section className="certification-page">
      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="page-title-row">
        <div>
          <h1>Certifications</h1>

          <p className="sub">Choose a certification to create.</p>
        </div>

        {/* PREVIEW ONLY WHEN SELECTED */}

        {form && (
          <button
            type="button"
            className="btn outline"
            onClick={() => setShowPreview(true)}
          >
            Preview Certification
          </button>
        )}
      </div>

      {/* =====================================
          CERTIFICATION SELECT
      ===================================== */}

      <div className="card section">
        <h2>Certification</h2>

        <p className="sub">
          Select the type of certification you want to create.
        </p>

        <div className="certification-select-wrapper">
          <label htmlFor="certification-type">Certification Type</label>

          <select
            id="certification-type"
            value={selectedType}
            onChange={(event) =>
              chooseCertification(event.target.value as CertificationType | "")
            }
          >
            <option value="">Choose certification</option>

            {certificationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =====================================
          NOTHING SELECTED
      ===================================== */}

      {!form && (
        <div className="card section certification-empty-state">
          <h2>Choose a Certification</h2>

          <p className="sub">
            Please select a certification above to display its corresponding
            form fields.
          </p>
        </div>
      )}

      {/* =====================================
          SOCIAL CASE STUDY REPORT
      ===================================== */}

      {form?.type === "Social Case Study Report" && (
        <>
          {/* PERSON INFORMATION */}

          <div className="card section">
            <h2>I. Identifying Information</h2>

            <div className="fields g3">
              <div>
                <label>Name - First Name</label>
                <input
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  placeholder="First name"
                />
              </div>

              <div>
                <label>Middle Name</label>
                <input
                  value={form.middleName}
                  onChange={(e) => updateField("middleName", e.target.value)}
                  placeholder="Middle name"
                />
              </div>

              <div>
                <label>Last Name</label>
                <input
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  placeholder="Last name"
                />
              </div>

              <div>
                <label>Suffix</label>
                <input
                  value={form.suffix}
                  onChange={(e) => updateField("suffix", e.target.value)}
                  placeholder="Jr., Sr., III"
                />
              </div>

              <div>
                <label>Age</label>
                <input
                  type="number"
                  min="0"
                  value={form.age || ""}
                  onChange={(e) =>
                    updateField("age", Number(e.target.value) || 0)
                  }
                />
              </div>

              <div>
                <label>Birthday</label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                />
              </div>

              <div>
                <label>Birthplace</label>
                <input
                  value={form.birthplace}
                  onChange={(e) => updateField("birthplace", e.target.value)}
                  placeholder="Birthplace"
                />
              </div>

              <div>
                <label>Educ. Attainment</label>
                <input
                  value={form.educationalAttainment}
                  onChange={(e) =>
                    updateField("educationalAttainment", e.target.value)
                  }
                  placeholder="Educational attainment"
                />
              </div>

              <div>
                <label>Civil Status</label>

                <select
                  value={form.civilStatus}
                  onChange={(e) => updateField("civilStatus", e.target.value)}
                >
                  <option value="">Select status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>

              <div>
                <label>Occupation</label>

                <input
                  value={form.occupation}
                  onChange={(e) => updateField("occupation", e.target.value)}
                  placeholder="Occupation"
                />
              </div>

              <div>
                <label>Contact No.</label>

                <input
                  value={form.contactNo}
                  onChange={(e) => updateField("contactNo", e.target.value)}
                  placeholder="Contact number"
                />
              </div>

              <div>
                <label>Target Institution</label>

                <select
                  value={form.targetInstitution}
                  onChange={(e) =>
                    updateField("targetInstitution", e.target.value)
                  }
                >
                  <option value="">Select target institution</option>

                  <option value="PCSO">PCSO</option>

                  <option value="Ofc of the President">
                    Ofc of the President
                  </option>
                </select>
              </div>
            </div>

            <div className="field-full">
              <label>Address</label>

              <textarea
                rows={3}
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Complete address"
              />
            </div>
          </div>

          {/* FAMILY COMPOSITION */}

          <div className="card section">
            <div className="family-header">
              <div>
                <h2>II. Family Composition</h2>

                <p className="sub">Add the members of the family.</p>
              </div>

              <button
                type="button"
                className="btn primary"
                onClick={addFamilyMember}
              >
                + Add Family Member
              </button>
            </div>

            {form.familyMembers.length === 0 && (
              <div className="empty-family">No family members added yet.</div>
            )}

            {form.familyMembers.map((member, index) => (
              <div className="family-card" key={member.id}>
                <div className="family-card-head">
                  <strong>Family Member {index + 1}</strong>

                  <button
                    type="button"
                    className="btn danger"
                    onClick={() => removeFamilyMember(member.id)}
                  >
                    Remove
                  </button>
                </div>

                <div className="fields g3">
                  <div>
                    <label>Name</label>

                    <input
                      value={member.name}
                      onChange={(e) =>
                        updateFamilyMember(member.id, "name", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label>Age</label>

                    <input
                      type="number"
                      min="0"
                      value={member.age || ""}
                      onChange={(e) =>
                        updateFamilyMember(
                          member.id,
                          "age",
                          Number(e.target.value) || 0,
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>CS</label>

                    <select
                      value={member.civilStatus}
                      onChange={(e) =>
                        updateFamilyMember(
                          member.id,
                          "civilStatus",
                          e.target.value,
                        )
                      }
                    >
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Separated">Separated</option>
                    </select>
                  </div>

                  <div>
                    <label>Relationship</label>

                    <input
                      value={member.relationship}
                      onChange={(e) =>
                        updateFamilyMember(
                          member.id,
                          "relationship",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>Educational Attainment</label>

                    <input
                      value={member.educationalAttainment}
                      onChange={(e) =>
                        updateFamilyMember(
                          member.id,
                          "educationalAttainment",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>Occupation</label>

                    <input
                      value={member.occupation}
                      onChange={(e) =>
                        updateFamilyMember(
                          member.id,
                          "occupation",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>Income</label>

                    <input
                      type="number"
                      min="0"
                      value={member.income || ""}
                      onChange={(e) =>
                        updateFamilyMember(
                          member.id,
                          "income",
                          Number(e.target.value) || 0,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SOCIAL CASE STUDY DETAILS */}

          <div className="card section">
            <h2>III. Problem Presented</h2>

            <textarea
              rows={6}
              value={form.presentingProblem}
              onChange={(e) => updateField("presentingProblem", e.target.value)}
              placeholder="Enter the problem presented..."
            />

            <h2>IV. Family Background</h2>

            <textarea
              rows={6}
              value={form.familySituation}
              onChange={(e) => updateField("familySituation", e.target.value)}
              placeholder="Enter the family background..."
            />

            <h2>Assessment</h2>

            <textarea
              rows={6}
              value={form.assessment}
              onChange={(e) => updateField("assessment", e.target.value)}
              placeholder="Enter assessment..."
            />

            <h2>V. Recommendation</h2>

            <textarea
              rows={6}
              value={form.recommendation}
              onChange={(e) => updateField("recommendation", e.target.value)}
              placeholder="Enter recommendation..."
            />
          </div>
        </>
      )}

      {/* =====================================
          INTER-AGENCY REFERRAL FORM
      ===================================== */}

      {form?.type === "Inter-Agency Referral Form" && (
        <div className="card section">
          <h2>Inter-Agency Referral Form</h2>

          <div className="fields g2">
            <div>
              <label>Patient Name</label>

              <input
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="Patient name"
              />
            </div>

            <div>
              <label>Age</label>

              <input
                type="number"
                min="0"
                value={form.age || ""}
                onChange={(e) =>
                  updateField("age", Number(e.target.value) || 0)
                }
              />
            </div>

            <div>
              <label>Civil Status</label>

              <select
                value={form.civilStatus}
                onChange={(e) => updateField("civilStatus", e.target.value)}
              >
                <option value="">Select status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Separated">Separated</option>
              </select>
            </div>

            <div>
              <label>Referred To</label>

              <input
                value={form.referredTo}
                onChange={(e) => updateField("referredTo", e.target.value)}
                placeholder="Agency / institution"
              />
            </div>
          </div>

          <div className="field-full">
            <label>Address</label>

            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
            />
          </div>

          <div className="fields g2">
            <div>
              <label>Services Needed</label>

              <input
                value={form.servicesNeeded}
                onChange={(e) => updateField("servicesNeeded", e.target.value)}
                placeholder="Services needed"
              />
            </div>
            <div>
              <label>Contact</label>

              <input
                value={form.contactNo}
                onChange={(e) => updateField("contactNo", e.target.value)}
                placeholder="Contact number"
              />
            </div>
          </div>

          <div className="field-full">
            <label>Reason for Referral</label>

            <textarea
              rows={6}
              value={form.reasonForReferral}
              onChange={(e) => updateField("reasonForReferral", e.target.value)}
              placeholder="Reason for referral..."
            />
          </div>

          <div className="field-full">
            <label>Remarks</label>

            <textarea
              rows={5}
              value={form.referralRemarks}
              onChange={(e) => updateField("referralRemarks", e.target.value)}
              placeholder="Additional remarks..."
            />
          </div>
        </div>
      )}

      {/* =====================================
          CERTIFICATE OF FAMILY INCOME
      ===================================== */}

      {form?.type === "Certificate of Family Income" && (
        <div className="card section">
          <h2>Certificate of Family Income</h2>

          <div className="fields g2">
            <div>
              <label>First Name</label>

              <input
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
              />
            </div>

            <div>
              <label>Last Name</label>

              <input
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
              />
            </div>

            <div>
              <label>Address</label>

              <input
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Complete address"
              />
            </div>

            <div>
              <label>Monthly Family Income</label>

              <input
                type="number"
                min="0"
                value={form.monthlyFamilyIncome || ""}
                onChange={(e) =>
                  updateField(
                    "monthlyFamilyIncome",
                    Number(e.target.value) || 0,
                  )
                }
              />
            </div>

            <div>
              <label>Income Source</label>

              <input
                value={form.incomeSource}
                onChange={(e) => updateField("incomeSource", e.target.value)}
              />
            </div>

            <div>
              <label>Number of Family Members</label>

              <input
                type="number"
                min="0"
                value={form.numberOfFamilyMembers || ""}
                onChange={(e) =>
                  updateField(
                    "numberOfFamilyMembers",
                    Number(e.target.value) || 0,
                  )
                }
              />
            </div>
          </div>

          <div className="field-full">
            <label>Remarks</label>

            <textarea
              rows={5}
              value={form.incomeRemarks}
              onChange={(e) => updateField("incomeRemarks", e.target.value)}
              placeholder="Additional information..."
            />
          </div>
        </div>
      )}

      {/* =====================================
          FORM FOOTER
      ===================================== */}

      {form && (
        <div className="form-foot">
          <button
            type="button"
            className="btn"
            onClick={() => setPage("dashboard")}
          >
            Cancel
          </button>

          <div className="row">
            <button
              type="button"
              className="btn outline"
              onClick={() => setShowPreview(true)}
            >
              Preview Certification
            </button>

            <button
              type="button"
              className="btn primary"
              onClick={saveCertification}
            >
              Save Certification
            </button>
          </div>
        </div>
      )}

      {/* =====================================
          PREVIEW MODAL
      ===================================== */}

      {form && (
        <CertificationPreviewModal
          isOpen={showPreview}
          certification={form}
          onClose={() => setShowPreview(false)}
        />
      )}
    </section>
  );
}
