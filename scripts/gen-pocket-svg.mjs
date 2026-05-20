// One-off generator for /home/ubuntu/repos/calendar/public/pocket-calendar.svg
// Produces a pure-vector A4-style SVG with the front and back of the
// 70 × 100 mm pocket calendar side-by-side.

import { writeFileSync } from "node:fs";

const YEAR = 2026;
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const WEEKDAYS = ["M","T","W","T","F","S","S"];
// Holidays as "m-d" with red bold treatment
const HOLIDAYS = new Set([
  "1-1","1-19","2-16","5-25","6-19","7-3","9-7","10-12",
  "11-11","11-26","12-25"
]);

// JS DOW 0=Sun…6=Sat → Mon-first: (jsDow + 6) % 7
const dowMon = (y, m, d) => (new Date(Date.UTC(y, m, d)).getUTCDay() + 6) % 7;
const daysIn = (y, m) => new Date(y, m + 1, 0).getDate();

const C = {
  ink:    "#161616",
  paper:  "#f3eee1",
  red:    "#e23725",
  yellow: "#ffb800",
  blue:   "#1c52e0",
  soft:   "#767069",
  rule:   "#d8cfc0",
  muted:  "#b3a99a",
};

// Layout: front at x=0, back at x=78; each card 70 × 100 with 4-mm radius
const W = 148, H = 100;

// Helper: text element with attrs
const t = (x, y, str, opts = {}) => {
  const a = {
    "font-size": opts.size ?? 3,
    fill: opts.fill ?? C.ink,
    "text-anchor": opts.anchor ?? "start",
    "font-family": opts.family ?? "Inter, sans-serif",
    "font-weight": opts.weight ?? 400,
    "letter-spacing": opts.spacing ?? 0,
    ...(opts.style ? { style: opts.style } : {}),
  };
  const attrs = Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(" ");
  return `<text x="${x}" y="${y}" ${attrs}>${str}</text>`;
};

/* ─── FRONT SIDE ─── */
function renderFront() {
  const ox = 0;
  // Bauhaus composition coords (offsets within 70 × 100)
  const els = [];

  // Card body (clip-rect for plastic look)
  els.push(`<g clip-path="url(#front-clip)">`);
  els.push(`<rect x="${ox}" y="0" width="70" height="100" fill="${C.paper}"/>`);

  // Geometric shapes
  // Red disc (top-right)
  els.push(`<circle cx="${ox + 73}" cy="34" r="23" fill="${C.red}"/>`);
  // Black dot top-left
  els.push(`<circle cx="${ox + 14}" cy="16" r="2.3" fill="${C.ink}"/>`);
  // Blue bar
  els.push(`<rect x="${ox + 6}" y="60" width="22" height="4.6" fill="${C.blue}"/>`);
  // Black ring bottom-left
  els.push(`<circle cx="${ox + 15}" cy="86" r="6.3" fill="none" stroke="${C.ink}" stroke-width="1.4"/>`);
  // Yellow triangle bottom-right
  els.push(`<polygon points="${ox + 38},100 ${ox + 70},100 ${ox + 70},74" fill="${C.yellow}"/>`);

  // Brand mark (top-left)
  els.push(t(ox + 5, 8, "APEX&amp;CO.", { family: "JetBrains Mono, monospace", size: 2.2, weight: 500, spacing: "0.32em" }));
  els.push(t(ox + 5, 11, "POCKET 2026", { family: "JetBrains Mono, monospace", size: 2.6, weight: 700, spacing: "0.22em" }));

  // Stamp (top-right)
  els.push(t(ox + 65, 8, "SERIES·02", { family: "JetBrains Mono, monospace", size: 2.2, weight: 500, spacing: "0.32em", anchor: "end" }));
  els.push(t(ox + 65, 11, "№ 026 / 2026", { family: "JetBrains Mono, monospace", size: 2.4, weight: 700, spacing: "0.22em", anchor: "end", fill: C.red }));

  // Big year: solid "20" then outlined "26"
  els.push(`<g font-family="Archivo Black, Inter, sans-serif" font-weight="900" font-size="38" letter-spacing="-1.6">`);
  els.push(`<text x="${ox + 4}" y="56" fill="${C.ink}">20</text>`);
  els.push(`<text x="${ox + 41}" y="56" fill="${C.paper}" stroke="${C.ink}" stroke-width="0.45">26</text>`);
  els.push(`</g>`);

  // Black seal
  els.push(`<rect x="${ox + 18}" y="68.5" width="34" height="5" fill="${C.ink}"/>`);
  els.push(t(ox + 35, 72.2, "A YEAR OF GOOD DAYS", {
    family: "JetBrains Mono, monospace", size: 1.8, weight: 600, spacing: "0.28em",
    fill: C.paper, anchor: "middle"
  }));

  // Bottom rule with Jan / Dec labels
  els.push(t(ox + 5, 95.5, "JAN", { family: "JetBrains Mono, monospace", size: 2, weight: 500, spacing: "0.28em" }));
  els.push(t(ox + 65, 95.5, "DEC", { family: "JetBrains Mono, monospace", size: 2, weight: 500, spacing: "0.28em", anchor: "end" }));
  els.push(`<line x1="${ox + 14}" y1="94.6" x2="${ox + 56}" y2="94.6" stroke="${C.ink}" stroke-width="0.25"/>`);

  els.push(`</g>`);
  return els.join("\n  ");
}

