# ReadAble — Product Requirements Document

> **Version:** 1.0
> **Status:** Product Definition / MVP Planning
> **Product Type:** Web Application
> **Primary Audience:** People with dyslexia and users who experience reading difficulties
> **Core Approach:** Rule-based document transformation, accessibility, and personalized reading — **no AI/ML required**

---

## 1. Product Summary

**ReadAble** is a web-based **Universal Accessible Document Converter** that transforms supported digital documents into a more readable, customizable reading experience.

The product follows:

```text
UPLOAD
   ↓
PARSE
   ↓
STRUCTURE
   ↓
ANALYZE
   ↓
REFLOW
   ↓
PERSONALIZE
   ↓
READ
   ↓
EXPORT
```

The product does **not** attempt to diagnose dyslexia or determine whether someone has dyslexia.

Instead, it provides configurable reading accommodations such as:

* typography customization
* increased spacing
* readable line length
* focus reading
* reading ruler
* text-to-speech
* synchronized text highlighting
* semantic navigation
* accessible document reflow
* accessibility analysis
* export to accessible formats

The central product idea is:

> **Change how the document is presented, not what the document says.**

---

# 2. Product Vision

## Vision

> **Make every supported document easier to read without changing its meaning.**

## Mission

ReadAble aims to bridge the gap between:

**documents designed for visual layout**

and

**documents designed for human reading.**

---

# 3. Problem Statement

Many digital documents prioritize visual formatting over reading accessibility.

Examples:

```text
PDF
├── multi-column layout
├── small typography
├── dense paragraphs
├── inconsistent headings
├── excessive whitespace
├── complex tables
├── headers/footers
└── poor reading order
```

For users who experience dyslexia or other reading difficulties, this can create additional reading friction.

Existing tools already address many individual problems. Microsoft Immersive Reader, for example, provides text size, spacing, column width, themes, line focus, and read-aloud capabilities. ([Microsoft Support][1])

Adobe Acrobat also already provides PDF reflow into a single-column reading view. ([Adobe Help Center][2])

OrbitNote provides OCR-based PDF accessibility and can turn inaccessible scanned documents into readable PDFs. ([Texthelp][3])

Therefore, ReadAble should **not** position itself simply as another dyslexia reader.

---

# 4. Product Opportunity

The opportunity is to combine these capabilities into a single workflow:

```text
                    ORIGINAL DOCUMENT
                           │
                           ▼
                 DOCUMENT PROCESSING
                           │
                           ▼
                 STRUCTURE ANALYSIS
                           │
                           ▼
              ACCESSIBILITY ANALYSIS
                           │
                           ▼
                 DOCUMENT REFLOW
                           │
                           ▼
              PERSONAL READING PROFILE
                           │
                           ▼
                 ACCESSIBLE READER
                           │
                           ▼
                       EXPORT
```

The differentiation is therefore:

> **Document transformation platform rather than merely a document reader.**

---

# 5. Competitive Positioning

## Existing Landscape

| Product                    | Primary Strength                                              |
| -------------------------- | ------------------------------------------------------------- |
| Microsoft Immersive Reader | Reading accessibility                                         |
| Adobe Acrobat              | PDF accessibility + reflow                                    |
| Texthelp OrbitNote         | Accessible PDF/OCR workspace                                  |
| Helperbird                 | Browser-wide accessibility tools                              |
| Reader Mode                | Distraction-free reading                                      |
| BeeLine Reader             | Visual reading assistance                                     |
| **ReadAble**               | **Document transformation + personalized accessible reading** |

Microsoft's Immersive Reader already supports line focus, including 1, 3, and 5-line modes. ([Microsoft Support][4])

Adobe already supports temporary PDF reflow into a single column. ([Adobe Help Center][2])

Therefore:

### Features that are NOT considered unique

```text
❌ Dyslexia-friendly fonts
❌ Font size customization
❌ Line spacing
❌ Letter spacing
❌ Reading ruler
❌ Line focus
❌ Text-to-speech
❌ PDF reflow
❌ OCR
```

