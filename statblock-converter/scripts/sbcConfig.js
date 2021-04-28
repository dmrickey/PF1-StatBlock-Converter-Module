import { sbcContent } from "./sbcContent.js"

export const sbcConfig = {};

/* ------------------------------------ */
/* sbc configuration               		*/
/* ------------------------------------ */

sbcConfig.modData = {
    "version": "3.1.3",
    "mod": "pf1-statblock-converter",
    "modName": "sbc | PF1 Statblock Converter"
}

sbcConfig.const = {
    "lineheight": 20,
    "crFractions": { "1/8" : 0.125, "1/6" : 0.1625, "1/4": 0.25, "1/3": 0.3375, "1/2": 0.5 },
    "actorType": { 0 : "npc", 1 : "character" },
    "tokenBarAttributes": [
        "attributes.hp",
        "spells.spellbooks.primary.spellPoints",
        "spells.spellbooks.secondary.spellPoints",
        "spells.spellbooks.tertiary.spellPoints",
        "spells.spellbooks.spelllike.spellPoints",
        "details.xp",
        "attributes.ac.normal.total",
        "attributes.ac.flatFooted.total",
        "attributes.ac.touch.total",
        "attributes.cmd.total",
        "attributes.speed.land.total",
        "attributes.speed.land.fly.total",
        "attributes.speed.land.swim.total",
        "attributes.speed.land.climb.total",
        "attributes.speed.land.burrow.total",
        "attributes.sr.total"  
    ]
}

sbcConfig.options = {
    "actorReady": false,
    "debug": false,
    "inputDelay": 1000,
    "defaultActorType": 0,
    "tokenSettings": {
        "displayName": 20,
        "vision": false,
        "disposition": -1,
        "displayBars": 20,
        "bar1": {},
        "bar2": {}
    },
    "flags": {
        "noStr": false,
        "noDex": false,
        "noCon": false,
        "noInt": false,
        "noWis": false,
        "noCha": false,
        "isUndead": false
        
    }
}

sbcConfig.initializeConfig = async function () {

    let raceIndex = await game.packs.get("pf1.races").getIndex()
    for (let key in raceIndex) { if (raceIndex[key].name !== "") { sbcConfig.races.push(raceIndex[key].name) } }

    let classIndex = await game.packs.get("pf1.classes").getIndex()
    for (let key in classIndex) { if (classIndex[key].name !== "") { sbcConfig.classes.push(classIndex[key].name.replace(/[()]*/g,"")) } }

    let prestigeClassIndex = Object.keys(sbcContent.prestigeClasses)
    for (let key in prestigeClassIndex) { if (prestigeClassIndex[key].name !== "") { sbcConfig.prestigeClassNames.push(prestigeClassIndex[key]) } }

    let featsIndex = await game.packs.get("pf1.feats").getIndex()
    for (let key in featsIndex) { if (featsIndex[key].name !== "") { sbcConfig.feats.push(featsIndex[key].name) } }

    let weaponIndex = await game.packs.get("pf1.weapons-and-ammo").getIndex()
    for (let key in weaponIndex) { if (weaponIndex[key].name !== "") { sbcConfig.weapons.push(weaponIndex[key].name) } }

    let armorsIndex = await game.packs.get("pf1.armors-and-shields").getIndex()
    for (let key in armorsIndex) { if (armorsIndex[key].name !== "") { sbcConfig.armors.push(armorsIndex[key].name) } }

    let itemIndex = await game.packs.get("pf1.items").getIndex()
    for (let key in itemIndex) { if (itemIndex[key].name !== "") { sbcConfig.items.push(itemIndex[key].name) } }

    let classAbilitiesIndex = await game.packs.get("pf1.class-abilities").getIndex()
    for (let key in classAbilitiesIndex) { if (classAbilitiesIndex[key].name !== "") { sbcConfig["class-abilities"].push(classAbilitiesIndex[key].name) } }

}


/* ------------------------------------ */
/* Compendium-Related              		*/
/* ------------------------------------ */

