export type Gender = "Male" | "Female" | "Other";
export type Status = "Active" | "Inactive";
export type Page =
  | "dashboard"
  | "people"
  | "form"
  | "view"
  | "preview"
  | "reports"
  | "settings";

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
}

export type PersonFormData = Omit<Person, "id" | "code" | "status"> & {
  id?: string;
  code?: string;
  status?: Status;
};
