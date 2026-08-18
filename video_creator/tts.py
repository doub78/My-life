import asyncio
import edge_tts
from config import TTS_VOICE, TTS_RATE


async def _generate(text: str, output_path: str, voice: str, rate: str):
    communicate = edge_tts.Communicate(text, voice, rate=rate)
    await communicate.save(output_path)


def generate_voiceover(text: str, output_path: str, voice: str = TTS_VOICE, rate: str = TTS_RATE) -> str:
    asyncio.run(_generate(text, output_path, voice, rate))
    return output_path


def list_voices(locale_filter: str = "th") -> list[dict]:
    async def _list():
        voices = await edge_tts.list_voices()
        return [v for v in voices if locale_filter.lower() in v["Locale"].lower()]
    return asyncio.run(_list())
