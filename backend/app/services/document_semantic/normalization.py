import re

def normalize_text_content(text: str) -> str:
    """Performs safe whitespace, hyphenation, and line-break normalization."""
    if not text:
        return ""

    # 1. Hyphenation cleanup: e.g. "read-\nable" -> "readable"
    # Matches a word ending with hyphen followed by newline and next word part
    cleaned = re.sub(r'(\b[a-zA-Z]{2,})-\n([a-zA-Z]{2,}\b)', r'\1\2', text)

    # 2. Normalize whitespace (tabs/newlines/multiple spaces)
    cleaned = re.sub(r'[ \t]+', ' ', cleaned)
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)

    return cleaned.strip()
