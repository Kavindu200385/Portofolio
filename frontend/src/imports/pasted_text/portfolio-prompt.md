Portfolio Website — Software Engineer & DevOps · UI Design Prompt
Design a premium, dark-mode portfolio website for a Full Stack Software Engineer and DevOps professional. The aesthetic is inspired by the best Framer developer templates of 2025 — specifically the Apollo (dark, terminal-focused), Dune (cyberpunk noise texture + futuristic font), Codify (engineer-focused with subtle motion), BentoX (bento grid project showcase), and Fuel (clean, confident, expensive-looking without trying hard). The result should feel like a hacker's OS meets a premium SaaS product page — dark, sharp, alive, and deeply intentional.

🎨 Visual Direction

Background: #080810 — near-black with a subtle dot-grid or noise texture overlay (like Dune's grain film effect)
Primary Accent: Electric cyan #00F0FF — used sparingly for borders, highlights, active states
Secondary Accent: Acid green #A3FF47 — for terminal output text, tag badges, availability dot
Text: Off-white #EDEAE4 for headings, muted #7A7A8C for body/secondary
Card Surfaces: #0F0F1A with 1px border of rgba(255,255,255,0.06)

Typography:

Display / Hero: Syne Bold — massive, geometric, commanding
Monospace / Code blocks: JetBrains Mono — for terminal cards, stack tags, command outputs
Body: Instrument Serif italic for editorial pull quotes and section intros


📐 Layout & Sections
1. Navigation
Minimal floating nav, blur backdrop (backdrop-filter: blur(12px)), hides on scroll-down / reappears on scroll-up. Logo = your initials in a monospaced bracket style e.g. [ YN ]. Links: Work · Stack · Experience · Contact. A small green pulsing dot + "Available for work" label on the right.
2. Hero — Full viewport
Left-aligned layout. Giant Syne display text stacked in 3 lines:
Software
Engineer &
DevOps.
Below: animated typing effect cycling through → [ Full Stack ] → [ Cloud Native ] → [ CI/CD ] → [ System Design ]
Right side: a floating dark terminal window (decorative) showing a mock whoami or cat about.txt command output with green text. Faint radial glow behind it.
Two CTAs: View Work ↗ (outline button with glow on hover) + Download CV (ghost button).
3. About — Two column
Left: stylized photo in a card with glitch-frame border treatment, a small status badge ("Open to roles · Remote / On-site"), and social icons stacked vertically.
Right: 2-paragraph bio (confident, first-person tone). Below bio, a dark terminal card styled like a real shell:
bash$ cat skills.txt

Languages   →  TypeScript · Python · Go · Bash
Frontend    →  React · Next.js · TailwindCSS
Backend     →  Node.js · FastAPI · PostgreSQL · Redis
DevOps      →  Docker · Kubernetes · Terraform · Ansible
Cloud       →  AWS · GCP · Vercel · Cloudflare
CI/CD       →  GitHub Actions · ArgoCD · Jenkins
Each category line has a subtle cyan left-border accent.
4. Bento Grid — Projects / Works
Inspired by BentoX and Grids&Stuff from Framer. Asymmetric grid of 6 cards — 2 large (span 2 cols), 4 standard. Each card contains:

Project name in Syne bold
One-line description
Stack badges (pill tags in acid green outline)
GitHub icon + Live link icon (appear on hover)
Subtle project screenshot or abstract geometric graphic as card background at 15% opacity
Hover state: card border glows cyan, slight translateY(-4px) lift, background opacity increases to 30%

5. Tech Stack Marquee
Full-width scrolling strip (infinite loop, left direction) of tech logos in monochrome white: Docker, Kubernetes, AWS, Terraform, React, Next.js, PostgreSQL, Redis, GitHub Actions, ArgoCD, Nginx, Linux. Below: a 3-column icon grid grouped by category (Frontend / Backend / DevOps & Cloud) with subtle icon + label layout.
6. Experience Timeline
Inspired by Codify and Apollo from Framer. Vertical timeline, left-aligned. Each entry:

Company name (large, Syne) + role title (monospaced, cyan)
Duration in a small muted badge
3 bullet achievements written as terminal-style log lines: ✓ Reduced deployment time by 70% via GitOps...
Company logo (small, grayscale, placed right)
Subtle left-border line connecting entries
Hover: entry card expands with a smooth height animation, border glows

7. Contact — Minimal closing section
Large centered headline in Syne: "Let's build something that matters." Below: email address with a copy-to-clipboard icon. Row of social links: GitHub · LinkedIn · X · Telegram. A subtle animated gradient radial glow behind the section for atmosphere.
8. Footer
Single line: © 2025 [Your Name] · Built with Next.js & Vercel · All rights reserved

✨ Motion & Interaction Specs

Page load: Staggered reveal — nav fades in first, then hero text lines slide up with 0.15s delay each, then terminal card slides in from right
Scroll-triggered: Each section fades + slides up as it enters viewport (Framer Motion whileInView)
Bento cards: Hover glow border + lift — box-shadow: 0 0 24px rgba(0,240,255,0.15)
Marquee: CSS infinite scroll, pauses on hover
Timeline: Height expand animation on hover using Framer Motion AnimatePresence
CTA buttons: Magnetic hover effect — button subtly follows cursor within a 40px radius
Custom cursor: Small glowing cyan dot that scales up on hoverable elements
Terminal card: Typewriter effect on text lines using react-type-animation


📱 Responsive Breakpoints

Desktop (1440px): Full layout as described above
Tablet (768px): Bento grid collapses to 2 columns, terminal card stacks below bio
Mobile (390px): Single column, hero text scales down to 48px, marquee speed reduces, nav becomes hamburger with full-screen overlay menu


🧱 Next.js Component Map
<Nav />            → floating, scroll-aware, blur backdrop
<Hero />           → typing animation + terminal card
<About />          → bio + skills terminal
<Projects />       → bento grid with hover states
<TechStack />      → marquee + icon grid
<Experience />     → animated vertical timeline
<Contact />        → email copy + socials + glow
<Footer />         → single line