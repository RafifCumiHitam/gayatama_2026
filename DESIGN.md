# `DESIGN.md`

````md
# ReadAble — Design System & UI Specification

> Version: 1.0
> Status: Design Specification
> Product: ReadAble
> Reference: LofiWireframe
> Platform: Responsive Web Application

---

# 01. Design Overview

ReadAble is a Universal Accessible Document Converter.

The interface should communicate:

- Calm
- Accessible
- Minimal
- Editorial
- Trustworthy
- Functional
- Low cognitive load

The visual design must support the product's primary purpose:

> Help users transform and read documents without creating additional visual distraction.

The UI should therefore prioritize:

1. Content
2. Reading comfort
3. Navigation
4. User control
5. Accessibility

over decorative visual elements.

---

# 02. Design Philosophy

## 2.1 Calm Interface

The interface should avoid excessive:

- gradients
- shadows
- animations
- decorative illustrations
- visual noise
- competing colors

The reader should feel closer to a digital reading environment than a SaaS dashboard.

---

## 2.2 Editorial Interface

ReadAble should visually resemble:

- digital publishing tools
- document editors
- reading applications
- academic research tools

rather than:

- social media
- gaming interfaces
- AI chat applications

---

## 2.3 Progressive Disclosure

Do not expose every control at once.

Primary workflow:

Upload
→ Process
→ Profile
→ Read
→ Analyze
→ Export

Advanced settings should remain inside dedicated panels.

---

# 03. Design Direction

## Visual Keywords

```text
Calm
Editorial
Accessible
Structured
Neutral
Human
Academic
Minimal
Functional
````

---

# 04. Layout Philosophy

The application uses a strong grid-based layout.

Desktop screens primarily use:

```text
┌───────────────────────────────────────────────┐
│ Header / Toolbar                              │
├───────────────┬───────────────────┬───────────┤
│ Navigation    │ Main Content      │ Context   │
│ / Controls    │                   │ Panel     │
└───────────────┴───────────────────┴───────────┘
```

The wireframe establishes this pattern consistently across Processing, Reader, Score, and Export screens.

---

# 05. Grid System

## Desktop

Base:

```text
12-column conceptual grid
```

Recommended content width:

```text
max-width: 1440px
```

Application shell:

```text
100vw × 100vh
```

---

## Reader

Recommended:

```text
Left controls:
220–260px

Reading canvas:
flexible

Right contents:
180–240px
```

Example:

```text
┌────── 240px ──────┬─────── flexible ───────┬── 220px ──┐
│ Controls           │ Reading Canvas          │ Contents  │
└────────────────────┴────────────────────────┴───────────┘
```

---

# 06. Responsive Breakpoints

```text
Mobile
< 640px

Tablet
640px – 1023px

Desktop
1024px – 1439px

Large Desktop
≥ 1440px
```

---

# 07. Mobile Layout Strategy

Desktop:

```text
Controls + Reader + Contents
```

Mobile:

```text
Reader
  ↓
Controls → Bottom Sheet
Contents → Drawer
```

Never compress all three desktop columns into one tiny viewport.

---

# 08. Color System

The wireframe uses a deliberately monochromatic palette built around warm neutral surfaces and dark text. This should remain the visual foundation.

## Base Colors

```css
--color-bg:
#F4F2EE;

--color-surface:
#FFFFFF;

--color-surface-muted:
#EDECEA;

--color-surface-subtle:
#E5E3DF;

--color-text:
#1C1C1C;

--color-text-secondary:
#555555;

--color-text-muted:
#888888;

--color-text-disabled:
#AAAAAA;

--color-border:
#AAAAAA;

--color-border-light:
#BBBBB9;
```

---

# 09. Semantic Colors

Semantic colors should be introduced carefully.

## Success

```text
#3F5F4A
```

## Warning

```text
#806B3D
```

## Error

```text
#713F3F
```

## Info

```text
#465A68
```

Semantic colors should never dominate the interface.

They should primarily communicate state.

---

# 10. Dark Mode

Dark mode is not part of the initial visual direction.

If implemented later:

```text
Background:
#171717

Surface:
#202020

Surface Muted:
#292929

Text:
#F4F2EE

