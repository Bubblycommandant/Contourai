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
  } = data;

  const ICRU = {
    organization: "ICRU",
    title: "ICRU Report 83",
    year: 2010,
    evidence: "HIGH" as const,
  };

  if (site === "Head & Neck" && subsite === "Oropharynx") {
    let ctvMargin = "5–7 mm";
    let laterality: "Ipsilateral" | "Bilateral" = "Ipsilateral";
    let includedLevels = ["IIa", "IIb", "III", "IV"];
    let deepExtensions: string[] = [];
    let riskLevel: RiskLevel = "LOW";

    const advancedT = tStage?.includes("T3") || tStage?.includes("T4");
    const advancedN = nStage?.includes("N2");
    const earlyN = nStage?.includes("N0") || nStage?.includes("N1");

    const enePresent =
      eneStatus === "Microscopic" ||
      eneStatus === "Macroscopic" ||
      eneStatus === "Present (unspecified)";

    // HPV-positive, early, lateralized logic
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

    // Midline forces bilateral
    if (tumorLaterality === "Midline / Crossing midline") {
      laterality = "Bilateral";
    }

    if (advancedN) {
      laterality = "Bilateral";
      riskLevel = "INTERMEDIATE";
    }

    if (eneStatus === "Microscopic") {
      ctvMargin = "7–10 mm";
      riskLevel = "INTERMEDIATE";
    }

    if (eneStatus === "Macroscopic" || eneStatus === "Present (unspecified)") {
      ctvMargin = "10 mm";
      riskLevel = "HIGH";
      laterality = "Bilateral";
    }

    if (advancedT) {
      deepExtensions.push("Evaluate deep muscle and fascial plane spread");
      riskLevel = "HIGH";
      laterality = "Bilateral";
    }

    // Add RPN if advanced or ENE
    if (advancedN || enePresent) {
      includedLevels.push("RPN");
    }

    const levelBoundaries: Record<string, any> = {};
    includedLevels.forEach(level => {
      levelBoundaries[level] = levelAtlas[level];
    });

    return {
      summary:
        "Oropharynx — stage, ENE, HPV and lateralization logic applied.",
      gtv:
        "All gross primary tumor and radiologically involved nodes.",
      ctv:
        `GTV + ${ctvMargin} anatomically trimmed.`,
      electiveText: `${laterality} levels ${includedLevels.join(", ")}`,
      includedLevels,
      levelBoundaries,
      laterality,
      ptv:
        "CTV + 3–5 mm depending on immobilization accuracy.",
      deepExtensions,
      riskLevel,
      explanation:
        "Midline tumors or advanced features mandate bilateral coverage. Lateralized early HPV-positive tumors may allow ipsilateral-only treatment.",
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
