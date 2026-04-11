#!/usr/bin/env python3
"""新規 README mds を docx に変換して 最新版/ 配下の正しい場所に配置する。"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from importlib.machinery import SourceFileLoader

_mod = SourceFileLoader(
    "convert_latest_md_to_docs",
    str(ROOT / "scripts" / "convert-latest-md-to-docs.py"),
).load_module()

convert_md_to_docx = _mod.convert_md_to_docx

TMP = Path("/tmp/payhome-readmes")
LATEST = ROOT / "docs" / "最新版"

# (src, dst)
tasks = [
    (TMP / "README.md", LATEST / "README.docx"),
    (TMP / "02_管理シート_README.md", LATEST / "02_管理シート" / "00_管理シートの使い方.docx"),
    (TMP / "03_営業関係_README.md", LATEST / "03_営業関係" / "00_README.docx"),
    (TMP / "04_経理関係_README.md", LATEST / "04_経理関係" / "00_README.docx"),
    (TMP / "05_契約書_README.md", LATEST / "05_契約書" / "00_README.docx"),
    (TMP / "06_事業計画_README.md", LATEST / "06_事業計画・戦略" / "00_README.docx"),
    (TMP / "07_運用ルール_README.md", LATEST / "07_業務運用ルール" / "00_README.docx"),
]

for src, dst in tasks:
    if not src.exists():
        print(f"skip (not found): {src}")
        continue
    # Delete existing docx to avoid append
    if dst.exists():
        dst.unlink()
    convert_md_to_docx(src, dst)
    print(f"created: {dst.relative_to(ROOT)}")
