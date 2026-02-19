import { levelAtlas } from "./atlas";

export type RiskLevel = "LOW" | "INTERMEDIATE" | "HIGH";

export type Recommendation = {
  summary: string;
  gtv: string;
  ctv: string;
  electiveText: string;
  includedLevels: string[];
  levelBoundaries: Record<string, any>;
  laterality: "Ipsilateral" | "Bilateral";
  ptv: string;
  deepExtensions: string[];
  riskLevel: RiskLevel;
  explanation: string;
  citations: {
    organization: string;
    title: string;
    year: number;
    evidence: "HIGH" | "MEDIUM" | "LOW";
  }[];
};

export function generateRecommendation(data: any): Recommendation {
  const {
    site,
    subsite,
    tStage,
    nStage,
    eneStatus,
    hpvStatus,
    tumorLaterality,
    marginStatus,
    doi,
    pni,
    lvi,
  } = data;

  const ICRU = {
    organization: "ICRU",
    title: "ICRU Report 83",
    year: 2010,
    evidence: "HIGH" as const,
  };

  /* ===============================
     OROPHARYNX LOGIC (unchanged)
  =============================== */

  if (site === "Head & Neck" && subsite === "Oropharynx") {
    let ctvMargin = "5–7 mm";
    let laterality: "Ipsilateral" | "Bilateral" = "Ipsilateral";
    let includedLevels = ["IIa", "IIb", "III", "IV"];
    let riskLevel: RiskLevel = "LOW";

    const advancedT = tStage?.includes("T3") || tStage?.includes("T4");
    const advancedN = nStage?.includes("N2");
    const earlyN = nStage?.includes("N0") || nStage?.includes("N1");

    const enePresent =
      eneStatus === "Microscopic" ||
      eneStatus === "Macroscopic" ||
      eneStatus === "Present (unspecified)";

    if (
      hpvStatus === "Positive" &&
      tumorLaterality === "Lateralized" &&
      earlyN &&
      !enePresent &&
      !advancedT
    ) {
      laterality = "Ipsilateral";
      riskLevel = "LOW";
    }

    if (tumorLaterality === "Midline / Crossing midline") {
      laterality = "Bilateral";
    }

    if (advancedN) {
      laterality = "Bilateral";
      riskLevel = "INTERMEDIATE";
    }

    if (enePresent) {
      ctvMargin = "10 mm";
      riskLevel = "HIGH";
      laterality = "Bilateral";
      includedLevels.push("RPN");
    }

    return {
      summary: "Oropharynx logic applied.",
      gtv: "All gross tumor and involved nodes.",
      ctv: `GTV + ${ctvMargin} anatomically trimmed.`,
      electiveText: `${laterality} levels ${includedLevels.join(", ")}`,
      includedLevels,
      levelBoundaries: {},
      laterality,
      ptv: "CTV + 3–5 mm.",
      deepExtensions: [],
      riskLevel,
      explanation:
        "HPV and lateralization influence bilaterality. ENE escalates margin and risk.",
      citations: [
        {
          organization: "EORTC",
          title: "Head & Neck Nodal Atlas",
          year: 2018,
          evidence: "HIGH",
        },
        ICRU,
      ],
    };
  }

  /* ===============================
     ORAL CAVITY LOGIC (NEW)
  =============================== */

  if (site === "Head & Neck" && subsite === "Oral Cavity") {
    let ctvMargin = "5 mm";
    let laterality: "Ipsilateral" | "Bilateral" = "Ipsilateral";
    let includedLevels = ["I", "II", "III"];
    let riskLevel: RiskLevel = "LOW";

    const advancedT = tStage?.includes("T3") || tStage?.includes("T4");
    const advancedN = nStage?.includes("N2");
    const enePresent =
      eneStatus === "Microscopic" ||
      eneStatus === "Macroscopic" ||
      eneStatus === "Present (unspecified)";

    const highDOI = doi && Number(doi) >= 10;

    // Margin logic
    if (marginStatus === "Close (<5 mm)") {
      ctvMargin = "7–10 mm";
      riskLevel = "INTERMEDIATE";
    }

    if (marginStatus === "Positive") {
      ctvMargin = "10 mm";
      riskLevel = "HIGH";
    }

    // DOI logic
    if (highDOI) {
      riskLevel = "INTERMEDIATE";
    }

    // PNI/LVI escalation
    if (pni === "Yes" || lvi === "Yes") {
      riskLevel = "INTERMEDIATE";
    }

    // Nodal burden
    if (advancedN || enePresent) {
      laterality = "Bilateral";
      includedLevels = ["I", "II", "III", "IV"];
      riskLevel = "HIGH";
    }

    return {
      summary: "Oral cavity logic applied.",
      gtv: "Post-operative bed and any residual disease.",
      ctv: `GTV + ${ctvMargin} including high-risk surgical bed.`,
      electiveText: `${laterality} levels ${includedLevels.join(", ")}`,
      includedLevels,
      levelBoundaries: {},
      laterality,
      ptv: "CTV + 3–5 mm.",
      deepExtensions: [],
      riskLevel,
      explanation:
        "Margins, DOI ≥10 mm, PNI/LVI and ENE escalate risk and may mandate bilateral coverage.",
      citations: [
        {
          organization: "NCCN",
          title: "Head & Neck Guidelines",
          year: 2024,
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
    electiveText: "",
    includedLevels: [],
    levelBoundaries: {},
    laterality: "Ipsilateral",
    ptv: "",
    deepExtensions: [],
    riskLevel: "LOW",
    explanation: "",
    citations: [ICRU],
  };
}