These are **baseline capabilities**.

### Proposed differentiation

```text
🟢 Universal document transformation
🟢 Semantic document reconstruction
🟢 Accessibility analysis before/after transformation
🟢 Rule-based reflow engine
🟢 Persistent reading profiles
🟢 Exportable transformed document
🟢 Unified workflow across supported document types
```

---

# 6. Target Users

## Primary Persona — Dyslexic Reader

Needs:

* less visual clutter
* customizable typography
* predictable reading flow
* focus assistance
* TTS
* personal reading configuration

---

## Secondary Persona — Student

Typical documents:

```text
Research papers
Lecture notes
Textbooks
Journal articles
Assignments
Course materials
```

Needs:

* fast document conversion
* comfortable reading
* bookmarks
* navigation
* highlighting
* notes
* export

---

## Secondary Persona — Educator

Needs:

* make materials more accessible
* check document structure
* distribute accessible versions
* reduce manual document formatting

---

## Potential B2B Users

```text
Schools
Universities
Publishers
Libraries
Corporate training
Educational platforms
Accessibility teams
```

---

# 7. Product Goals

## Primary Goals

1. Convert supported documents into a readable presentation.
2. Preserve document meaning and hierarchy.
3. Provide customizable reading accommodations.
4. Provide semantic document navigation.
5. Provide accessibility analysis.
6. Allow users to save reading preferences.
7. Allow export of transformed documents.

## Secondary Goals

1. Improve reading workflow.
2. Reduce visual clutter.
3. Make document accessibility measurable.
4. Provide a consistent reading interface across document formats.

---

# 8. Non-Goals

ReadAble will **not**:

* diagnose dyslexia
* determine whether a user has dyslexia
* provide medical advice
* claim that one font is universally optimal for dyslexia
* automatically rewrite document meaning
* summarize documents using AI in MVP
* use LLMs in MVP
* use ML-based personalization in MVP

---

# 9. Core Product Principles

## 9.1 Preserve Meaning

The system may change:

```text
Typography
Spacing
Layout
Reading order presentation
Column structure
Visual hierarchy
```

But should preserve:

```text
Words
Meaning
Headings
References
Tables
Figures
Relationships
```

---

## 9.2 User Control

ReadAble should never assume:

> "This is the correct dyslexia configuration."

Instead:

> "Choose the reading environment that works best for you."

---

## 9.3 Accessibility by Default

The reader itself must be accessible.

Target:

> **WCAG 2.2 AA-oriented implementation**

Requirements include:

* keyboard navigation
* semantic HTML
* visible focus states
* sufficient contrast
* screen-reader support
* reduced-motion support
* accessible forms
* accessible controls

---

# 10. Supported Input Formats

## MVP

```text
PDF
```

## Phase 2

```text
DOCX
EPUB
TXT
```

## Phase 3

```text
PPTX
PNG
JPG
Scanned PDF
```

### Important

The product should not claim:

> "Any document can be perfectly converted."

Instead:

> **"Convert supported documents into a more readable format."**

---

# 11. Core User Journey

```text
LANDING PAGE
     ↓
UPLOAD
     ↓
PROCESSING
     ↓
ACCESSIBILITY ANALYSIS
     ↓
CONVERSION PREVIEW
     ↓
READABLE READER
     ↓
CUSTOMIZE
     ↓
SAVE PROFILE
     ↓
EXPORT
```

---

# 12. Information Architecture

```text
ReadAble
│
├── Home
│
├── Convert
│   ├── Upload
│   ├── Processing
│   ├── Analysis
│   └── Preview
│
├── Reader
│   ├── Document
│   ├── Contents
│   ├── Typography
│   ├── Focus
│   ├── Reading Ruler
│   ├── TTS
│   └── Notes
│
├── My Documents
│   ├── Recent
│   ├── Saved
│   └── Exported
│
├── Accessibility
│   ├── Score
│   ├── Structure
│   ├── Issues
│   └── Improvements
│
└── Settings
    ├── Reading Profiles
    ├── Accessibility
    ├── Appearance
    └── Account
```

