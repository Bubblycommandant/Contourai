import { levelAtlas } from "./atlas";

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
  citations: {
    organization: string;
    title: string;
    year: number;
    evidence: "HIGH" | "MEDIUM" | "LOW";
  }[];
};

export function generateRecommendation(data: any): Recommendation {
  const { site, subsite, tStage, nStage, eneStatus } = data;

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

    const advancedN = nStage?.includes("N2");
    const enePresent =
      eneStatus === "Microscopic" ||
      eneStatus === "Macroscopic" ||
      eneStatus === "Present (unspecified)";
    const advancedT = tStage?.includes("T3") || tStage?.includes("T4");

    if (advancedN) {
      laterality = "Bilateral";
    }

    if (eneStatus === "Microscopic") {
      ctvMargin = "7–10 mm";
    }

    if (eneStatus === "Macroscopic" || eneStatus === "Present (unspecified)") {
      ctvMargin = "10 mm";
    }

    if (advancedN || enePresent) {
      rpnIncluded = true;
      laterality = "Bilateral";
    }

    if (rpnIncluded) {
      includedLevels.push("RPN");
    }

    if (advancedT) {
      deepExtensions.push("Evaluate deep muscle and fascial plane spread");
    }

    const levelBoundaries: Record<string, any> = {};
    includedLevels.forEach(level => {
      levelBoundaries[level] = levelAtlas[level];
    });

    return {
      summary:
        "Oropharynx — nodal, ENE, deep extension and boundary metadata applied.",
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
      explanation:
        "Advanced stage and ENE modify nodal bilaterality and microscopic extension margins. Boundary metadata derived from consensus atlas.",
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
    explanation: "No structured rule triggered.",
    citations: [ICRU],
  };
}