Secondary:
#C8C6C1

Border:
#555555
```

The reading canvas must remain independently configurable.

---

# 11. Typography

## UI Font

Recommended:

```text
Inter
```

Fallback:

```text
system-ui
sans-serif
```

---

# 12. Reading Fonts

The reader must support multiple fonts.

Recommended options:

```text
System
Lexend
Atkinson Hyperlegible
OpenDyslexic
```

Important:

The application must not claim that one font is universally best for dyslexia.

The user controls the reading environment.

---

# 13. Type Scale

## Display

```text
56px
line-height: 1.05
weight: 700
```

## H1

```text
40px
line-height: 1.1
weight: 700
```

## H2

```text
28px
line-height: 1.2
weight: 700
```

## H3

```text
20px
line-height: 1.3
weight: 700
```

## Body

```text
16px
line-height: 1.7
weight: 400
```

## Small

```text
13px
line-height: 1.5
```

## Caption

```text
11px
line-height: 1.4
```

## Micro Label

```text
10px
letter-spacing: 0.15em
text-transform: uppercase
```

The wireframe heavily uses small uppercase labels for metadata and section identifiers. Preserve this characteristic.

---

# 14. Reading Typography

Default readable profile:

```text
Font size:
18px

Line height:
1.8

Letter spacing:
0.02–0.04em

Paragraph spacing:
1.25–1.5em

Content width:
60–72 characters per line
```

The reader should not use overly wide text columns.

---

# 15. Spacing System

Base unit:

```text
4px
```

Scale:

```text
4
8
12
16
20
24
32
40
48
64
80
96
```

Recommended usage:

```text
4px  → micro spacing
8px  → icon/text
12px → controls
16px → components
24px → cards
32px → sections
48px → major sections
64px → page layout
96px → hero spacing
```

---

# 16. Border System

The wireframe strongly uses borders instead of shadows.

Default:

```css
border: 1px dashed #AAAAAA;
```

Interactive selected state:

```css
border: 1px solid #1C1C1C;
```

Avoid heavy shadows.

Cards should generally be separated using:

* border
* spacing
* surface contrast

rather than elevation.

---

# 17. Border Radius

The wireframe has an intentionally sharp editorial appearance.

Default:

```text
border-radius: 0px
```

Optional exception:

```text
Small controls:
2–4px
```

Avoid:

```text
rounded-xl
rounded-2xl
pill-shaped cards
```

unless specifically required for accessibility or a secondary component.

---

# 18. Buttons

## Primary Button

```text
Background:
#1C1C1C

Text:
#F4F2EE

Border:
#1C1C1C
```

Example:

```text
┌──────────────────────────┐
│   UPLOAD DOCUMENT →      │
└──────────────────────────┘
```

Typography:

```text
11px
uppercase
letter-spacing: 0.15em
font-weight: 600
```

---

# 19. Secondary Button

```text
Background:
transparent

Text:
#1C1C1C

Border:
1px dashed #1C1C1C
```

Hover:

```text
background:
#EDECEA
```

---

# 20. Button States

Required:

```text
Default
Hover
Focus
Active
Disabled
Loading
```

Keyboard focus:

```text
outline:
2px solid #1C1C1C

outline-offset:
3px
```

Never remove focus indication.

---

# 21. Input Components

Inputs should use:

```text
white / warm surface
1px border
4px max radius
comfortable padding
clear label
```

Avoid floating labels.

Use explicit labels.

---

# 22. File Upload Component

The Landing screen contains the main upload drop zone.

Structure:

```text
┌─────────────────────────────────────────┐
│                                         │
│                    ↑                    │
│                                         │
│      Drag & Drop your document          │
│           or click to browse            │
│                                         │
│ ─────────────── Supports ─────────────  │
│                                         │
│ PDF DOCX PPTX EPUB JPG PNG TXT          │
│                                         │
└─────────────────────────────────────────┘
```

The wireframe uses a dashed border and muted warm-gray surface for this component.

---

# 23. Upload States

## Idle

```text
Dashed border
Neutral surface
Upload icon
```

## Hover

```text
Background:
#EDECEA

Border:
#1C1C1C
```

## Drag Active

```text
Border:
solid #1C1C1C

