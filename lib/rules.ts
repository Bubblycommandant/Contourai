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
  const { site, subsite, tStage, nStage } = data;

  const ICRU = {
    organization: "ICRU",
    title: "ICRU Report 83",
    year: 2010,
    evidence: "HIGH" as const,
  };

  if (site === "Head & Neck") {

    // OROPHARYNX
    if (subsite === "Oropharynx") {
      if (nStage?.includes("N2")) {
        return {
          summary:
            "Oropharynx with advanced nodal disease — bilateral elective neck coverage recommended.",
          gtv:
            "All gross primary and nodal disease.",
          ctv:
            "GTV + 5–10 mm anatomically trimmed.",
          elective:
            "Ipsilateral levels II–IV + contralateral II–III.",
          ptv:
            "CTV + 3–5 mm.",
          explanation:
            "Oropharynx tumors have high bilateral nodal spread risk. N2 stage warrants bilateral elective coverage per EORTC atlas.",
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
    }

    // ORAL CAVITY
    if (subsite === "Oral Cavity") {
      if (nStage?.includes("N0")) {
        return {
          summary:
            "Lateralized oral cavity primary — ipsilateral elective coverage.",
          gtv:
            "Primary tumor bed ± involved nodes.",
          ctv:
            "GTV + 5 mm anatomically constrained.",
          elective:
            "Ipsilateral levels I–III.",
          ptv:
            "CTV + 3–5 mm.",
          explanation:
            "Oral cavity tumors drain primarily to ipsilateral levels I–III. N0 disease does not mandate bilateral coverage.",
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
    }

    // LARYNX
    if (subsite === "Larynx") {
      return {
        summary:
          "Laryngeal primary — level II–IV coverage depending on nodal status.",
        gtv:
          "Primary laryngeal tumor ± involved nodes.",
        ctv:
          "GTV + 5–10 mm respecting cartilage boundaries.",
        elective:
          "Levels II–IV (bilateral if supraglottic).",
        ptv:
          "CTV + 3–5 mm.",
        explanation:
          "Supraglottic tumors have bilateral nodal drainage. Glottic tumors have limited nodal spread unless advanced.",
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

    // NASOPHARYNX
    if (subsite === "Nasopharynx") {
      return {
        summary:
          "Nasopharynx — routine bilateral nodal coverage required.",
        gtv:
          "Primary + involved retropharyngeal nodes.",
        ctv:
          "GTV + 5–10 mm including parapharyngeal space.",
        elective:
          "Bilateral levels II–V + retropharyngeal nodes.",
        ptv:
          "CTV + 3–5 mm.",
        explanation:
          "Nasopharynx has predictable bilateral nodal spread including retropharyngeal nodes.",
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
  }

  return {
    summary: "No rule matched.",
    gtv: "",
    ctv: "",
    elective: "",
    ptv: "",
    explanation:
      "No structured rule triggered.",
    citations: [ICRU],
  };
}