sbcConfig.races = []
sbcConfig.classes = []
sbcConfig.prestigeClassNames = []
sbcConfig.feats = []
sbcConfig.weapons = []
sbcConfig.armors = []
sbcConfig.items = []
sbcConfig.skills = []
sbcConfig["class-abilities"] = []

/* ------------------------------------ */
/* Weapons, Attacks and Armor     		*/
/* ------------------------------------ */

sbcConfig.weaponAttacks = {
    "Claw": {"type": "B and S", "special": "-"},
    "Talon": {"type": "S", "special": "-"},
    "Sting": {"type": "P", "special": "-"},
    "Slam": {"type": "B", "special": "-"},
    "Tail": {"type": "B", "special": "-"},
    "Pincer": {"type": "B", "special": "-"},
    "Wing": {"type": "B", "special": "-"},
    "Tentacle": {"type": "B", "special": "-"},
    "Hoof": {"type": "B", "special": "-"},
    "Gore": {"type": "P", "special": "-"},
    "Bite": {"type": "B, P and S", "special": "-"},
    "Aklys": {"type": "B", "special": "performance, trip" },
    "Ammentum": { "type": "P", "special": "performance" },
    "Ankus": { "type": "P", "special": "disarm, trip" },
    "Boarding Axe": { "type": "P or S", "special": "-" },
    "Butchering Axe": { "type": "S", "special": "see text" },
    "Hooked Axe": { "type": "S", "special": "disarm, performance, trip" },
    "Knuckle Axe": { "type": "S", "special": "monk, performance" },
    "Orc Double Axe": { "type": "S", "special": "double" },
    "Throwing Axe": { "type": "S", "special": "-" },
    "Dwarven Heavy Axe-Gauntlet": { "type": "S", "special": "blocking, disarm" },
    "Dwarven Light Axe-Gauntlet": { "type": "S", "special": "blocking, disarm" },
    "Barbazu beard": { "type": "S", "special": "see text" },
    "Bardiche": { "type": "S", "special": "brace, reach, see text" },
    "Battle aspergillum": { "type": "B", "special": "see text" },
    "Gnome Battle Ladder": { "type": "B", "special": "trip" },
    "Battle poi": { "type": "fire", "special": "-" },
    "Battleaxe": { "type": "S", "special": "-" },
    "Bayonet": { "type": "P", "special": "-" },
    "Bec de corbin": { "type": "B or P", "special": "brace, reach, see text" },
    "Bill": { "type": "S", "special": "brace, disarm, reach, see text" },
    "Blade boot": { "type": "P", "special": "see text" },
    "Blowgun": { "type": "P", "special": "-" },
    "Boarding gaff": { "type": "S", "special": "double, reach, trip" },
    "Boarding pike": { "type": "P", "special": "brace, reach" },
    "Bola": { "type": "B", "special": "nonlethal, trip" },
    "Brutal Bola": { "type": "B and P", "special": "trip" },
    "Boomerang": { "type": "B", "special": "-" },
    "Thorn Bow": { "type": "P", "special": "-" },
    "Brass knife": { "type": "P or S", "special": "fragile" },
    "Brass knuckles": { "type": "B", "special": "monk" },
    "Broken-back seax": { "type": "P & S", "special": "see text" },
    "Cat-o’-nine-tails": { "type": "S", "special": "disarm, nonlethal" },
    "Cestus": { "type": "B or P", "special": "monk" },
    "Spiked Chain": { "type": "P", "special": "disarm, trip" },
    "Chain-hammer": { "type": "B", "special": "double, see text" },
    "Chakram": { "type": "S", "special": "-" },
    "Claw blades": { "type": "B or S", "special": "see text" },
    "Club": { "type": "B", "special": "-" },
    "Mere Club": { "type": "B or P", "special": "fragile" },
    "Combat scabbard": { "type": "B", "special": "improvised, see text" },
    "Crook": { "type": "B", "special": "reach, trip" },
    "Heavy Crank Crossbow": { "type": "P", "special": "-" },
    "Light Crank Crossbow": { "type": "P", "special": "-" },
    "Double Crossbow": { "type": "P", "special": "-" },
    "Hand Crossbow": { "type": "P", "special": "-" },
    "Heavy Crossbow": { "type": "P", "special": "-" },
    "Launching Crossbow": { "type": "-", "special": "see text" },
    "Light Crossbow": { "type": "P", "special": "-" },
    "Repeating Heavy Crossbow": { "type": "P", "special": "-" },
    "Repeating Light Crossbow": { "type": "P", "special": "-" },
    "Elven Curve blade": { "type": "S", "special": "-" },
    "Cutlass": { "type": "S", "special": "-" },
    "Dagger": { "type": "P or S", "special": "-" },
    "Dueling Dagger": { "type": "P or S", "special": "see text" },
    "Punching Dagger": { "type": "P", "special": "-" },
    "Swordbreaker Dagger": { "type": "S", "special": "disarm, sunder" },
    "Dart": { "type": "P", "special": "-" },
    "Jolting Dart": { "type": "P", "special": "see text" },
    "Dogslicer": { "type": "S", "special": "fragile" },
    "Dwarven Dorn-Dergar": { "type": "B", "special": "reach, see text" },
    "Double spear": { "type": "P", "special": "double" },
    "Earth breaker": { "type": "B", "special": "-" },
    "Elven branched spear": { "type": "P", "special": "brace, reach" },
    "Estoc": { "type": "P", "special": "-" },
    "Falcata": { "type": "S", "special": "-" },
    "Falchion": { "type": "S", "special": "-" },
    "Fauchard": { "type": "S", "special": "reach, trip" },
    "Dire Flail": { "type": "B", "special": "disarm, double, trip" },
    "Heavy Flail": { "type": "B", "special": "disarm, trip" },
    "Light Flail": { "type": "B", "special": "disarm, trip" },
    "Flailpole": { "type": "B", "special": "disarm, reach, trip" },
    "Flambard": { "type": "S", "special": "sunder" },
    "Flask Thrower": { "type": "-", "special": "see text" },
    "Flickmace": { "type": "B", "special": "reach, trip" },
    "Flindbar": { "type": "B and P", "special": "disarm, trip" },
    "Flying blade": { "type": "S", "special": "performance, reach" },
    "Flying Talon": { "type": "P", "special": "disarm, trip" },
    "Gandasa": { "type": "S", "special": "-" },
    "Garrote": { "type": "S", "special": "grapple, see text" },
    "Gauntlet": { "type": "B", "special": "-" },
    "Spiked Gauntlet": { "type": "P", "special": "attached" },
    "Dwarven Giant-Sticker": { "type": "P or S", "special": "brace, reach" },
    "Gladius": { "type": "P or S", "special": "performance" },
    "Glaive": { "type": "S", "special": "reach" },
    "Glaive-guisarme": { "type": "S", "special": "brace, reach, see text" },
    "Gnome pincher": { "type": "B", "special": "disarm, see text" },
    "Grappling hook": { "type": "P", "special": "grapple" },
    "Greataxe": { "type": "S", "special": "-" },
    "Greatclub": { "type": "B", "special": "-" },
    "Greatsword": { "type": "S", "special": "-" },
    "Guisarme": { "type": "S", "special": "reach, trip" },
    "Halberd": { "type": "P or S", "special": "brace, trip" },
    "Halfling rope-shot": { "type": "B", "special": "disarm" },
    "Gnome hooked Hammer": { "type": "B or P", "special": "double, trip" },
    "Light Hammer": { "type": "B", "special": "-" },
    "Lucerne Hammer": { "type": "B or P", "special": "brace, reach, see text" },
    "Handaxe": { "type": "S", "special": "-" },
    "Handwraps": { "type": "-", "special": "See text" },
    "Harpoon": { "type": "P", "special": "grapple" },
    "Dwarven boulder Helmet": { "type": "B", "special": "see text" },
    "Hook hand": { "type": "S", "special": "disarm, attached, see text" },
    "Orc Hornbow": { "type": "P", "special": "-" },
    "Horsechopper": { "type": "P or S", "special": "reach, trip" },
    "Hunga munga": { "type": "P", "special": "-" },
    "Hurlbat": { "type": "P and S", "special": "-" },
    "Javelin": { "type": "P", "special": "-" },
    "Stormshaft Javelin": { "type": "P", "special": "see text" },
    "Kama": { "type": "S", "special": "monk, trip" },
    "Tri-Bladed Katar": { "type": "P", "special": "-" },
    "Khopesh": { "type": "S", "special": "trip" },
    "Klar": { "type": "S", "special": "-" },
    "Butterfly Knife": { "type": "P or S", "special": "-" },
    "Deer Horn Knife": { "type": "P", "special": "blocking, monk" },
    "Switchblade Knife": { "type": "P", "special": "-" },
    "Knobkerrie": { "type": "B", "special": "see text" },
    "Pounder Kobold tail attachment": { "type": "B", "special": "-" },
    "Razored Kobold tail attachment": { "type": "S", "special": "-" },
    "Spiked Kobold tail attachment": { "type": "P", "special": "-" },
    "Sweeper Kobold tail attachment": { "type": "B", "special": "trip" },
    "Long Lash Kobold tail attachment": { "type": "S", "special": "reach" },
    "Kukri": { "type": "S", "special": "-" },
    "Kumade": { "type": "P", "special": "grapple" },
    "Collapsible Kumade": { "type": "P", "special": "grapple" },
    "Kunai": { "type": "B or P", "special": "tool" },
    "Lance": { "type": "P", "special": "reach" },
    "Lantern staff": { "type": "B", "special": "see text" },
    "Lasso": { "type": "-", "special": "see text" },
    "Dwarven Longaxe": { "type": "S", "special": "reach" },
    "Longbow": { "type": "P", "special": "-" },
    "Long bow": { "type": "P", "special": "-" },
    "Composite Longbow": { "type": "P", "special": "Strength (0-5)" },
    "Dwarven Longhammer": { "type": "B", "special": "reach" },
    "Longspear": { "type": "P", "special": "brace, reach" },
    "Long spear": { "type": "P", "special": "brace, reach" },
    "Longsword": { "type": "S", "special": "-" },
    "Long sword": { "type": "S", "special": "-" },
    "Heavy Mace": { "type": "B", "special": "-" },
    "Light Mace": { "type": "B", "special": "-" },
    "Machete": { "type": "S", "special": "-" },
    "Mancatcher": { "type": "P", "special": "grapple, reach, see text" },
    "Manople": { "type": "P or S", "special": "blocking, disarm" },
    "Dwarven Maulaxe": { "type": "B or S", "special": "-" },
    "Morningstar": { "type": "B and P", "special": "-" },
    "Net": { "type": "-", "special": "-" },
    "Snag Net": { "type": "P", "special": "trip, see text" },
    "Nunchaku": { "type": "B", "special": "disarm, monk" },
    "Ogre hook": { "type": "P", "special": "trip" },
    "Orc skull ram": { "type": "B", "special": "reach" },
    "Dwarven Heavy Pelletbow": { "type": "B", "special": "-" },
    "Dwarven Light Pelletbow": { "type": "B", "special": "-" },
    "Heavy Pick": { "type": "P", "special": "-" },
    "Light Pick": { "type": "P", "special": "-" },
    "Pickaxe": { "type": "P", "special": "-" },
    "Pilum": { "type": "P", "special": "see text" },
    "Gnome Piston maul": { "type": "B", "special": "see text" },
    "Planson": { "type": "B or P", "special": "brace" },
    "Quadrens": { "type": "P", "special": "performance" },
    "Quarterstaff": { "type": "B", "special": "double, monk" },
    "Dwarven Ram Hammer": { "type": "B", "special": "-" },
    "Ranseur": { "type": "P", "special": "disarm, reach" },
    "Rapier": { "type": "P", "special": "finesse" },
    "Spiral Rapier": { "type": "P", "special": "blocking, disarm, see text" },
    "Ratfolk tailblade": { "type": "S", "special": "-" },
    "Drow Razor": { "type": "S", "special": "see text" },
    "Rhoka": { "type": "S", "special": "-" },
    "Gnome Ripsaw glaive": { "type": "S", "special": "reach, see text" },
    "Rope gauntlet": { "type": "B (or S)", "special": "-" },
    "Sawtooth Sabre": { "type": "S", "special": "-" },
    "Sai": { "type": "B", "special": "disarm, monk" },
    "Sanpkhang": { "type": "P or S", "special": "monk, see text" },
    "Sap": { "type": "B", "special": "nonlethal" },
    "Combat Scabbard": { "type": "S", "special": "see text" },
    "Bladed Scarf": { "type": "S", "special": "disarm, trip" },
    "Scimitar": { "type": "S", "special": "-" },
    "Scizore": { "type": "P", "special": "-" },
    "Scythe": { "type": "P or S", "special": "trip" },
    "Sea-knife": { "type": "S", "special": "-" },
    "Heavy Shield": { "type": "B", "special": "-" },
    "Light Shield": { "type": "B", "special": "-" },
    "Throwing Shield": { "type": "B", "special": "performance, trip" },
    "Shortbow": { "type": "P", "special": "-" },
    "Short bow": { "type": "P", "special": "-" },
    "Composite Shortbow": { "type": "P", "special": "-" },
    "Shortspear": { "type": "P", "special": "-" },
    "Shotel": { "type": "P", "special": "performance" },
    "Shrillshaft javelin": { "type": "P", "special": "see text" },
    "Shuriken": { "type": "P", "special": "monk" },
    "Siangham": { "type": "P", "special": "monk" },
    "Sica": { "type": "S", "special": "performance" },
    "Sickle": { "type": "S", "special": "trip" },
    "Sickle-sword": { "type": "S", "special": "distracting, see text" },
    "Sling": { "type": "B", "special": "-" },
    "Sling glove": { "type": "B", "special": "-" },
    "Halfling Sling staff": { "type": "B", "special": "-" },
    "Double Sling": { "type": "B", "special": "double, see text" },
    "Stitched Sling": { "type": "B", "special": "disarm, trip" },
    "Spear": { "type": "P", "special": "brace" },
    "Boar Spear": { "type": "P", "special": "brace, see text" },
    "Syringe Spear": { "type": "P", "special": "brace, see text" },
    "Totem Spear": { "type": "P or S", "special": "see text" },
    "Weighted Spear": { "type": "B or P", "special": "brace, double" },
    "Spear-sling": { "type": "P", "special": "see text" },
    "Dwarven Sphinx Hammer": { "type": "B", "special": "-" },
    "Spiked armor": { "type": "P", "special": "-" },
    "Heavy Spiked shield": { "type": "P", "special": "-" },
    "Light Spiked shield": { "type": "P", "special": "-" },
    "Split-blade sword": { "type": "S", "special": "disarm, trip, see text" },
    "Spring blade": { "type": "P or S", "special": "see text" },
    "Starknife": { "type": "P", "special": "-" },
    "Stingchuck": { "type": "B", "special": "see text" },
    "Stonebow": { "type": "B", "special": "-" },
    "Switchscythe": { "type": "P or S", "special": "trip" },
    "Sword cane": { "type": "P", "special": "see text" },
    "Bastard Sword": { "type": "S", "special": "-" },
    "Dueling Sword": { "type": "S", "special": "-" },
    "Short Sword": { "type": "P", "special": "-" },
    "Two-Bladed Sword": { "type": "S", "special": "double" },
    "Terbutje": { "type": "S", "special": "fragile" },
    "Dteel Terbutje": { "type": "S", "special": "-" },
    "Thorn bracer": { "type": "P", "special": "-" },
    "Throwing arrow cord": { "type": "P", "special": "-" },
    "Tongi": { "type": "P", "special": "-" },
    "Traveling kettle": { "type": "B", "special": "monk, see text" },
    "Trident": { "type": "P", "special": "brace" },
    "Unarmed strike": { "type": "B", "special": "nonlethal" },
    "Dwarven Urgrosh": { "type": "P or S", "special": "brace, double" },
    "War razor": { "type": "S", "special": "-" },
    "Dwarven Waraxe": { "type": "S", "special": "-" },
    "Dwarven Double Waraxe": { "type": "S", "special": "see text" },
    "Warhammer": { "type": "B", "special": "-" },
    "Dwarven War-shield": { "type": "P or S", "special": "see text" },
    "Waveblade": { "type": "P or S", "special": "monk, see text" },
    "Whip": { "type": "S", "special": "disarm, nonlethal, reach, trip" },
    "Scorpion Whip": { "type": "S", "special": "disarm, performance, reach, trip" },
    "Wooden stake": { "type": "P", "special": "-" },
    "Wrist launcher": { "type": "P", "special": "-" },
    "Heavy Wrist launcher": { "type": "P", "special": "-" }
}

