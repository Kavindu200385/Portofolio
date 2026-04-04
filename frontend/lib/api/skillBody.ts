// @ts-nocheck

export function normalizeSkillBody(body: any) {
  if (!body || typeof body !== "object") return {};
  return {
    name: body.name,
    icon: body.icon ?? "",
    category: body.category ?? "Tools",
    description: body.shortDescription ?? body.description ?? "",
    proficiency: body.proficiency ?? "Intermediate",
    order: typeof body.order === "number" ? body.order : 0,
    color: body.color ?? "#4F8EF7",
    size: body.size === "wide" ? "wide" : "normal",
  };
}