---

# 13. Homepage Requirements

## Objective

Immediately communicate:

> **Upload a document → make it easier to read.**

### Hero

```text
Make Every Document
Easier to Read.

Transform your documents into
a personalized reading experience.

[ Upload Document ]
```

### Supported formats

```text
PDF · DOCX · EPUB · PPTX · TXT · Images
```

### Process

```text
01 Upload
02 Adapt
03 Read
04 Export
```

### Feature highlights

```text
Adaptive Typography
Focus Reading
Reading Ruler
Text-to-Speech
Document Reflow
Accessibility Analysis
```

---

# 14. Upload Requirements

## Upload methods

* drag & drop
* file picker

## Validation

System checks:

```text
File type
File size
File integrity
Format compatibility
```

### Upload states

```text
Idle
Hover
Uploading
Processing
Success
Error
```

### Error examples

```text
Unsupported file format.

This document could not be processed.

The document contains a layout
that ReadAble cannot currently reconstruct.
```

---

# 15. Processing Screen

The processing UI should expose meaningful progress.

```text
Preparing your document...

✓ File uploaded
✓ Text extracted
✓ Reading order detected
✓ Headings identified
✓ Tables detected
● Creating readable layout
○ Accessibility analysis
```

Progress:

```text
78%
━━━━━━━━━━━━━━━━━━░░░░
```

---

# 16. Document Structure Engine

This is a core technical component.

## Input

Raw document.

## Output

Semantic document tree.

Example:

```text
Document
│
├── Heading 1
│
├── Paragraph
├── Paragraph
│
├── Heading 2
│
├── Paragraph
│
├── Figure
│   └── Caption
│
├── Table
│
└── Footnote
```

---

# 17. Semantic Node Model

```typescript
type DocumentNode =
  | HeadingNode
  | ParagraphNode
  | ListNode
  | ImageNode
  | TableNode
  | QuoteNode
  | CaptionNode
  | FootnoteNode
  | PageBreakNode
```

Every node should preserve:

```typescript
{
  id: string;
  type: NodeType;
  content: string;
  order: number;
  page?: number;
  metadata?: Record<string, unknown>;
}
```

---

# 18. Rule-Based Document Reflow Engine

## Objective

Transform complex layout into a readable reading flow.

```text
Original
   ↓
Extract
   ↓
Classify
   ↓
Order
   ↓
Normalize
   ↓
Reflow
```

---

## Example

### Original

```text
┌───────────────┬───────────────┐
│ Heading       │               │
│               │ Figure        │
│ Paragraph     │               │
│ Paragraph     │ Caption       │
└───────────────┴───────────────┘
```

### Reflow

```text
HEADING

Paragraph

Paragraph

FIGURE

Caption
```

---

# 19. Reflow Rules

Example rule set:

```text
IF document has multiple text columns
THEN generate single reading flow

IF heading detected
THEN preserve heading hierarchy

IF image has nearby caption
THEN group image + caption

IF footer repeats across pages
THEN classify as page artifact

IF header repeats across pages
THEN classify as page artifact

IF paragraph exceeds configured visual width
THEN constrain reading width

IF table is detected
THEN preserve table relationship
```

---

# 20. Accessibility Analysis Engine

Before conversion:

```text
Document Accessibility
        ↓
Analyze
        ↓
Score
        ↓
Issues
```

---

## Accessibility Score

Example:

```text
Accessibility Score

82 / 100
━━━━━━━━━━━━━━━━

Typography       90
Structure        88
Reading Order    81
Spacing          76
Contrast         92
Media            65
```

### Important disclaimer

The score represents **document accessibility characteristics**.

It does not mean:

> "This document is suitable for every dyslexic reader."

---

# 21. Issue Detection

Example:

```text
⚠ Long text lines
Page 4

⚠ Dense paragraph
Page 12

⚠ Missing image description
Page 18

⚠ Inconsistent heading structure
Page 24
```

---

# 22. Before / After Accessibility

This should become a key product moment.

