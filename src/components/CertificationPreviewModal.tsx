import type { CertificationRecord } from "../types";
import obandoLogo from "../assets/obando-logo.png";

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

  /*
   * Print certificate.
   */
  const print = () => {
    window.print();
  };

  return (
    <div className="cert-modal-overlay" onMouseDown={onClose}>
      <div
        className="cert-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* =====================================
            MODAL HEADER
        ===================================== */}

        <div className="cert-modal-header">
          <div>
            <h2>Certification Preview</h2>

            <p>Preview the certification before printing.</p>
          </div>

          <button type="button" className="cert-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* =====================================
            CERTIFICATE PAPER
        ===================================== */}

        <div className="certificate-paper" id="certificate-print">
          {/* =================================
              OFFICIAL HEADER
          ================================= */}

          <div className="official-header">
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
                    <strong>Name :</strong>

                    <span>{displayName}</span>
                  </div>

                  <div>
                    <strong>Age :</strong>

                    <span>{value(certification.age)}</span>
                  </div>

                  <div>
                    <strong>Birthday :</strong>

                    <span>{formatDate(certification.dateOfBirth)}</span>
                  </div>

                  <div>
                    <strong>Birthplace :</strong>

                    <span>{value(certification.birthplace)}</span>
                  </div>

                  <div>
                    <strong>Address :</strong>

                    <span>{value(certification.address)}</span>
                  </div>

                  <div>
                    <strong>Educ. Attainment :</strong>

                    <span>{value(certification.educationalAttainment)}</span>
                  </div>

                  <div>
                    <strong>Civil Status :</strong>

                    <span>{value(certification.civilStatus)}</span>
                  </div>

                  <div>
                    <strong>Occupation :</strong>

                    <span>{value(certification.occupation)}</span>
                  </div>

                  <div>
                    <strong>Contact No. :</strong>

                    <span>{value(certification.contactNo)}</span>
                  </div>

                  <div>
                    <strong>Target Institution :</strong>

                    <span>{value(certification.targetInstitution)}</span>
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
                                  }${
                                    member.income
                                      ? `₱${member.income.toLocaleString()}`
                                      : ""
                                  }`
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

                <p className="formal-paragraph">
                  {certification.presentingProblem ||
                    displayName +
                      " is requesting for a social case study report for his son Dale Cribenson B. Legaspi to avail financial/medical assistance from your " +
                      "good office " +
                      value(certification.targetInstitution) +
                      ", The client was diagnosed with Appendicitis appendectomy, Due to the nature of his illness, he requires continues medical consultation, medication and regular monitoring by his attending physician. The family is currently facing financial difficulties and is unable to settle the remaining hospital balance due to their limited source income. Due to the indigent condition of the family, they cannot afford to support the client's basic needs."}
                </p>
              </div>

              {/* FAMILY BACKGROUND */}

              <div className="formal-section">
                <h2>IV. Family Background</h2>

                <p className="formal-paragraph">
                  {certification.familySituation ||
                    displayName +
                      " is a native residence of Obando Bulacan. They live in their own house made of semi-concrete materials, The client fully depends on his father as a collection specialist. However;the income of the faily is too minimal to support their basic needs and financial expenses; thus, they sought the MSWDO for proper intervention."}
                </p>
              </div>

              {/* RECOMMENDATION */}

              <div className="formal-section">
                <h2>V. Recommendation:</h2>

                <p className="formal-paragraph">
                  {certification.recommendation ||
                    "In view of the foregoing information, the undersigned worker respectfully recommends, " +
                      displayName +
                      " to avail financial/medical assistance from your good office" +
                      value(certification.targetInstitution) +
                      ", Due to their indigent condition, he is found eligible in the said services."}
                </p>
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
                <h2>FOR: BULACAN MEDICAL CENTER</h2>
                <div className="identifying-info">
                  <h2>I. PATIENT'S DATA:</h2>
                  <div>
                    <span>Patient Name :</span>

                    <span>{displayName}</span>
                    <span>Age :</span>

                    <span>{value(certification.age)}</span>
                    <span>Civil Status :</span>

                    <span>{value(certification.civilStatus)}</span>
                  </div>

                  <div>
                    <strong>Address :</strong>

                    <span>{value(certification.address)}</span>
                  </div>
                </div>

                <div className="ClinicalDataInfo formal-field">
                  <h2>Clinical Data:</h2>
                  <h2>
                    FOR MEDICAL ASSISTANCE DIABETES MELLITUS II DIABETES
                    NEPHROPATHY (See attachement)
                  </h2>
                  <p>MAY DELA PAZ-OSEDA, MD</p>
                  <p>Medical Officer II</p>
                  <p>LICENSE NO. 110351</p>
                </div>

                <h2>
                  III. MUNICIPAL SOCIAL WORKER ASSESSMENT AND RECOMMENDATION:
                </h2>

                <p>
                  <b>{displayName}</b>, is requesting for a referral to avail
                  medical from your good office, <b>(BULACAN MEDICAL CENTER)</b>{" "}
                  concerning her health condition who diagnosed with{" "}
                  <b>
                    DIABETES MELLITUS TYPE II DIABETES NEPHROPATHY(see
                    attachement)
                  </b>
                  . Due to indegent condition of the family, they cannot afford
                  to support her medicine expenses.
                </p>
                <p>
                  In view of the foregoing information, the undersigned worker
                  respectfully recommend, {displayName} to avail medical
                  assistance from your good office.
                </p>

                <h2>IV. REASON FOR REFERRAL:</h2>
                <p>
                  Due to their indigent condition, the client is found eligible
                  in the said services.
                </p>
              </div>

              {/* SIGNATURES */}

              <div className="formal-signatures">
                <div className="signature-column">
                  <div className="signature-space" />

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
                    , of legal age, residing at 0411 (A) PROVINCIAL RD. SAN
                    PASCUAL, OBANDO, BULACAN is found to have a family income
                    below the latest poverty threshold as determined by the
                    Philippine Statistics Authority (PSA) in its report 1st Sem
                    2021. Therefore, the above individual may qualify for the
                    grant of Lifelin Rate as provided under Republict Act No.
                    11552 and its Implementing Rule and Regulations. Provided
                    that, the address indicated herein shall be the same address
                    used ub the electric service being applied for.
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
                <div className="middle-signature">
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
                <div className="signature-column">
                  <p>Conforme:</p>

                  <div className="signature-space" />

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
