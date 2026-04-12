#!/usr/bin/env python3
"""v2 の md ファイルを docx/pptx に変換して 最新版/ 配下に配置する。"""
from __future__ import annotations

import sys
from pathlib import Path
from importlib.machinery import SourceFileLoader

ROOT = Path(__file__).resolve().parent.parent
_mod = SourceFileLoader(
    "convert_latest_md_to_docs",
    str(ROOT / "scripts" / "convert-latest-md-to-docs.py"),
).load_module()

convert_md_to_docx = _mod.convert_md_to_docx
convert_md_to_pptx = _mod.convert_md_to_pptx

TMP = Path("/tmp/payhome-v2")
LATEST = ROOT / "docs" / "最新版"

tasks = [
    (TMP / "README.md", LATEST / "README.docx", None, "docx"),
    (TMP / "料金プラン_MVP版.md",
     LATEST / "03_営業関係" / "料金プラン_MVP版.docx", None, "docx"),
    (TMP / "工務店FAQ_MVP版.md",
     LATEST / "03_営業関係" / "工務店FAQ_MVP版.docx", None, "docx"),
    (TMP / "工務店向け説明_MVP版.md",
     LATEST / "03_営業関係" / "工務店向け説明_MVP版.pptx",
     "2026-05-01 MVPリリース (料金モデル v2)", "pptx"),
    (TMP / "キャッシュポイント一覧.md",
     LATEST / "04_経理関係" / "キャッシュポイント一覧.docx", None, "docx"),
]

for src, dst, subtitle, fmt in tasks:
    if not src.exists():
        print(f"skip (not found): {src}")
        continue
    if dst.exists():
        dst.unlink()
    if fmt == "docx":
        convert_md_to_docx(src, dst)
    else:
        convert_md_to_pptx(src, dst, subtitle or "")
    print(f"✓ {dst.relative_to(ROOT)}")

print("=== done ===")