/* ─── BACK SIDE ─── */
function renderBack() {
  const ox = 78;
  const els = [];

  els.push(`<g clip-path="url(#back-clip)">`);
  els.push(`<rect x="${ox}" y="0" width="70" height="100" fill="#ffffff"/>`);

  // Header
  els.push(t(ox + 4.5, 11, "2026", {
    family: "Archivo Black, Inter, sans-serif", size: 8, weight: 900, spacing: "-0.04em"
  }));
  els.push(t(ox + 65.5, 7.4, "ENGLISH · MON–SUN", {
    family: "JetBrains Mono, monospace", size: 1.7, weight: 500, spacing: "0.24em",
    anchor: "end", fill: C.soft
  }));
  els.push(t(ox + 65.5, 10.6, "APEX&amp;CO.", {
    family: "JetBrains Mono, monospace", size: 2, weight: 700, spacing: "0.22em",
    anchor: "end", fill: C.red
  }));
  els.push(`<line x1="${ox + 4.5}" y1="13" x2="${ox + 65.5}" y2="13" stroke="${C.ink}" stroke-width="0.25"/>`);

  // Months 3×4 grid; total available height 13 → 87 = 74 mm, width 4.5 → 65.5 = 61 mm
  const cols = 3, rows = 4;
  const gridX = ox + 4.5, gridY = 15;
  const gridW = 61, gridH = 72;
  const gapX = 1.6, gapY = 1.6;
  const cellW = (gridW - gapX * (cols - 1)) / cols;
  const cellH = (gridH - gapY * (rows - 1)) / rows;

  for (let mi = 0; mi < 12; mi++) {
    const col = mi % cols;
    const row = Math.floor(mi / cols);
    const x = gridX + col * (cellW + gapX);
    const y = gridY + row * (cellH + gapY);

    // Month label
    els.push(t(x, y + 2.5, MONTHS[mi].slice(0, 3).toUpperCase(), {
      family: "JetBrains Mono, monospace", size: 2.2, weight: 700, spacing: "0.18em"
    }));
    els.push(t(x + cellW, y + 2.5, String(mi + 1).padStart(2, "0"), {
      family: "JetBrains Mono, monospace", size: 1.8, weight: 500, fill: C.red, anchor: "end"
    }));

    // Weekday header row
    const headY = y + 4.6;
    for (let wi = 0; wi < 7; wi++) {
      const cx = x + (cellW / 7) * (wi + 0.5);
      els.push(t(cx, headY, WEEKDAYS[wi], {
        family: "JetBrains Mono, monospace", size: 1.5, weight: 500,
        anchor: "middle", fill: wi >= 5 ? C.red : C.muted
      }));
    }
    els.push(`<line x1="${x}" y1="${headY + 0.6}" x2="${x + cellW}" y2="${headY + 0.6}" stroke="${C.rule}" stroke-width="0.12"/>`);

    // Days grid
    const start = dowMon(YEAR, mi, 1);
    const dim   = daysIn(YEAR, mi);
    const dayRowH = 1.85;
    const dayBaseY = headY + 2.4;

    for (let d = 1; d <= dim; d++) {
      const pos = start + d - 1;
      const col2 = pos % 7;
      const row2 = Math.floor(pos / 7);
      const cx = x + (cellW / 7) * (col2 + 0.5);
      const cy = dayBaseY + row2 * dayRowH;
      const isHoliday = HOLIDAYS.has(`${mi + 1}-${d}`);
      const isWE = col2 >= 5;
      els.push(t(cx, cy, String(d), {
        family: "JetBrains Mono, monospace", size: 1.85,
        weight: isHoliday ? 700 : 500,
        anchor: "middle",
        fill: (isHoliday || isWE) ? C.red : C.ink
      }));
    }
  }

  // Footer
  els.push(`<line x1="${ox + 4.5}" y1="89" x2="${ox + 65.5}" y2="89" stroke="${C.ink}" stroke-width="0.25"/>`);
  els.push(`<rect x="${ox + 4.5}" y="91.1" width="1.4" height="1.4" fill="${C.red}"/>`);
  els.push(t(ox + 6.6, 92.4, "WEEKENDS / HOLIDAYS", {
    family: "JetBrains Mono, monospace", size: 1.6, weight: 500, spacing: "0.2em"
  }));
  els.push(t(ox + 65.5, 92.4, "PRINTED ON PVC", {
    family: "JetBrains Mono, monospace", size: 1.6, weight: 500, spacing: "0.2em",
    anchor: "end"
  }));

  els.push(`</g>`);
  return els.join("\n  ");
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  ════════════════════════════════════════════════════════════════
   APEX & CO. — Pocket Calendar 2026
   Two-sided 70 × 100 mm plastic pocket card · Print-ready vector

   Layout in this file:
     - Left card  (x =   0 … 70)  · FRONT (обложка)
     - Right card (x =  78 … 148) · BACK  (оборот · 12 months)

   To reprint for a new year:
     1. Change YEAR in scripts/gen-pocket-svg.mjs and regenerate, OR
     2. Edit numerals directly inside the back <g> groups below.
   Holiday days are bold-red; weekends are red.
  ════════════════════════════════════════════════════════════════
-->
<svg xmlns="http://www.w3.org/2000/svg"
     width="148mm" height="100mm"
     viewBox="0 0 ${W} ${H}"
     preserveAspectRatio="xMidYMid meet">
  <defs>
    <style><![CDATA[
      @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
      text { dominant-baseline: alphabetic; }
    ]]></style>
    <clipPath id="front-clip">
      <rect x="0"  y="0" width="70" height="100" rx="3.2" ry="3.2"/>
    </clipPath>
    <clipPath id="back-clip">
      <rect x="78" y="0" width="70" height="100" rx="3.2" ry="3.2"/>
    </clipPath>
  </defs>

  <!-- ═══════════════════════ FRONT ═══════════════════════ -->
  ${renderFront()}

  <!-- ═══════════════════════ BACK ═══════════════════════ -->
  ${renderBack()}

  <!-- ─── trim outlines (visible on screen + print preview) ─── -->
  <rect x="0"  y="0" width="70" height="100" rx="3.2" ry="3.2"
        fill="none" stroke="#bcbcbc" stroke-width="0.15" stroke-dasharray="0.6 0.6"/>
  <rect x="78" y="0" width="70" height="100" rx="3.2" ry="3.2"
        fill="none" stroke="#bcbcbc" stroke-width="0.15" stroke-dasharray="0.6 0.6"/>
</svg>
`;

writeFileSync("/home/ubuntu/repos/calendar/public/pocket-calendar.svg", svg);
console.log("wrote pocket-calendar.svg, " + svg.length + " bytes");
