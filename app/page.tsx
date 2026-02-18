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

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>ContourAI – Clinical Phase 1</h1>

      <div style={{ marginTop: 20 }}>
        <select
          value={form.site}
          onChange={(e) =>
            setForm({ ...form, site: e.target.value })
          }
        >
          <option value="">Select Site</option>
          <option>Head & Neck</option>
          <option>Breast</option>
          <option>Prostate</option>
        </select>

        <br /><br />

        <input
          placeholder="T Stage"
          value={form.tStage}
          onChange={(e) =>
            setForm({ ...form, tStage: e.target.value })
          }
        />

        <br /><br />

        <input
          placeholder="N Stage"
          value={form.nStage}
          onChange={(e) =>
            setForm({ ...form, nStage: e.target.value })
          }
        />

        <br /><br />

        <input
          placeholder="Margin (mm)"
          type="number"
          value={form.marginMm}
          onChange={(e) =>
            setForm({ ...form, marginMm: e.target.value })
          }
        />

        <br /><br />

        <button
          onClick={handleGenerate}
          style={{
            padding: 10,
            backgroundColor: "blue",
            color: "white",
            border: "none",
          }}
        >
          Generate Recommendation
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 30 }}>
          <h2>Recommendation</h2>
          <p><strong>Summary:</strong> {result.summary}</p>
          <p><strong>GTV:</strong> {result.gtv}</p>
          <p><strong>CTV:</strong> {result.ctv}</p>
          <p><strong>Elective:</strong> {result.elective}</p>
          <p><strong>PTV:</strong> {result.ptv}</p>

          <h3>Citations:</h3>
          <ul>
            {result.citations.map((c, i) => (
              <li key={i}>
                {c.organization} – {c.title} ({c.year})
              </li>
            ))}
          </ul>

          <button
            onClick={downloadJSON}
            style={{
              marginTop: 15,
              padding: 8,
              backgroundColor: "green",
              color: "white",
              border: "none",
            }}
          >
            Download JSON
          </button>
        </div>
      )}
    </div>
  );
}
