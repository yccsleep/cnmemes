"""
每月更新脚本 - 把新词条合并进现有数据库
使用方法：
1. 从meme-generator工具复制出新词条JSON，存为 new_memes.json 放在项目根目录
2. 运行：python merge_memes.py
3. 检查输出，然后 git push 即可
"""
import json
import re
import sys

TONE_MAP = {
    'ā':'a','á':'a','ǎ':'a','à':'a',
    'ē':'e','é':'e','ě':'e','è':'e',
    'ī':'i','í':'i','ǐ':'i','ì':'i',
    'ō':'o','ó':'o','ǒ':'o','ò':'o',
    'ū':'u','ú':'u','ǔ':'u','ù':'u',
    'ǖ':'v','ǘ':'v','ǚ':'v','ǜ':'v',
}

def make_slug(pinyin, cn_name, existing_slugs):
    s = str(pinyin).lower()
    for k, v in TONE_MAP.items():
        s = s.replace(k, v)
    s = re.sub(r'[^a-z0-9\s]', '', s)
    s = re.sub(r'\s+', '-', s.strip())
    if not s or s == '-':
        s = re.sub(r'[^a-z0-9]', '', cn_name.lower()) or 'meme'
    # Dedupe
    original = s
    counter = 2
    while s in existing_slugs:
        s = f"{original}-{counter}"
        counter += 1
    return s

def main():
    # Load existing data
    try:
        with open("src/data/memes.json", "r", encoding="utf-8") as f:
            existing = json.load(f)
        print(f"现有词条: {len(existing)} 条")
    except FileNotFoundError:
        print("❌ 找不到 src/data/memes.json，请确认在项目根目录运行")
        sys.exit(1)

    # Load new entries
    new_file = sys.argv[1] if len(sys.argv) > 1 else "new_memes.json"
    try:
        with open(new_file, "r", encoding="utf-8") as f:
            new_entries = json.load(f)
        if isinstance(new_entries, dict):
            new_entries = [new_entries]
        print(f"待合并词条: {len(new_entries)} 条")
    except FileNotFoundError:
        print(f"❌ 找不到 {new_file}")
        print("请把新词条JSON存为 new_memes.json 放在项目根目录")
        sys.exit(1)

    # Merge
    existing_names = {e["chinese_name"] for e in existing}
    existing_slugs = {e.get("slug", "") for e in existing}

    added = []
    skipped = []

    for entry in new_entries:
        name = entry.get("chinese_name", "")
        if not name:
            continue
        if name in existing_names:
            skipped.append(name)
            continue

        # Generate slug if missing
        if not entry.get("slug"):
            entry["slug"] = make_slug(
                entry.get("pinyin", name),
                name,
                existing_slugs
            )
        existing_slugs.add(entry["slug"])

        # Ensure examples format
        if "examples" not in entry:
            entry["examples"] = [
                {"chinese": entry.pop("ex1_cn", ""), "english": entry.pop("ex1_en", "")},
                {"chinese": entry.pop("ex2_cn", ""), "english": entry.pop("ex2_en", "")}
            ]

        existing.append(entry)
        existing_names.add(name)
        added.append(name)

    # Save
    with open("src/data/memes.json", "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 新增 {len(added)} 条:")
    for n in added:
        print(f"   + {n}")

    if skipped:
        print(f"\n⏭ 跳过 {len(skipped)} 条（已存在）:")
        for n in skipped:
            print(f"   - {n}")

    print(f"\n📊 数据库总计: {len(existing)} 条")
    print(f"\n下一步：")
    print(f"  git add src/data/memes.json")
    print(f"  git commit -m '月度更新：新增{len(added)}条热梗'")
    print(f"  git push")

if __name__ == "__main__":
    main()