```text
BEFORE

Accessibility
61 / 100

        ↓

READABLE TRANSFORMATION

        ↓

AFTER

Accessibility
89 / 100
```

The user can inspect what changed.

---

# 23. Reading Profiles

Users can create presets.

## Default Profiles

### Standard

```text
System font
Normal spacing
Normal width
```

### Dyslexia Friendly

```text
Lexend
Larger font
Increased line height
Increased letter spacing
Reduced line length
```

### Focus

```text
Shorter reading window
Focus mode
Reduced visual distraction
```

### High Contrast

```text
High contrast
Clear text/background separation
```

---

# 24. Custom Profile

Controls:

```text
Font Family
Font Size
Line Height
Letter Spacing
Word Spacing
Paragraph Spacing
Content Width
Alignment
Background
Contrast
```

---

# 25. Reader Interface

## Desktop

```text
┌────────────┬────────────────────────┬──────────────┐
│ CONTENT    │ READING CANVAS         │ CONTROLS     │
│            │                        │              │
│ Chapter 1  │ Heading                │ Typography   │
│ Chapter 2  │                        │              │
│ Chapter 3  │ Paragraph...           │ Focus        │
│            │                        │              │
│ 3.1        │ Paragraph...           │ Ruler        │
│ 3.2        │                        │              │
│ 3.3        │ Figure                 │ TTS          │
└────────────┴────────────────────────┴──────────────┘
```

---

# 26. Mobile Reader

```text
┌─────────────────────────┐
│ ☰  Document       Aa ⋮ │
├─────────────────────────┤
│                         │
│ 3.2 Photosynthesis      │
│                         │
│ Paragraph...            │
│                         │
│ Paragraph...            │
│                         │
│ Figure                  │
│                         │
├─────────────────────────┤
│ Reading Controls        │
└─────────────────────────┘
```

Controls should open as a bottom sheet.

---

# 27. Typography Controls

```text
FONT

System
Lexend
Atkinson Hyperlegible
OpenDyslexic

SIZE

−────●────+

LINE HEIGHT

−────●────+

LETTER SPACING

−────●────+
```

Changes should update the reader immediately.

---

# 28. Focus Mode

Focus mode should support:

```text
1 line
3 lines
5 lines
```

This is already established accessibility behavior in Microsoft Immersive Reader, so ReadAble should treat it as a **baseline feature**, not claim it as novel. ([Microsoft Support][4])

---

# 29. Reading Ruler

```text
Reading Ruler
[ ON ]

Lines
1
2
3

Opacity
Low ─────●──── High
```

---

# 30. Text-to-Speech

Use platform/browser TTS where possible.

Controls:

```text
Previous
Play/Pause
Next

Speed:
0.5x
0.75x
1x
1.25x
1.5x
```

While speaking:

```text
The Industrial Revolution began
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

The active sentence should be highlighted.

---

# 31. Word Interaction

Selecting a word:

```text
┌──────────────────────────┐
│ photosynthesis            │
│                           │
│ 🔊 Listen                 │
│ 🔤 Syllables              │
│ 📖 Definition             │
│ ⭐ Save                   │
│ 📝 Note                   │
└──────────────────────────┘
```

---

# 32. Navigation

Reader navigation should support:

```text
Table of Contents
Page
Heading
Bookmark
Search
```

Search should highlight matches without destroying the reading context.

---

# 33. Notes & Highlighting

P1 feature.

Users can:

* highlight
* add note
* remove highlight
* navigate between highlights

Example:

```text
Highlights
──────────────
3 saved highlights

Page 4
Page 12
Page 24
```

---

# 34. My Documents

Dashboard:

```text
MY DOCUMENTS

Recent

Biology Chapter 3
PDF · 24 pages
Accessibility 82

Economics Research
PDF · 18 pages
Accessibility 74

