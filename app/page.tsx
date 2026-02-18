"use client";

import { useState } from "react";
import { generateRecommendation, Recommendation } from "../lib/rules";

export default function Home() {
  const [form, setForm] = useState({
    site: "",
    tStage: "",
    nStage: "",
    marginMm: "",
  });

  const [result, setResult] = useState<Recommendation | null>(null);

  const handleGenerate = () => {
    setResult(generateRecommendation(form));
  };

  const downloadJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contourai-report.json";
    a.click();
  };

  const getRiskLabel = () => {
    if (form.nStage?.includes("N2") || form.tStage?.includes("T3"))
      return "High Risk";
    return "Standard Risk";
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9", padding: 30 }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 20 }}>
        ContourAI – Clinical Decision Support
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 20 }}>

        {/* LEFT PANEL */}
        <div style={{ background: "white", padding: 20, borderRadius: 8 }}>
          <h2>Case Input</h2>

          <select
            value={form.site}
            onChange={(e) => setForm({ ...form, site: e.target.value })}
            style={{ width: "100%", marginTop: 10 }}
          >
            <option value="">Select Site</option>
            <option>Head & Neck</option>
            <option>Breast</option>
            <option>Prostate</option>
          </select>

          <input
            placeholder="T Stage"
            value={form.tStage}
            onChange={(e) => setForm({ ...form, tStage: e.target.value })}
            style={{ width: "100%", marginTop: 10 }}
          />

          <input
            placeholder="N Stage"
            value={form.nStage}
            onChange={(e) => setForm({ ...form, nStage: e.target.value })}
            style={{ width: "100%", marginTop: 10 }}
          />

          <input
            placeholder="Margin (mm)"
            type="number"
            value={form.marginMm}
            onChange={(e) => setForm({ ...form, marginMm: e.target.value })}
            style={{ width: "100%", marginTop: 10 }}
          />

          <button
            onClick={handleGenerate}
            style={{
              marginTop: 15,
              padding: 10,
              width: "100%",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 4,
            }}
          >
            Generate
          </button>
        </div>

        {/* CENTER PANEL */}
        <div style={{ background: "white", padding: 20, borderRadius: 8 }}>
          <h2>Recommendation</h2>

          {result ? (
            <>
              <div style={{
                padding: 10,
                backgroundColor: "#e2e8f0",
                borderRadius: 6,
                marginBottom: 15
              }}>
                <strong>
                  {form.site} – {form.tStage}{form.nStage} – {getRiskLabel()}
                </strong>
              </div>

              <p><strong>Summary:</strong> {result.summary}</p>
              <p><strong>GTV:</strong> {result.gtv}</p>
              <p><strong>CTV:</strong> {result.ctv}</p>
              <p><strong>Elective:</strong> {result.elective}</p>
              <p><strong>PTV:</strong> {result.ptv}</p>

              <button
                onClick={downloadJSON}
                style={{
                  marginTop: 15,
                  padding: 8,
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                }}
              >
                Download JSON
              </button>
            </>
          ) : (
            <p style={{ color: "#64748b" }}>
              Enter case details and generate recommendation.
            </p>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div style={{ background: "white", padding: 20, borderRadius: 8 }}>
          <h2>Citations</h2>

          {result ? (
            <ul>
              {result.citations.map((c, i) => (
                <li key={i} style={{ marginBottom: 10 }}>
                  <div>
                    <strong>{c.organization}</strong> – {c.title} ({c.year})
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      padding: "2px 6px",
                      borderRadius: 4,
                      backgroundColor:
                        c.evidence === "HIGH"
                          ? "#16a34a"
                          : c.evidence === "MEDIUM"
                          ? "#f59e0b"
                          : "#dc2626",
                      color: "white",
                    }}
                  >
                    {c.evidence}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#64748b" }}>
              Citations will appear here.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
