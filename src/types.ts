export type Gender = "Male" | "Female" | "Other";

export type Status = "Active" | "Inactive";

export type Page =
  | "dashboard"
  | "certification"
  | "savedcertificates"
  | "people"
  | "form"
  | "view"
  | "preview"
  | "reports"
  | "settings";

export type CertificationType =
  | "Social Case Study Report"
  | "Inter-Agency Referral Form"
  | "Certificate of Family Income";

export type TargetInstitution = "PCSO" | "Ofc of the President";

export type CertificationFamilyMember = {
  id: string;
  name: string;
  relationship: string;
  age: number;
  civilStatus: string;
  educationalAttainment: string;
  occupation: string;
  income: number;
};

export type CertificationRecord = {
  id: string;
  type: CertificationType;

  // Database IDs
  personId?: number;
  socialcaseId?: number;
  interagencyId?: number;
  familyIncomeId?: number;

  // Person information
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  age: number;
  dateOfBirth: string;
  birthplace: string;
  gender: string;
  civilStatus: string;
  educationalAttainment: string;
  occupation: string;
  contactNo: string;
  barangay: string;
  address: string;

  // =====================================================
  // DATE CREATED
  // Comes from person_details.created_at
  // =====================================================
  createdAt?: string;

  // Target institution
  targetInstitution: string;

  // Certification details
  purpose: string;
  requestedDate: string;

  // Family
  familyMembers: CertificationFamilyMember[];

  // Social Case Study Report
  presentingProblem: string;
  familySituation: string;
  assessment: string;
  recommendation: string;

  // Inter-Agency Referral
  referredTo: string;
  reasonForReferral: string;
  servicesNeeded: string;
  referralRemarks: string;

  // Certificate of Family Income
  monthlyFamilyIncome: number;
  incomeSource: string;
  numberOfFamilyMembers: number;
  incomeRemarks: string;
};

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  civilStatus: string;
  occupation: string;
  income: number;
  educationalAttainment: string;
  targetInstitution: string;
}

export interface Person {
  id: string;
  code: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  dob: string;
  gender: Gender;
  civilStatus: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postal: string;
  status: Status;
  emergencyName: string;
  emergencyRel: string;
  emergencyPhone: string;
  nationalId: string;
  passport: string;
  photo: string;
  familyMembers: FamilyMember[];
}

export type PersonFormData = Omit<Person, "id" | "code" | "status"> & {
  id?: string;
  code?: string;
  status?: Status;
};