Background:
#E5E3DF
```

## Uploading

Show:

```text
Filename
File size
Progress
Cancel
```

## Success

Show:

```text
✓ Document uploaded
```

## Error

Show:

```text
Unable to process this file.
```

---

# 24. Tags / Format Chips

Used for:

```text
PDF
DOCX
PPTX
EPUB
JPG
PNG
TXT
```

Style:

```text
border: 1px dashed #AAAAAA
font-size: 11px
padding: 2px 8px
```

Do not use colorful badges.

---

# 25. Header

Landing header:

```text
┌────────────────────────────────────────────────────┐
│ ReadAble        Product  How It Works  About   Sign In │
└────────────────────────────────────────────────────┘
```

Height:

```text
64–72px
```

Bottom border:

```text
1px dashed #AAAAAA
```

---

# 26. Logo

Wordmark:

```text
ReadAble
```

Style:

```text
font-size:
14px

font-weight:
700

letter-spacing:
0.25em

text-transform:
uppercase
```

The logo should remain typographic in MVP.

---

# 27. Landing Screen

Screen ID:

```text
01 / Landing
```

Primary goal:

> Get the user to upload a document.

Layout:

```text
┌──────────────────────────────────────────────────┐
│ HEADER                                            │
├───────────────────────────────────┬──────────────┤
│                                   │ HOW IT WORKS │
│              HERO                 │              │
│                                   │ 01 Upload    │
│        headline                   │ 02 Parse     │
│        description                │ 03 Reflow    │
│                                   │ 04 Profile   │
│        upload zone                │ 05 Export    │
│                                   │              │
│        CTA                        │ SCORE        │
└───────────────────────────────────┴──────────────┘
```

---

# 28. Landing Hero

Headline:

```text
Turn any document
into a reading
experience that
works for you.
```

Supporting text:

```text
Upload a PDF, DOCX, or image.
We parse the structure, reflow the layout,
and produce an accessible version tailored
to how you read.
```

CTA:

```text
UPLOAD DOCUMENT →
```

---

# 29. Processing Screen

Screen ID:

```text
02 / Processing
```

Goal:

> Communicate that the document is being transformed.

Layout:

```text
┌─────────────────────────────────────┬──────────────┐
│                                     │              │
│          Processing title           │  Structure   │
│                                     │              │
│          Pipeline                   │  Tree        │
│                                     │              │
│          Progress                   │              │
│                                     │              │
└─────────────────────────────────────┴──────────────┘
```

---

# 30. Processing Pipeline

Use sequential status.

```text
✓ Text extracted
✓ Structure detected
✓ Reading order parsed
✓ Tables detected
✓ Images located
⟳ Accessibility layout generated
○ Export formats prepared
```

States:

```text
Completed
Active
Pending
Error
```

---

# 31. Processing Animation

Animation should be subtle.

Allowed:

```text
spinner
progress bar
opacity pulse
```

Avoid:

```text
large moving illustrations
bouncing elements
continuous decorative animations
```

Respect:

```text
prefers-reduced-motion
```

---

# 32. Document Structure Preview

Right-side panel.

Example:

```text
H1  Economic Growth

  P   Paragraph ×3

  H2  2.1 Introduction

    P   Paragraph ×2
    IMG Figure 1.1
    CAP Caption

  H2  2.2 Methods

    P   Paragraph ×4
    TBL Table 1
```

Use indentation to communicate hierarchy.

---

# 33. Profile Screen

Screen ID:

```text
03 / Profile
```

Goal:

> Let users choose their reading environment.

Heading:

```text
Choose how you read.
```

Supporting copy:

```text
Every person reads differently.
Select the profile closest to your needs —
you can adjust later.
```

---

# 34. Profile Cards

Profiles:

```text
Standard
Dyslexia Friendly
Focus Reading
High Contrast
Custom
```

Desktop:

```text
3-column grid
```

Tablet:

```text
2-column grid
```

Mobile:

```text
1-column stack
```

---

# 35. Selected Profile

Default:

```text
dashed border
transparent background
```

Selected:

```text
solid 1px #1C1C1C
background #EDECEA
```

Radio indicator:

```text
3px × 3px selected square
```

The visual language intentionally follows the wireframe's geometric style.

---

# 36. Profile Preview

Right panel:

```text
LIVE PREVIEW
```

The preview must update immediately when the profile changes.

Example:

```text
Chapter 2

