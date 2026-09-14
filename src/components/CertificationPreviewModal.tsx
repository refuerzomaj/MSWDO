import type { CertificationRecord } from "../types";
import obandoLogo from "../assets/obando-logo.png";
import { useReactToPrint } from "react-to-print";
import React from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  certification: CertificationRecord;
};

export default function CertificationPreviewModal({
  isOpen,
  onClose,
  certification,
}: Props) {
  const contentRef = React.useRef<HTMLDivElement>(null);

  const print = useReactToPrint({
    contentRef,
    documentTitle: certification.type || "certification",
  });
  if (!isOpen) {
    return null;
  }

  /*
   * Display blank fields as an underline.
   */
  const value = (text: string | number | undefined | null) => {
    if (text === "" || text === 0 || text === null || text === undefined) {
      return "________________";
    }

    return String(text);
  };

  /*
   * Format date.
   */
  const formatDate = (date: string) => {
    if (!date) {
      return "________________";
    }

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  /*
   * Person's full name.
   */
  const fullName = [
    certification.firstName,
    certification.middleName,
    certification.lastName,
    certification.suffix,
  ]
    .filter(Boolean)
    .join(" ");

  const displayName = fullName || "________________";

  const primaryFamilyMember = certification.familyMembers[0];

  const pronoun = certification.gender === "Female" ? "her" : "his";
  const subjectPronoun = certification.gender === "Female" ? "she" : "he";

  const familyMemberName =
    primaryFamilyMember?.name?.trim() || "________________";

  const familyMemberRelationship =
    primaryFamilyMember?.relationship?.trim() || "________________";

  const defaultProblemPresented =
    displayName +
    " is requesting for a social case study report for " +
    pronoun +
    " " +
    familyMemberRelationship +
    " " +
    familyMemberName +
    " to avail financial/medical assistance from your " +
    "good office (" +
    value(certification.targetInstitution) +
    "), The client was diagnosed with " +
    value(certification.medicalCondition) +
    ", Due to the nature of " +
    pronoun +
    " illness, " +
    subjectPronoun +
    " requires continues medical consultation, medication and regular monitoring by " +
    "the attending physician. The family is currently facing financial difficulties " +
    "and is unable to settle the remaining hospital balance due to their limited " +
    "source income. Due to the indigent condition of the family, they cannot afford " +
    "to support the client's basic needs.";

  const defaultFamilyBackground =
    displayName +
    " is a native residence of Obando Bulacan. They live in their own house made of semi-concrete materials, The client fully depends on " +
    pronoun +
    " father as a collection specialist. However;the income of the family is too minimal to support their basic needs and financial expenses; thus, they sought the MSWDO for proper intervention.";

  const defaultRecommendation =
    "In view of the foregoing information, the undersigned worker respectfully recommends, " +
    displayName +
    " to avail financial/medical assistance from your good office (" +
    value(certification.targetInstitution) +
    "), Due to their indigent condition, " +
    subjectPronoun +
    " is found eligible in the said services.";

  const defaultReasonForReferral =
    "Due to their indigent condition, the client is found eligible in the said services.";
  /*
   * Print certificate.
   */

  return (
    <div className="cert-modal-overlay" onMouseDown={onClose}>
      <div
        className="cert-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* =====================================
            MODAL HEADER
        ===================================== */}

        {/* =====================================
    MODAL HEADER
===================================== */}
        <div className="cert-modal-header">
          {/* PRINT BUTTON - TOP LEFT */}
          <button
            type="button"
            className="btn primary cert-print-top"
            onClick={print}
          >
            🖨 Print Certification
          </button>

          {/* MODAL TITLE */}
          <div className="cert-modal-title">
            <h2>Certification Preview</h2>
            <p>Preview the certification before printing.</p>
          </div>

          {/* CLOSE BUTTON - TOP RIGHT */}
          <button
            type="button"
            className="cert-modal-close"
            onClick={onClose}
            aria-label="Close certification preview"
          >
            ×
          </button>
        </div>

        {/* =====================================
            CERTIFICATE PAPER
        ===================================== */}

        <div
          ref={contentRef}
          className="certificate-paper"
          id="certificate-print"
        >
          {/* =================================
              OFFICIAL HEADER
          ================================= */}

          <div className="official-header" ref={contentRef}>
            {/* OBANDO LOGO */}
            <img src={obandoLogo} className="obando-logo" />

            <div className="header-line">Republic of the Philippines</div>

            <div className="header-line">Province of Bulacan</div>

            <div className="header-line municipality">
              MUNICIPALITY OF OBANDO
            </div>

            <div className="header-line office">
              Municipal Social Welfare and Development Office
            </div>
          </div>

          {/* =================================
              CERTIFICATION TITLE
          ================================= */}

          <div className="certificate-main-title">
            {certification.type === "Social Case Study Report" ? (
              <>
                <div className="certificate-date">
                  {formatDate(certification.requestedDate)}
                </div>
                <h1>SOCIAL CASE STUDY REPORT</h1>
              </>
            ) : certification.type === "Certificate of Family Income" ? (
              <>
                <h1>
                  CERTIFICATE OF FAMILY INCOME WITHIN THE POVERTY THRESHOLD
                </h1>
                <span>Certification No. 2026-002</span>
              </>
            ) : certification.type === "Inter-Agency Referral Form" ? (
              <>
                <h1>INTER-AGENCY REFERRAL FORM</h1>
                <div className="interDate">
                  <div className="certificate-date">
                    <span>CTR No. 07-0025</span>
                    <br />
                    {formatDate(certification.requestedDate)}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>

          {/* =================================
              SOCIAL CASE STUDY REPORT
          ================================= */}

          {certification.type === "Social Case Study Report" && (
            <>
              {/* IDENTIFYING INFORMATION */}

              <div className="formal-section">
                <h2>I. Identifying Information:</h2>

                <div className="identifying-info">
                  <div>
                    <strong>Name : {displayName}</strong>
                  </div>

                  <div>
                    <strong>Age : {value(certification.age)}</strong>
                  </div>

                  <div>
                    <strong>
                      Birthday : {formatDate(certification.dateOfBirth)}
                    </strong>
                  </div>

                  <div>
                    <strong>
                      Birthplace : {value(certification.birthplace)}
                    </strong>
                  </div>

                  <div>
                    <strong>Address : {value(certification.address)}</strong>
                  </div>

                  <div>
                    <strong>
                      Educ. Attainment :{" "}
                      {value(certification.educationalAttainment)}
                    </strong>
                  </div>

                  <div>
                    <strong>
                      Civil Status : {value(certification.civilStatus)}
                    </strong>
                  </div>

                  <div>
                    <strong>
                      Occupation : {value(certification.occupation)}
                    </strong>
                  </div>

                  <div>
                    <strong>
                      Contact No. : {value(certification.contactNo)}
                    </strong>
                  </div>

                  <div>
                    <strong>
                      Target Institution :{" "}
                      {value(certification.targetInstitution)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* FAMILY COMPOSITION */}

              <div className="formal-section">
                <h2>II. Family Composition</h2>

                <div className="formal-family-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>CS</th>
                        <th>Relationship</th>
                        <th>Educational Attainment</th>
                        <th>Occupation/Income</th>
                      </tr>
                    </thead>

                    <tbody>
                      {certification.familyMembers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="empty-table-cell">
                            No family members added.
                          </td>
                        </tr>
                      ) : (
                        certification.familyMembers.map((member) => (
                          <tr key={member.id}>
                            <td>{value(member.name)}</td>

                            <td>{value(member.age)}</td>

                            <td>{value(member.civilStatus)}</td>

                            <td>{value(member.relationship)}</td>

                            <td>{value(member.educationalAttainment)}</td>

                            <td>
                              {member.occupation || member.income
                                ? `${member.occupation || ""}${
                                    member.occupation && member.income
                                      ? " / "
                                      : ""
                                  }${member.income ? `₱${member.income}` : ""}`
                                : "________________"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PROBLEM PRESENTED */}

              <div className="formal-section">
                <h2>III. Problem Presented:</h2>

                <br />
                {certification?.presentingProblem?.trim() ? (
                  <p className="formal-paragraph">
                    {certification.presentingProblem}
                  </p>
                ) : (
                  <p className="formal-paragraph">{defaultProblemPresented}</p>
                )}
              </div>

              {/* FAMILY BACKGROUND */}

              <div className="formal-section">
                <h2>IV. Family Background</h2>

                {certification.familySituation.trim() ? (
                  <p className="formal-paragraph">
                    {certification.familySituation}
                  </p>
                ) : (
                  <p className="formal-paragraph">{defaultFamilyBackground}</p>
                )}
              </div>

              {/* RECOMMENDATION */}

              <div className="formal-section">
                <h2>V. Recommendation:</h2>

                {certification.recommendation.trim() ? (
                  <p className="formal-paragraph">
                    {certification.recommendation}
                  </p>
                ) : (
                  <p className="formal-paragraph">{defaultRecommendation}</p>
                )}
              </div>

              {/* =================================
                  SIGNATURES
              ================================= */}

              <div className="formal-signatures">
                <div className="signature-column">
                  <p>Prepared by:</p>

                  <div className="signature-space" />

                  <strong>Crystel Lynne G. Francisco</strong>

                  <span>MSWDO-STAFF</span>
                </div>

                <div className="signature-column">
                  <p>Assed by:</p>

                  <div className="signature-space" />

                  <strong>Reygie A. Cabucos, RSW</strong>

                  <span>MSWDO-HEAD</span>

                  <span>License No. 0026372</span>
                </div>
              </div>
            </>
          )}

          {/* =================================
              INTER-AGENCY REFERRAL FORM
          ================================= */}

          {certification.type === "Inter-Agency Referral Form" && (
            <>
              <div className="formal-section">
                <h2>
                  FOR: {value(certification.placeToRefer.toLocaleUpperCase())}
                </h2>
                <div className="identifying-info">
                  <h2>I. PATIENT'S DATA:</h2>
                  <div>
                    <strong>
                      Patient Name : {displayName}{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Age :{" "}
                      {value(certification.age)}{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Civil Status :{" "}
                      {value(certification.civilStatus)}
                    </strong>
                  </div>

                  <div>
                    <strong>Address : {value(certification.address)}</strong>
                  </div>
                </div>
                <br />
                <h2>II. Clinical Data: </h2>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  FOR MEDICAL ASSISTANCE{" "}
                  <strong>
                    {value(certification.clinicalData?.toLocaleUpperCase())}
                  </strong>{" "}
                  <br />
                  (See attachement)
                </p>
                <div
                  className="certificate-date"
                  style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  <p>
                    MAY DELA PAZ-OSEDA, MD <br /> Medical Officer II
                    <br />
                    LICENSE NO. 110351
                  </p>
                  <p></p>
                  <p></p>
                </div>

                <h2>
                  III. MUNICIPAL SOCIAL WORKER ASSESSMENT AND RECOMMENDATION:
                </h2>

                <p
                  style={{
                    fontSize: "15px",
                  }}
                >
                  <b>{displayName}</b>, is requesting for a referral to avail
                  medical from your good office, (
                  {value(certification.placeToRefer.toLocaleUpperCase())}){" "}
                  concerning her health condition who diagnosed with{" "}
                  <b>
                    <span>
                      {value(certification.clinicalData.toLocaleUpperCase())}
                    </span>{" "}
                  </b>
                  . Due to indegent condition of the family, they cannot afford
                  to support her medicine expenses.
                </p>
                <p
                  style={{
                    fontSize: "15px",
                  }}
                >
                  In view of the foregoing information, the undersigned worker
                  respectfully recommend, {displayName} to avail medical
                  assistance from your good office.
                </p>

                <h2>IV. REASON FOR REFERRAL:</h2>

                <p
                  style={{
                    fontSize: "15px",
                  }}
                >
                  {defaultReasonForReferral}
                </p>

                {certification.reasonForReferral?.trim() && (
                  <p
                    style={{
                      fontSize: "15px",
                    }}
                  >
                    {certification.reasonForReferral.trim()}
                  </p>
                )}
              </div>

              {/* SIGNATURES */}

              <div className="formal-signatures">
                <div className="signature-column">
                  <strong>Christine L. Campita, RSW</strong>

                  <span>Social Welfare Officer I</span>

                  <span>LICENSE NO. 0038926</span>
                </div>
              </div>
            </>
          )}

          {/* =================================
              FAMILY INCOME
          ================================= */}

          {certification.type === "Certificate of Family Income" && (
            <>
              <div className="formal-section">
                <div className="identifying-info">
                  <p className="content-info">
                    This is to certify that, after verification,{" "}
                    <b>
                      {value(certification.firstName)}{" "}
                      {value(certification.lastName)}
                    </b>
                    , of legal age, residing at{" "}
                    <b style={{ textTransform: "uppercase" }}>
                      {value(certification.address)}
                    </b>{" "}
                    is found to have a family income below the latest poverty
                    threshold as determined by the Philippine Statistics
                    Authority (PSA) in its report 1st Sem 2021. Therefore, the
                    above individual may qualify for the grant of Lifelin Rate
                    as provided under Republict Act No. 11552 and its
                    Implementing Rule and Regulations. Provided that, the
                    address indicated herein shall be the same address used ub
                    the electric service being applied for.
                  </p>
                  <p className="content-info">
                    In case of transfer of residence, the above qualified
                    marginalized end-user shall inform the Municipal Social
                    Welfare and Development Office (MSWDO) for purposes of
                    securing a new certificate.
                  </p>
                  <p className="content-info">
                    The validity of this certification shall be from March to
                    June 2026.
                  </p>
                </div>
              </div>

              {/* SIGNATURES */}

              <div className="family-income-formal-signatures">
                <div
                  className="middle-signature"
                  style={{
                    fontSize: "12px",
                    fontWeight: "normal",
                    fontFamily: "Courier New, Courier, monospace !important",
                  }}
                >
                  <span>_____________________</span>
                  <br></br>
                  <span>REYGIE A CABUCOS, RSW</span>
                  <br></br>
                  <span>MSWDO-HEAD</span>
                  <br></br>
                  <span>License no. 0026372</span>
                </div>
                <div className="date-issuance">
                  {formatDate(certification.requestedDate)}
                </div>
                <div
                  className="signature-column"
                  style={{
                    fontSize: "12px",
                    fontWeight: "normal",
                  }}
                >
                  <p>Conforme:</p>

                  <span>EUFROCINA E. CUADRA</span>

                  <span>Name and Signature of the Qualified</span>

                  <span>Marginalized End-User</span>
                </div>
              </div>
            </>
          )}

          {/* =================================
              GENERAL FOOTER
          ================================= */}

          {/* <div className="certificate-bottom">
            <p>Date Requested: {formatDate(certification.requestedDate)}</p>

            {certification.purpose && <p>Purpose: {certification.purpose}</p>}
          </div> */}
        </div>

        {/* =====================================
            MODAL FOOTER
        ===================================== */}

        <div className="cert-modal-footer">
          <button type="button" className="btn" onClick={onClose}>
            Close
          </button>

          <button type="button" className="btn primary" onClick={print}>
            Print Certification
          </button>
        </div>
      </div>
    </div>
  );
}
