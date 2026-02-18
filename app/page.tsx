"use client";

import { useState } from "react";
import { generateRecommendation, Recommendation } from "../lib/rules";

export default function Home() {
  const [form, setForm] = useState({
    site: "",
    subsite: "",
    tStage: "",
    nStage: "",
  });

  const [result, setResult] = useState<Recommendation | null>(null);

  const handleGenerate = () => {
    setResult(generateRecommendation(form));
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
          </select>

          {form.site === "Head & Neck" && (
            <select
              value={form.subsite}
              onChange={(e) =>
                setForm({ ...form, subsite: e.target.value })
              }
              style={{ width: "100%", marginTop: 10 }}
            >
              <option value="">Select Subsite</option>
              <option>Oropharynx</option>
              <option>Oral Cavity</option>
              <option>Larynx</option>
              <option>Nasopharynx</option>
            </select>
          )}

          <input
            placeholder="T Stage"
            value={form.tStage}
            onChange={(e) =>
              setForm({ ...form, tStage: e.target.value })
            }
            style={{ width: "100%", marginTop: 10 }}
          />

          <input
            placeholder="N Stage"
            value={form.nStage}
            onChange={(e) =>
              setForm({ ...form, nStage: e.target.value })
            }
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
              <p><strong>Summary:</strong> {result.summary}</p>
              <p><strong>GTV:</strong> {result.gtv}</p>
              <p><strong>CTV:</strong> {result.ctv}</p>
              <p><strong>Elective:</strong> {result.elective}</p>
              <p><strong>PTV:</strong> {result.ptv}</p>

              <details style={{ marginTop: 15 }}>
                <summary style={{ cursor: "pointer", fontWeight: 600 }}>
                  Why this recommendation?
                </summary>
                <p style={{ marginTop: 8 }}>
                  {result.explanation}
                </p>
              </details>
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
                          : "#f59e0b",
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
