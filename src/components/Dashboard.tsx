import { useEffect, useMemo, useState } from "react";

import type { Person, Page } from "../types";
import { fullName } from "../utils";
import Stats from "./Stats";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {
  people: Person[];
  setPage: (p: Page) => void;
  setCurrentId: (id: string) => void;
};

const COLORS = ["#6366f1", "#22c55e", "#f59e0b"];

type CertificationCounts = {
  socialCaseStudy: number;
  interAgency: number;
  familyIncome: number;
};

type BarangayData = {
  barangay: string;
  socialCaseStudy: number;
  interAgency: number;
  familyIncome: number;
  total: number;
};

type DashboardStatistics = {
  success: boolean;
  totalCertifications: number;
  certificationCounts: CertificationCounts;
  barangays: BarangayData[];
};

type PieData = {
  name: string;
  value: number;
};

export default function Dashboard({ people, setPage, setCurrentId }: Props) {
  // =====================================================
  // STATE
  // =====================================================

  const [dashboardData, setDashboardData] =
    useState<DashboardStatistics | null>(null);

  // No barangay selected at first
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/dashboard/statistics",
        );

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data: DashboardStatistics = await response.json();

        if (!data.success) {
          throw new Error("Failed to load dashboard statistics.");
        }

        console.log("DASHBOARD DATA:", data);

        setDashboardData(data);
      } catch (err) {
        console.error("DASHBOARD DATA ERROR:", err);

        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // =====================================================
  // DEFAULT COUNTS
  // =====================================================

  const certificationCounts: CertificationCounts =
    dashboardData?.certificationCounts ?? {
      socialCaseStudy: 0,
      interAgency: 0,
      familyIncome: 0,
    };

  const totalCertifications = dashboardData?.totalCertifications ?? 0;

  // =====================================================
  // BARANGAYS
  // =====================================================

  const barangays = useMemo(() => {
    return dashboardData?.barangays ?? [];
  }, [dashboardData]);

  // =====================================================
  // SELECTED BARANGAY
  // =====================================================

  const selectedBarangayData = useMemo(() => {
    if (!selectedBarangay) {
      return null;
    }

    return barangays.find((item) => item.barangay === selectedBarangay) ?? null;
  }, [selectedBarangay, barangays]);

  // =====================================================
  // TOTAL CERTIFICATION PIE CHART
  // =====================================================

  const certificationPieData: PieData[] = [
    {
      name: "Social Case Study Report",
      value: certificationCounts.socialCaseStudy,
    },
    {
      name: "Inter-Agency Referral Form",
      value: certificationCounts.interAgency,
    },
    {
      name: "Certificate of Family Income",
      value: certificationCounts.familyIncome,
    },
  ];

  // =====================================================
  // BARANGAY PIE CHART
  // =====================================================

  const barangayPieData: PieData[] = selectedBarangayData
    ? [
        {
          name: "Social Case Study Report",
          value: selectedBarangayData.socialCaseStudy,
        },
        {
          name: "Inter-Agency Referral Form",
          value: selectedBarangayData.interAgency,
        },
        {
          name: "Certificate of Family Income",
          value: selectedBarangayData.familyIncome,
        },
      ]
    : [];

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section>
        <h1>Dashboard</h1>

        <p className="sub">Loading dashboard statistics...</p>
      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <section>
        <h1>Dashboard</h1>

        <div className="card section">
          <h2>Unable to load dashboard</h2>

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
            onClick={() => window.location.reload()}
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
      <h1>Dashboard</h1>

      <p className="sub">
        Overview of certificate records and certifications in the registry.
      </p>

      <Stats people={people} />

      {/* =================================================
          CERTIFICATION DISTRIBUTION
      ================================================= */}

      <div className="dashboard-chart-grid" style={{ marginTop: 20 }}>
        <div className="card section">
          <div className="chart-header">
            <div>
              <h2>Certification Distribution</h2>

              <p className="sub">Total certifications by type.</p>
            </div>

            <div className="chart-total">
              <strong>{totalCertifications}</strong>

              <span>Total Certificates</span>
            </div>
          </div>

          <div className="pie-chart-wrapper">
            <CertificationPieChart data={certificationPieData} />
          </div>

          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-dot social"></span>

              <span>Social Case Study Report</span>

              <strong>{certificationCounts.socialCaseStudy}</strong>
            </div>

            <div className="legend-item">
              <span className="legend-dot referral"></span>

              <span>Inter-Agency Referral Form</span>

              <strong>{certificationCounts.interAgency}</strong>
            </div>

            <div className="legend-item">
              <span className="legend-dot income"></span>

              <span>Certificate of Family Income</span>

              <strong>{certificationCounts.familyIncome}</strong>
            </div>
          </div>
        </div>

        {/* =================================================
            CERTIFICATIONS BY BARANGAY
        ================================================= */}

        <div className="card section">
          <div className="chart-header">
            <div>
              <h2>Certifications by Barangay</h2>

              <p className="sub">
                Click a barangay to view its certification data.
              </p>
            </div>
          </div>

          {/* =================================================
              BARANGAY LIST
          ================================================= */}

          <div
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 8,
            }}
          >
            {barangays.length === 0 ? (
              <div className="empty-chart" style={{ gridColumn: "1 / -1" }}>
                <div className="empty-chart-number">0</div>

                <p>No barangay certification data available.</p>
              </div>
            ) : (
              barangays.map((item, index) => {
                const isSelected = selectedBarangay === item.barangay;

                return (
                  <button
                    key={item.barangay}
                    type="button"
                    onClick={() => setSelectedBarangay(item.barangay)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      border: isSelected
                        ? "1px solid #6366f1"
                        : "1px solid #e5e7eb",
                      borderRadius: 6,
                      background: isSelected ? "#eef2ff" : "#ffffff",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: 15,
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        minWidth: 0,
                      }}
                    >
                      <strong style={{ minWidth: 22 }}>{index + 1}.</strong>

                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: isSelected ? "#4338ca" : "#111827",
                          fontWeight: isSelected ? 600 : 400,
                        }}
                      >
                        {item.barangay}
                      </span>
                    </span>

                    <strong
                      style={{
                        minWidth: 25,
                        textAlign: "right",
                        color: isSelected ? "#4338ca" : "#374151",
                      }}
                    >
                      {item.total}
                    </strong>
                  </button>
                );
              })
            )}
          </div>

          {/* =================================================
              BARANGAY GRAPH
          ================================================= */}

          {selectedBarangayData && (
            <div style={{ marginTop: 28 }}>
              <div className="chart-header">
                <div>
                  <h2>{selectedBarangayData.barangay}</h2>

                  <p className="sub">
                    Certification distribution for this barangay.
                  </p>
                </div>

                <div className="chart-total">
                  <strong>{selectedBarangayData.total}</strong>

                  <span>Certificates</span>
                </div>
              </div>

              <div className="pie-chart-wrapper">
                <CertificationPieChart data={barangayPieData} />
              </div>

              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-dot social"></span>

                  <span>Social Case Study Report</span>

                  <strong>{selectedBarangayData.socialCaseStudy}</strong>
                </div>

                <div className="legend-item">
                  <span className="legend-dot referral"></span>

                  <span>Inter-Agency Referral Form</span>

                  <strong>{selectedBarangayData.interAgency}</strong>
                </div>

                <div className="legend-item">
                  <span className="legend-dot income"></span>

                  <span>Certificate of Family Income</span>

                  <strong>{selectedBarangayData.familyIncome}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =================================================
          RECENT RECORDS
      ================================================= */}

      <div className="dash-grid">
        <div className="card section">
          <h2>Recent records</h2>

          <ul className="list-plain">
            {people.slice(0, 5).map((p) => (
              <li key={p.id}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();

                    setCurrentId(p.id);

                    setPage("view");
                  }}
                >
                  {fullName(p)}
                </a>

                <span>{p.code}</span>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 14 }}>
            <button className="btn outline" onClick={() => setPage("people")}>
              Open people list
            </button>
          </div>
        </div>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div className="card section">
          <h2>Quick actions</h2>

          <div className="fields">
            <button className="btn primary" onClick={() => setPage("form")}>
              Enter person information
            </button>

            <button className="btn outline" onClick={() => setPage("people")}>
              List / view / update / delete
            </button>

            <button className="btn" onClick={() => setPage("preview")}>
              Open print preview
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================
   PIE CHART COMPONENT
===================================================== */

function CertificationPieChart({ data }: { data: PieData[] }) {
  const hasData = data.some((item) => item.value > 0);

  if (!hasData) {
    return (
      <div className="empty-chart">
        <div className="empty-chart-number">0</div>

        <p>No certification data available.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={105}
          innerRadius={55}
          paddingAngle={3}
          label={({ value }) => value}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip formatter={(value) => [value, "Certificates"]} />

        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
