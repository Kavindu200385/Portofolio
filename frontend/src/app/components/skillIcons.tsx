import type { IconType } from "react-icons/lib";
import {
  SiCpanel,
  SiDocker,
  SiFigma,
  SiGithub,
  SiGithubactions,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNestjs,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiCss,
  SiTailwindcss,
} from "react-icons/si";

/** Built-in brand logos keyed by `SkillItem.id`. */
const ICON_BY_ID: Record<string, IconType> = {
  "s-github": SiGithub,
  "s-gha": SiGithubactions,
  "s-cpanel": SiCpanel,
  "s-mysql": SiMysql,
  "s-tailwind": SiTailwindcss,
  "s-react": SiReact,
  "s-nest": SiNestjs,
  "s-node": SiNodedotjs,
  "s-figma": SiFigma,
  "s-html": SiHtml5,
  "s-css": SiCss,
  "s-js": SiJavascript,
  "s-docker": SiDocker,
  "s-python": SiPython,
};

/** Match by normalized skill name when `id` is not a built-in. */
const ICON_BY_NAME: Record<string, IconType> = {
  github: SiGithub,
  githubactions: SiGithubactions,
  cpanel: SiCpanel,
  mysql: SiMysql,
  tailwindcss: SiTailwindcss,
  tailwind: SiTailwindcss,
  react: SiReact,
  nestjs: SiNestjs,
  nest: SiNestjs,
  nodejs: SiNodedotjs,
  node: SiNodedotjs,
  figma: SiFigma,
  html: SiHtml5,
  html5: SiHtml5,
  css: SiCss,
  css3: SiCss,
  javascript: SiJavascript,
  js: SiJavascript,
  docker: SiDocker,
  python: SiPython,
};

function normName(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isIconUrl(s: string) {
  const t = s.trim();
  return /^https?:\/\//i.test(t) || t.startsWith("/");
}

/** Cursor IDE — not in this react-icons set; official Simple Icon via CDN. */
const CURSOR_ICON_URL =
  "https://cdn.jsdelivr.net/npm/simple-icons@v13.15.0/icons/cursor.svg";

export function SkillIcon({
  id,
  name = "",
  icon,
  color,
  size = 28,
}: {
  id: string;
  name?: string;
  icon: string;
  color: string;
  size?: number;
}) {
  const isCursor =
    id === "s-cursor" || normName(name) === "cursor";

  if (isCursor) {
    return (
      <img
        src={CURSOR_ICON_URL}
        alt=""
        width={size}
        height={size}
        draggable={false}
        style={{
          display: "block",
          objectFit: "contain",
          filter: "brightness(0) invert(1)",
          opacity: 0.95,
        }}
      />
    );
  }

  const Icon = ICON_BY_ID[id] ?? ICON_BY_NAME[normName(name)];
  if (Icon) {
    return <Icon size={size} color={color} style={{ display: "block" }} aria-hidden />;
  }

  if (isIconUrl(icon)) {
    return (
      <img
        src={icon.trim()}
        alt=""
        width={size}
        height={size}
        draggable={false}
        style={{ display: "block", objectFit: "contain" }}
      />
    );
  }

  if (icon.trim()) {
    return (
      <span style={{ fontSize: size * 0.86, lineHeight: 1 }} aria-hidden>
        {icon}
      </span>
    );
  }

  return (
    <span
      style={{
        fontSize: 13,
        fontWeight: 700,
        color,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      ?
    </span>
  );
}
