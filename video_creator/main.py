#!/usr/bin/env python3
"""
Faceless YouTube Shorts Creator — Tim Danilov Method
Run: python main.py --script script.json
"""

import argparse
import json
import os
import sys

from tts import generate_voiceover
from footage import get_footage
from captions import make_caption_frame, parse_script_into_scenes
from assembler import build_video
from config import TEMP_DIR, OUTPUT_DIR


def load_script(path: str) -> dict:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def run(script_path: str):
    data = load_script(script_path)

    title = data.get("title", "video")
    full_text = data.get("script", "")
    keywords = data.get("keywords", ["nature", "city", "people"])
    voice = data.get("voice", None)
    words_per_scene = data.get("words_per_scene", 10)
    output_name = data.get("output", f"{title.replace(' ', '_')}.mp4")

    print(f"[1/5] Splitting script into scenes...")
    scenes = parse_script_into_scenes(full_text, words_per_scene)
    print(f"      {len(scenes)} scenes")

    print("[2/5] Generating voiceover...")
    os.makedirs(TEMP_DIR, exist_ok=True)
    audio_path = os.path.join(TEMP_DIR, "voiceover.mp3")
    kw = {"voice": voice} if voice else {}
    generate_voiceover(full_text, audio_path, **kw)
    print(f"      Saved: {audio_path}")

    print("[3/5] Downloading stock footage...")
    footage = get_footage(keywords, count=min(len(scenes), 6))
    if not footage:
        print("      No Pexels key set — using color backgrounds")

    print("[4/5] Generating caption frames...")
    caption_paths = []
    for i, scene in enumerate(scenes):
        p = make_caption_frame(scene, duration=3.0, index=i)
        caption_paths.append(p)
    print(f"      {len(caption_paths)} caption frames")

    print("[5/5] Assembling video...")
    out = build_video(scenes, footage, audio_path, caption_paths, output_name)
    print(f"\nDone! -> {os.path.abspath(out)}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Auto-create a faceless YouTube Short")
    parser.add_argument("--script", required=True, help="Path to script JSON file")
    args = parser.parse_args()

    if not os.path.exists(args.script):
        print(f"Error: {args.script} not found")
        sys.exit(1)

    run(args.script)