sbcConfig.damageTypes = {
    "b": "bludgeoning",
    "p": "piercing",
    "s": "slashing",
    "c": "cold",
    "f": "fire",
    "e": "electricity",
    "s": "sonic",
    "a": "acid",
    "force": "force",
    "negative": "negative",
    "positive": "positive"
}

sbcConfig.armorBonusTypes = [
    "dex",
    "armor",
    "shield",
    "natural",
    "base",
    "enhancement",
    "dodge",
    "inherent",
    "deflection",
    "morale",
    "luck",
    "sacred",
    "insight",
    "resistance",
    "profane",
    "trait",
    "racial",
    "size",
    "competence",
    "circumstance",
    "alchemical",
    "penalty",
    "rage",
    "monk",
    "wis"
]

/* ------------------------------------ */
/* Skills and Features             		*/
/* ------------------------------------ */

sbcConfig.skills = {
    "acrobatics": "acr",
    "artistry": "art",
    "appraise": "apr",
    "bluff": "blf",
    "climb": "clm",
    "craft": "crf",
    "diplomacy": "dip",
    "disable device": "dev",
    "disguise": "dis",
    "escape artist": "esc",
    "fly": "fly",
    "handle animal": "han",
    "heal": "hea",
    "intimidate": "int",
    "knowledge": {
        "arcana": "kar",
        "dungeoneering": "kdu",
        "engineering": "ken",
        "geography": "kge",
        "history": "khi",
        "local": "klo",
        "nature": "kna",
        "nobility": "kno",
        "planes": "kpl",
        "religion": "kre"
    },
    "linguistics": "lin",
    "lore": "lor",
    "perception": "per",
    "perform": "prf",
    "profession": "pro",
    "ride": "rid",
    "sense motive": "sen",
    "sleight of hand": "slt",
    "spellcraft": "spl",
    "stealth": "ste",
    "survival": "sur",
    "swim": "swm",
    "use magic device": "umd"
}

