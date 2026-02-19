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

    // Advanced nodal stage
    if (nStage?.includes("N2")) {
      elective = "Ipsilateral II–IV + contralateral II–III";
    }

    // ENE Logic
    if (eneStatus === "Microscopic") {
      ctvMargin = "7–10 mm";
    }

    if (eneStatus === "Macroscopic") {
      ctvMargin = "10 mm";
      elective += " + consider adjacent inferior nodal level";
    }

    if (eneStatus === "Present (unspecified)") {
      ctvMargin = "10 mm";
      elective += " + consider adjacent inferior nodal level";
    }

    return {
      summary:
        "Oropharynx — nodal coverage adjusted based on ENE and stage.",
      gtv:
        "All gross primary tumor and radiologically involved nodes.",
      ctv:
        `GTV + ${ctvMargin} anatomically trimmed respecting air and bone.`,
      elective,
      ptv:
        "CTV + 3–5 mm depending on immobilization accuracy.",
      explanation:
        "Oropharynx tumors carry bilateral nodal risk in advanced N stage. ENE increases risk of microscopic spread beyond capsule, warranting expanded CTV margins. Unspecified ENE is treated conservatively as macroscopic.",
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
