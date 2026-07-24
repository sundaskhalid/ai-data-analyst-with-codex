# Build an AI Data Analyst with Codex

This project accompanies Sundas Khalid's Teachable AI Academy webinar, **How Do You Build an AI Data Analyst with Codex?**

The project demonstrates how to use Codex to investigate a customer retention decline, create a cohort analysis, validate the findings, and turn the analysis into an Excel workbook and an executive presentation.

## Start here

1. Download or clone this project.
2. Open the project folder in Codex.
3. Copy the prompt from [`prompt.md`](prompt.md).
4. Let Codex inspect the data.
5. Review and approve the proposed methodology before Codex continues.
6. Compare the generated results with the included reference deliverables.

## Project files

| Folder | Contents |
| --- | --- |
| `data/` | Demo customer retention dataset |
| `analysis/` | Supporting tables and structured analysis results |
| `deliverables/` | Excel cohort analysis and executive findings deck |
| `scripts/` | Reproducible analysis and workbook generation scripts |
| `prompt.md` | Copy ready Codex demo prompt |

## Framework

The prompt follows five stages:

1. **Frame** the business question and metric.
2. **Inspect** the data quality and grain.
3. **Build** weekly retention and cohort analysis.
4. **Test** the strongest possible drivers.
5. **Validate** the calculations and conclusions.

The most important checkpoint is the data grain. The source is recorded at the visit level, so it must be aggregated to one customer per week before retention is compared.

## Reference deliverables

The `deliverables` folder contains:

1. `customer_retention_cohort_breakdown.xlsx`
2. `customer_retention_leadership_deck.pptx`

The presentation numbers should always reconcile to the Excel workbook.

## Run the analysis

Install the Python dependency:

```bash
python3 -m pip install -r requirements.txt
```

Run the core analysis:

```bash
python3 scripts/analyze_retention.py
```

The workbook generation script uses the spreadsheet tooling available in Codex.

## Data and responsible AI note

This is a workshop demo dataset with generated customer and visit identifiers. It contains no names, email addresses, phone numbers, or street addresses.

Before using AI with workplace data:

1. Use tools and accounts approved by your organization.
2. Share only the minimum data required.
3. Remove direct and indirect identifiers.
4. Keep prompts, code, assumptions, and outputs auditable.
5. Require human review before consequential decisions.

AI generated analysis can contain errors. Reconcile source counts, inspect the methodology, reproduce important calculations, and distinguish association from causation.

## About

Created for Sundas Khalid's Teachable AI Academy webinar.

Learn more at [sundaskhalid.com](https://sundaskhalid.com).
