"use client";

import { useState } from "react";

export default function Home() {
  const [site, setSite] = useState("");
  const [result, setResult] = useState<any>(null);

  const generateRecommendation = (site: string) => {
    if (site === "Head & Neck") {
      return {
        summary: "Include gross disease and at-risk nodal basins.",
        gtv: "All visible primary and nodal disease on imaging.",
        ctv: "GTV + 5–10 mm anatomically trimmed.",
        elective: "Include adjacent nodal levels depending on N stage.",
        ptv: "CTV + 3–5 mm depending on setup accuracy.",
        citations: ["EORTC 2018 Head & Neck Atlas", "ICRU Report 83"]
      };
    }

    if (site === "Breast") {
      return {
        summary: "Adjuvant breast or chest wall irradiation.",
        gtv: "Tumor bed identified via clips/imaging.",
        ctv: "Tumor bed + 10–15 mm within breast tissue.",
        elective: "Regional nodes if N positive.",
        ptv: "CTV + 5 mm typical.",
        citations: ["ESTRO Breast CTV Guidelines", "ICRU Report 83"]
      };
    }

    return null;
  };

  const handleGenerate = () => {
    const output = generateRecommendation(site);
    setResult(output);
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>ContourAI – Phase 1</h1>

      <select
        value={site}
        onChange={(e) => setSite(e.target.value)}
        style={{ padding: 8, marginTop: 20 }}
      >
        <option value="">Select Site</option>
        <option>Head & Neck</option>
        <option>Breast</option>
      </select>

      <br /><br />

      <button
        onClick={handleGenerate}
        style={{
          padding: 10,
          backgroundColor: "blue",
          color: "white",
          border: "none"
        }}
      >
        Generate
      </button>

      {result && (
        <div style={{ marginTop: 30 }}>
          <p><strong>Summary:</strong> {result.summary}</p>
          <p><strong>GTV:</strong> {result.gtv}</p>
          <p><strong>CTV:</strong> {result.ctv}</p>
          <p><strong>Elective:</strong> {result.elective}</p>
          <p><strong>PTV:</strong> {result.ptv}</p>

          <h3>Citations:</h3>
          <ul>
            {result.citations.map((c: string, i: number) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
