import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ANALYSIS_PATH = path.join(ROOT, "analysis", "retention_analysis.json");
const OUTPUT_DIR = path.join(ROOT, "deliverables");
const PREVIEW_DIR = path.join(OUTPUT_DIR, "workbook_previews");
const OUTPUT_XLSX = path.join(OUTPUT_DIR, "customer_retention_cohort_breakdown.xlsx");

const data = JSON.parse(await fs.readFile(ANALYSIS_PATH, "utf8"));
const wb = Workbook.create();

const colors = {
  ink: "#17202A",
  muted: "#667085",
  bg: "#F7F4EF",
  panel: "#FFFFFF",
  accent: "#176B87",
  amber: "#C47F2C",
  red: "#B64242",
  paleBlue: "#DCEBF1",
  paleAmber: "#F3E3CE",
  paleRed: "#F4DADA",
  grid: "#D8D2C8",
  dark: "#111827",
};

function sheet(name) {
  const ws = wb.worksheets.add(name);
  ws.showGridLines = false;
  return ws;
}

function write(ws, address, rows) {
  ws.getRange(address).values = rows;
}

function setFill(range, color) {
  range.format.fill.color = color;
}

function setFont(range, opts = {}) {
  if (opts.bold !== undefined) range.format.font.bold = opts.bold;
  if (opts.size !== undefined) range.format.font.size = opts.size;
  if (opts.color !== undefined) range.format.font.color = opts.color;
  if (opts.name !== undefined) range.format.font.name = opts.name;
}

function setHeader(range) {
  setFill(range, colors.dark);
  setFont(range, { bold: true, color: "#FFFFFF", size: 10, name: "Aptos" });
  range.format.wrapText = true;
  range.format.verticalAlignment = "Center";
}

function setTitle(ws, title, subtitle, cols = "A1:J1") {
  ws.getRange(cols).merge();
  ws.getRange("A1").values = [[title]];
  setFill(ws.getRange(cols), colors.dark);
  setFont(ws.getRange("A1"), { bold: true, size: 18, color: "#FFFFFF", name: "Aptos Display" });
  ws.getRange("A1").format.rowHeightPx = 34;
  if (subtitle) {
    ws.getRange("A2:J2").merge();
    ws.getRange("A2").values = [[subtitle]];
    setFill(ws.getRange("A2:J2"), colors.bg);
    setFont(ws.getRange("A2"), { size: 11, color: colors.muted, name: "Aptos" });
    ws.getRange("A2").format.rowHeightPx = 28;
  }
}

function widths(ws, widthsPx) {
  widthsPx.forEach((px, idx) => {
    ws.getRangeByIndexes(0, idx, 1, 1).format.columnWidthPx = px;
  });
}

function styleTable(ws, topLeft, rowCount, colCount) {
  const header = ws.getRange(topLeft).getResizedRange(0, colCount - 1);
  setHeader(header);
  const body = ws.getRange(topLeft).getOffsetRange(1, 0).getResizedRange(rowCount - 2, colCount - 1);
  setFill(body, colors.panel);
  setFont(body, { size: 10, color: colors.ink, name: "Aptos" });
  body.format.wrapText = true;
  body.format.verticalAlignment = "Top";
}

function rowValues(items, keys) {
  return items.map((item) => keys.map((key) => item[key] ?? ""));
}

function addDashboard() {
  const ws = sheet("Executive Summary");
  setTitle(
    ws,
    "Customer retention drop diagnosis",
    data.summary.period_definition,
    "A1:J1",
  );
  widths(ws, [190, 170, 190, 230, 280, 95, 95, 110, 110, 120]);

  write(ws, "A4:D6", [
    ["Baseline retention", "Drop-week retention", "Retention change", "Active customers"],
    [`${data.summary.baseline_retention_pct}%`, `${data.summary.drop_week_retention_pct}%`, `${data.summary.drop_pp} pp`, data.summary.drop_active_customers],
    ["Prior four-week April customer-weeks", "Week starting Apr 27", "Drop vs baseline", "Unique active customers in drop week"],
  ]);
  setHeader(ws.getRange("A4:D4"));
  setFill(ws.getRange("A5:D5"), colors.panel);
  setFont(ws.getRange("A5:D5"), { bold: true, size: 18, color: colors.ink, name: "Aptos Display" });
  setFill(ws.getRange("C5"), colors.paleRed);
  setFont(ws.getRange("A6:D6"), { size: 9, color: colors.muted, name: "Aptos" });

  write(ws, "A9:E12", [
    ["Top insight", "Baseline", "Drop week", "Impact", "Evidence"],
    ...data.driver_deep_dive.map((r) => [r.driver, r.baseline, r.drop_week, r.impact, r.evidence]),
  ]);
  styleTable(ws, "A9", 4, 5);
  ws.getRange("A9:E12").format.wrapText = true;

  write(ws, "A15:J24", [
    [
      "Week",
      "Active customers",
      "Retention %",
      "Avg visits",
      "Crash exposure %",
      "Email coverage %",
      "Promo exposure %",
      "Support rate %",
      "Avg risk",
      "Avg session min",
    ],
    ...rowValues(data.weekly, [
      "week",
      "active_customers",
      "retention_rate",
      "avg_visits",
      "crash_exposure",
      "email_coverage",
      "promo_coverage",
      "support_rate",
      "avg_risk",
      "avg_session_min",
    ]),
  ]);
  styleTable(ws, "A15", data.weekly.length + 1, 10);
  setFill(ws.getRange("A24:J24"), colors.paleRed);
  setFont(ws.getRange("A24:J24"), { bold: true });
  return ws;
}