2.3 Economic Growth

Economic growth is the increase
in the production of goods and
services...
```

Preview should demonstrate:

* font
* size
* line height
* spacing
* content width

---

# 37. Reader Screen

Screen ID:

```text
04 / Reader
```

This is the most important screen.

Reader layout:

```text
┌───────────────────────────────────────────────────────┐
│ TOOLBAR                                               │
├──────────────┬─────────────────────────┬──────────────┤
│ Controls     │                         │ Contents     │
│              │    Reading Canvas       │              │
│ Typography   │                         │ Chapter 1    │
│ Reading Aids │    Document             │ Chapter 2    │
│ Background   │                         │ Chapter 2.3  │
│ Columns      │                         │ Chapter 3    │
│              │                         │              │
└──────────────┴─────────────────────────┴──────────────┘
```

---

# 38. Reader Toolbar

Contains:

```text
ReadAble
Document name
Page indicator
Previous
Next
Score & Export
```

Toolbar height:

```text
48–56px
```

---

# 39. Reader Controls Sidebar

Sections:

```text
Typography
Reading Aids
Background
Columns
```

Future:

```text
Theme
TTS
Highlight
Bookmarks
```

Controls should be grouped with section labels.

---

# 40. Typography Controls

Controls:

```text
Font Size
Line Height
Font Family
Letter Spacing
Word Spacing
```

Use sliders for continuous values.

Use select/buttons for discrete options.

---

# 41. Reading Aids

Controls:

```text
Reading Ruler
Highlight Active Paragraph
Hide Footnotes
Text-to-Speech
Focus Mode
```

Each toggle should clearly communicate:

```text
ON
OFF
```

Never rely only on color.

---

# 42. Background Presets

Wireframe proposes:

```text
White
Warm
Green tint
Purple tint
Dark
```

The final UI should present them as accessible color swatches.

Each swatch requires:

```text
aria-label
```

Example:

```text
"Warm reading background"
```

---

# 43. Column Width

Options:

```text
Narrow
Wide
Full
```

Default:

```text
Narrow
```

Recommended readable width:

```text
45–75 characters per line
```

---

# 44. Reading Canvas

Canvas background:

```text
#EDECEA
```

Document surface:

```text
#F4F2EE
```

This creates a subtle separation between:

```text
application
```

and

```text
document
```

---

# 45. Document Content

The reader should preserve semantic hierarchy.

Example:

```text
Chapter 2

2.3 Economic Growth

Paragraph...

Paragraph...

KEY CONCEPT

Definition...

Figure 2.1

Factors Affecting Growth

— Capital accumulation
— Technological progress
— Labour force growth
```

---

# 46. Content Width

Recommended:

```text
max-width:
640–720px
```

The document should remain centered.

---

# 47. Paragraph Rules

Default:

```text
margin-bottom:
1.4em
```

Avoid:

```text
fully justified text
```

Default alignment:

```text
left
```

---

# 48. Heading Rules

H1:

```text
28–40px
bold
tight line-height
```

H2:

```text
20–28px
bold
```

H3:

```text
17–20px
bold
```

Headings should have sufficient separation from preceding content.

---

# 49. Images

Images should:

```text
max-width: 100%
height: auto
```

Captions should be visually separated but remain semantically associated.

Example:

```text
[ FIGURE ]

