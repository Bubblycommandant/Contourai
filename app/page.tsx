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

  const riskColors: any = {
    LOW: "#16a34a",
    INTERMEDIATE: "#f59e0b",
    HIGH: "#dc2626",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eef2f7", padding: 40 }}>
      <h1 style={{ fontSize: 30, fontWeight: 700 }}>ContourAI</h1>
      <p style={{ marginBottom: 30, color: "#475569" }}>
        Oropharynx Contouring Decision Support Engine
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 24 }}>

        {/* CASE INPUT */}
        <div style={card}>
          <h2>Case Input</h2>

          <select
            value={form.site}
            onChange={(e) => setForm({ ...form, site: e.target.value })}
            style={input}
          >
            <option value="">Select Site</option>
            <option>Head & Neck</option>
          </select>

          {form.site === "Head & Neck" && (
            <>
              <select
                value={form.subsite}
                onChange={(e) => setForm({ ...form, subsite: e.target.value })}
                style={input}
              >
                <option value="">Select Subsite</option>
                <option>Oropharynx</option>
              </select>

              <input
                placeholder="T Stage"
                value={form.tStage}
                onChange={(e) => setForm({ ...form, tStage: e.target.value })}
                style={input}
              />

              <input
                placeholder="N Stage"
                value={form.nStage}
                onChange={(e) => setForm({ ...form, nStage: e.target.value })}
                style={input}
              />

              <select
                value={form.eneStatus}
                onChange={(e) => setForm({ ...form, eneStatus: e.target.value })}
                style={input}
              >
                <option>Not Present</option>
                <option>Microscopic</option>
                <option>Macroscopic</option>
                <option>Present (unspecified)</option>
              </select>
            </>
          )}

          <button style={button} onClick={handleGenerate}>
            Generate Recommendation
          </button>
        </div>

        {/* RECOMMENDATION */}
        <div style={card}>
          <h2>Recommendation</h2>

          {!result && (
            <p style={{ color: "#64748b" }}>
              Enter case parameters and generate recommendation.
            </p>
          )}

          {result && (
            <>
              {/* RISK STRIP */}
              <div
                style={{
                  backgroundColor: riskColors[result.riskLevel],
                  color: "white",
                  padding: 10,
                  borderRadius: 6,
                  marginBottom: 20,
                  fontWeight: 600,
                }}
              >
                Risk Level: {result.riskLevel}
              </div>

              <p><strong>Summary:</strong> {result.summary}</p>
              <p><strong>GTV:</strong> {result.gtv}</p>
              <p><strong>CTV:</strong> {result.ctv}</p>
              <p><strong>Elective:</strong> {result.electiveText}</p>
              <p><strong>PTV:</strong> {result.ptv}</p>

              {result.deepExtensions.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <h3>Deep Space Extensions</h3>
                  <ul>
                    {result.deepExtensions.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              <details style={{ marginTop: 20 }}>
                <summary style={{ cursor: "pointer", fontWeight: 600 }}>
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

              <details style={{ marginTop: 20 }}>
                <summary style={{ cursor: "pointer", fontWeight: 600 }}>
                  Anatomical Boundaries
                </summary>
                <pre style={codeBlock}>
{JSON.stringify(result.levelBoundaries, null, 2)}
                </pre>
              </details>
            </>
          )}
        </div>

        {/* EVIDENCE */}
        <div style={card}>
          <h2>Evidence & Sources</h2>
          {result &&
            result.citations.map((c, i) => (
              <div key={i} style={citation}>
                <strong>{c.organization}</strong>
                <div>{c.title}</div>
                <div style={{ fontSize: 13 }}>{c.year}</div>
                <span style={badge}>{c.evidence}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

/* STYLES */

const card = {
  backgroundColor: "white",
  padding: 24,
  borderRadius: 10,
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

const input = {
  width: "100%",
  padding: 8,
  marginTop: 10,
  borderRadius: 6,
  border: "1px solid #cbd5e1",
};

const button = {
  marginTop: 20,
  padding: 12,
  width: "100%",
  backgroundColor: "#1e40af",
  color: "white",
  border: "none",
  borderRadius: 6,
  fontWeight: 600,
};

const codeBlock = {
  marginTop: 10,
  fontSize: 12,
  backgroundColor: "#f8fafc",
  padding: 12,
  borderRadius: 6,
};

const citation = {
  marginBottom: 15,
  padding: 12,
  backgroundColor: "#f8fafc",
  borderRadius: 6,
};

const badge = {
  marginTop: 6,
  display: "inline-block",
  fontSize: 12,
  padding: "2px 8px",
  borderRadius: 4,
  backgroundColor: "#16a34a",
  color: "white",
};