Lecture Notes
DOCX · 12 pages
Accessibility 91
```

Filters:

```text
All
PDF
DOCX
EPUB
Recent
```

---

# 35. Export

## Primary outputs

```text
Readable Web
Accessible PDF
EPUB
```

Phase 2:

```text
DOCX
```

The core promise:

> **The transformed document should not require ReadAble to remain useful.**

This distinguishes ReadAble from a pure reader.

---

# 36. Accessibility Export

The export pipeline:

```text
Document
   ↓
Semantic Structure
   ↓
Reading Profile
   ↓
Accessible Layout
   ↓
Export
```

Exported document should attempt to preserve:

* headings
* paragraphs
* lists
* tables
* image relationships
* reading order
* metadata

---

# 37. Rule-Based Personalization

No AI.

The system can learn preferences through deterministic rules.

Example:

```text
IF user changes font size
3 times within a session

THEN ask:

"Save this as your reading profile?"
```

Another:

```text
IF user activates Focus Mode
for 3 consecutive sessions

THEN recommend:

"Save Focus Mode to your profile?"
```

Another:

```text
IF user always uses 1.25x TTS

THEN preselect 1.25x
```

This is **preference persistence**, not AI personalization.

---

# 38. Privacy Requirements

Documents can contain sensitive information.

Therefore:

### MVP principles

* do not use uploaded documents for model training
* do not send documents to third-party AI services
* encrypt stored documents
* provide document deletion
* provide session expiration
* minimize stored document metadata

### User controls

```text
Delete document
Delete all documents
Clear reading history
Download data
```

---

# 39. Security Requirements

* HTTPS
* secure upload validation
* MIME verification
* file size limits
* malware scanning where applicable
* isolated document processing
* access-controlled storage
* signed download URLs
* authentication
* authorization

Document processing should run in an isolated environment because uploaded files are untrusted input.

---

# 40. Performance Requirements

### Upload

Initial feedback:

```text
< 1 second
```

### Reader

UI interactions:

```text
< 100ms target
```

### Processing

Normal digital PDF:

```text
< 10 seconds target
```

Large/complex documents may process asynchronously.

---

# 41. Functional Requirements

| ID     | Requirement               | Priority |
| ------ | ------------------------- | -------- |
| FR-001 | Upload PDF                | P0       |
| FR-002 | Extract PDF text          | P0       |
| FR-003 | Detect document structure | P0       |
| FR-004 | Generate readable reflow  | P0       |
| FR-005 | Dyslexia-friendly profile | P0       |
| FR-006 | Typography customization  | P0       |
| FR-007 | Line spacing              | P0       |
| FR-008 | Letter spacing            | P0       |
| FR-009 | Content width             | P0       |
| FR-010 | Focus mode                | P0       |
| FR-011 | Reader navigation         | P0       |
| FR-012 | Save reading settings     | P0       |
| FR-013 | TTS                       | P1       |
| FR-014 | Reading ruler             | P1       |
| FR-015 | Accessibility score       | P1       |
| FR-016 | Before/after analysis     | P1       |
| FR-017 | Document library          | P1       |
| FR-018 | Highlight                 | P1       |
| FR-019 | Notes                     | P1       |
| FR-020 | EPUB export               | P1       |
| FR-021 | DOCX input                | P2       |
| FR-022 | EPUB input                | P2       |
| FR-023 | OCR                       | P2       |
| FR-024 | Image input               | P2       |
| FR-025 | PPTX input                | P2       |

---

# 42. Non-Functional Requirements

## Accessibility

* WCAG 2.2 AA-oriented
* keyboard navigation
* screen-reader support
* focus indicators
* semantic markup
* reduced-motion
* scalable typography

## Reliability

Target:

> ≥99% successful processing for supported standard PDFs.

## Privacy

User documents must be treated as private data.

## Scalability

Document processing should be asynchronous and independently scalable.

---

# 43. Technical Architecture

```text
                    FRONTEND
              Next.js + TypeScript
                       │
                       ▼
                    API
                    FastAPI
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      Document       User        Analytics
      Service       Service        Service
          │
          ▼
    Processing Queue
          │
    ┌─────┼─────┐
    ▼     ▼     ▼
  PDF    DOCX   EPUB
 Parser  Parser Parser
    │
    └─────┬─────┘
          ▼
   Semantic Document Model
          │
          ▼
   Accessibility Engine
          │
          ▼
   Reflow Engine
          │
          ▼
   Accessible Document
