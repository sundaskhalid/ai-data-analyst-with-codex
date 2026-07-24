# AI Data Analyst Starter Kit

Use this practice project with ChatGPT, Claude, Codex, or another AI tool that can analyze files. You will investigate a customer retention decline, build a cohort analysis, validate the findings, and turn the results into an Excel workbook and a short presentation.

## What is included

| File | What it contains |
| --- | --- |
| [`prompt.md`](prompt.md) | The complete prompt to paste into your AI tool |
| [`data/customer_retention_data.csv`](data/customer_retention_data.csv) | The customer retention dataset used for the analysis |

## How to use this project

1. Select **Code** at the top of this page, then select **Download ZIP**.
2. Unzip the downloaded folder on your computer.
3. Open your preferred AI tool. Use a new project or chat that supports file uploads.
4. Upload [`data/customer_retention_data.csv`](data/customer_retention_data.csv). If your tool supports working directly with a local project folder, open the downloaded folder instead.
5. Open [`prompt.md`](prompt.md), copy the full prompt, and paste it into your AI tool.
6. Let the AI inspect the dataset and explain the data quality, grain, assumptions, and proposed methodology.
7. Review the inspection results. When you are comfortable with the approach, approve the AI to continue.
8. Review the generated Excel workbook and presentation. Confirm that every number in the presentation matches the workbook.

If you prefer Git, clone the repository:

```bash
git clone https://github.com/sundaskhalid/ai-data-analyst-starter-kit.git
```

## What your AI tool should create

The prompt asks your AI tool to generate:

1. An Excel workbook with weekly retention, cohort analysis, driver analysis, validation checks, and charts.
2. A presentation of no more than six slides covering the problem, findings, cohort analysis, validation, and recommendations.

These outputs are created during the exercise and are not included in this repository. Exact file generation features may vary by AI tool.

## Before trusting the analysis

Confirm that:

1. The visit level data was aggregated to the correct customer and week grain.
2. Customer counts reconcile across the source data, workbook, and presentation.
3. Key calculations were rerun or independently checked.
4. Conclusions distinguish correlation from causation.
5. Important assumptions and limitations are clearly documented.

## Responsible AI reminder

This practice dataset uses generated customer and visit identifiers. It does not contain names, email addresses, phone numbers, or street addresses.

When working with company data, use tools approved by your organization, remove sensitive information, and share only the minimum data required.

## Stay connected

Want future webinars and practical AI lessons? [Subscribe to my newsletter](https://sundaskhalid.com/newsletter).
