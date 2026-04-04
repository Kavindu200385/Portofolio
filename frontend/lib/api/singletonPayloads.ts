// @ts-nocheck

export function aboutFromClient(body: any) {
  if (!body || typeof body !== "object") return {};
  if (Array.isArray(body.paragraphs)) {
    return {
      paragraph1: body.paragraphs[0] ?? "",
      paragraph2: body.paragraphs[1] ?? "",
      paragraph3: body.paragraphs[2] ?? "",
      badges: body.badges ?? [],
      profilePhoto: body.profilePhoto ?? "",
    };
  }
  return {
    paragraph1: body.paragraph1 ?? "",
    paragraph2: body.paragraph2 ?? "",
    paragraph3: body.paragraph3 ?? "",
    badges: body.badges ?? [],
    profilePhoto: body.profilePhoto ?? "",
  };
}

export function heroFromClient(body: any) {
  if (!body || typeof body !== "object") return {};
  return {
    mainHeading: body.mainHeading ?? body.heading ?? "",
    subHeading: body.subHeading ?? "",
    cta1Label: body.cta1Label ?? "",
    cta1Link: body.cta1Link ?? "",
    cta2Label: body.cta2Label ?? "",
    cta2Link: body.cta2Link ?? "",
    heroPhoto: body.heroPhoto ?? "",
  };
}

export function contactFromClient(body: any) {
  if (!body || typeof body !== "object") return {};
  return {
    email: body.email ?? "",
    whatsapp: body.whatsapp ?? "",
    linkedin: body.linkedin ?? "",
    github: body.github ?? "",
    phone: body.phone ?? "",
    sectionHeading: body.sectionHeading ?? body.heading ?? "",
    sectionDescription: body.sectionDescription ?? body.description ?? "",
  };
}
