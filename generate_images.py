import requests
import os
import json
import time
import urllib.parse
from pathlib import Path

POLLINATIONS_URL = "https://image.pollinations.ai/prompt/{prompt}?width=1344&height=768&model=flux&nologo=true&seed={seed}&negative={negative}"
OUTPUT_DIR = "generated_images"
PROGRESS_FILE = "progress.json"

STYLE = (
    "cinematic dark documentary photography, dramatic moody lighting, "
    "deep shadows, photorealistic, high contrast, gritty editorial style, "
    "dark atmosphere, cinematic color grading, gold and black tones, "
    "16:9 widescreen, "
)

NEGATIVE = "cartoon, anime, illustration, bright colors, cheerful, 3D render, watercolor, drawing, sketch, painting, blurry, low quality"

PROMPTS = [
    # 001 — HOOK
    "corporate products arranged on dark desk — Nike shoe, Coca-Cola can, Boeing model plane, baby formula tin — dramatic single spotlight, dark shadows beneath each product, cinematic still life, gold and black palette",

    # 002–004 — NIKE
    "Nike swoosh logo on dark factory wall, sweatshop interior, single hanging lightbulb casting harsh shadow, worn anonymous hands stitching shoe leather, cinematic documentary, dark moody atmosphere",
    "vintage newspaper front page with labor scandal headline, corporate executive in expensive suit sweating and loosening collar, PR office in background, juxtaposition of wealth and exploitation",
    "antique brass balance scale on dark surface, Nike shoe on left side, pile of shadowy corporate logos on right tipping down dramatically, symbolic corporate accountability, studio spotlight",

    # 005–007 — COCA-COLA
    "1880s apothecary pharmacy, sepia tones, Victorian-era bottles labeled with health claims, cocaine and caffeine ingredients listed, warm gaslight atmosphere, antique medical aesthetic, dark history",
    "scientists in white lab coats with Coca-Cola logo patches, whiteboard showing sugar industry funded research, cash stacks on desk, Olympic rings poster on wall, corporate corruption visual",
    "dark world map with red liquid spreading across every continent, Olympic medals, school vending machines, dead union workers all connected to single Coke bottle at center with dark web lines",

    # 008–011 — BOEING
    "dark corporate boardroom, whiteboard showing two options: 'Pilot Training = $$$' vs 'Tell Nobody = $0', executives in expensive suits, one circling second option while smiling, sinister atmosphere",
    "airplane silhouette nose-diving toward dark ocean, government document covered in thick black redaction bars, rubber APPROVED stamp pressing down on it, cold clinical bureaucratic aesthetic",
    "dark timeline collage — plane crash wreckage, CEO holding oversized departure check, same plane flying again, airplane door falling from mid-air — corporate accountability failure sequence",
    "dark legal document with list of names, each receiving red DECEASED stamp one by one, dramatic single spotlight, paper texture, ominous corporate whistleblower intimidation visual",

    # 012–015 — NESTLÉ
    "dark corporate life cycle infographic — baby formula tin, KitKat bar, instant coffee jar, hospital IV bag — all Nestlé branded, circular timeline from birth to death, dark irony, cinematic",
    "wall calendar rapidly flipping through 2005, 2008, 2010, 2020, 2025 — smiling suited executive with marker crossing out each deadline, factory conditions unchanged in background, dark satire",
    "women in white nurse-like uniforms distributing product samples to new mothers in rural developing country, contaminated water source visible just behind them, ironic documentary juxtaposition",
    "10 million tally marks covering dark screen, Nestlé annual report showing record profits beside it, stark numerical devastation, cold infographic aesthetic, dark and impactful",

    # 016–018 — FACEBOOK
    "Mark Zuckerberg caricature in gray suit standing on dark globe, Facebook logo spreading like dark wings over Southeast Asia map, storm clouds rolling in from Myanmar direction, corporate imperialism",
    "digital world map with country checkboxes, Myanmar checkbox glowing red with warning symbol, blurred corporate employee in background shrugging and clicking mouse, bureaucratic negligence, tech aesthetic",
    "corporate internal memo on screen: Fix Misinformation = -15% Engagement, red pen crossing it out, Engagement over Everything written below, Myanmar violence news headlines visible in background",

    # 019–021 — PALANTIR
    "government surveillance center shutting down, equipment being covered with sheets, two silhouetted figures in suits immediately opening laptop to start new company, CIA building visible through window",
    "massive surveillance dashboard showing simultaneous data feeds — supply chains, employee GPS locations, military target maps, civilian profiles — cold blue light, dystopian corporate panopticon",
    "military targeting software UI with crosshairs over map coordinates, missile trajectory calculations updating in real time, Palantir logo watermark in corner, cold automated warfare aesthetic",

    # 022–026 — PURDUE PHARMA
    "1990s corporate launch party, executive raising champagne glass, prescription papers falling like confetti from ceiling, doctors signing stacks of papers without reading, dark celebration of greed",
    "pharmaceutical sales rep presenting to doctor in clinical office, whiteboard reading: Requesting More Pills = Pseudo-Addiction — Correct Solution: Higher Dose, gift baskets on desk, corruption visual",
    "cold email on computer screen reading: This is not too bad — 500000 tally marks slowly filling the dark frame around it, coffee cup beside keyboard, contrast of indifference and death toll",
    "sharp-suited McKinsey consultant arriving with briefcase, Purdue Pharma executive extending hand, large money pile between them, dark power handshake, cinematic corporate evil partnership",
    "courthouse exterior, BANKRUPT sign on front door, suited family members carrying money bags out back exit, GUILTY stamp on court documents, private jet waiting on tarmac behind building",

    # 027–029 — EXXON MOBIL
    "Standard Oil logo shattering like glass in slow motion, Exxon logo assembling itself from the fragments, oil spreading across world map, black gold dripping from corporate letters, dark transformation",
    "1970s corporate laboratory, scientist reading internal climate research chart showing dramatic temperature rise, face going pale, documents being fed into industrial paper shredder, dark origin of denial",
    "side-by-side infographic: Exxon internal 1970s climate chart vs NASA public data — both curves identical — Exxon logo burying their own chart while funding newspaper ads reading Climate Change Uncertain",

    # 030–033 — DUTCH EAST INDIA COMPANY
    "1600s Dutch merchant examining exotic spices as if they were gold and diamonds, treasure chest aesthetic, Southeast Asia map glowing behind him, oil painting style, dark golden colonial era tones",
    "1600s candlelit corporate meeting, merchant drawing first organizational chart with investor shares listed, fleet of warships visible through arched window simultaneously setting sail, capitalism invented dark comedy",
    "historical map of Southeast Asia and Indonesia, Dutch colonial flags planting across islands one by one, fires and smoke rising, gold spice trade routes overlaying scenes of conquest, dark historical",
    "British East India Company soldiers marching across India, opium ship fleet approaching China coast, empire rebrand from company to government, colonial bureaucracy as corporate structure, dark historical",

    # 034–038 — DUPONT
    "1938 chemistry laboratory, scientist accidentally spilling shiny non-stick substance across cookware, gleaming Teflon coating spreading, DuPont logo on wall, bright hopeful American dream before dark truth",
    "stack of corporate research documents on dark mahogany desk, pages showing alarming findings with red underlines, executive hands pausing above the pile, tense boardroom silence, dim lighting",
    "dark boardroom, executive speech bubble beginning We cannot let our chemicals— everyone leaning in hopefully — then completing —interfere with our profits, executives slumping, money bags appearing on table",
    "West Virginia farm at dusk, livestock lying dead in field, farmer staring at distant industrial chemical plant, lawyer office interior with documents stacked floor to ceiling, determined investigator reading",
    "world map with 99 percent of countries glowing red, extreme close-up of human bloodstream with chemical molecule symbols floating in it, text overlay: รวมถึงคุณด้วย, disturbing realization aesthetic",

    # 039–040 — OUTRO
    "10 corporate logos in dark circle — Nike, Coca-Cola, Boeing, Nestle, Facebook, Palantir, Purdue Pharma, Exxon, Dutch East India Company, DuPont — everyday products emerging from each, person surrounded",
    "dramatic YouTube subscribe button on dark background, microphone in foreground spotlight, comment section interface with glowing question mark, dark cinematic end card, channel branding moment",
]


