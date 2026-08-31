import re
from typing import List, Tuple
from app.services.document_analyzer.models import AnalyzedBlock, BlockClassification


class HeadingHierarchyEngine:
    """Infers heading levels (1, 2, 3) using numbering patterns or relative font size rankings."""

    def determine_heading_level(
        self, block: AnalyzedBlock, all_headings: List[AnalyzedBlock]
    ) -> Tuple[int, List[str]]:
        text = (block.text or "").strip()
        evidence: List[str] = []

        # 1. Numbering pattern rules
        # e.g., "1.1.1 History" -> Level 3
        if re.match(r'^\d+\.\d+\.\d+\b', text):
            evidence.append("numbering_pattern_x_y_z")
            return 3, evidence

        # e.g., "1.1 Background" or "A.1" -> Level 2
        if re.match(r'^(\d+|\[A-Z\])\.\d+\b', text):
            evidence.append("numbering_pattern_x_y")
            return 2, evidence

        # e.g., "1 Introduction" or "I. Overview" -> Level 1
        if re.match(r'^(\d+|[IVXLCDM]+)\.?\s+[A-Z]', text, re.IGNORECASE):
            evidence.append("numbering_pattern_x_single")
            return 1, evidence

        # 2. Font size ranking rules relative to document heading sizes
        font_sizes = sorted(
            list(set(h.font_size for h in all_headings if h.font_size)),
            reverse=True
        )

        if block.font_size and font_sizes:
            rank = font_sizes.index(block.font_size) + 1 if block.font_size in font_sizes else len(font_sizes)
            level = min(rank, 3)
            evidence.append(f"font_size_rank_{rank}")
            return level, evidence

        # Default fallback
        evidence.append("default_heading_level_1")
        return 1, evidence