```

---

# 44. Suggested Technology Stack

## Frontend

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
Zustand
Framer Motion
```

## Backend

```text
FastAPI
Python
Pydantic
SQLAlchemy
PostgreSQL
```

## Document Processing

```text
PyMuPDF
python-docx
python-pptx
ebooklib
BeautifulSoup
```

## OCR

```text
Tesseract
```

## Storage

```text
S3-compatible object storage
```

## Queue

```text
Redis
Celery / RQ / equivalent worker system
```

---

# 45. Database Model

```text
User
 │
 ├── ReadingProfile
 │
 ├── Document
 │     │
 │     ├── DocumentVersion
 │     ├── AccessibilityReport
 │     └── Export
 │
 └── ReadingSession
```

---

## Document

```typescript
interface Document {
  id: string;
  userId: string;
  name: string;
  originalFormat: string;
  fileSize: number;
  pageCount: number;
  processingStatus: string;
  accessibilityScore?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## ReadingProfile

```typescript
interface ReadingProfile {
  id: string;
  name: string;

  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;

  contentWidth: number;
  backgroundColor: string;

  focusMode: boolean;
  focusLines: number;

  readingRuler: boolean;

  ttsSpeed: number;
}
```

---

# 46. MVP Definition

## MVP must contain

### Input

```text
PDF
```

### Processing

```text
Text extraction
Heading detection
Paragraph detection
Reading order
Basic structure
```

### Transformation

```text
Single-column reflow
Typography normalization
Readable line width
Paragraph spacing
```

### Reader

```text
Typography controls
Focus Mode
Navigation
Search
TTS
```

### Output

```text
Readable Web
PDF export
```

### Accessibility

```text
Accessibility score
Basic issue detection
```

---

# 47. MVP Explicitly Excludes

```text
❌ AI
❌ LLM
❌ AI summarization
❌ AI tutor
❌ Automatic dyslexia diagnosis
❌ Complex mathematical reconstruction
❌ Perfect image understanding
❌ Perfect table reconstruction
❌ Real-time collaboration
❌ Social features
```

---

# 48. Product Success Metrics

## Conversion Funnel

```text
Visitors
   ↓
Upload
   ↓
Processed
   ↓
Opened
   ↓
Read
   ↓
Customized
   ↓
Exported
```

---

## Primary Metrics

### Document Processing Success

Target:

> ≥90% of supported standard documents successfully processed in MVP.

### Reader Activation

Target:

> ≥70% of successfully processed documents opened in Reader.

### Customization

Target:

> ≥50% of active users use at least one reading customization.

### Export

Target:

> ≥20% of converted documents exported.

---

# 49. Research Metrics

If this becomes a thesis/academic project, add controlled experiments.

## Control

```text
Original PDF
```

## Experimental

```text
ReadAble transformed document
```

Measure:

```text
Reading time
Reading errors
Backtracking
Comprehension
Task completion
User satisfaction
```

---

# 50. Research Hypothesis

### H1

> Users complete reading tasks faster using the transformed document than the original document.

### H2

> Users report higher reading comfort using the transformed document.

### H3

> Users experience fewer navigation/backtracking difficulties using the reflowed document.

### H4

> User-controlled reading profiles improve perceived readability compared with a fixed accessibility configuration.

---

# 51. Accessibility Score Algorithm — MVP

The score can be rule-based.

Example:

```text
Score =

Typography        20%
Structure         20%
Reading Order     20%
Spacing           15%
Contrast          15%
Media             10%
```

Example:

```text
Typography
├── Font size
├── Line height
└── Text density

Structure
├── Heading hierarchy
├── Paragraph structure
└── Lists

Reading Order
├── Column order
├── Figure relationship
└── Page sequence
```

---

# 52. Before/After Example

### Original

```text
PAGE 12

