export type Recommendation = {
  summary: string;
  gtv: string;
  ctv: string;
  electiveText: string;
  includedLevels: string[];
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

    // Bilateral nodal logic
    if (advancedN) {
      laterality = "Bilateral";
    }

    // ENE-driven margin
    if (eneStatus === "Microscopic") {
      ctvMargin = "7–10 mm";
    }

    if (eneStatus === "Macroscopic" || eneStatus === "Present (unspecified)") {
      ctvMargin = "10 mm";
    }

    // Retropharyngeal logic
    if (advancedN || enePresent) {
      rpnIncluded = true;
      laterality = "Bilateral";
    }

    if (rpnIncluded) {
      includedLevels.push("RPN");
    }

    // SUBSITE-SPECIFIC DEEP LOGIC
    if (advancedT) {

      if (data.oropharynxSubsite === "Base of Tongue") {
        deepExtensions.push("Superior constrictor muscle");
        deepExtensions.push("Parapharyngeal space");
        deepExtensions.push("Evaluate skull base proximity");
      }

      if (data.oropharynxSubsite === "Posterior Pharyngeal Wall") {
        deepExtensions.push("Prevertebral fascia");
        deepExtensions.push("Retropharyngeal space expansion");
      }

      if (data.oropharynxSubsite === "Soft Palate") {
        deepExtensions.push("Superior spread toward nasopharynx");
        deepExtensions.push("Consider skull base inclusion");
      }

      if (data.oropharynxSubsite === "Tonsil") {
        deepExtensions.push("Parapharyngeal fat space");
        deepExtensions.push("Medial pterygoid muscle if advanced");
      }
    }

    const electiveText = `${laterality} levels ${includedLevels.join(", ")}`;

    return {
      summary:
        "Oropharynx — nodal, ENE, and deep extension logic applied.",
      gtv:
        "All gross primary tumor and radiologically involved nodes.",
      ctv:
        `GTV + ${ctvMargin} anatomically trimmed.`,
      electiveText,
      includedLevels,
      laterality,
      ptv:
        "CTV + 3–5 mm depending on immobilization accuracy.",
      deepExtensions,
      explanation:
        "Advanced T stage modifies deep muscle and fascial plane coverage. ENE increases microscopic extension risk. N stage governs bilaterality and RPN inclusion.",
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
    laterality: "Ipsilateral",
    ptv: "",
    deepExtensions: [],
    explanation: "No structured rule triggered.",
    citations: [ICRU],
  };
}
