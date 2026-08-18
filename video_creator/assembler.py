import os
import random
from moviepy.editor import (
    VideoFileClip, AudioFileClip, ImageClip, CompositeVideoClip,
    concatenate_videoclips, ColorClip,
)
from config import VIDEO_WIDTH, VIDEO_HEIGHT, FPS, OUTPUT_DIR, TEMP_DIR


def _resize_to_fill(clip, w=VIDEO_WIDTH, h=VIDEO_HEIGHT):
    scale = max(w / clip.w, h / clip.h)
    resized = clip.resize(scale)
    x = (resized.w - w) // 2
    y = (resized.h - h) // 2
    return resized.crop(x1=x, y1=y, x2=x + w, y2=y + h)


def _make_fallback_clip(duration: float, color=(10, 10, 40)) -> VideoFileClip:
    return ColorClip(size=(VIDEO_WIDTH, VIDEO_HEIGHT), color=color, duration=duration)


def build_video(
    scenes: list[str],
    footage_paths: list[str],
    audio_path: str,
    caption_paths: list[str],
    output_name: str = "output.mp4",
    scene_duration: float = 3.0,
) -> str:
    audio = AudioFileClip(audio_path)
    total_dur = audio.duration
    n_scenes = max(len(scenes), 1)
    per_scene = total_dur / n_scenes

    clips = []
    for i, scene in enumerate(scenes):
        dur = per_scene

        if footage_paths:
            src = footage_paths[i % len(footage_paths)]
            try:
                raw = VideoFileClip(src, audio=False)
                max_start = max(0, raw.duration - dur)
                start = random.uniform(0, max_start)
                bg = raw.subclip(start, start + dur)
                bg = _resize_to_fill(bg)
            except Exception:
                bg = _make_fallback_clip(dur)
        else:
            bg = _make_fallback_clip(dur)

        bg = bg.set_duration(dur)

        if i < len(caption_paths):
            cap = (
                ImageClip(caption_paths[i])
                .set_duration(dur)
                .set_opacity(1.0)
            )
            frame = CompositeVideoClip([bg, cap], size=(VIDEO_WIDTH, VIDEO_HEIGHT))
        else:
            frame = bg

        clips.append(frame.set_fps(FPS))

    final = concatenate_videoclips(clips, method="compose").set_audio(audio)
    final = final.set_duration(total_dur)

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    out_path = os.path.join(OUTPUT_DIR, output_name)
    final.write_videofile(
        out_path,
        fps=FPS,
        codec="libx264",
        audio_codec="aac",
        threads=4,
        logger=None,
    )
    return out_path
