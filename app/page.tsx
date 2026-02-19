"use client";

import { useState } from "react";
import { generateRecommendation, Recommendation } from "../lib/rules";

export default function Home() {
  const [form, setForm] = useState({
    site: "",
    subsite: "",
    tStage: "",
    nStage: "",
    eneStatus: "Not Present",
  });

  const [result, setResult] = useState<Recommendation | null>(null);

  const handleGenerate = () => {
    setResult(generateRecommendation(form));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#eef2f7",
        padding: 40,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 30, fontWeight: 700, color: "#0f172a" }}>
          ContourAI
        </h1>
        <p style={{ color: "#475569", marginTop: 4 }}>
          Oropharynx Contouring Decision Support Engine
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr",
          gap: 24,
        }}
      >
        {/* LEFT PANEL */}
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Case Input</h2>

          <Label>Select Site</Label>
          <Select
            value={form.site}
            onChange={(e) => setForm({ ...form, site: e.target.value })}
          >
            <option value="">Select Site</option>
            <option>Head & Neck</option>
          </Select>

          {form.site === "Head & Neck" && (
            <>
              <Label>Subsite</Label>
              <Select
                value={form.subsite}
                onChange={(e) =>
                  setForm({ ...form, subsite: e.target.value })
                }
              >
                <option value="">Select Subsite</option>
                <option>Oropharynx</option>
              </Select>

              <Label>T Stage</Label>
              <Input
                placeholder="e.g., T4"
                value={form.tStage}
                onChange={(e) =>
                  setForm({ ...form, tStage: e.target.value })
                }
              />

              <Label>N Stage</Label>
              <Input
                placeholder="e.g., N2b"
                value={form.nStage}
                onChange={(e) =>
                  setForm({ ...form, nStage: e.target.value })
                }
              />

              <Label>ENE Status</Label>
              <Select
                value={form.eneStatus}
                onChange={(e) =>
                  setForm({ ...form, eneStatus: e.target.value })
                }
              >
                <option>Not Present</option>
                <option>Microscopic</option>
                <option>Macroscopic</option>
                <option>Present (unspecified)</option>
              </Select>
            </>
          )}

          <button style={primaryButton} onClick={handleGenerate}>
            Generate Recommendation
          </button>
        </div>

        {/* CENTER PANEL */}
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Recommendation</h2>

          {!result && (
            <p style={{ color: "#64748b" }}>
              Enter case parameters and generate recommendation.
            </p>
          )}

          {result && (
            <>
              <HeaderBlock result={result} />

              <ClinicalRow title="GTV" value={result.gtv} />
              <ClinicalRow title="CTV" value={result.ctv} />
              <ClinicalRow title="Elective" value={result.electiveText} />
              <ClinicalRow title="PTV" value={result.ptv} />

              {result.deepExtensions.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <h3 style={{ fontSize: 16, marginBottom: 8 }}>
                    Deep Space Extensions
                  </h3>
                  <ul style={{ paddingLeft: 18 }}>
                    {result.deepExtensions.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              <details style={detailsStyle}>
                <summary style={summaryStyle}>
                  Structured Nodal Levels
                </summary>
                <pre style={codeBlock}>
{JSON.stringify(
  {
    laterality: result.laterality,
    includedLevels: result.includedLevels,
  },
  null,
  2
)}
                </pre>
              </details>

              <details style={detailsStyle}>
                <summary style={summaryStyle}>
                  Anatomical Boundaries
                </summary>
                <pre style={codeBlock}>
{JSON.stringify(result.levelBoundaries, null, 2)}
                </pre>
              </details>
            </>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Evidence & Sources</h2>

          {result &&
            result.citations.map((c, i) => (
              <div key={i} style={citationBlock}>
                <strong>{c.organization}</strong>
                <div style={{ fontSize: 14 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>
                  {c.year}
                </div>
                <span style={evidenceBadge}>{c.evidence}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

/* ======================= COMPONENTS ======================= */

function HeaderBlock({ result }: { result: Recommendation }) {
  return (
    <div
      style={{
        backgroundColor: "#f1f5f9",
        padding: 14,
        borderRadius: 6,
        marginBottom: 20,
      }}
    >
      <strong>Summary:</strong> {result.summary}
    </div>
  );
}

function ClinicalRow({ title, value }: any) {
  return (
    <div style={{ marginBottom: 12 }}>
      <strong>{title}:</strong>
      <div style={{ marginTop: 4 }}>{value}</div>
    </div>
  );
}

/* ======================= STYLES ======================= */

const cardStyle = {
  backgroundColor: "white",
  padding: 24,
  borderRadius: 10,
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

const sectionTitle = {
  fontSize: 18,
  marginBottom: 16,
  color: "#0f172a",
};

const primaryButton = {
  marginTop: 20,
  padding: 12,
  width: "100%",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 6,
  fontWeight: 600,
  cursor: "pointer",
};

const detailsStyle = {
  marginTop: 20,
};

const summaryStyle = {
  cursor: "pointer",
  fontWeight: 600,
  color: "#1e293b",
};

const codeBlock = {
  marginTop: 10,
  fontSize: 12,
  backgroundColor: "#f8fafc",
  padding: 12,
  borderRadius: 6,
};

const citationBlock = {
  marginBottom: 18,
  padding: 12,
  backgroundColor: "#f8fafc",
  borderRadius: 6,
};

const evidenceBadge = {
  marginTop: 6,
  display: "inline-block",
  fontSize: 12,
  padding: "2px 8px",
  borderRadius: 4,
  backgroundColor: "#16a34a",
  color: "white",
};

function Label({ children }: any) {
  return (
    <div style={{ marginTop: 12, marginBottom: 4, fontSize: 14 }}>
      {children}
    </div>
  );
}

function Input(props: any) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: 8,
        borderRadius: 6,
        border: "1px solid #cbd5e1",
      }}
    />
  );
}

function Select(props: any) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        padding: 8,
        borderRadius: 6,
        border: "1px solid #cbd5e1",
      }}
    />
  );
}
