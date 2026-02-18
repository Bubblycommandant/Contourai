export type Recommendation = {
  summary: string;
  gtv: string;
  ctv: string;
  elective: string;
  ptv: string;
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

  if (site === "Breast") {
    if (marginMm && Number(marginMm) <= 2) {
      return {
        summary:
          "Close/positive margin — high-risk tumor bed expansion recommended.",
        gtv: "Tumor bed defined by surgical clips and imaging.",
        ctv: "Tumor bed + 15 mm limited to breast tissue.",
        elective: "Regional nodes if N positive.",
        ptv: "CTV + 5 mm.",
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

  if (site === "Prostate") {
    if (tStage?.includes("T3")) {
      return {
        summary:
          "High-risk prostate cancer — seminal vesicle inclusion required.",
        gtv: "Prostate ± involved seminal vesicles.",
        ctv: "Prostate + proximal seminal vesicles.",
        elective: "Pelvic nodes if high risk.",
        ptv: "CTV + 5–7 mm (posterior margin 3–5 mm).",
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
    citations: [ICRU],
  };
}
