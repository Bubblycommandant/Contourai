export type Recommendation = {
  summary: string;
  gtv: string;
  ctv: string;
  electiveText: string;
  includedLevels: string[];
  laterality: "Ipsilateral" | "Bilateral";
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
  const { site, subsite, nStage, eneStatus } = data;

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
    let rpnIncluded = false;

    const advancedN = nStage?.includes("N2");
    const enePresent =
      eneStatus === "Microscopic" ||
      eneStatus === "Macroscopic" ||
      eneStatus === "Present (unspecified)";

    // Bilateral neck logic
    if (advancedN) {
      laterality = "Bilateral";
    }

    // ENE-driven margin logic
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

    const electiveText = `${laterality} levels ${includedLevels.join(
      ", "
    )}`;

    return {
      summary:
        "Oropharynx — nodal and RPN coverage adjusted based on stage and ENE.",
      gtv:
        "All gross primary tumor and radiologically involved nodes.",
      ctv:
        `GTV + ${ctvMargin} anatomically trimmed respecting air and bone.`,
      electiveText,
      includedLevels,
      laterality,
      ptv:
        "CTV + 3–5 mm depending on immobilization accuracy.",
      explanation:
        "Oropharynx tumors have predictable retropharyngeal drainage. Advanced N stage or ENE increases bilateral nodal and RPN risk. ENE expands microscopic spread risk beyond capsule.",
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
    explanation: "No structured rule triggered.",
    citations: [ICRU],
  };
}
