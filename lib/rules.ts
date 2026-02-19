import { levelAtlas } from "./atlas";

export type RiskLevel = "LOW" | "INTERMEDIATE" | "HIGH";

export type Recommendation = {
  summary: string;
  stageGroup: string;
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

/* ================= AJCC STAGING HELPERS ================= */

function stageOropharynxHPVPositive(t: string, n: string): string {
  if (t === "T1" && (n === "N0" || n === "N1")) return "Stage I";
  if (t === "T2" && (n === "N0" || n === "N1")) return "Stage I";
  if ((t === "T3" && n === "N0") || n === "N2") return "Stage II";
  if (t === "T4" || n === "N3") return "Stage III";
  return "Stage Uncertain";
}

function stageOropharynxHPVNegative(t: string, n: string): string {
  if (t === "T1" && n === "N0") return "Stage I";
  if (t === "T2" && n === "N0") return "Stage II";
  if (t === "T3" || n === "N1") return "Stage III";
  if (t === "T4" || n === "N2" || n === "N3") return "Stage IVA";
  return "Stage Uncertain";
}

function stageOralCavity(t: string, n: string): string {
  if (t === "T1" && n === "N0") return "Stage I";
  if (t === "T2" && n === "N0") return "Stage II";
  if (t === "T3" || n === "N1") return "Stage III";
  if (t === "T4" || n === "N2" || n === "N3") return "Stage IVA";
  return "Stage Uncertain";
}

/* ================= MAIN ENGINE ================= */

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

  /* ================= OROPHARYNX ================= */

  if (site === "Head & Neck" && subsite === "Oropharynx") {
    let stageGroup =
      hpvStatus === "Positive"
        ? stageOropharynxHPVPositive(tStage, nStage)
        : stageOropharynxHPVNegative(tStage, nStage);

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

    if (advancedN || enePresent || advancedT) {
      laterality = "Bilateral";
      riskLevel = "HIGH";
      includedLevels.push("RPN");
    }

    return {
      summary: "Oropharynx logic applied.",
      stageGroup,
      gtv: "All gross tumor and involved nodes.",
      ctv: "GTV + 5–10 mm anatomically trimmed.",
      electiveText: `${laterality} levels ${includedLevels.join(", ")}`,
      includedLevels,
      levelBoundaries: {},
      laterality,
      ptv: "CTV + 3–5 mm.",
      deepExtensions: [],
      riskLevel,
      explanation:
        "AJCC stage calculated automatically based on HPV status and TN category.",
      citations: [
        {
          organization: "AJCC",
          title: "AJCC 8th Edition Staging Manual",
          year: 2018,
          evidence: "HIGH",
        },
        ICRU,
      ],
    };
  }

  /* ================= ORAL CAVITY ================= */

  if (site === "Head & Neck" && subsite === "Oral Cavity") {
    let stageGroup = stageOralCavity(tStage, nStage);
    let laterality: "Ipsilateral" | "Bilateral" = "Ipsilateral";
    let includedLevels = ["I", "II", "III"];
    let riskLevel: RiskLevel = "LOW";

    const advancedN = nStage?.includes("N2");
    const enePresent =
      eneStatus === "Microscopic" ||
      eneStatus === "Macroscopic" ||
      eneStatus === "Present (unspecified)";
    const highDOI = doi && Number(doi) >= 10;

    if (marginStatus === "Positive" || highDOI || pni === "Yes" || lvi === "Yes") {
      riskLevel = "INTERMEDIATE";
    }

    if (advancedN || enePresent) {
      laterality = "Bilateral";
      includedLevels = ["I", "II", "III", "IV"];
      riskLevel = "HIGH";
    }

    return {
      summary: "Oral cavity logic applied.",
      stageGroup,
      gtv: "Post-operative bed and residual disease.",
      ctv: "GTV + 5–10 mm based on risk factors.",
      electiveText: `${laterality} levels ${includedLevels.join(", ")}`,
      includedLevels,
      levelBoundaries: {},
      laterality,
      ptv: "CTV + 3–5 mm.",
      deepExtensions: [],
      riskLevel,
      explanation:
        "AJCC stage automatically calculated for oral cavity based on T and N category.",
      citations: [
        {
          organization: "AJCC",
          title: "AJCC 8th Edition Staging Manual",
          year: 2018,
          evidence: "HIGH",
        },
        ICRU,
      ],
    };
  }

  return {
    summary: "No rule matched.",
    stageGroup: "",
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
