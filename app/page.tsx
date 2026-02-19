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
    hpvStatus: "Unknown",
    tumorLaterality: "Lateralized",
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

              <select
                value={form.hpvStatus}
                onChange={(e) => setForm({ ...form, hpvStatus: e.target.value })}
                style={input}
              >
                <option>Unknown</option>
                <option>Positive</option>
                <option>Negative</option>
              </select>

              <select
                value={form.tumorLaterality}
                onChange={(e) =>
                  setForm({ ...form, tumorLaterality: e.target.value })
                }
                style={input}
              >
                <option>Lateralized</option>
                <option>Midline / Crossing midline</option>
              </select>
            </>
          )}

          <button style={button} onClick={handleGenerate}>
            Generate Recommendation
          </button>
        </div>

        <div style={card}>
          <h2>Recommendation</h2>

          {result && (
            <>
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
              <p><strong>Elective:</strong> {result.electiveText}</p>
            </>
          )}
        </div>

        <div style={card}>
          <h2>Evidence</h2>
          {result &&
            result.citations.map((c, i) => (
              <div key={i}>
                <strong>{c.organization}</strong>
                <div>{c.title}</div>
                <div>{c.year}</div>
              </div>
            ))}
        </div>

      </div>
    </div>
  );
}

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