function addSegments() {
  const ws = sheet("Cohort Breakdown");
  setTitle(
    ws,
    "Cohort and segment breakdown",
    "All retention figures are customer-week retention: retained in the next 7 days by active customer-week.",
    "A1:N1",
  );
  widths(ws, [130, 90, 95, 90, 95, 90, 90, 95, 95, 95, 95, 90, 95, 110]);
  let row = 4;
  for (const [name, rows] of Object.entries(data.segments)) {
    ws.getRange(`A${row}:N${row}`).merge();
    ws.getRange(`A${row}`).values = [[name]];
    setFill(ws.getRange(`A${row}:N${row}`), colors.paleBlue);
    setFont(ws.getRange(`A${row}`), { bold: true, color: colors.ink, size: 12, name: "Aptos Display" });
    row += 1;
    const keys = [
      "segment",
      "baseline_customers",
      "baseline_retention",
      "drop_customers",
      "drop_retention",
      "retention_delta_pp",
      "baseline_share",
      "drop_share",
      "drop_crash",
      "drop_email",
      "drop_promo",
      "drop_support",
      "drop_risk",
      "approx_drop_contribution_pp",
    ];
    write(ws, `A${row}:N${row + rows.length}`, [
      [
        "Segment",
        "Base cust-wks",
        "Base ret %",
        "Drop cust",
        "Drop ret %",
        "Delta pp",
        "Base share %",
        "Drop share %",
        "Crash %",
        "Email %",
        "Promo %",
        "Support %",
        "Risk",
        "Approx contrib pp",
      ],
      ...rowValues(rows, keys),
    ]);
    styleTable(ws, `A${row}`, rows.length + 1, 14);
    for (let i = 0; i < rows.length; i += 1) {
      const contribution = Number(rows[i].approx_drop_contribution_pp);
      const fill = contribution <= -10 ? colors.paleRed : contribution <= -5 ? colors.paleAmber : colors.panel;
      setFill(ws.getRange(`A${row + 1 + i}:N${row + 1 + i}`), fill);
    }
    row += rows.length + 3;
  }
  return ws;
}

function addCohortPlan() {
  const ws = sheet("Cohort x Plan");
  setTitle(ws, "Cohort x plan detail", "Drop-week retention by customer cohort and plan tier.", "A1:G1");
  widths(ws, [140, 120, 120, 120, 120, 120, 120]);
  write(ws, "A4:G20", [
    [
      "Customer cohort",
      "Plan",
      "Base cust-wks",
      "Base ret %",
      "Drop customers",
      "Drop ret %",
      "Delta pp",
    ],
    ...rowValues(data.cohort_plan, [
      "customer_cohort",
      "plan",
      "baseline_customers",
      "baseline_retention",
      "drop_customers",
      "drop_retention",
      "delta_pp",
    ]),
  ]);
  styleTable(ws, "A4", data.cohort_plan.length + 1, 7);
  return ws;
}

function addDriverSheet() {
  const ws = sheet("Driver Deep Dive");
  setTitle(ws, "Driver deep dive", "Operational readout of the three drivers most likely responsible for the April 27 drop.", "A1:E1");
  widths(ws, [210, 240, 300, 330, 330]);
  write(ws, "A4:E7", [
    ["Driver", "Baseline", "Drop week", "Impact", "Evidence"],
    ...data.driver_deep_dive.map((r) => [r.driver, r.baseline, r.drop_week, r.impact, r.evidence]),
  ]);
  styleTable(ws, "A4", 4, 5);
  ws.getRange("A4:E7").format.wrapText = true;

  write(ws, "A10:B16", [
    ["Interpretation note", "Value"],
    ["Primary comparison", "Prior four weeks of April vs week starting April 27, 2026"],
    ["Retention grain", "Customer-week, deduped from visit-level source"],
    ["Drop magnitude", `${data.summary.drop_pp} pp`],
    ["Most concentrated technical signal", "mobile_crash_bug_exposed and app_version 4.3.1"],
    ["Most actionable recovery lever", "rollback/fix 4.3.1, reinstate lifecycle campaigns, reduce support backlog"],
    ["Caveat", "Week of Apr 27 has fewer active customers than prior weeks; treat customer-week retention as the primary metric."],
  ]);
  styleTable(ws, "A10", 7, 2);
  return ws;
}

addDashboard();
addSegments();
addCohortPlan();
addDriverSheet();

await fs.mkdir(PREVIEW_DIR, { recursive: true });
for (const name of ["Executive Summary", "Cohort Breakdown", "Cohort x Plan", "Driver Deep Dive"]) {
  const blob = await wb.render({ sheetName: name, scale: 1 });
  await fs.writeFile(path.join(PREVIEW_DIR, `${name.replace(/[^a-z0-9]+/gi, "_").toLowerCase()}.png`), Buffer.from(await blob.arrayBuffer()));
}

const inspect = await wb.inspect({
  kind: "table",
  range: "Executive Summary!A4:J24",
  include: "values,formulas",
  tableMaxRows: 24,
  tableMaxCols: 10,
});
console.log(inspect.ndjson);
const errors = await wb.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

await fs.mkdir(OUTPUT_DIR, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(wb);
await output.save(OUTPUT_XLSX);
console.log(JSON.stringify({ output: OUTPUT_XLSX }, null, 2));
