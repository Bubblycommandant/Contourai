export type Recommendation = {
  summary: string;
  gtv: string;
  ctv: string;
  elective: string;
  ptv: string;
  explanation: string;
  citations: {
    organization: string;
    title: string;
    year: number;
    evidence: "HIGH" | "MEDIUM" | "LOW";
  }[];
};

export function generateRecommendation(data: any): Recommendation {
  const { site, tStage, nStage, marginMm } = data;

  const ICRU = {
    organization: "ICRU",
    title: "ICRU Report 83",
    year: 2010,
    evidence: "HIGH" as const,
  };

  // HEAD & NECK
  if (site === "Head & Neck") {
    if (nStage?.includes("N2")) {
      return {
        summary:
          "Locally advanced nodal disease — bilateral elective neck coverage recommended.",
        gtv:
          "All gross tumor and radiologically involved nodes.",
        ctv:
          "GTV + 5–10 mm anatomically trimmed respecting air, bone, and fascia.",
        elective:
          "Ipsilateral levels II–IV + contralateral II–III.",
        ptv:
          "CTV + 3–5 mm depending on immobilization accuracy.",
        explanation:
          "N2 disease detected. According to EORTC consensus atlas, bilateral elective nodal coverage is recommended in advanced nodal stage. CTV expansion of 5–10 mm reflects microscopic spread risk. PTV margin per ICRU 83.",
        citations: [
          {
            organization: "EORTC",
            title: "Head & Neck Nodal Level Atlas",
            year: 2018,
            evidence: "HIGH",
          },
          ICRU,
        ],
      };
    }

    return {
      summary: "Limited nodal disease.",
      gtv: "Gross primary ± involved nodes.",
      ctv: "GTV + 5 mm expansion.",
      elective: "Ipsilateral nodal levels depending on site.",
      ptv: "CTV + 3–5 mm.",
      explanation:
        "No advanced nodal stage detected. Ipsilateral coverage sufficient. Margin selection reflects standard microscopic spread risk per EORTC guidance.",
      citations: [
        {
          organization: "EORTC",
          title: "Head & Neck Nodal Level Atlas",
          year: 2018,
          evidence: "HIGH",
        },
        ICRU,
      ],
    };
  }

  // BREAST
  if (site === "Breast") {
    if (marginMm && Number(marginMm) <= 2) {
      return {
        summary:
          "Close/positive margin — high-risk tumor bed expansion recommended.",
        gtv: "Tumor bed defined by surgical clips and imaging.",
        ctv: "Tumor bed + 15 mm limited to breast tissue.",
        elective: "Regional nodes if N positive.",
        ptv: "CTV + 5 mm.",
        explanation:
          "Margin ≤2 mm indicates higher microscopic residual risk. ESTRO guidelines recommend expanded tumor bed coverage. PTV margin applied as per ICRU recommendations.",
        citations: [
          {
            organization: "ESTRO",
            title: "Breast CTV Guidelines",
            year: 2015,
            evidence: "HIGH",
          },
          ICRU,
        ],
      };
    }

    return {
      summary: "Standard adjuvant whole breast irradiation.",
      gtv: "Tumor bed.",
      ctv: "Whole breast CTV.",
      elective: "Regional nodes if indicated.",
      ptv: "CTV + 5 mm.",
      explanation:
        "Adequate surgical margins. Whole breast irradiation per ESTRO consensus. Standard PTV margin per ICRU 83.",
      citations: [
        {
          organization: "ESTRO",
          title: "Breast CTV Guidelines",
          year: 2015,
          evidence: "HIGH",
        },
        ICRU,
      ],
    };
  }

  // PROSTATE
  if (site === "Prostate") {
    if (tStage?.includes("T3")) {
      return {
        summary:
          "High-risk prostate cancer — seminal vesicle inclusion required.",
        gtv: "Prostate ± involved seminal vesicles.",
        ctv: "Prostate + proximal seminal vesicles.",
        elective: "Pelvic nodes if high risk.",
        ptv: "CTV + 5–7 mm (posterior margin 3–5 mm).",
        explanation:
          "T3 disease indicates extracapsular extension risk. RTOG prostate atlas recommends inclusion of seminal vesicles in high-risk disease. Standard PTV margins per ICRU.",
        citations: [
          {
            organization: "RTOG",
            title: "Prostate Contouring Atlas",
            year: 2009,
            evidence: "HIGH",
          },
          ICRU,
        ],
      };
    }

    return {
      summary: "Localized prostate cancer.",
      gtv: "Prostate gland.",
      ctv: "Prostate only.",
      elective: "No elective nodes in low risk.",
      ptv: "CTV + 5–7 mm.",
      explanation:
        "Organ-confined disease. RTOG consensus supports prostate-only coverage in low-risk cases.",
      citations: [
        {
          organization: "RTOG",
          title: "Prostate Contouring Atlas",
          year: 2009,
          evidence: "HIGH",
        },
        ICRU,
      ],
    };
  }

  return {
    summary: "No rule matched.",
    gtv: "",
    ctv: "",
    elective: "",
    ptv: "",
    explanation:
      "No structured rule triggered. Default ICRU definitions applied.",
    citations: [ICRU],
  };
}