Figure 2.1 — GDP Growth 2020–2025
Source: BPS
```

---

# 50. Tables

Tables should not simply be converted into screenshots.

Desktop:

```text
native semantic table
```

Mobile:

```text
horizontal scroll
```

or

```text
responsive stacked representation
```

depending on data complexity.

---

# 51. Reading Ruler

When enabled:

```text
┌─────────────────────────────────────────┐
│                                         │
│ current reading region                 │
│                                         │
└─────────────────────────────────────────┘
```

The ruler must:

* follow scroll position
* remain non-interactive
* not block text selection
* not block TTS
* respect reduced motion

---

# 52. Focus Mode

Modes:

```text
1 line
3 lines
5 lines
```

Inactive content:

```text
reduced opacity
```

Active content:

```text
full contrast
```

Never reduce contrast below accessible levels.

---

# 53. Accessibility Score Screen

Screen ID:

```text
05 / Score
```

Goal:

> Show how the document performed against ReadAble's accessibility rules.

Layout:

```text
┌──────────────┬──────────────────────────┬────────────┐
│ Score        │ Issues                   │ Page Score │
│              │                          │            │
│ 78 / 100     │ ⚠ Paragraph length       │ Pg 4       │
│              │ ⚠ Contrast               │ Pg 8       │
│ Checklist    │ ✕ Missing alt text       │ Pg 12      │
│              │                          │            │
└──────────────┴──────────────────────────┴────────────┘
```

---

# 54. Score Visualization

Primary:

```text
78
out of 100
```

Avoid overly decorative circular charts.

A large numeric score is preferred because it is:

* readable
* scannable
* accessible
* consistent with the wireframe

---

# 55. Score Categories

```text
Typography
Heading Structure
Paragraph Length
Color Contrast
Table Structure
Image Description
Reading Order
Footnote Linkage
```

Each should have:

```text
✓ Pass
⚠ Warning
✕ Failure
```

Do not communicate state using color alone.

---

# 56. Issues

Each issue card contains:

```text
Severity
Page
Description
View in document
Auto-fix
```

Example:

```text
⚠ PAGE 12

3 paragraphs exceed 80 words.
Consider splitting.

[ View in document ]
[ Auto-fix ]
```

---

# 57. Page Score

Use compact horizontal bars.

```text
Pg 04  █████████░ 92
Pg 08  ████████░░ 78
Pg 12  ██████░░░░ 60
```

The exact visual can use the same monochromatic system.

---

# 58. Export Screen

Screen ID:

```text
06 / Export
```

Heading:

```text
Your document is ready.
```

Supporting copy:

```text
Choose a format to download,
or read it directly in the browser.
```

---

# 59. Before / After Comparison

The export page should emphasize transformation.

```text
┌────────────────────┐    ┌────────────────────┐
│ ORIGINAL            │    │ ACCESSIBLE VERSION │
│                     │    │                    │
│ research-paper.pdf  │ →  │ research-paper.*   │
│                     │    │                    │
│ Score: 54           │    │ Score: 78          │
└────────────────────┘    └────────────────────┘
```

This is a core product moment.

---

# 60. Export Format Cards

Formats:

```text
PDF
EPUB
DOCX
HTML
```

Each card:

```text
FORMAT
Title
Description
Filename
Export button
```

---

# 61. Export States

```text
Ready
Generating
Complete
Failed
```

Generating:

```text
Preparing accessible PDF...
```

Complete:

```text
✓ Export ready
DOWNLOAD
```

---

# 62. Navigation Model

Primary public navigation:

```text
Product
How It Works
About
Sign In
```

Authenticated navigation:

```text
Dashboard
Documents
Profiles
Settings
```

Reader navigation:

```text
Contents
Search
Bookmarks
```

---

# 63. Icons

Use a consistent icon system.

Recommended:

```text
Lucide Icons
```

Style:

```text
1.5–2px stroke
16–20px
```

Icons should support text, not replace important text labels.

---

# 64. Icon Rules

Good:

```text
🔊 Text-to-Speech
```

Better in implementation:

```text
[volume icon] Text-to-Speech
```

Avoid:

```text
[volume icon]
```

without accessible label.

---

# 65. Accessibility Requirements

The design itself must be accessible.

Target:

```text
WCAG 2.2 AA
```

---

# 66. Keyboard Navigation

Every interactive element must be reachable using:

```text
Tab
Shift + Tab
Enter
Space
Arrow keys
Escape
```

Where appropriate.

---

# 67. Focus Management

When opening:

```text
Drawer
Modal
Bottom Sheet
Settings panel
```

focus should move to the newly opened context.

When closed:

```text
focus returns to triggering element
```

---

# 68. Screen Reader Requirements

Use semantic elements:

```html
<header>
<nav>
<main>
<aside>
<article>
<section>
<footer>
```

Avoid building the entire interface from:

```html
<div>
```

---

# 69. Color Accessibility

Do not communicate:

```text
success = green
warning = yellow
error = red
```

alone.

Always combine:

```text
icon
+
text
+
color
```

---

# 70. Motion

Default animation:

```text
120–200ms
```

Use:

```text
opacity
transform
background
border
```

Avoid:

```text
large scale
bounce
parallax
continuous movement
```

For:

```text
prefers-reduced-motion: reduce
```

disable non-essential motion.

---

# 71. Empty States

## No Documents

```text
No documents yet.

