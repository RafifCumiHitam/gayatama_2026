# Phase 1B Report — PDF Layout Analysis & Reading Order Engine

> **Version:** 1.0  
> **Status:** Completed  
> **Project:** ReadAble — Universal Accessible Document Converter  
> **Rule:** Strict Rule-Based / Deterministic System — **NO AI/ML/LLM/Vector DB/AI OCR**  

---

## 1. Architecture

Phase 1B implements deterministic layout analysis and reading order reconstruction over extracted PyMuPDF blocks:

```text
DocumentExtraction (from Phase 1A)
        │
        ▼
[LayoutAnalyzer] (Master Orchestrator)
        │
        ├── 1. [HeaderFooterDetector] ──► Identifies repeated headers/footers across pages
        ├── 2. [BlockClassifier] ────────► Classifies TITLE, HEADING, PARAGRAPH, LIST_ITEM, TABLE_CANDIDATE, IMAGE
        ├── 3. [ColumnDetector] ─────────► Detects single, 2-column, and 3-column regions via x-clusters
        ├── 4. [ParagraphGrouper] ────────► Groups compatible blocks & flags cross-column/page continuations
        └── 5. [ReadingOrderEngine] ────► Orders blocks deterministically (Full-width -> Col 1 -> Col 2 -> Col 3)
        │
        ▼
OrderedDocument (Analyzed & Ordered Blocks with Evidence Signals)
```

---

## 2. Component Design & Rule Algorithms

### A. Block Classification (`BlockClassifier`)
- **TITLE**: First page, font size $\ge 1.4\times$ page font size median, length $<120$ characters.
- **HEADING**: Font size $\ge 1.15\times$ page median, OR matches numbered heading pattern (e.g. `1. Introduction`, `1.1 Background`), OR uppercase string $<60$ characters.
- **LIST_ITEM**: Starts with bullet characters (`•`, `-`, `*`) or numbered list prefixes (`1.`, `a)`).
- **TABLE_CANDIDATE**: Multiple tab characters or grid-like whitespace separators.
- **IMAGE**: Preserved from PyMuPDF image blocks.

### B. Column Detection (`ColumnDetector`)
- Clusters horizontal center coordinates $(x_0 + x_1) / 2$.
- Differentiates full-width blocks (spanning $>65\%$ of page width) from column-bound blocks.
- Supports single-column, 2-column, and 3-column page layouts. Assigns 1-based `column_index`.

### C. Paragraph Grouping & Continuation (`ParagraphGrouper`)
- Merges adjacent text blocks with identical fonts and small vertical gaps ($\le 15\text{pt}$).
- Detects continuation blocks across columns or pages when preceding blocks lack sentence-ending punctuation (`.`, `!`, `?`, `:`).

### D. Header & Footer Detection (`HeaderFooterDetector`)
- Compares text near top margin ($\le 15\%$) and bottom margin ($\ge 85\%$) across pages.
- Classifies repeated text patterns and page number regex matches (`Page 1`, `1 / 5`) as `HEADER` or `FOOTER`.

### E. Reading Order Engine (`ReadingOrderEngine`)
- Orders elements on each page:
  1. Top `HEADER` blocks.
  2. Top full-width `TITLE` or header blocks.
  3. Column 1 blocks (top-to-bottom).
  4. Column 2 blocks (top-to-bottom).
  5. Column 3+ blocks (top-to-bottom).
  6. Bottom full-width blocks.
  7. Bottom `FOOTER` blocks.
- Assigns sequential `page_reading_order` and continuous `global_reading_order`.

---

## 3. Data Models (`AnalyzedBlock` & `OrderedDocument`)

Defined in [`backend/app/services/document_analyzer/models.py`](file:///e:/PROJECTS/ReadAble/backend/app/services/document_analyzer/models.py):
- `AnalyzedBlock`: Retains original PyMuPDF attributes plus:
  - `classification`: `TITLE`, `HEADING`, `PARAGRAPH`, `LIST_ITEM`, `TABLE_CANDIDATE`, `IMAGE`, `HEADER`, `FOOTER`.
  - `evidence_signals`: List of strings explaining rule matches (e.g., `["heading_numbering_pattern", "column_1_left_cluster"]`).
  - `column_index`: 0 for full-width, 1..N for specific column.
  - `global_reading_order` & `page_reading_order`: 1-based reading sequence.
  - `is_header`, `is_footer`, `is_continuation`: Flag attributes.

---

## 4. Test Fixtures & Automated Test Suite

Generated test PDFs in [`backend/tests/fixtures/create_fixtures.py`](file:///e:/PROJECTS/ReadAble/backend/tests/fixtures/create_fixtures.py):
- `three_column.pdf`: 3-column layout document.
- `heading_document.pdf`: Document with title and numbered headings.
- `header_footer.pdf`: 2-page document with header/footer repetitions.
- `lists.pdf`: Document with bullet points and numbered lists.
- `mixed_layout.pdf`: Full-width title with 2-column body content.

Pytest suite in [`backend/tests/test_layout_analyzer.py`](file:///e:/PROJECTS/ReadAble/backend/tests/test_layout_analyzer.py):
- `test_single_column_reading_order`: Passed.
- `test_two_column_reading_order`: Passed (Column 1 blocks strictly precede Column 2 blocks).
- `test_heading_detection_and_classification`: Passed.
- `test_header_footer_detection`: Passed.
- `test_list_item_detection`: Passed.
- `test_mixed_layout_title_and_columns`: Passed.
- `test_determinism`: Passed (100% identical reading order across multiple runs).

All **18/18 pytest test cases passed**. Next.js production build (`npm run build`) succeeded.

---

## 5. Known Limitations & Edge Cases

- Complex multi-column layouts with floating sidebars or non-standard text wrapping may fall back to default y-position ordering.
- Tables with sparse borders are flagged as `TABLE_CANDIDATE` and will be fully parsed into table structures in Phase 1C.

---

## 6. Next Step

The next phase is:

**PHASE 1C — SEMANTIC DOCUMENT MODEL & ACCESSIBLE REFLOW ENGINE**
