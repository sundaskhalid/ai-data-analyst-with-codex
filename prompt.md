# Codex demo prompt

Copy and paste this prompt into Codex from the project folder:

```text
Act as my AI data analyst. Analyze data/customer_retention_data.csv to identify what is driving the latest retention decline.

Follow this framework:

1. Frame: Define retention, the business question, the comparison period, and any assumptions.

2. Inspect: Check the schema, date range, missing values, duplicates, and data grain. Determine whether visits must be aggregated to one customer per week.

Pause after inspection and ask for my approval.

3. Build: Calculate weekly retention and create a customer acquisition cohort analysis.

4. Test: Compare retention across available drivers such as platform, app version, crash exposure, email engagement, segment, and region.

5. Validate: Reconcile customer counts, rerun key calculations, and separate correlation from causation.

Create two final deliverables:

1. An Excel workbook with weekly retention, cohort analysis, driver analysis, validation checks, and charts.

2. A presentation of no more than six slides covering the problem, findings, cohort analysis, validation, and recommendations.

Save the code and all outputs. Make sure the numbers in the presentation match the Excel workbook.
```

## Stay connected

Want future webinars and practical AI lessons? [Subscribe to my newsletter](https://sundaskhalid.com/newsletter).
