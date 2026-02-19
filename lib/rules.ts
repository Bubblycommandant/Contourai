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
  explanation: string;
  deepExtensions: string[];
  riskLevel: RiskLevel;
  citations: {
    organization: string;
    title: string;
    year: number;
    evidence: "HIGH" | "MEDIUM" | "LOW";
  }[];
};

export function generateRecommendation(data: any): Recommendation {
  const { site, subsite, tStage, nStage, eneStatus, hpvStatus } = data;

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
    let rpnIncluded = false;
    let riskLevel: RiskLevel = "LOW";

    const advancedT = tStage?.includes("T3") || tStage?.includes("T4");
    const advancedN = nStage?.includes("N2");
    const enePresent =
      eneStatus === "Microscopic" ||
      eneStatus === "Macroscopic" ||
      eneStatus === "Present (unspecified)";
    const earlyN = nStage?.includes("N0") || nStage?.includes("N1");

    // HPV Influence on bilaterality in early disease
    if (hpvStatus === "Positive" && earlyN && !enePresent) {
      laterality = "Ipsilateral";
      riskLevel = "LOW";
    }

    // Standard nodal logic
    if (advancedN) {
      laterality = "Bilateral";
      riskLevel = "INTERMEDIATE";
    }

    // ENE logic
    if (eneStatus === "Microscopic") {
      ctvMargin = "7–10 mm";
      riskLevel = "INTERMEDIATE";
    }

    if (eneStatus === "Macroscopic" || eneStatus === "Present (unspecified)") {
      ctvMargin = "10 mm";
      riskLevel = "HIGH";
    }

    // Retropharyngeal logic
    if (advancedN || enePresent) {
      rpnIncluded = true;
      laterality = "Bilateral";
    }

    if (advancedT) {
      deepExtensions.push("Evaluate deep muscle and fascial plane spread");
      riskLevel = "HIGH";
    }

    if (rpnIncluded) includedLevels.push("RPN");

    const levelBoundaries: Record<string, any> = {};
    includedLevels.forEach(level => {
      levelBoundaries[level] = levelAtlas[level];
    });

    return {
      summary:
        "Oropharynx — stage, ENE, HPV and anatomical metadata applied.",
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
        "Risk level derived from T stage, N stage, ENE status and HPV status. HPV-positive early disease may allow ipsilateral coverage.",
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
