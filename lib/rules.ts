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
  const { site, subsite, nStage, eneStatus } = data;

  const ICRU = {
    organization: "ICRU",
    title: "ICRU Report 83",
    year: 2010,
    evidence: "HIGH" as const,
  };

  if (site === "Head & Neck" && subsite === "Oropharynx") {

    let ctvMargin = "5–7 mm";
    let elective = "Ipsilateral levels II–IV";
    let rpn = "Ipsilateral retropharyngeal nodes";

    const advancedN = nStage?.includes("N2");
    const enePresent =
      eneStatus === "Microscopic" ||
      eneStatus === "Macroscopic" ||
      eneStatus === "Present (unspecified)";

    // Bilateral neck logic
    if (advancedN) {
      elective = "Ipsilateral II–IV + contralateral II–III";
    }

    // ENE-driven margin logic
    if (eneStatus === "Microscopic") {
      ctvMargin = "7–10 mm";
    }

    if (eneStatus === "Macroscopic" || eneStatus === "Present (unspecified)") {
      ctvMargin = "10 mm";
      elective += " + consider adjacent inferior nodal level";
    }

    // Retropharyngeal node logic
    if (advancedN || enePresent) {
      rpn = "Bilateral retropharyngeal nodes";
    }

    return {
      summary:
        "Oropharynx — nodal and RPN coverage adjusted based on stage and ENE.",
      gtv:
        "All gross primary tumor and radiologically involved nodes.",
      ctv:
        `GTV + ${ctvMargin} anatomically trimmed respecting air and bone.`,
      elective: `${elective} + ${rpn}`,
      ptv:
        "CTV + 3–5 mm depending on immobilization accuracy.",
      explanation:
        "Oropharynx tumors have predictable retropharyngeal drainage. Advanced N stage or ENE increases risk of bilateral RPN involvement. ENE expands microscopic spread risk beyond capsule, requiring larger CTV margin.",
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
    elective: "",
    ptv: "",
    explanation: "No structured rule triggered.",
    citations: [ICRU],
  };
}