2.3 Economic Growth

Economic growth is the increase in
the production of goods and services
within an economy over a period...

              Figure 2.1

        [CHART]

Source: BPS
```

### ReadAble

```text
2.3 Economic Growth

Economic growth is the increase
in the production of goods and
services within an economy over
a period...

FIGURE 2.1

[CHART]

Source:
BPS
```

The information is preserved.

The presentation is changed.

---

# 53. UX Copy

## Homepage

> **Make every document easier to read.**

Supporting copy:

> Transform PDFs and other supported documents into a personalized reading experience designed around your needs.

---

## Upload

> **Drop your document here**

> or browse from your device.

---

## Processing

> **We're preparing your document for reading.**

---

## Success

> **Your document is ready to read.**

---

## Accessibility

> **See how your document can be improved.**

---

## Export

> **Take your readable document with you.**

---

# 54. Design Direction

The UI should feel:

```text
Calm
Accessible
Minimal
Academic
Trustworthy
Friendly
```

Avoid:

```text
Overly playful
Excessive animation
High visual density
Aggressive gradients
Too many floating elements
```

The reader itself should prioritize content over interface chrome.

---

# 55. Design System

## UI Font

Recommended:

```text
Inter
Geist
```

## Reading Fonts

Provide:

```text
System
Lexend
Atkinson Hyperlegible
OpenDyslexic
```

The user chooses the reading font; it should not be imposed.

---

## Colors

Suggested direction:

```text
Background:
#F8F7F3

Surface:
#FFFFFF

Text:
#1F2933

Primary:
#426B69

Border:
#D8DAD6

Muted:
#6B7280
```

The exact colors should remain configurable during visual design testing.

---

# 56. Responsive Layout

## Desktop

```text
Sidebar
+
Reading Canvas
+
Controls
```

## Tablet

```text
Sidebar
+
Reading Canvas

Controls → Drawer
```

## Mobile

```text
Reading Canvas

Navigation → Drawer
Controls → Bottom Sheet
```

---

# 57. Product Differentiation

ReadAble should **not** compete feature-by-feature with Microsoft or Adobe.

Instead:

### Existing tools

```text
Document
   ↓
Reader
```

### ReadAble

```text
Document
   ↓
Analyze
   ↓
Transform
   ↓
Personalize
   ↓
Read
   ↓
Export
```

This is the central product strategy.

---

# 58. Product Moat

The long-term defensibility should come from:

### 1. Document Structure Engine

A normalized representation of different document formats.

### 2. Reflow Rules

A growing rule system for complex layouts.

### 3. Accessibility Analysis

Consistent evaluation of document structure.

### 4. Reading Profiles

Portable accessibility preferences.

### 5. Export Pipeline

Transformation into reusable accessible formats.

---

# 59. Roadmap

## Phase 0 — Foundation

```text
Project setup
Design system
Authentication
Database
Storage
```

## Phase 1 — Reader

```text
PDF viewer
Navigation
Typography
Reading settings
```

## Phase 2 — Document Parser

```text
PDF extraction
Structure detection
Reading order
Semantic model
```

## Phase 3 — Reflow

```text
Single-column layout
Paragraph normalization
Heading hierarchy
Figure handling
```

## Phase 4 — Accessibility

```text
Accessibility score
Issue detection
Before/after analysis
```

## Phase 5 — Reading Assistance

```text
Focus mode
Reading ruler
TTS
Highlight
Bookmarks
```

## Phase 6 — Export

```text
Readable PDF
EPUB
Accessible HTML
```

## Phase 7 — Multi-format

```text
DOCX
EPUB
PPTX
OCR
Images
```

---

# 60. Definition of Done — MVP

The MVP is complete when a user can:

```text
1. Open ReadAble
        ↓
2. Upload a standard PDF
        ↓
3. Wait for processing
        ↓
4. See accessibility analysis
        ↓
5. Open transformed document
        ↓
6. Navigate headings
        ↓
7. Change font
        ↓
8. Change spacing
        ↓
