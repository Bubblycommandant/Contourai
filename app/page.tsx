"use client";

import { useState } from "react";

type Recommendation = {
  summary: string;
  gtv: string;
  ctv: string;
  elective: string;
  ptv: string;
  citations: string[];
};

function generateRecommendation(data: any): Recommendation {
  const { site, tStage, nStage, marginMm, ene } = data;

  const icru = "ICRU Report 83 (2010)";

  // HEAD & NECK
  if (site === "Head & Neck") {
    if (nStage?.includes("N2")) {
      return {
        summary:
          "Locally advanced nodal disease – bilateral neck coverage recommended.",
        gtv:
          "All radiologically visible primary and nodal disease.",
        ctv:
          "GTV + 5–10 mm anatomically trimmed to respect barriers.",
        elective:
          "Ipsilateral levels II–IV + contralateral II–III.",
        ptv:
          "CTV + 3–5 mm depending on immobilization accuracy.",
        citations: [
          "EORTC Head & Neck Atlas 2018",
          icru,
        ],
      };
    }

    return {
      summary: "Early-stage or limited nodal disease.",
      gtv: "Gross primary ± involved nodes.",
      ctv: "GTV + 5 mm expansion.",
      elective: "Ipsilateral nodal levels depending on site.",
      ptv: "CTV + 3–5 mm.",
      citations: ["EORTC Head & Neck Atlas 2018", icru],
    };
  }

  // BREAST
  if (site === "Breast") {
    if (marginMm && marginMm <= 2) {
      return {
        summary: "Close margin – high-risk tumor bed coverage required.",
        gtv: "Tumor bed defined by clips and imaging.",
        ctv: "Tumor bed + 15 mm limited to breast tissue.",
        elective: "Regional nodes if N positive.",
        ptv: "CTV + 5 mm typical.",
        citations: ["ESTRO Breast Guidelines 2015", icru],
      };
    }

    return {
      summary: "Standard adjuvant whole breast irradiation.",
      gtv: "Tumor bed.",
      ctv: "Whole breast CTV.",
      elective: "Regional nodes if indicated.",
      ptv: "CTV + 5 mm.",
      citations: ["ESTRO Breast Guidelines 2015", icru],
    };
  }

  // PROSTATE
  if (site === "Prostate") {
    if (tStage?.includes("T3")) {
      return {
        summary: "High-risk disease – seminal vesicle coverage required.",
        gtv: "Prostate ± involved seminal vesicles.",
        ctv: "Prostate + proximal seminal vesicles.",
        elective: "Pelvic nodes if high risk.",
        ptv: "CTV + 5–7 mm (posterior 3–5 mm).",
        citations: ["RTOG Prostate Atlas", icru],
      };
    }

    return {
      summary: "Localized prostate cancer.",
      gtv: "Prostate gland.",
      ctv: "Prostate only.",
      elective: "No elective nodes in low risk.",
      ptv: "CTV + 5–7 mm.",
      citations: ["RTOG Prostate Atlas", icru],
    };
  }

  return {
    summary: "No rule matched.",
    gtv: "",
    ctv: "",
    elective: "",
    ptv: "",
    citations: [icru],
  };
}

export default function Home() {
  const [form, setForm] = useState({
    site: "",
    tStage: "",
    nStage: "",
    marginMm: "",
    ene: false,
  });

  const [result, setResult] = useState<Recommendation | null>(null);

  const handleGenerate = () => {
    setResult(generateRecommendation(form));
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
          placeholder="T Stage (e.g., T2)"
          value={form.tStage}
          onChange={(e) =>
            setForm({ ...form, tStage: e.target.value })
          }
        />

        <br /><br />

        <input
          placeholder="N Stage (e.g., N2b)"
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

        <label>
          <input
            type="checkbox"
            checked={form.ene}
            onChange={(e) =>
              setForm({ ...form, ene: e.target.checked })
            }
          />
          ENE Present
        </label>

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
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
