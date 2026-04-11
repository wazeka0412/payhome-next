#!/usr/bin/env python3
"""docs/ 直下の戦略系 md ファイルを docx に変換して 最新版/06_事業計画・戦略/ に配置する。

元ファイルは削除せず、コピー扱い。
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

# Reuse the converter from the existing script
from importlib.machinery import SourceFileLoader

_mod = SourceFileLoader(
    "convert_latest_md_to_docs",
    str(ROOT / "scripts" / "convert-latest-md-to-docs.py"),
).load_module()

convert_md_to_docx = _mod.convert_md_to_docx

SRC = ROOT / "docs"
DST = ROOT / "docs" / "最新版" / "06_事業計画・戦略"
DST.mkdir(parents=True, exist_ok=True)

TASKS = [
    ("mvp-launch-strategy.md", "MVPローンチ戦略.docx"),
    ("business-model-story.md", "事業モデル・ストーリー.docx"),
    ("business-model-milestones.md", "事業マイルストーン.docx"),
    ("builder-sales-deck.md", "工務店向けセールスデッキ原稿.docx"),
    ("saas-pricing-expert-panel.md", "SaaS料金エキスパートパネル議事録.docx"),
    ("pre-release-expert-review.md", "リリース前エキスパートレビュー.docx"),
    ("youtube-analytics-2026-04.md", "YouTubeアナリティクス_2026-04.docx"),
]

for src_name, dst_name in TASKS:
    src = SRC / src_name
    if not src.exists():
        print(f"skip (not found): {src_name}")
        continue
    dst = DST / dst_name
    convert_md_to_docx(src, dst)
    print(f"created: {dst.relative_to(ROOT)}")

print("=== done ===")
