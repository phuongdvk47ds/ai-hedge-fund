"""Check that every ASCII wireframe in a Markdown file is a closed 74-column box.

Usage: python3 scripts/check_mockups.py docs/AGILE_SRS.md
"""
import re
import sys

WIDTH = 74
text = open(sys.argv[1], encoding="utf-8").read()
bad = 0
blocks = re.findall(r"```text\n(┌.*?┘)\n```", text, re.S)
for n, block in enumerate(blocks, 1):
    for row in block.split("\n"):
        if len(row) != WIDTH or row[0] not in "┌│├└" or row[-1] not in "┐│┤┘":
            bad += 1
            print(f"[FAIL] mockup {n}: width {len(row)}: {row[:40]!r}")
print(f"{len(blocks)} mockups checked, {bad} malformed rows")
sys.exit(1 if bad else 0)
