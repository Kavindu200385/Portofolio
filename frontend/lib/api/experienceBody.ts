// @ts-nocheck

function splitDateLabel(s: string | undefined): { month?: string; year?: string } {
  const t = (s ?? "").trim();
  if (!t) return {};
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return { month: parts.slice(0, -1).join(" "), year: parts[parts.length - 1] };
  }
  return { year: t };
}

export function experienceFromClient(body: any) {
  if (!body || typeof body !== "object") return {};
  const start = splitDateLabel(body.startDate);
  const end = splitDateLabel(body.endDate);
  return {
    company: body.companyName ?? body.company,
    role: body.role,
    startMonth: start.month ?? "",
    startYear: start.year ?? "",
    endMonth: end.month ?? "",
    endYear: end.year ?? "",
    isCurrent: Boolean(body.present ?? body.isCurrent),
    description: body.description ?? "",
    companyLogo: body.logo ?? body.companyLogo ?? "",
    order: typeof body.order === "number" ? body.order : 0,
  };
}