sbcConfig.specialAbilityTypes = {
    "ex": "Extraordinary",
    "su": "Supernatural",
    "sp": "Special"
}

sbcConfig.classFeatures = [
    "arcane bond",
    "bloodline",
    "sneak attack",
    "trapfinding",
    "evasion",
    "rogue talents",
    "rogue talent",
    "trap sense",
    "favored enemy",
    "track",
    "wild empathy",
    "endurance",
    "smite evil",
    "divine grace",
    "lay on hands",
    "divine bond",
    "mercy",
    "favored terrain",
    "hunter's bond",
    "quarry",
    "flurry of blows",
    "stunning fist",
    "ki",
    "bravery",
    "weapon training",
    "armor training",
    "wild shape",
    "bardic performance",
    "bardic knowledge",
    "inspire courage",
    "inspire competence",
    "lore master",
    "versatile performance",
    "countersong",
    "distraction",
    "fascinate",
    "dirge of doom",
    "inspire heroics",
    "rage power",
    "rage",
    "damage reduction",
    "dual identity",
    "vigilante talent",
    "social talent",
    "hex",
    "eidolon",
    "defensive instinct",
    "shifter",
    "chimeric",
    "mystery",
    "relevation",
    "divine might",
    "commune",
    "arcane pool",
    "spellstrike",
    "magus arcana",
    "spell combat",
    "knowledge pool",
    "domain",
    "judgement",
    "solo tactics",
    "bane",
    "exploit weakness",
    "panache",
    "grit",
    "nimble",
    "gun training",
    "deeds",
    "phrenic",
    "channel",
    "challenge",
    "bomb",
    "poison resistance",
    "discovery",
    "mutagen",
    "fervor",
    "blessings",
    "sacred weapon",
    "charmed life",
    "swashbuckler weapon training",
    "studied target",
    "slayer talent",
    "inspired rage",
    "raging song",
    "spell kenning",
    "alchemy",
    "investigator talent",
    "studied strike",
    "animal companion",
    "animal focus",
    "brawler's flurry",
    "maneuver training",
    "martial flexibility",
    "knockout",
    "brawler's strike",
    "arcane reservoir",
    "arcanist exploit",
    "ninja trick",
    "uncanny dodge",
    "no trace",
    "smite good",
    "calm spirit",
    "phantom recall",
    "bonded manifestation",
    "discipline",
    "psychic",
    "focus power",
    "implements",
    "shift focus",
    "outside contact",
    "mesmerist",
    "touch treatment",
    "manifold tricks",
    "spirit bonus",
    "spirit power",
    "spirit surge",
    "burn",
    "elemental overflow",
    "infusion",
    "internal buffer",
    "utility wild talent",
    "metakinesis",
    "metakinetic"
]

