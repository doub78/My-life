import os
import textwrap
from PIL import Image, ImageDraw, ImageFont
from config import (
    VIDEO_WIDTH, VIDEO_HEIGHT, FONT_PATH,
    CAPTION_FONT_SIZE, CAPTION_COLOR, CAPTION_STROKE, CAPTION_STROKE_WIDTH,
    CAPTION_Y_POSITION, TEMP_DIR,
)


def _get_font(size: int):
    try:
        return ImageFont.truetype(FONT_PATH, size)
    except Exception:
        return ImageFont.load_default()


def make_caption_frame(text: str, duration: float, index: int) -> str:
    """Creates a transparent PNG with caption text, returns path."""
    img = Image.new("RGBA", (VIDEO_WIDTH, VIDEO_HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    font = _get_font(CAPTION_FONT_SIZE)

    wrapped = textwrap.fill(text, width=18)
    lines = wrapped.split("\n")

    line_h = CAPTION_FONT_SIZE + 10
    total_h = line_h * len(lines)
    y_start = int(VIDEO_HEIGHT * CAPTION_Y_POSITION) - total_h // 2

    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        tw = bbox[2] - bbox[0]
        x = (VIDEO_WIDTH - tw) // 2
        y = y_start + i * line_h
        # stroke
        for dx in range(-CAPTION_STROKE_WIDTH, CAPTION_STROKE_WIDTH + 1):
            for dy in range(-CAPTION_STROKE_WIDTH, CAPTION_STROKE_WIDTH + 1):
                if dx != 0 or dy != 0:
                    draw.text((x + dx, y + dy), line, font=font, fill=CAPTION_STROKE)
        draw.text((x, y), line, font=font, fill=CAPTION_COLOR)

    os.makedirs(TEMP_DIR, exist_ok=True)
    path = os.path.join(TEMP_DIR, f"caption_{index}.png")
    img.save(path)
    return path


def parse_script_into_scenes(script_text: str, words_per_scene: int = 10) -> list[str]:
    """Split a script into caption-sized chunks."""
    words = script_text.split()
    scenes = []
    for i in range(0, len(words), words_per_scene):
        scenes.append(" ".join(words[i:i + words_per_scene]))
    return scenes
