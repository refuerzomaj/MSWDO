import { useEffect, useState } from "react";

import type {
  Page,
  CertificationType,
  CertificationRecord,
  CertificationFamilyMember,
} from "../types";

import CertificationPreviewModal from "./CertificationPreviewModal";

/*
 * Props received from the parent App component.
 *
 * setPage:
 *   Changes the current page.
 *
 * toast:
 *   Displays a popup notification such as:
 *   "Certification saved successfully."
 *
 * editCertification:
 *   Contains a certificate selected from the Saved Certificates page
 *   when the user wants to edit it.
 *
 * onFinishedEditing:
 *   Notifies the parent component that editing has finished.
 */
type Props = {
  setPage: (page: Page) => void;
  toast?: (message: string) => void;
  editCertification?: CertificationRecord | null;
  onFinishedEditing?: () => void;
};

/*
 * The three certification types available in the system.
 */
const certificationTypes: CertificationType[] = [
  "Social Case Study Report",
  "Inter-Agency Referral Form",
  "Certificate of Family Income",
];

/*
 * Creates a blank family-member object.
 *
 * This is used whenever the user clicks
 * "+ Add Family Member".
 */
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

/*
 * Creates a new blank certification form.
 *
 * The selected certification type is passed into this function.
 *
 * IMPORTANT:
 * No database columns are added here.
 * These are the existing frontend fields used by the application.
 */
const createCertification = (type: CertificationType): CertificationRecord => ({
  id: crypto.randomUUID(),

  // Selected certification type.
  type,

  // Person information.
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",

  age: 0,
  dateOfBirth: "",
  birthplace: "",

  // Kept because it exists in the existing frontend type.
  gender: "",

  civilStatus: "",
  educationalAttainment: "",
  occupation: "",
  contactNo: "",
  barangay: "",
  address: "",

  // General certification information.
  targetInstitution: "",
  purpose: "",
  requestedDate: new Date().toISOString().slice(0, 10),

  // Family members.
  familyMembers: [],

  // Social Case Study fields.
  presentingProblem: "",
  familySituation: "",
  assessment: "",
  recommendation: "",

  // Inter-Agency Referral fields.
  referredTo: "",
  reasonForReferral: "",
  servicesNeeded: "",
  referralRemarks: "",

  // Certificate of Family Income fields.
  monthlyFamilyIncome: 0,
  incomeSource: "",
  numberOfFamilyMembers: 0,
  incomeRemarks: "",
});

