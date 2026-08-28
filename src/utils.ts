import type { Person } from "./types";
export const colors = [
  "#1a9b8a",
  "#0f2744",
  "#3b6ea8",
  "#8a4d1a",
  "#6b4ea8",
  "#1a6b8a",
];
export function fullName(p: Person) {
  return [p.firstName, p.middleName, p.lastName, p.suffix]
    .filter(Boolean)
    .join(" ");
}
export function initials(p: Person) {
  return ((p.firstName[0] || "") + (p.lastName[0] || "")).toUpperCase();
}
export function colorFor(id: string) {
  return colors[
    [...id].reduce((n, c) => n + c.charCodeAt(0), 0) % colors.length
  ];
}
export function nextPersonCode(people: Person[]) {
  const max = people.reduce((m, p) => {
    const n = parseInt(p.code.replace(/\D/g, ""), 10);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 10540);
  return `PRP-${max + 1}`;
}
