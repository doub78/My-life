import os
import requests
from config import PEXELS_API_KEY, VIDEO_WIDTH, VIDEO_HEIGHT, TEMP_DIR


def search_videos(query: str, per_page: int = 5, orientation: str = "portrait") -> list[dict]:
    if not PEXELS_API_KEY or PEXELS_API_KEY == "YOUR_PEXELS_API_KEY":
        return []
    headers = {"Authorization": PEXELS_API_KEY}
    params = {"query": query, "per_page": per_page, "orientation": orientation}
    resp = requests.get("https://api.pexels.com/videos/search", headers=headers, params=params, timeout=15)
    resp.raise_for_status()
    return resp.json().get("videos", [])


def download_video(video: dict, index: int) -> str | None:
    files = video.get("video_files", [])
    portrait = [f for f in files if f.get("width", 0) <= 1080 and f.get("height", 0) >= 1280]
    target = portrait[0] if portrait else (files[0] if files else None)
    if not target:
        return None
    os.makedirs(TEMP_DIR, exist_ok=True)
    path = os.path.join(TEMP_DIR, f"clip_{index}.mp4")
    resp = requests.get(target["link"], stream=True, timeout=60)
    with open(path, "wb") as f:
        for chunk in resp.iter_content(chunk_size=65536):
            f.write(chunk)
    return path


def get_footage(keywords: list[str], count: int = 5) -> list[str]:
    paths = []
    for i, kw in enumerate(keywords[:count]):
        videos = search_videos(kw, per_page=3)
        if videos:
            p = download_video(videos[0], i)
            if p:
                paths.append(p)
    return paths