export default function Certification({
  setPage,
  toast,
  editCertification,
  onFinishedEditing,
}: Props) {
  /*
   * Stores which certification type is currently selected.
   *
   * Example:
   * "Social Case Study Report"
   */
  const [selectedType, setSelectedType] = useState<CertificationType | "">(
    editCertification?.type || "",
  );

  /*
   * Stores all values entered into the certification form.
   *
   * null means that no certification has been selected yet.
   */
  const [form, setForm] = useState<CertificationRecord | null>(
    editCertification || null,
  );

  /*
   * Determines whether the form is creating a new certificate
   * or updating an existing certificate.
   */
  const [isEditing, setIsEditing] = useState(Boolean(editCertification));

  /*
   * Controls whether the certificate preview modal is visible.
   */
  const [showPreview, setShowPreview] = useState(false);

  /*
   * Prevents multiple Save/Update requests while one request
   * is already being processed.
   */
  const [isSaving, setIsSaving] = useState(false);

  /*
   * Loads the selected certificate into the form when the user
   * clicks Edit from the Saved Certificates page.
   *
   * This allows the existing certificate data to be modified.
   */
  useEffect(() => {
    if (editCertification) {
      setForm(editCertification);
      setSelectedType(editCertification.type);
      setIsEditing(true);
      setShowPreview(false);
    }
  }, [editCertification]);

  /*
   * Updates a normal certification field.
   *
   * Example:
   * updateField("firstName", "Juan")
   *
   * The generic <K> makes sure the field and value types
   * match CertificationRecord.
   */
  const updateField = <K extends keyof CertificationRecord>(
    field: K,
    value: CertificationRecord[K],
  ) => {
    setForm((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        [field]: value,
      };
    });
  };

  /*
   * Changes the selected certification type.
   *
   * If the user selects an actual certification,
   * a new blank form is created.
   *
   * If the user chooses the empty option,
   * the current form is cleared.
   */
  const chooseCertification = (type: CertificationType | "") => {
    setSelectedType(type);

    if (type === "") {
      setForm(null);
      setShowPreview(false);
      setIsEditing(false);
      return;
    }

    setForm(createCertification(type));
    setShowPreview(false);
    setIsEditing(false);
  };

  /*
   * Adds a new family member to the familyMembers array.
   */
  const addFamilyMember = () => {
    setForm((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        familyMembers: [...previous.familyMembers, createFamilyMember()],
      };
    });
  };

  /*
   * Updates one field of one family member.
   *
   * Example:
   * updateFamilyMember(
   *   memberId,
   *   "occupation",
   *   "Farmer"
   * )
   */
  const updateFamilyMember = (
    id: string,
    field: keyof CertificationFamilyMember,
    value: string | number,
  ) => {
    setForm((previous) => {
      if (!previous) {
        return previous;
      }

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
   * Removes a family member from the current certification.
   */
  const removeFamilyMember = (id: string) => {
    setForm((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,

        familyMembers: previous.familyMembers.filter(
          (member) => member.id !== id,
        ),
      };
    });
  };

  /*
   * Saves a new certification or updates an existing certification.
   *
   * NEW CERTIFICATE:
   *   POST /api/certifications
   *
   * EXISTING CERTIFICATE:
   *   PUT /api/certifications/:personId
   *
   * The backend remains responsible for inserting/updating
   * the appropriate PostgreSQL records.
   */
  const saveCertification = async () => {
    /*
     * Make sure a certification form exists.
     */
    if (!form) {
      toast?.("Please choose a certification first.");
      return;
    }

    /*
     * First name validation.
     */
    if (!form.firstName.trim()) {
      toast?.("First name is required.");
      return;
    }

    /*
     * Last name validation.
     */
    if (!form.lastName.trim()) {
      toast?.("Last name is required.");
      return;
    }

    try {
      /*
       * Disable the Save/Update button while the request
       * is being sent to the backend.
       */
      setIsSaving(true);

      /*
       * Determines whether this is an UPDATE or CREATE.
       *
       * Existing certificates have a personId.
       */
      const isUpdate =
        isEditing && form.personId !== undefined && form.personId !== null;

      /*
       * Select the correct API endpoint.
       *
       * IMPORTANT:
       * These URLs must NOT contain Markdown.
       */
      const url = isUpdate
        ? `http://localhost:5000/api/certifications/${form.personId}`
        : "http://localhost:5000/api/certifications";

      /*
       * POST creates a new certificate.
       * PUT updates an existing certificate.
       */
      const method = isUpdate ? "PUT" : "POST";

      /*
       * Debug information.
       *
       * These messages can be viewed in the browser console.
       */
      console.log("=================================");
      console.log(
        isUpdate ? "UPDATING CERTIFICATION" : "CREATING CERTIFICATION",
      );
      console.log("URL:", url);
      console.log("METHOD:", method);
      console.log("PERSON ID:", form.personId);
      console.log("CERTIFICATION TYPE:", form.type);
      console.log("FORM DATA:", form);
      console.log("=================================");

      /*
       * Send the certification data to the Node/Express backend.
       */
      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        /*
         * Convert the React form object into JSON.
         */
        body: JSON.stringify(form),
      });

      /*
       * Read the backend response as text first.
       *
       * This allows us to handle both JSON and non-JSON responses.
       */
      const responseText = await response.text();

      /*
       * Stores the parsed backend response.
       */
      let data: any = null;

      /*
       * Try to convert the response into JSON.
       */
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        /*
         * If the backend returns HTML/plain text,
         * display it in the browser console.
         */
        console.error("Backend returned non-JSON:", responseText);
      }

      /*
       * If the backend returned an HTTP error,
       * stop the successful save process.
       */
      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            responseText ||
            `Server returned ${response.status}`,
        );
      }

      /*
       * SUCCESS POPUP
       *
       * Shows:
       * "Certification saved successfully."
       *
       * or:
       * "Certification updated successfully."
       *
       * If the backend provides its own message,
       * that message is used instead.
       */
      toast?.(
        data?.message ||
          (isUpdate
            ? "Certification updated successfully."
            : "Certification saved successfully."),
      );

      /*
       * Close the preview modal after successful save/update.
       */
      setShowPreview(false);

      /*
       * Clear the form.
       */
      setForm(null);

      /*
       * Reset the certification selector.
       */
      setSelectedType("");

      /*
       * Return from editing mode to normal create mode.
       */
      setIsEditing(false);

      /*
       * Tell the parent component that editing/saving
       * has finished.
       *
       * This can be used to refresh the Saved Certificates page.
       */
      onFinishedEditing?.();
    } catch (error) {
      /*
       * Log the error for debugging.
       */
      console.error("SAVE/UPDATE CERTIFICATION ERROR:", error);

      /*
       * Show a specific message when the backend cannot
       * be reached.
       */
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast?.(
          "Cannot connect to the server. Check if the backend is running.",
        );
      } else {
        /*
         * Show the backend error or a general error.
         */
        toast?.(
          error instanceof Error
            ? error.message
            : "Failed to save certification.",
        );
      }
    } finally {
      /*
       * Re-enable the Save/Update button whether the request
       * succeeds or fails.
       */
      setIsSaving(false);
    }
  };

  /*
   * RENDER THE CERTIFICATION PAGE
   */
  return (
    <section className="certification-page">
      {/* =========================================
          PAGE HEADER
          Displays the page title and Preview button.
      ========================================== */}

      <div className="page-title-row">
        <div>
          <h1>
            {isEditing ? form?.type || "Edit Certification" : "Certifications"}
          </h1>

          <p className="sub">
            {isEditing
              ? "Edit the information of the saved certificate."
              : "Choose a certification to create."}
          </p>
        </div>

        {form && (
          <button
            type="button"
            className="btn outline"
            onClick={() => setShowPreview(true)}
            disabled={isSaving}
          >
            Preview Certification
          </button>
        )}
      </div>

      {/* =========================================
          CERTIFICATION TYPE SELECTOR
          Allows the user to select which certificate
          they want to create.
      ========================================== */}

      {/* =========================================
    CERTIFICATION TYPE SELECTION
    =========================================
    SHOW ONLY WHEN CREATING A NEW CERTIFICATE.

    When editing an existing certificate from
    Saved Certificates, this entire section
    is hidden because the certification type
    cannot be changed.
========================================= */}

      {!isEditing && (
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
                chooseCertification(
                  event.target.value as CertificationType | "",
                )
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
      )}

      {/* =========================================
          EMPTY STATE
          Displays a message when no certificate
          has been selected.
      ========================================== */}

      {!form && (
        <div className="card section certification-empty-state">
          <h2>Choose a Certification</h2>

          <p className="sub">
            Please select a certification above to display its corresponding
            form fields.
          </p>
        </div>
      )}

      {/* =========================================
          SOCIAL CASE STUDY REPORT
      ========================================== */}

      {form?.type === "Social Case Study Report" && (
        <>
          {/* =====================================
              I. IDENTIFYING INFORMATION
          ====================================== */}

          <div className="card section">
            <h2>I. Identifying Information</h2>

            <div className="fields g3">
              {/* First Name */}
              <div>
                <label>First Name</label>

                <input
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  placeholder="First name"
                />
              </div>

              {/* Middle Name */}
              <div>
                <label>Middle Name</label>

                <input
                  value={form.middleName}
                  onChange={(e) => updateField("middleName", e.target.value)}
                  placeholder="Middle name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label>Last Name</label>

                <input
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  placeholder="Last name"
                />
              </div>

              {/* Suffix */}
              <div>
                <label>Suffix</label>

                <input
                  value={form.suffix}
                  onChange={(e) => updateField("suffix", e.target.value)}
                  placeholder="Jr., Sr., III"
                />
              </div>

              {/* Age */}
              <div>
                <label>Age</label>

                <input
                  required
                  type="number"
                  min="0"
                  value={form.age || ""}
                  onChange={(e) =>
                    updateField("age", Number(e.target.value) || 0)
                  }
                />
              </div>

              {/* Birthday */}
              <div>
                <label>Birthday</label>

                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                />
              </div>

              {/* Birthplace */}
              <div>
                <label>Birthplace</label>

                <input
                  value={form.birthplace}
                  onChange={(e) => updateField("birthplace", e.target.value)}
                  placeholder="Birthplace"
                />
              </div>

              {/* Educational Attainment */}
              <div>
                <label>Educational Attainment</label>

                <input
                  value={form.educationalAttainment}
                  onChange={(e) =>
                    updateField("educationalAttainment", e.target.value)
                  }
                  placeholder="Educational attainment"
                />
              </div>

              {/* Civil Status */}
              <div>
                <label>Civil Status</label>

                <select
                  required
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

              {/* Occupation */}
              <div>
                <label>Occupation</label>

                <input
                  value={form.occupation}
                  onChange={(e) => updateField("occupation", e.target.value)}
                  placeholder="Occupation"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label>Contact No.</label>

                <input
                  value={form.contactNo}
                  onChange={(e) => updateField("contactNo", e.target.value)}
                  placeholder="Contact number"
                />
              </div>

              {/* Target Institution */}
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

              {/* Barangay */}
              <div>
                <label>Barangay</label>

                <select
                  value={form.barangay}
                  onChange={(e) => updateField("barangay", e.target.value)}
                >
                  <option value="">Select barangay</option>

                  <option value="Binuangan">Binuangan</option>

                  <option value="Catanghalan">Catanghalan</option>

                  <option value="Hulo">Hulo</option>

                  <option value="Lawa">Lawa</option>

                  <option value="Paco">Paco</option>

                  <option value="Pag-asa">Pag-asa</option>

                  <option value="Paliwas">Paliwas</option>

                  <option value="Pantoc">Pantoc</option>

                  <option value="Poblacion">Poblacion</option>

                  <option value="Salambao">Salambao</option>

                  <option value="Tawiran">Tawiran</option>
                </select>
              </div>

              {/* Address */}
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
          </div>

          {/* =====================================
              II. FAMILY COMPOSITION
          ====================================== */}

          <div className="card section">
            <div className="family-header">
              <div>
                <h2>II. Family Composition</h2>

                <p className="sub">Add the members of the family.</p>
              </div>

              {/* Add Family Member button */}
              <button
                type="button"
                className="btn primary"
                onClick={addFamilyMember}
              >
                + Add Family Member
              </button>
            </div>

            {/* Empty family state */}
            {form.familyMembers.length === 0 && (
              <div className="empty-family">No family members added yet.</div>
            )}

            {/* Display every family member */}
            {form.familyMembers.map((member, index) => (
              <div className="family-card" key={member.id}>
                <div className="family-card-head">
                  <strong>Family Member {index + 1}</strong>

                  {/* Remove family member */}
                  <button
                    type="button"
                    className="btn danger"
                    onClick={() => removeFamilyMember(member.id)}
                  >
                    Remove
                  </button>
                </div>

                <div className="fields g3">
                  {/* Name */}
                  <div>
                    <label>Name</label>

                    <input
                      value={member.name}
                      onChange={(e) =>
                        updateFamilyMember(member.id, "name", e.target.value)
                      }
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label>Age</label>

                    <input
                      required
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

                  {/* Civil Status */}
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

                  {/* Relationship */}
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

                  {/* Educational Attainment */}
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

                  {/* Occupation */}
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

                  {/* Income */}
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

          {/* =====================================
              III-V. SOCIAL CASE STUDY DETAILS
          ====================================== */}

          <div className="card section">
            {/* Problem Presented */}
            <h2>III. Problem Presented</h2>

            <textarea
              rows={6}
              value={form.presentingProblem}
              onChange={(e) => updateField("presentingProblem", e.target.value)}
              placeholder="Enter the problem presented..."
            />

            {/* Family Background */}
            <h2>IV. Family Background</h2>

            <textarea
              rows={6}
              value={form.familySituation}
              onChange={(e) => updateField("familySituation", e.target.value)}
              placeholder="Enter the family background..."
            />

            {/* Assessment */}
            <h2>Assessment</h2>

            <textarea
              rows={6}
              value={form.assessment}
              onChange={(e) => updateField("assessment", e.target.value)}
              placeholder="Enter assessment..."
            />

            {/* Recommendation */}
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

      {/* =========================================
          INTER-AGENCY REFERRAL FORM
      ========================================== */}

      {form?.type === "Inter-Agency Referral Form" && (
        <div className="card section">
          <h2>Inter-Agency Referral Form</h2>

          <div className="fields g2">
            {/* First Name */}
            <div>
              <label>First Name</label>

              <input
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="First name"
              />
            </div>

            {/* Middle Name */}
            <div>
              <label>Middle Name</label>

              <input
                value={form.middleName}
                onChange={(e) => updateField("middleName", e.target.value)}
                placeholder="Middle name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label>Last Name</label>

              <input
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="Last name"
              />
            </div>

            {/* Suffix */}
            <div>
              <label>Suffix</label>

              <input
                value={form.suffix}
                onChange={(e) => updateField("suffix", e.target.value)}
                placeholder="Jr., Sr., III"
              />
            </div>

            {/* Age */}
            <div>
              <label>Age</label>

              <input
                required
                type="number"
                min="0"
                value={form.age || ""}
                onChange={(e) =>
                  updateField("age", Number(e.target.value) || 0)
                }
              />
            </div>

            {/* Civil Status */}
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

            {/* Referred To */}
            <div>
              <label>Referred To</label>

              <input
                value={form.referredTo}
                onChange={(e) => updateField("referredTo", e.target.value)}
                placeholder="Agency / institution"
              />
            </div>

            {/* Barangay */}
            <div>
              <label>Barangay</label>

              <select
                value={form.barangay}
                onChange={(e) => updateField("barangay", e.target.value)}
              >
                <option value="">Select barangay</option>

                <option value="Binuangan">Binuangan</option>

                <option value="Catanghalan">Catanghalan</option>

                <option value="Hulo">Hulo</option>

                <option value="Lawa">Lawa</option>

                <option value="Paco">Paco</option>

                <option value="Pag-asa">Pag-asa</option>

                <option value="Paliwas">Paliwas</option>

                <option value="Pantoc">Pantoc</option>

                <option value="Poblacion">Poblacion</option>

                <option value="Salambao">Salambao</option>

                <option value="Tawiran">Tawiran</option>
              </select>
            </div>

            {/* Contact */}
            <div>
              <label>Contact</label>

              <input
                value={form.contactNo}
                onChange={(e) => updateField("contactNo", e.target.value)}
                placeholder="Contact number"
              />
            </div>

            {/* Services Needed */}
            <div>
              <label>Services Needed</label>

              <input
                value={form.servicesNeeded}
                onChange={(e) => updateField("servicesNeeded", e.target.value)}
                placeholder="Services needed"
              />
            </div>

            {/* Address */}
            <div className="field-full">
              <label>Address</label>

              <textarea
                rows={3}
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>
          </div>

          {/* Reason for Referral */}
          <div className="field-full">
            <label>Reason for Referral</label>

            <textarea
              rows={6}
              value={form.reasonForReferral}
              onChange={(e) => updateField("reasonForReferral", e.target.value)}
              placeholder="Reason for referral..."
            />
          </div>

          {/* Remarks */}
          {/* <div className="field-full">
            <label>Remarks</label>

            <textarea
              rows={5}
              value={form.referralRemarks}
              onChange={(e) => updateField("referralRemarks", e.target.value)}
              placeholder="Additional remarks..."
            />
          </div> */}
        </div>
      )}

      {/* =========================================
          CERTIFICATE OF FAMILY INCOME
      ========================================== */}

      {form?.type === "Certificate of Family Income" && (
        <div className="card section">
          <h2>Certificate of Family Income</h2>

          <div className="fields g2">
            {/* First Name */}
            <div>
              <label>First Name</label>

              <input
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="First name"
              />
            </div>

            {/* Middle Name */}
            <div>
              <label>Middle Name</label>

              <input
                value={form.middleName}
                onChange={(e) => updateField("middleName", e.target.value)}
                placeholder="Middle name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label>Last Name</label>

              <input
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="Last name"
              />
            </div>

            {/* Suffix */}
            <div>
              <label>Suffix</label>

              <input
                value={form.suffix}
                onChange={(e) => updateField("suffix", e.target.value)}
                placeholder="Jr., Sr., III"
              />
            </div>

            {/* Age */}
            <div>
              <label>Age</label>

              <input
                required
                type="number"
                min="0"
                value={form.age || ""}
                onChange={(e) =>
                  updateField("age", Number(e.target.value) || 0)
                }
              />
            </div>

            {/* Civil Status */}
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

            {/* Barangay */}
            <div>
              <label>Barangay</label>

              <select
                value={form.barangay}
                onChange={(e) => updateField("barangay", e.target.value)}
              >
                <option value="">Select barangay</option>

                <option value="Binuangan">Binuangan</option>

                <option value="Catanghalan">Catanghalan</option>

                <option value="Hulo">Hulo</option>

                <option value="Lawa">Lawa</option>

                <option value="Paco">Paco</option>

                <option value="Pag-asa">Pag-asa</option>

                <option value="Paliwas">Paliwas</option>

                <option value="Pantoc">Pantoc</option>

                <option value="Poblacion">Poblacion</option>

                <option value="Salambao">Salambao</option>

                <option value="Tawiran">Tawiran</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <label>Address</label>

              <input
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Complete address"
              />
            </div>

            {/* Monthly Family Income */}
            {/* <div>
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
            </div> */}

            {/* Income Source */}
            {/* <div>
              <label>Income Source</label>

              <input
                value={form.incomeSource}
                onChange={(e) => updateField("incomeSource", e.target.value)}
                placeholder="Income source"
              />
            </div> */}

            {/* Number of Family Members */}
            {/* <div>
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
            </div> */}
          </div>

          {/* Income Remarks */}
          {/* <div className="field-full">
            <label>Remarks</label>

            <textarea
              rows={5}
              value={form.incomeRemarks}
              onChange={(e) => updateField("incomeRemarks", e.target.value)}
              placeholder="Additional information..."
            />
          </div> */}
        </div>
      )}

      {/* =========================================
          FORM FOOTER
          Contains Cancel, Preview and Save/Update.
      ========================================== */}

      {form && (
        <div className="form-foot">
          {/* =========================================
    CANCEL BUTTON
    =========================================
    NEW CERTIFICATE:
      - Clear the current form
      - Reset certification type
      - Return to Certification page

    EDITING CERTIFICATE:
      - Clear the editing state
      - Clear the current form
      - Return to Saved Certificates
========================================= */}
          <button
            type="button"
            className="btn"
            disabled={isSaving}
            onClick={() => {
              {
                /* =====================================
        CLOSE PREVIEW
    ===================================== */
              }
              setShowPreview(false);

              {
                /* =====================================
        EDITING / UPDATING EXISTING CERTIFICATE
        =====================================
        If isEditing is true, the user came
        from Saved Certificates to edit an
        existing certificate.
    ===================================== */
              }
              if (isEditing) {
                // Clear the editing state in the parent component.
                onFinishedEditing?.();

                // Clear the current certificate form.
                setForm(null);

                // Reset the certification type dropdown.
                setSelectedType("");

                // Exit editing mode.
                setIsEditing(false);

                // Return to Saved Certificates.
                setPage("savedcertificates");

                return;
              }

              {
                /* =====================================
        ADDING NEW CERTIFICATE
        =====================================
        If isEditing is false, the user is
        creating a brand-new certificate.
    ===================================== */
              }

              // Clear the current certificate form.
              setForm(null);

              // Reset the certification type dropdown
              // back to "Choose certification".
              setSelectedType("");

              // Make sure editing mode is disabled.
              setIsEditing(false);

              // Return to the Certification page.
              setPage("certification");
            }}
          >
            Cancel
          </button>

          <div className="row">
            {/* Preview button */}
            <button
              type="button"
              className="btn outline"
              onClick={() => setShowPreview(true)}
              disabled={isSaving}
            >
              Preview Certification
            </button>

            {/* Save or Update button */}
            <button
              type="button"
              className="btn primary"
              onClick={saveCertification}
              disabled={isSaving}
            >
              {isSaving
                ? isEditing
                  ? "Updating..."
                  : "Saving..."
                : isEditing
                  ? "Update Certification"
                  : "Save Certification"}
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          CERTIFICATION PREVIEW MODAL
          Uses the existing preview component.
      ========================================== */}

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
