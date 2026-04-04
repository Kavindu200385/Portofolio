// @ts-nocheck

export function normalizeProjectBody(body: any) {
  if (!body || typeof body !== "object") return {};
  return {
    name: body.name,
    category: body.type ?? body.category ?? "Individual",
    shortDescription: body.shortDescription,
    description: body.longDescription ?? body.description,
    mainPhoto: body.thumbnail ?? body.mainPhoto,
    additionalPhotos: body.extraImages ?? body.additionalPhotos ?? [],
    githubLink: body.githubLink ?? "",
    liveDemoLink: body.liveDemoLink ?? "",
    techStack: Array.isArray(body.techStack) ? body.techStack : [],
    featured: !!body.featured,
    order: typeof body.order === "number" ? body.order : 0,
  };
}