Upload your first document
to create a readable version.

[ Upload Document ]
```

---

# 72. Error States

Errors should explain:

1. What happened
2. Why it happened
3. What the user can do

Example:

```text
We couldn't reconstruct this document.

The PDF contains a complex layout
that ReadAble cannot currently interpret.

Try another PDF or continue with
the original document.

[ Try Another File ]
```

---

# 73. Loading States

Avoid generic:

```text
Loading...
```

Prefer contextual messages:

```text
Extracting text...
Detecting structure...
Rebuilding reading order...
Preparing readable layout...
```

---

# 74. Toasts

Use only for:

```text
Profile saved
Highlight added
Export complete
Document deleted
```

Avoid using toast for critical errors.

---

# 75. Modal Rules

Modals should be reserved for:

```text
Delete confirmation
Export options
Unsaved changes
Important warnings
```

Do not use modals for normal settings.

---

# 76. Component Architecture

Suggested component hierarchy:

```text
components/
│
├── layout/
│   ├── AppShell
│   ├── Header
│   └── Sidebar
│
├── upload/
│   ├── UploadDropzone
│   ├── FileStatus
│   └── FormatTags
│
├── processing/
│   ├── ProcessingPipeline
│   ├── ProgressBar
│   └── StructureTree
│
├── profile/
│   ├── ProfileCard
│   ├── ProfileGrid
│   └── ProfilePreview
│
├── reader/
│   ├── ReaderShell
│   ├── ReaderToolbar
│   ├── ReaderControls
│   ├── ReadingCanvas
│   ├── ContentsPanel
│   ├── ReadingRuler
│   └── FocusMode
│
├── accessibility/
│   ├── ScoreCard
│   ├── CheckList
│   ├── IssueCard
│   └── PageScore
│
└── export/
    ├── BeforeAfter
    ├── ExportCard
    └── ExportStatus
