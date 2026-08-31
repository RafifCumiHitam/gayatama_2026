# Phase 1C Report — Semantic Document Model & Accessible Reflow Engine

> **Version:** 1.0  
> **Status:** Completed  
> **Project:** ReadAble — Universal Accessible Document Converter  
> **Rule:** Strict Rule-Based / Deterministic System — **NO AI/ML/LLM/Vector DB/AI OCR**  

---

## 1. Architecture

Phase 1C completes the core end-to-end document conversion pipeline:

```text
PDF File
   │
   ▼
[PDFProcessor] (Phase 1A: PyMuPDF Extraction)
   │
   ▼
[LayoutAnalyzer] (Phase 1B: Columns, Reading Order & Block Classification)
   │
   ▼
[SemanticAnalyzer] (Phase 1C Part A: Semantic Modeling)
   ├── HeadingHierarchyEngine (Infer H1, H2, H3 via numbering patterns & font ranks)
   ├── Normalization (Whitespace, safe hyphenation cleanup)
   ├── ListParser (Groups LIST_ITEM blocks into semantic LIST containers)
   ├── FigureParser (Associates images with caption blocks)
   ├── TableParser (Conservative table candidate parsing)
   └── SectionBuilder (Stack-based hierarchical section construction)
   │
   ▼
[ReflowEngine] (Phase 1C Part B: Accessible Reflow Transformation)
   └── Generates single-column, comfortable-width ReadableDocument
   │
   ▼
Database Persistence (`document_sections` Table)
   │
   ▼
Frontend Reader UI (`/documents/[documentId]/reader`)
```

---

## 2. Component Design & Algorithms

### A. Semantic Data Models (`SemanticDocument`)
Defined in [`backend/app/services/document_semantic/semantic_models.py`](file:///e:/PROJECTS/ReadAble/backend/app/services/document_semantic/semantic_models.py):
- `SemanticDocument`: `document_id`, `title`, `language`, `sections[]`, `headers[]`, `footers[]`, `source_text_length`, `source_word_count`.
- `SemanticSection`: `id`, `title`, `level` (1, 2, 3), `order`, `blocks[]`, `children[]`, `page_number`.
- `SemanticBlock`: `id`, `semantic_type` (`DOCUMENT_TITLE`, `HEADING`, `PARAGRAPH`, `LIST`, `FIGURE`, `TABLE`, etc.), `content`, `order`, `source_block_ids`, `page_number`, `heading_level`, `heading_level_evidence`.

### B. Heading Hierarchy & Section Builder
- `HeadingHierarchyEngine`: Inferred via regex numbering patterns (e.g. `1.1.1` $\rightarrow$ H3, `1.1` $\rightarrow$ H2, `1.` $\rightarrow$ H1) or font size ranking relative to all document headings.
- `SectionBuilder`: Stack-based algorithm building nested `SemanticSection` trees without reordering blocks.

### C. Reflow Engine (`ReflowEngine`)
Defined in [`backend/app/services/document_reflow/reflow_engine.py`](file:///e:/PROJECTS/ReadAble/backend/app/services/document_reflow/reflow_engine.py):
- Transforms `SemanticDocument` into a linear, single-column `ReadableDocument` stream.
- Computes character and word counts for content integrity checks.

---

## 3. Database Persistence & API Integration

- **Atomic Database Persistence**: Persists semantic sections into PostgreSQL `document_sections` table via [`backend/app/services/document_semantic/persistence.py`](file:///e:/PROJECTS/ReadAble/backend/app/services/document_semantic/persistence.py).
- **API Endpoints**:
  - `GET /api/v1/documents/{id}/sections` — Returns database-backed `DocumentSection` records.
  - `GET /api/v1/documents/{id}/content` — Returns `ReadableContentResponse`.
  - Ownership authorization verified on both endpoints.
- **5-Stage Real Processing Progress**:
  - 0-20%: PDF extraction
  - 20-40%: Layout analysis
  - 40-60%: Semantic analysis
  - 60-85%: Reflow
  - 85-100%: Section persistence & finalization

---

## 4. Frontend Reader Integration

- Updated `/documents/[documentId]/reader` to fetch real extracted sections from `GET /documents/{id}/sections`.
- Renders semantic section headings, paragraphs, lists, figures, and table elements dynamically with customizable font family (`OpenDyslexic`, `Inter`, `Georgia`), font size, line height, and letter spacing.

---

## 5. Testing & Verification

- Pytest suite in [`backend/tests/test_semantic_analyzer.py`](file:///e:/PROJECTS/ReadAble/backend/tests/test_semantic_analyzer.py):
  - `test_semantic_document_title_and_sections`: Passed.
  - `test_list_parsing`: Passed.
  - `test_header_footer_filtering`: Passed.
  - `test_content_integrity_and_reflow`: Passed.
  - `test_semantic_determinism`: Passed (100% identical output across runs).
- **All 23/23 backend test suites passed**.
- **Next.js production build (`npm run build`) succeeded**.

---

## 6. Known Limitations

- Complex nested tables with merged cells fall back to `PARAGRAPH` blocks to preserve reading integrity without data loss.

---

## 7. Next Phase

The next critical phase is:

**PHASE 2: ACCESSIBILITY ANALYSIS ENGINE & ACCCOMMODATION ENGINE**