sbcConfig.spellCastingClasses = [
    "adept",
    "alchemist",
    "antipaladin",
    "arcanist",
    "bard",
    "bloodrager",
    "cleric",
    "druid",
    "hunter",
    "inquisitor",
    "investigator",
    "magus",
    "medium",
    "mesmerist",
    "occultist",
    "oracle",
    "paladin",
    "psychic",
    "ranger",
    "red mantis assassin",
    "sahir-afiyun",
    "shaman",
    "skald",
    "sorcerer",
    "spiritualist",
    "summoner",
    "warpriest",
    "witch",
    "wizard"
]

sbcConfig.metamagic = [
    "Apocalyptic",
    "Aquatic",
    "Ascendant",
    "Authoritative",
    "Benthic",
    "Blissful",
    "Bouncing",
    "Brackish",
    "Brisk",
    "Burning",
    "Centered",
    "Cherry Blossom",
    "Coaxing",
    "Concussive",
    "Conditional",
    "Consecrate",
    "Contagious",
    "Contingent",
    "Crypt",
    "Dazing",
    "Delayed",
    "Disruptive",
    "Echoing",
    "Eclipsed",
    "Ectoplasmic",
    "Elemental",
    "Empower",
    "Empowered",
    "Encouraging",
    "Enlarge",
    "Enlarged",
    "Extend",
    "Extended",
    "Familiar",
    "Fearsome",
    "Flaring",
    "Fleeting",
    "Focused",
    "Furious",
    "Heighten",
    "Heightened",
    "Intensified",
    "Intuitive",
    "Jinxed",
    "Latent Curse",
    "Lingering",
    "Logical",
    "Maximize",
    "Maximized",
    "Merciful",
    "Murky",
    "Persistent",
    "Piercing",
    "Quicken",
    "Quickened",
    "Reach",
    "Rime",
    "Scarring",
    "Scouting Summons",
    "Seeking",
    "Selective",
    "Shadow Grasp",
    "Sickening",
    "Silent",
    "Snuffing",
    "Solar",
    "Solid Shadows",
    "Stable",
    "Steam",
    "Still",
    "Stilled",
    "Studied",
    "Stygian",
    "Stylized",
    "Tenacious",
    "Tenebrous",
    "Thanatopic",
    "Threatening Illusion",
    "Threnodic",
    "Thundering",
    "Toppling",
    "Toxic",
    "Traumatic",
    "Trick",
    "Tumultuous",
    "Umbral",
    "Ursurping",
    "Vast",
    "Verdant",
    "Widen",
    "Widened",
    "Yai-Mimic"
]