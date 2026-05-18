import requests
import os
import json
import time
import urllib.parse
from pathlib import Path

# Pollinations.ai — free, no API key required
POLLINATIONS_URL = "https://image.pollinations.ai/prompt/{prompt}?width=1344&height=768&model=flux&nologo=true&seed={seed}"
OUTPUT_DIR = "generated_images"
PROGRESS_FILE = "progress.json"

STYLE_PREFIX = "2D flat animation, Extra History YouTube video art style, simple round cartoon characters with minimal facial features, thick dark outlines, flat muted colors with subtle shading, simple but detailed backgrounds, 16:9 widescreen, "

PROMPTS = [
    # HOOK 001-018
    "animated character sits at wooden desk surrounded by everyday products: Nike shoes, Coca-Cola can, Boeing plane model, baby formula can, character looks at camera nervously, dark studio background, 16:9",
    "same desk scene, dark shadows beginning to creep beneath each product, character notices the shadows, concerned expression, gold and black color palette, 16:9",
    "Nike shoe isolated on dark background, dark factory shadow stretching beneath it, single dramatic light source from above, muted tones, 16:9",
    "Coca-Cola can casting a skull-shaped shadow on dark background, red and black muted palette, dramatic lighting, unsettling visual, 16:9",
    "small Boeing plane model casting shadow of crashing plane, dark background, simple shapes, dark irony visual, 16:9",
    "baby formula can casting shadow of crying baby in shadow, muted tones, uncomfortable corporate visual, 16:9",
    "character's eyes go wide as all product shadows grow larger around him, overwhelmed expression, gold and black background, 16:9",
    "all product shadows merging into one giant dark cloud behind the character, character grips the desk edge, ominous atmosphere, 16:9",
    "bold title card, dark background with gold text '10 บริษัทที่ชั่วร้ายที่สุดในโลก', dramatic typography, simple design, 16:9",
    "character points dramatically at the camera, serious and intense expression, products arranged like crime evidence on desk behind him, 16:9",
    "wide shot, character appears tiny at the bottom of frame, massive dark corporation logos looming above him like skyscrapers, 16:9",
    "character scratching head looking at pile of everyday branded products, thought bubble with question mark, muted palette, 16:9",
    "character holds magnifying glass to a corporate logo, the lens reveals dark factory imagery underneath the cheerful branding, 16:9",
    "split screen, left side: happy smiling consumer buying product, right side: dark factory conditions producing it, stark contrast, 16:9",
    "countdown visual showing slots #10 through #1 on a dark leaderboard, all slots filled with question marks, gold and dark palette, 16:9",
    "character stands at podium like a news anchor, serious expression, 'Starting with #10' text on board behind him, 16:9",
    "dramatic zoom into character's eyes, tension building, muted dramatic lighting, 16:9",
    "'#10 NIKE' title card, bold white text on dark background, Nike swoosh visible, ominous tone, 16:9",
    # NIKE 019-058
    "giant Nike swoosh logo on dark background, bold and simple design, muted blue-gray palette, 16:9",
    "camera slowly pulls back from Nike logo, revealing the logo is painted on the wall of a dark factory in Asia, 16:9",
    "dark factory interior, single bare lightbulb hanging from ceiling casting yellow light, rows of sewing machines, cramped and dirty, 16:9",
    "small cartoon child worker hands stitching a Nike swoosh onto a shoe, close-up view from above, uncomfortable visual, 16:9",
    "factory workers hunched over sewing machines, no windows, poor lighting, dark brown and gray palette, crowded conditions, 16:9",
    "price tag floating in dark space showing '14c per hour', bold simple design, stark visual, 16:9",
    "cartoon child worker looks directly up at the camera with sad eyes, holding a Nike shoe, single light source from above, 16:9",
    "comparison: Nike shoe price tag '$180' on left, worker wage '14c/hr' on right, dark split screen, 16:9",
    "barrels labeled 'TOXIC CHEMICALS' in factory corner, worker nearby without protective equipment, muted green warning palette, 16:9",
    "Nike CEO character sitting in enormous leather chair, floor-to-ceiling profit charts behind him, completely oblivious expression, expensive office, 16:9",
    "1990s newspaper front page, cartoon-style, headline about child labor scandal, photo shown as cartoon illustration, 16:9",
    "multiple TV screens in a newsroom all showing the same image of 12-year-old child stitching ball, character watching, 16:9",
    "Nike CEO character sweating profusely at a press conference podium, ring of photographers surrounding him, flashbulbs going off, 16:9",
    "CEO loosening collar nervously with one hand, reaching for phone with other hand, panicked expression, 16:9",
    "PR war room, whiteboards covered in damage control strategies, team members arguing, coffee cups everywhere, 16:9",
    "official Nike press release document animated on screen: 'We are deeply committed to change', character reading with highly skeptical raised eyebrow, 16:9",
    "Nike CEO at podium saying 'We're sorry, we will do better', large crowd of reporters, flashbulbs, 16:9",
    "same factory scene as before, but calendar on wall shows 1996 changing to 2000, factory completely unchanged, 16:9",
    "calendar flips again: 2005, factory still same, workers still same, nothing improved, dark irony visual, 16:9",
    "calendar continues: 2010, 2015 — factory identical, child worker hasn't moved, 16:9",
    "calendar now shows present day, factory still exactly the same, child worker glances at camera tiredly, 16:9",
    "balance scale appears, Nike child labor facts on one side, 'but wait, there are worse companies' text on the other side, 16:9",
    "scale tips dramatically to the 'worse companies' side, Nike side floats up, character looks at camera, 16:9",
    "character raises one eyebrow at the camera knowingly, arms crossed, 'just you wait' expression, 16:9",
    "Nike store exterior, happy customers walking in with shopping bags, tiny factory reflected in store window behind them, 16:9",
    "'Just Do It' slogan on wall, character standing next to it with deeply conflicted expression, 16:9",
    "pile of Nike products stacked tall next to tiny factory worker figure for size comparison, 16:9",
    "Nike annual profit chart shooting up sharply while worker wages line stays completely flat, two lines on same graph, 16:9",
    "character holds Nike shoe examining it, thought bubble above head showing factory interior, 16:9",
    "news ticker scrolling at bottom: 'Nike scandal… Nike apologizes… Nike scandal again…', character walks past wearing Nikes without noticing, 16:9",
    "factory manager character with clipboard walking past collapsed worker, not stopping, completely indifferent expression, 16:9",
    "corporate boardroom, executives high-fiving over profit charts, factory fire visible through window behind them, no one notices, 16:9",
    "Nike advertisement showing happy athlete running vs reality of factory worker, split screen comparison, 16:9",
    "child worker receives tiny coin, Nike receives giant gold coin, cartoonish size contrast, 16:9",
    "map of Asia with factory location pins scattered across multiple countries, supply chain routes shown, 16:9",
    "Nike corporate lawyer character cheerfully filing paperwork, large stack of legal documents, 16:9",
    "massive warehouse stacked floor to ceiling with Nike products, dark perspective making it feel overwhelming, 16:9",
    "ranking board showing Nike confirmed at #10, character points to it, 'and it only gets worse from here', 16:9",
    "character looks at camera with grim smile, 'Ready for worse?', 16:9",
    "'#9 COCA-COLA' title card, red and black, dark background, 16:9",
    # COCA-COLA 059-098
    "1886 American pharmacy interior, wooden shelves lined with glass bottles, warm sepia and amber tones, old-fashioned signage, 16:9",
    "bearded Civil War veteran character in pharmacist's apron, tired eyes, haunted expression, behind wooden counter, 16:9",
    "veteran character mixing glowing green liquid in large glass beaker, concentrated expression, vintage pharmacy setting, 16:9",
    "three ingredient bottles on counter labeled 'COCAINE', 'CAFFEINE', 'SYRUP' being poured into mixing bowl, vintage label style, 16:9",
    "beaker bubbling with dark liquid, test tubes in rack, smoke rising gently, vintage chemistry aesthetic, 16:9",
    "bottle with decorative label: 'COCA-COLA: Cures Headaches, Fatigue and Nervousness' in 1880s patent medicine style, 16:9",
    "customers lined up at pharmacy counter, all of them look extremely wide-eyed and alert, some vibrating slightly, 16:9",
    "customer's eyes spinning with energy after first sip, cartoon energy lines radiating from them, 16:9",
    "cash register ringing rapidly as Coca-Cola sells out, veteran smiling, coins stacking up, 16:9",
    "vintage 1890s advertisement poster style, happy well-dressed people, 'Coca-Cola: The Ideal Brain Tonic', cheerful but ironic, 16:9",
    "timeline animation, calendar fast-forwarding from 1886 to 1960s, world changing around Coca-Cola bottle that stays the same, 16:9",
    "1960s health-conscious consumers reading food labels carefully in supermarket, concerned expressions, muted 60s color palette, 16:9",
    "Coca-Cola marketing team in conference room panic, whiteboard showing downward trend graph, someone wrote 'SUGAR = BAD (apparently)', 16:9",
    "scientists in white lab coats with small Coca-Cola logos stitched on the pockets, 16:9",
    "scientist writing 'Actually Sugar Is Fine' on whiteboard, stacks of cash visibly sitting on the desk beside him, 16:9",
    "corrupt health organization official receiving heavy briefcase from suited Coca-Cola representative, both looking suspicious, 16:9",
    "official signing document at desk: 'Obesity Caused Only By Lack Of Exercise, Not Diet', pen in hand, 16:9",
    "fitness magazine cover: 'Just Exercise More!', featuring Coca-Cola-sponsored athlete, ironic visual, 16:9",
    "Olympic rings appearing alongside Coca-Cola logo, athletes holding Coke cans instead of trophies, cheerful and ironic, 16:9",
    "elementary school hallway, Coca-Cola vending machine placed prominently near classroom door, small children looking up at it, 16:9",
    "Coca-Cola executive at press conference: 'We absolutely do not market to children', large vending machine clearly visible behind him, 16:9",
    "character and audience notice the vending machine behind the exec, character points at it with raised eyebrow, 16:9",
    "world map with factory location pins, arrows pointing from Coca-Cola HQ to outsourced bottling plants globally, 16:9",
    "ominous bottling plant building at night, 'OUTSOURCED OPERATIONS' sign, dark atmosphere, 16:9",
    "union workers holding protest signs outside bottling plant, shadowy figures watching from inside, 16:9",
    "union meeting being disrupted by dark silhouettes entering, workers looking frightened, 16:9",
    "newspaper headline: 'Union Leaders Near Coca-Cola Plants Go Missing', character reading with growing horror, 16:9",
    "world map with Coca-Cola spreading outward like red liquid across every country, overwhelming global scale, 16:9",
    "counter: '2,000,000,000 SERVINGS PER DAY', character tries to comprehend the number, mind blown expression, 16:9",
    "globe with Coca-Cola logo replacing the entire planet, dark corporate humor visual, 16:9",
    "human circulatory system diagram, Coca-Cola liquid flowing through the veins instead of blood, unsettling visual, 16:9",
    "doctor's office, doctor showing character an X-ray with Coke molecules floating in bloodstream, 16:9",
    "dark web of influence: school vending machine, Olympics, health organizations, missing union leaders, all connected by lines to single Coke bottle in center, 16:9",
    "Coca-Cola annual revenue chart, massive numbers, cheerful red corporate graphics vs dark reality, 16:9",
    "character holding Coke can, staring at it with new suspicious eyes, 16:9",
    "supermarket drinks aisle, every single brand is actually a Coca-Cola subsidiary under different names, character realizing this, 16:9",
    "Coca-Cola CEO waving cheerfully from the deck of a massive yacht, profits very visible, 16:9",
    "ranking board updated: Coca-Cola at #9, Nike at #10, both confirmed, 16:9",
    "character turns to camera, 'But this next company can kill you much faster than sugar', serious tone, 16:9",
    "'#8 BOEING' title card, dark blue and gray palette, airplane silhouette, 16:9",
    # BOEING 099-143
    "Boeing logo on clear blue sky background, large commercial airplane visible below, clean corporate appearance, 16:9",
    "737 MAX airplane technical blueprint spread on drafting table, engineers in hardhats examining it, 16:9",
    "cartoon test flight animation, 737 MAX airplane nose tilting sharply and dangerously upward during takeoff, 16:9",
    "engineers gathered around monitor seeing the dangerous nose-up problem, pointing at screen, concerned looks, 16:9",
    "whiteboard diagram: 'MCAS System - When nose goes up, automatically push nose down', simple technical drawing style, 16:9",
    "Boeing corporate boardroom, executives in suits sitting around long table, overhead projector on, 16:9",
    "two options written on whiteboard: 'Option A: Train Pilots = expensive' vs 'Option B: Tell Nobody = zero cost', 16:9",
    "executive circles 'Tell Nobody = zero cost' with confident smile, uncapping marker dramatically, 16:9",
    "other executives nodding, no one objects, someone takes notes, complete boardroom agreement, 16:9",
    "calendar: October 29, 2018, Lion Air plane on Indonesian runway, sunny day, passengers boarding, 16:9",
    "airplane cockpit view, MCAS activating alarm on screen, nose being pushed down automatically, pilots struggling with controls, 16:9",
    "altitude meter spinning downward rapidly, warning lights flashing red across cockpit, 16:9",
    "plane trajectory shown as arrow pointing steeply down toward ocean surface at 700 km/h, clinical diagram style, 16:9",
    "ocean surface, impact shown as large ripple/splash effect, tasteful without graphic content, 16:9",
    "news broadcast screen: 'LION AIR FLIGHT 610 — 189 Dead', somber blue and gray tones, character watching in shock, 16:9",
    "investigation team at crash site, pointing at recovered wreckage, MCAS identified as culprit in diagram, 16:9",
    "government regulator office, officials sitting around table reading the investigation report, 16:9",
    "report page visible: 'PROJECTED: 15 MORE CRASHES if MCAS not fixed', bold alarming text, 16:9",
    "same report being slipped into an envelope, important pages being redacted with black marker, bureaucratic hands doing this, 16:9",
    "short memo being printed: generic pilot note, zero mention of MCAS anywhere, character reads it confused flipping pages, 16:9",
    "bureaucrat stamps memo 'SENT' and immediately turns back to coffee mug, 737 MAX planes still flying shown in window, 16:9",
    "calendar now shows March 10, 2019, Ethiopian Airlines plane on runway, same setup as before, 16:9",
    "same cockpit, same MCAS problem, same nose-down trajectory, pilots can't stop it, 16:9",
    "news headline: 'Ethiopian Airlines 302 — 157 Dead', character's fist hits desk in frustration, 16:9",
    "total counter appearing: '346 Dead', number builds slowly on screen, dark and impactful, 16:9",
    "timeline bar: Crash 1, Memo Sent, Crash 2, Each step labeled with dates, 16:9",
    "'$2,500,000,000 Fine' text appearing, character looks at it, 16:9",
    "Boeing's annual revenue shown next to the fine for comparison, fine looks small by comparison, 16:9",
    "CEO Dennis Muilenburg character being escorted out of Boeing HQ carrying a cardboard box, 16:9",
    "CEO waves goodbye cheerfully while receiving enormous golden check, '$62 Million Severance' written on it, 16:9",
    "CEO walks toward private jet in background, golden parachute literally floating behind him, cartoon visual, 16:9",
    "Boeing press conference: new CEO at podium saying 'Safety is our absolute priority', audience of reporters, 16:9",
    "calendar: November 2020, '737 MAX Recertified' stamp appearing, plane back in sky, 16:9",
    "nervous passengers boarding 737 MAX, not aware of which plane it is, 16:9",
    "January 2024, Alaska Airlines Flight 1282 in the air, door plug panel visible on fuselage, 16:9",
    "door panel suddenly flying off mid-flight into open sky, hole in plane side, 16:9",
    "passenger sitting next to gaping hole where door was, wind blowing hair sideways, looks at camera with complete bewilderment, 16:9",
    "investigation team examining door mechanism up close, finding completely missing bolts, incredulous expressions, 16:9",
    "simple technical diagram: door panel installed, arrows pointing to where bolts should be, all bolt slots are empty, 16:9",
    "list appearing one by one: 'Whistleblower 1', then 'Whistleblower 2', then 'Whistleblower 3', dark background, 16:9",
    "red 'DECEASED' stamp appearing next to each whistleblower name, one by one, 16:9",
    "character stares at list with increasingly wide eyes, visibly disturbed, 16:9",
    "character slowly, deliberately turns head to face camera, wide eyes, long beat of silence implied, 16:9",
    "'Hm.' text bubble appearing next to character's expressionless face, 16:9",
    "ranking board confirmed: Boeing at #8, 16:9",
    "'#7 NESTLE' title card, warm colors turning sinister, baby formula can in background, 16:9",
    # NESTLE 145-180
    "hospital delivery room, baby just born, nurse handing mother a baby formula can, first thing, 16:9",
    "toddler at kitchen table eating a chocolate bar, happy child, 16:9",
    "family eating instant noodles for dinner together, cozy home scene, 16:9",
    "office worker surviving workday on instant coffee, multiple empty cups on desk, 16:9",
    "elderly person in hospital bed, medical feeding tube connected, corporate logo on the tube bag, 16:9",
    "life cycle circle diagram showing all 5 stages of life, each stage labeled with a branded product, birth to death, all branded, 16:9",
    "corporate logo in center of life cycle circle, arrows connecting to every life stage, 'Cradle to Grave' implied, 16:9",
    "world map, headquarters labeled, operations spread across every continent, 'Largest Food Company' text, 16:9",
    "US Capitol building exterior, politician presenting bill in chamber: 'Require slave labor label on chocolate', 16:9",
    "corporate lobbyist character in expensive suit arriving at Capitol with enormous briefcase, suspicious grin, 16:9",
    "bill being fed into paper shredder as lobbyist smiles and counts money, 16:9",
    "corporate executive signing document: 'Promise: No more child labor by 2005', pen in hand, serious face, 16:9",
    "calendar shows 2005, executive crosses out date with red pen, writes 2008, child worker in cocoa field in background hasn't moved, 16:9",
    "calendar shows 2008, crosses out again, writes 2010, same child worker still there, 16:9",
    "calendar shows 2010, crosses to 2020, executive still has same smile, same child still there, 16:9",
    "calendar shows 2020, crosses to 2025, executive shrugs cheerfully, child worker looks at camera, 16:9",
    "1970s African village, thatched roofs, dirt roads, new mothers sitting outside with babies, warm afternoon light, 16:9",
    "saleswomen arriving in fake white nurse uniforms, carrying sample bags, warm welcoming smiles, 16:9",
    "saleswoman showing mother formula can with bright smile: 'Better for your baby than breastfeeding!', enthusiastic gesture, 16:9",
    "map layer appearing over scene showing contaminated water sources with warning symbols directly behind the saleswomen, 16:9",
    "village water pump with subtle contamination warning signs, locals drinking from it unaware, 16:9",
    "mother mixing formula powder with water from the village pump, not knowing the water is contaminated, 16:9",
    "timeline: free samples given for weeks, mother's milk supply decreasing shown as meter going down, 16:9",
    "mother's milk supply reaches zero, she looks at empty hands, only option now is to buy formula, 16:9",
    "mother at market stall with no money, looking at formula can price, can't afford it, worried expression, 16:9",
    "baby in hospital crib, sick from contaminated formula water, doctors attending, somber but tasteful visual, 16:9",
    "tally marks beginning to appear on dark background, counting slowly, 16:9",
    "tally marks continue filling the frame, more and more, 16:9",
    "screen filled entirely with tally marks, '10 Million' appears at bottom, overwhelming visual, 16:9",
    "annual report appearing on other side of screen, 'RECORD PROFITS' in cheerful corporate font, same year, 16:9",
    "character looking at death toll tally on left, profit report on right, no words needed, jaw drops, 16:9",
    "chocolate bar sitting in foreground, tally marks still visible in background, disconnect between product and consequence, 16:9",
    "ranking board: corporate food giant confirmed at #7, 16:9",
    "character exhales deeply, 'And now we reach the digital age of evil', looks at camera, 16:9",
    "'#6 FACEBOOK' title card, blue and dark palette, Facebook logo appearing, 16:9",
    "transition shot, social media icons flying past, Facebook logo dominates them all, 16:9",
    # FACEBOOK 181-213
    "New York Stock Exchange exterior, 2012, crowd gathered, Zuckerberg character ringing opening bell, celebration everywhere, 16:9",
    "Facebook logo spreading across world map rapidly, almost every country covered in blue, 16:9",
    "Zuckerberg character in boardroom at whiteboard, 'HOW DO WE GROW MORE?' written in big letters, thinking expression, 16:9",
    "world map with developing countries highlighted yellow, Zuckerberg pointing at them with plan, light bulb moment, 16:9",
    "'internet.org' logo appearing with sunshine and rainbows, cartoon people in developing countries smiling and looking at phones for first time, 16:9",
    "Zuckerberg in suit standing on the globe, spreading Facebook logo like wings over Africa and Southeast Asia, dramatic pose, 16:9",
    "happy green checkmarks appearing over Zambia, Philippines, India, Colombia on map one by one, 16:9",
    "Myanmar checkbox appears, a yellow warning triangle symbol appearing next to it, 16:9",
    "Facebook employee at desk noticing the Myanmar warning symbol on their screen, leaning forward, 16:9",
    "employee shrugs shoulders and clicks button labeled 'Expand Anyway', looks back at coffee mug, 16:9",
    "India scene, fake photoshopped image spreading across Facebook feed rapidly, shares multiplying, 16:9",
    "crowds forming in Indian street, people angry from misinformation, fire in background, 16:9",
    "line tracing from riot back to original Facebook post, chain of shares visualized, 16:9",
    "Facebook response: executive waves hand dismissively, 'Wow, that's unfortunate. Expand to the next country.', 16:9",
    "language moderation map showing Facebook's language coverage vs total world languages, enormous gap visible, 16:9",
    "tiny moderation team of exhausted workers staring at screen showing millions of posts to review, overwhelmed, 16:9",
    "Philippines map, propaganda posts spreading like red ink across the country, 16:9",
    "Cambodia, Sri Lanka, Ethiopia flags each appearing with warning symbols and fire icons, same pattern repeating, 16:9",
    "Myanmar map, UN report cover appearing: 'Facebook Role in Ethnic Cleansing', somber and clinical, 16:9",
    "internal memo on Zuckerberg's desk: 'Fixing misinformation = -15% engagement', highlighted line, 16:9",
    "Zuckerberg crossing it out slowly with red marker, writing 'ENGAGEMENT > EVERYTHING' underneath, deliberate motion, 16:9",
    "red REJECTED stamp slamming down on the safety proposal paper, final and definitive, 16:9",
    "news headlines appearing as wallpaper behind the REJECTED stamp, dark contrast, 16:9",
    "US Senate chamber, Zuckerberg character testifying before senators, calm blank face, 16:9",
    "senator leans forward aggressively asking question, Zuckerberg calmly: 'We take these concerns very seriously', 16:9",
    "Facebook stock chart going up steeply on left, human rights crisis severity chart also going up on right, both rising simultaneously, 16:9",
    "user profile data being harvested like fruit being picked from a tree made of Facebook icons, 16:9",
    "character casually scrolling Facebook on phone, completely unaware of giant data vacuum following them, 16:9",
    "ranking board: Facebook confirmed at #6, 16:9",
    "character: 'But the next company makes Facebook look like a charity', 16:9",
    "'#5 PALANTIR' title card, dark surveillance aesthetic, data streams visible, 16:9",
    "surveillance camera lens zooming in on Facebook logo, transitioning to Palantir section, 16:9",
    "character looks at phone nervously, shadow surveillance visual behind them, transition frame, 16:9",
    # PALANTIR 214-243
    "September 11 aftermath, government building, urgent emergency meeting, figures hunched over tables, maps everywhere, 16:9",
    "mass surveillance program: screens showing thousands of citizen profiles being monitored simultaneously, 16:9",
    "public protest outside government building, crowds with signs: 'NO SURVEILLANCE STATE', 16:9",
    "government official at podium: 'Mass surveillance program terminated, 2003', news broadcast style, 16:9",
    "two shadowy figures watching the announcement on TV together in dark room, 16:9",
    "both figures immediately pick up phones, scheming expressions, entrepreneurial evil energy, 16:9",
    "Peter Thiel character, sharp suit, slicked hair, powerful billionaire energy, 16:9",
    "Alex Karp character, bookish, philosophical look, stack of philosophy books under arm, 16:9",
    "giant CIA funding check falling from sky labeled 'In-Q-Tel Investment', two figures catch it, 16:9",
    "Palantir logo assembling itself from streams of flowing data, dramatic formation, 16:9",
    "Palantir HQ building exterior, dark glass and steel, imposing and secretive appearance, 16:9",
    "Palantir data dashboard showing ALL information streams flowing into one platform, overwhelming amount of data, 16:9",
    "dashboard section showing burger supply chain, inventory levels, truck locations, 16:9",
    "dashboard section showing bank employee communications, location tracking, activity monitoring, 16:9",
    "dashboard section labeled 'Predictive Policing', citizen risk scores next to names, 16:9",
    "dashboard section showing deportation target list, highlighted names, location data, 16:9",
    "character using Palantir dashboard suddenly sees their own profile in the system, face recognition box around their own image on screen, 16:9",
    "character slowly backing away from the screen in dawning horror, 16:9",
    "military contract signing ceremony, Palantir CEO shaking hands with generals, flags behind them, 16:9",
    "conflict zone map with targeting software interface overlaid, targeting coordinates visible, 16:9",
    "kill chain software sequence: target identified, path calculated, confirmed, eliminated, automated clinical steps, 16:9",
    "Palantir logo watermark appearing in corner of military targeting screen, branded warfare, 16:9",
    "Palantir CEO character at press conference: 'Our products are, in some cases, used to kill people', calm matter-of-fact tone, 16:9",
    "reporter character stops mid-note, pen frozen, stunned expression, 16:9",
    "CEO shrugs very casually: 'At least we're honest about it', 16:9",
    "character turns to camera: 'You know what? He's not wrong', 16:9",
    "Palantir stock chart going up alongside government contract value chart, both rising together, 16:9",
    "all data from previous companies flowing as streams into Palantir's central system, 16:9",
    "ranking board: Palantir confirmed at #5, 16:9",
    "'#4 PURDUE PHARMA' title card, pill bottle silhouette, ominous orange and dark palette, 16:9",
    # PURDUE PHARMA 244-274
    "1996 pharmaceutical launch party, executives in tuxedos with champagne flutes, balloons, formal celebration, 16:9",
    "spotlight hits OxyContin pill bottle being dramatically unveiled on a podium, 16:9",
    "Sackler family character raising champagne glass triumphantly: 'A blizzard of prescriptions!', manic energy, 16:9",
    "prescription papers raining down from ceiling like confetti at the launch party, executives celebrating, 16:9",
    "Purdue sales team receiving training materials, bold text: 'ADDICTION RISK: LESS THAN 1%', 16:9",
    "Purdue sales representative at doctor's office, gifts piled on desk, pamphlets spread out, charming presentation, 16:9",
    "whiteboard in doctor's office: 'Patient requesting more pills does not equal Addiction', 16:9",
    "whiteboard continues: 'Pseudo-addiction - The cure is MORE pills', doctor nodding and taking notes, 16:9",
    "doctor filling prescription pad rapidly, pen flying, stack of OxyContin scripts piling up, 16:9",
    "pharmacy counter, OxyContin being dispensed like candy, conveyor belt of orange pill bottles, 16:9",
    "patient progression timeline: receives Oxy, feels relief, needs more, dependency shown as chain forming, 16:9",
    "2001 newspaper headline: 'Prosecutor: Oxy Killed 59 People In Half My State', character reading it solemnly, 16:9",
    "private email shown on screen: from Sackler, 'Not too bad. Could have been much worse.', 16:9",
    "500,000 tally marks beginning to appear slowly on screen behind the email, 16:9",
    "Sackler character sipping coffee contentedly, oblivious to tally marks rapidly multiplying around him, 16:9",
    "tally marks completely filling the entire screen frame, '500,000' total appears, devastating visual, 16:9",
    "McKinsey consultant walking into pharma HQ lobby with briefcase, confident stride, expensive suit, 16:9",
    "consulting firm and pharma logos combining like two superheroes joining forces, evil partnership montage, 16:9",
    "presentation slide: 'TURBOCHARGE THE OXYCONTIN SALES ENGINE', bold font, professional formatting, 16:9",
    "another slide: 'Pay pharmacies a rebate for every customer who overdoses', consultant pointing at it proudly, 16:9",
    "even Purdue executives look visibly uncomfortable reading that specific slide, side-eyeing each other, 16:9",
    "character reaction: 'Keep in mind Purdue is the one saying that is too far', dark irony, 16:9",
    "bankruptcy filing papers on desk, pharma company name with filing stamp, 16:9",
    "court scene, judge's gavel coming down hard, 'GUILTY' stamp appearing, 16:9",
    "'$7.4 BILLION SETTLEMENT' text large on screen, character mouths 'wow', 16:9",
    "Sackler family loading money bags out the back door of courthouse while front door says 'BANKRUPT', 16:9",
    "family walking to private jet, family name on tail fin, relaxed and wealthy, 16:9",
    "family waves cheerfully from jet window as it takes off, courthouse tiny in background below, 16:9",
    "ranking board: Purdue Pharma confirmed at #4, 16:9",
    "character: 'The top 3 have been operating for over 100 years and are still going strong', 16:9",
    "'#3 EXXONMOBIL' title card, dark oil-black palette, oil drop forming the logo, 16:9",
    # EXXONMOBIL 275-305
    "oil company destroying river delta, oil spills spreading across water, military figures shown, 16:9",
    "offshore oil platform explosion, massive fire, oil slick spreading across ocean, 16:9",
    "character: 'But even those pale next to this one', points dramatically downward to reveal even darker company, 16:9",
    "1911, Standard Oil as single massive monopoly, Rockefeller character on throne of oil barrels, 16:9",
    "Supreme Court gavel shattering Standard Oil into 34 glass pieces, dramatic explosion visual, 16:9",
    "34 pieces scattering across US map, 16:9",
    "some pieces drifting slowly toward each other, beginning to merge, 16:9",
    "pieces solidify into Exxon logo, oil dripping from the letters, 16:9",
    "1970s Exxon research laboratory, scientists in lab coats working with equipment, retro aesthetic, 16:9",
    "climate research chart on scientist's desk, temperature curve pointing sharply upward, alarming trajectory, 16:9",
    "scientist's face draining of color as they read the findings, hands trembling slightly, 16:9",
    "scientist running urgently through corporate corridors clutching thick research report, 16:9",
    "board meeting room, executives reading the climate research report, faces serious and concerned, 16:9",
    "long heavy silence around the board table, everyone looking at the report, 16:9",
    "senior executive speaks one word: 'Shred it.' Points at the documents. Everyone nods, 16:9",
    "research documents being fed through paper shredder, important data destroyed, 16:9",
    "meanwhile: Exxon's 'Climate Doubt Campaign' headquarters being set up, opposite of what their research showed, 16:9",
    "New York Times newspaper, full-page oil company advertisement: 'Climate Science Remains Deeply Uncertain', 16:9",
    "same ad appearing in stack of newspapers spanning 30 years, calendar pages showing decades passing, 16:9",
    "think tank office receiving oil company funding check, scientists inside writing doubt papers cheerfully, 16:9",
    "side-by-side comparison: Exxon's own hidden 1970s climate predictions vs what they told the public, 16:9",
    "Exxon buries their own accurate chart under pile of 'doubt' documents, covers it over, 16:9",
    "politicians receiving oil lobby money in envelopes, then voting against climate legislation, 16:9",
    "decades of continued oil profits chart next to worsening climate data chart, both presented side by side, 16:9",
    "character standing at gas station pump, looking at Exxon logo with completely new understanding, 16:9",
    "ranking board: ExxonMobil confirmed at #3, 16:9",
    "character: 'Only two remain. And these make everyone else look like amateurs.', 16:9",
    "'#2 DUTCH EAST INDIA COMPANY' title card, 1600s golden era aesthetic, dark undertones, 16:9",
    "'#1 DUPONT' shadow visible beneath the #2 card, teasing the final entry, 16:9",
    "transition frame, Dutch galleon ships sailing across dark ocean toward title card, 16:9",
    # DUTCH EAST INDIA COMPANY 306-335
    "1600s European market stall, exotic spices displayed like precious jewels under special lighting, merchants hovering, 16:9",
    "Dutch merchant character holding nutmeg up to light, examining it with more reverence than gold, 16:9",
    "map of Indonesia with small islands labeled, glowing warmly, Dutch merchant eyes them hungrily, 16:9",
    "Dutch merchants sitting around round table, animated conversation, all very excited and greedy, 16:9",
    "one merchant drawing corporate structure diagram on parchment: 'Investors + Company = Shares of Profit', 16:9",
    "light bulb appearing over the table: 'WE JUST INVENTED CAPITALISM', everyone cheers, 16:9",
    "Amsterdam stock exchange being hastily established, first stock certificates being printed, investors lining up, 16:9",
    "VOC Dutch East India Company flag being raised on fleet of massive armed warships, 16:9",
    "one merchant pivots immediately: 'Now who wants an army?', points to warships in harbor, 16:9",
    "Dutch fleet of warships sailing toward Indonesia, timeline moving fast, 16:9",
    "1621, Banda Islands from bird's eye, peaceful village, nutmeg trees, calm scene, 16:9",
    "Dutch warships arriving at Banda Islands, flags planted, 16:9",
    "population meter: Banda Islands 15,000 drops rapidly to 1,500, near zero, clinical dark visual, 16:9",
    "survivors shown in chains being put to work harvesting nutmeg, 16:9",
    "slave ships arriving from various regions to replace the killed population, 16:9",
    "map showing Dutch flag planting across Southeast Asian islands rapidly, each accompanied by small fire animation, 16:9",
    "Sri Lanka being seized, Dutch troops landing, cinnamon trees in background, 'CINNAMON' label on island, 16:9",
    "South Africa, Cape Town harbor being established as VOC resupply base, Dutch flag raised, 16:9",
    "competing spice crops being set on fire to maintain monopoly, soldiers overseeing, 16:9",
    "spice trade route lines turning gold across the map, blood-red dripping beneath the gold, 16:9",
    "British East India Company forming in London, rival fleet being assembled in response, 16:9",
    "British Company army marching across India map, size comparison text: 'Larger than actual British Royal Army', 16:9",
    "opium ships sailing from India to China, enormous quantity of cargo visible, 16:9",
    "Chinese official holding up 'NO' sign to opium ships, British ships pointing cannons in response, 16:9",
    "Opium Wars: China forced to accept, mass addiction spreading across map of China, 16:9",
    "British parliament: company quietly dissolved in 1874, door with 'EAST INDIA COMPANY - CLOSED' sign, 16:9",
    "British government keeping everything the company built: India map, trade routes, all assets transferred, 16:9",
    "rebrand visual: 'EAST INDIA COMPANY' name crossed out with red X, replaced with 'BRITISH GOVERNMENT', same building, 16:9",
    "ranking board: Dutch East India Company confirmed at #2, 16:9",
    "'#1 - DUPONT' title card with maximum drama, gold crown, dark background, 16:9",
    # DUPONT 336-370
    "'#1 - DUPONT - THE WINNER' dramatic reveal, dark stage, spotlight, crown descends onto DuPont logo, 16:9",
    "1938 DuPont laboratory interior, bright clean American optimism, scientists in crisp white lab coats, 16:9",
    "chemist character accidentally knocks container, shiny slippery substance spills across entire desk surface, 16:9",
    "chemist touches substance, hand slides across desk with zero friction, eyes light up with discovery, 16:9",
    "'TEFLON' written in giant letters on the discovery chalkboard, chemist draws circle around it triumphantly, 16:9",
    "DuPont executives watching demonstration: egg sliding perfectly off Teflon pan with zero effort, amazed expressions, 16:9",
    "DuPont factory floor producing Teflon pans at industrial scale, fast-forward animation, conveyor belts, 16:9",
    "1950s American kitchen, happy housewife using Teflon pan, eggs sliding perfectly, sunshine through window, classic Americana, 16:9",
    "world map: Teflon spreading to every kitchen globally, icon of frying pan appearing in every country, 16:9",
    "DuPont profit chart skyrocketing: '$1 BILLION per year' labeled, executives celebrating, 16:9",
    "chemistry diagram on whiteboard: PFOA molecule structure, labeled 'Chemical used to manufacture Teflon', 16:9",
    "PFOA label reading 'FOREVER CHEMICAL - Does Not Break Down in Nature, Ever', dramatic text, 16:9",
    "DuPont internal research laboratory, scientists testing PFOA effects on laboratory animals, 16:9",
    "research report pages filling up: 'Animals die at these exposure levels', data graphs, grim findings, 16:9",
    "more research pages: 'Linked to birth defects in humans', charts and statistics, clinical and alarming, 16:9",
    "more pages: 'Cancer rates elevated among workers and nearby communities', overwhelming evidence building, 16:9",
    "researcher carrying the enormous thick research report to corporate boardroom, walking with determination, 16:9",
    "executives sitting around board table reading the PFOA research report, very serious faces, 16:9",
    "executive begins speaking: 'We simply cannot have our chemicals killing people...', everyone leans forward with hope, 16:9",
    "executive finishes: '...getting in the way of our profits.' everyone slumps with disappointment, 16:9",
    "money bags appear on table, '$1 BILLION ANNUAL PROFIT AT RISK' label, final decision: profits win, 16:9",
    "decision written on whiteboard: 'Do not publish the research. Do not tell regulators. Continue production.', 16:9",
    "PFOA being dumped in barrels into rivers and landfills, large industrial scale, 16:9",
    "DuPont waste management office, employee tries to calculate total dumped, question marks piling up, 'lost count' expression, 16:9",
    "1998, West Virginia farm, green rolling hills, but dead animals scattered across the fields, 16:9",
    "farmer noticing sick and dying animals, looking around confused, 16:9",
    "farmer looks over fence at the chemical plant visible in the distance, realization forming, 16:9",
    "farmer calls lawyer character, describes the situation over phone, 16:9",
    "DuPont legal truck arriving and unloading: 110,000 document pages, shown as enormous skyscraper-tall stack, 16:9",
    "lawyer sits down at desk with determined expression, opens first page of 110,000, reading glasses on, 16:9",
    "lawyer many months later, surrounded by notes, connecting evidence dots, finding decade-spanning cover-up, 16:9",
    "DuPont forced into court, compensation settlement papers being signed, hundreds of millions, 16:9",
    "world map lighting up red country by country: '99% of Humans Have PFAS in Their Blood', 16:9",
    "zoom into human body diagram, blood vessels shown with floating PFAS chemical symbols inside, 16:9",
    "character looking slowly at their own arm, then at camera, text appearing: 'Including you', 16:9",
    # OUTRO 371-380
    "all 10 company logos arranged in a dark circle on screen, waiting for final revelation, 16:9",
    "each logo slowly reveals an everyday product the character uses — shoes on feet, soda in hand, flying airplane, 16:9",
    "character surrounded on all sides by products from all 10 companies, completely encircled, 16:9",
    "character looks left, looks right, looks at camera — all exits blocked by corporate products, 16:9",
    "all 10 logos slowly closing in from every direction toward the trapped character, 16:9",
    "character accepts reality, resigned shrug, 'There is no escaping this', 16:9",
    "final corporate web visual: every product connected to every company, all connected, character in the center, 16:9",
    "subscribe button appearing dramatically with glow animation, character points at it enthusiastically, 16:9",
    "character holds microphone waiting with eyebrows raised, comment section appearing with 'Which company is most evil?', 16:9",
    "channel end card with dark gold branding, all 10 logos small in corners, dramatic and polished, 16:9",
]