9. Enable Focus Mode
        ↓
10. Use TTS
        ↓
11. Save reading preferences
        ↓
12. Export readable PDF
```

without requiring AI.

---

# 61. Final Product Definition

## Product

**ReadAble**

## Category

**Universal Accessible Document Transformation Platform**

## Core Problem

> Complex digital documents are not always optimized for comfortable reading.

## Core Solution

> Transform supported documents into structured, customizable, accessible reading experiences while preserving their original information.

## Core Technology

```text
Document Parsing
+
Semantic Structure
+
Rule-Based Accessibility Analysis
+
Rule-Based Document Reflow
+
Reading Profiles
```

## No AI Required

```text
✓ Deterministic
✓ Explainable
✓ Testable
✓ Reproducible
✓ Suitable for academic research
```

## Core Differentiator

> **ReadAble doesn't just help users read a document. It transforms the document into a format that is easier to read.**

---

## 62. Competitive Positioning Statement

> **Unlike traditional PDF readers and accessibility extensions, ReadAble is designed as a document transformation pipeline: it analyzes a supported document's structure, reconstructs its reading flow, applies user-selected accessibility preferences, and produces a reusable readable version.**

This distinction is especially important because **PDF reflow and reading customization are already established capabilities** in products such as Adobe Acrobat and Microsoft Immersive Reader. ([Adobe Help Center][2])

---

## 63. Reference Benchmark Sources

* [Microsoft Immersive Reader — official documentation](https://support.microsoft.com/en-us/accessibility/word/use-immersive-reader-in-word?utm_source=chatgpt.com) — typography, spacing, line focus, reading preferences, dan accessibility features. ([Microsoft Support][1])
* [Microsoft Immersive Reader — Microsoft Learn](https://learn.microsoft.com/en-us/training/educator-center/product-guides/immersive-reader/?utm_source=chatgpt.com) — positioning untuk dyslexia dan learning differences. ([Microsoft Learn][5])
* [Adobe Acrobat Accessibility](https://helpx.adobe.com/reader/desktop/accessibility-features.html?utm_source=chatgpt.com) — PDF accessibility dan Reflow. ([Adobe Help Center][2])
* [Texthelp OrbitNote](https://orbit.texthelp.com/?utm_source=chatgpt.com) — benchmark accessible PDF/OCR workflow. ([support.texthelp.com][6])
* [Helperbird](https://www.helperbird.com/?utm_source=chatgpt.com) — benchmark dyslexia-friendly reading, PDF, OCR, dan export workflow. ([Helperbird][7])

[1]: https://support.microsoft.com/en-gb/topic/use-immersive-reader-in-microsoft-edge-78a7a17d-52e1-47ee-b0ac-eff8539015e1?utm_source=chatgpt.com "Use Immersive Reader in Microsoft Edge - Microsoft Support"
[2]: https://helpx.adobe.com/reader/desktop/accessibility-features.html?utm_source=chatgpt.com "Accessibility features, Adobe Acrobat Reader | Acrobat Reader"
[3]: https://academy.texthelp.com/orbitnote-classic/updates/?utm_source=chatgpt.com "Latest features and highlights in OrbitNote Classic | Texthelp"
[4]: https://support.microsoft.com/en-us/education/onenote/use-line-focus-in-immersive-reader-for-office-for-the-web-and-onenote?utm_source=chatgpt.com "Use Line focus in Immersive Reader for Office for the web and OneNote | Microsoft Support"
[5]: https://learn.microsoft.com/id-id/training/educator-center/product-guides/immersive-reader/?utm_source=chatgpt.com "Panduan produk Pembaca Imersif - Microsoft Learn Educator Center | Microsoft Learn"
[6]: https://support.texthelp.com/help/orbitnote-revamp-getting-started-with-orbitnote?utm_source=chatgpt.com "Getting Started with OrbitNote Modern | Support"
[7]: https://www.helperbird.com/help/how-to-share-pdfs-with-helperbird/?utm_source=chatgpt.com "How to Share and Export PDFs with Helperbird"