```

---

# 77. Component States

Every major component should define:

```text
default
hover
focus
active
selected
disabled
loading
error
success
```

---

# 78. Design Tokens

Example:

```css
:root {
  --bg: #F4F2EE;
  --surface: #FFFFFF;
  --surface-muted: #EDECEA;
  --surface-subtle: #E5E3DF;

  --text: #1C1C1C;
  --text-secondary: #555555;
  --text-muted: #888888;
  --text-disabled: #AAAAAA;

  --border: #AAAAAA;
  --border-light: #BBBBB9;

  --success: #3F5F4A;
  --warning: #806B3D;
  --error: #713F3F;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

---

# 79. Tailwind Mapping

Recommended Tailwind utility style:

```text
bg-[#F4F2EE]
bg-[#EDECEA]
bg-[#FFFFFF]

text-[#1C1C1C]
text-[#555555]
text-[#888888]

border-[#AAAAAA]
border-dashed
```

The existing wireframe already follows this visual token approach.

---

# 80. Interaction Rules

## Upload

```text
Click
→ file picker

Drag
→ active dropzone

Drop
→ process
```

## Profile

```text
Click card
→ selected

Selected
→ live preview update
```

## Reader

```text
Change slider
→ update immediately

Toggle ruler
→ display immediately

Change background
→ update immediately
```

## Export

```text
Click format
→ generate

Generation complete
→ download
```

---

# 81. Reader State Persistence

The application should persist:

```text
font
font size
line height
letter spacing
background
column width
focus mode
reading ruler
TTS speed
```

Profile data should be stored independently from the document.

---

# 82. Design-to-Development Mapping

Wireframe:

```text
01 / Landing
```

Implementation:

```text
LandingPage
```

Wireframe:

```text
02 / Processing
```

Implementation:

```text
ProcessingPage
```

Wireframe:

```text
03 / Profile
```

Implementation:

```text
ProfilePage
```

Wireframe:

```text
04 / Reader
```

Implementation:

```text
ReaderPage
```

Wireframe:

```text
05 / Score
```

Implementation:

```text
AccessibilityPage
```

Wireframe:

```text
06 / Export
```

Implementation:

```text
ExportPage
```

---

# 83. Routing

Recommended:

```text
/
```

Landing

```text
/convert
```

Upload

```text
/processing/:documentId
```

Processing

```text
/profile/:documentId
```

Profile selection

```text
/read/:documentId
```

Reader

```text
/score/:documentId
```

Accessibility report

```text
/export/:documentId
```

Export

---

# 84. Mobile Navigation

Mobile reader:

```text
┌─────────────────────────────┐
│ ← ReadAble       Aa   ⋮     │
├─────────────────────────────┤
│                             │
│       READING CANVAS        │
│                             │
│                             │
│                             │
├─────────────────────────────┤
│ Controls                    │
└─────────────────────────────┘
```

Controls:

```text
bottom sheet
```

Contents:

```text
right drawer
```

---

# 85. Desktop Reader Keyboard Shortcuts

Recommended:

```text
Ctrl/Cmd + F
Search

Space
Play/Pause TTS

Arrow Up/Down
Scroll

Page Up/Down
Page navigation

Ctrl/Cmd + +
Increase font

Ctrl/Cmd + -
Decrease font

R
Toggle reading ruler

F
Toggle focus mode

Esc
Close panel
```

Shortcuts must not interfere with browser/system shortcuts where inappropriate.

---

# 86. Content Density

The application should maintain low information density.

Target:

```text
1 primary action
per visual section
```

Avoid:

```text
multiple competing CTAs
dense dashboards
large metric walls
```

---

# 87. Visual Hierarchy

Priority order:

```text
1. Page purpose
2. Primary action
3. Main content
4. Secondary controls
5. Metadata
```

Example:

```text
Your document is ready.
        ↓
Choose format.
        ↓
PDF / EPUB / DOCX / HTML
        ↓
Metadata
```

---

# 88. Do Not Introduce

The implementation should not introduce:

```text
❌ Gradient hero
❌ Glassmorphism
❌ Large shadows
❌ Excessive rounded cards
❌ AI chat widget
❌ Floating assistant
❌ Decorative illustrations everywhere
❌ Neon colors
❌ Excessive animations
```

These conflict with the established wireframe direction.

---

# 89. Design Quality Checklist

Before shipping a screen:

## Visual

* [ ] Grid aligned
* [ ] Consistent spacing
* [ ] Correct typography
* [ ] No unnecessary decoration
* [ ] Correct border style
* [ ] Correct surface hierarchy

## Accessibility

* [ ] Keyboard accessible
* [ ] Focus visible
* [ ] Screen reader labels
* [ ] Contrast checked
* [ ] Color not sole indicator
* [ ] Reduced motion supported

## UX

* [ ] Primary action obvious
* [ ] Loading state exists
* [ ] Error state exists
* [ ] Empty state exists
* [ ] Success state exists
* [ ] Mobile layout tested

---

# 90. Design Acceptance Criteria

The implementation is considered visually aligned with the wireframe when:

1. The six major screens retain the same information architecture.
2. The warm monochrome palette is preserved.
3. Dashed borders remain a primary visual language.
4. Typography remains editorial and minimal.
5. Reader content remains the visual priority.
6. Controls are grouped rather than scattered.
7. Desktop uses multi-panel layouts.
8. Mobile converts panels into drawers/bottom sheets.
9. No unnecessary decorative UI is introduced.
10. Accessibility remains a first-class design requirement.

---

# 91. Final Design Principle

The entire product should follow one rule:

> **The interface should disappear when the user starts reading.**

ReadAble is not supposed to impress users with visual complexity.

It should make the document feel:

```text
simpler
calmer
clearer
more controllable
```

The best UI state is one where the user stops thinking about the interface and focuses on the document.

````