def generate_image(prompt, index):
    full_prompt = STYLE_PREFIX + prompt
    encoded = urllib.parse.quote(full_prompt)
    url = POLLINATIONS_URL.format(prompt=encoded, seed=index * 42)

    for attempt in range(4):
        try:
            resp = requests.get(url, timeout=120)
            resp.raise_for_status()
            if len(resp.content) < 1000:
                raise ValueError("Response too small, likely an error page")

            filepath = os.path.join(OUTPUT_DIR, f"{index:03d}.jpg")
            with open(filepath, "wb") as f:
                f.write(resp.content)
            return True

        except Exception as e:
            wait = 2 ** attempt * 5
            print(f"  Attempt {attempt+1} failed: {e} — retrying in {wait}s")
            if attempt < 3:
                time.sleep(wait)
    return False


def main():
    Path(OUTPUT_DIR).mkdir(exist_ok=True)

    progress = {}
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE) as f:
            progress = json.load(f)

    total = len(PROMPTS)
    done = sum(1 for v in progress.values() if v == "done")
    failed = []

    print(f"Total prompts: {total} | Already done: {done} | Remaining: {total - done}")
    print(f"Output dir: {OUTPUT_DIR}/\n")

    for i, prompt in enumerate(PROMPTS, 1):
        key = str(i)
        if progress.get(key) == "done":
            continue

        print(f"[{i:03d}/{total}] Generating...", end=" ", flush=True)
        success = generate_image(prompt, i)

        if success:
            progress[key] = "done"
            with open(PROGRESS_FILE, "w") as f:
                json.dump(progress, f)
            done += 1
            print(f"OK  ({done}/{total} total done)")
        else:
            failed.append(i)
            print(f"FAILED")

        time.sleep(0.3)

    print(f"\nDone! Generated: {done}/{total}")
    if failed:
        print(f"Failed indices: {failed}")


if __name__ == "__main__":
    main()