def load_progress():
    if Path(PROGRESS_FILE).exists():
        with open(PROGRESS_FILE) as f:
            return json.load(f)
    return {}


def save_progress(progress):
    with open(PROGRESS_FILE, "w") as f:
        json.dump(progress, f)


def generate(idx, prompt):
    full_prompt = STYLE + prompt
    encoded = urllib.parse.quote(full_prompt)
    neg_encoded = urllib.parse.quote(NEGATIVE)
    url = POLLINATIONS_URL.format(prompt=encoded, seed=idx * 7 + 42, negative=neg_encoded)
    for attempt in range(3):
        try:
            r = requests.get(url, timeout=90)
            if r.status_code == 200 and len(r.content) > 5000:
                return r.content
        except Exception:
            pass
        time.sleep(5)
    return None


def main():
    Path(OUTPUT_DIR).mkdir(exist_ok=True)
    progress = load_progress()

    total = len(PROMPTS)
    for i, prompt in enumerate(PROMPTS, 1):
        key = str(i)
        if progress.get(key) == "done":
            print(f"[{i:03d}/{total}] skip")
            continue

        filename = Path(OUTPUT_DIR) / f"{i:03d}.jpg"
        print(f"[{i:03d}/{total}] generating...")
        data = generate(i, prompt)

        if data:
            with open(filename, "wb") as f:
                f.write(data)
            progress[key] = "done"
            save_progress(progress)
            print(f"[{i:03d}/{total}] saved ({len(data)//1024}KB)")
        else:
            print(f"[{i:03d}/{total}] FAILED — skipping")

        time.sleep(2)

    done = sum(1 for v in progress.values() if v == "done")
    print(f"\nComplete: {done}/{total} images generated in {OUTPUT_DIR}/")


if __name__ == "__main__":
    main()
