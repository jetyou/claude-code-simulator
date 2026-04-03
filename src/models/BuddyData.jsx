// ============================================================
// BuddyData.jsx — Species, Rarity, Personality, Identity
// High-fidelity data model matching Claude Code's /buddy system
// ============================================================

// ---- Deterministic RNG (FNV-1a + Mulberry32) ----

function fnv1aHash(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- Species Registry (6 species, 5-line ASCII each) ----

const SPECIES = [
  {
    id: 'cat',
    name: 'Cat',
    frames: {
      idle: [
        '  /\\_/\\  ',
        ' ( o.o ) ',
        '  > ^ <  ',
        ' /|   |\\ ',
        '(_|   |_)',
      ],
      happy: [
        '  /\\_/\\  ',
        ' ( ^.^ ) ',
        '  > ^ <  ',
        ' /|   |\\ ',
        '(_|   |_)',
      ],
      sad: [
        '  /\\_/\\  ',
        ' ( T.T ) ',
        '  > ^ <  ',
        ' /|   |\\ ',
        '(_|   |_)',
      ],
      blink: [
        '  /\\_/\\  ',
        ' ( -.- ) ',
        '  > ^ <  ',
        ' /|   |\\ ',
        '(_|   |_)',
      ],
      sleep: [
        '  /\\_/\\  ',
        ' ( -.- ) ',
        '  > ^ < z',
        ' /|   |\\ ',
        '(_|   |_)',
      ],
    },
  },
  {
    id: 'duck',
    name: 'Duck',
    frames: {
      idle: [
        '   __    ',
        ' >(o )__ ',
        '  ( ._>  ',
        '   `---\' ',
        '  ~~  ~~ ',
      ],
      happy: [
        '   __    ',
        ' >(^ )__ ',
        '  ( ._>  ',
        '   `---\' ',
        '  ~~  ~~ ',
      ],
      sad: [
        '   __    ',
        ' >(; )__ ',
        '  ( ._>  ',
        '   `---\' ',
        '  ~~  ~~ ',
      ],
      blink: [
        '   __    ',
        ' >(- )__ ',
        '  ( ._>  ',
        '   `---\' ',
        '  ~~  ~~ ',
      ],
      sleep: [
        '   __    ',
        ' >(- )__ ',
        '  ( ._> z',
        '   `---\' ',
        '  ~~  ~~ ',
      ],
    },
  },
  {
    id: 'owl',
    name: 'Owl',
    frames: {
      idle: [
        '  {o,o}  ',
        '  |)__)  ',
        '  -"-"-  ',
        '   | |   ',
        '  d   b  ',
      ],
      happy: [
        '  {^,^}  ',
        '  |)__)  ',
        '  -"-"-  ',
        '   | |   ',
        '  d   b  ',
      ],
      sad: [
        '  {;,;}  ',
        '  |)__)  ',
        '  -"-"-  ',
        '   | |   ',
        '  d   b  ',
      ],
      blink: [
        '  {-,-}  ',
        '  |)__)  ',
        '  -"-"-  ',
        '   | |   ',
        '  d   b  ',
      ],
      sleep: [
        '  {-,-}  ',
        '  |)__)  ',
        '  -"-"- z',
        '   | |   ',
        '  d   b  ',
      ],
    },
  },
  {
    id: 'dragon',
    name: 'Dragon',
    frames: {
      idle: [
        '  /\\_/\\> ',
        ' ( o.o)  ',
        ' /|  |~  ',
        '/ |__|\\  ',
        ' d    b  ',
      ],
      happy: [
        '  /\\_/\\> ',
        ' ( ^.^)  ',
        ' /|  |~  ',
        '/ |__|\\  ',
        ' d    b  ',
      ],
      sad: [
        '  /\\_/\\> ',
        ' ( T.T)  ',
        ' /|  |~  ',
        '/ |__|\\  ',
        ' d    b  ',
      ],
      blink: [
        '  /\\_/\\> ',
        ' ( -.- ) ',
        ' /|  |~  ',
        '/ |__|\\  ',
        ' d    b  ',
      ],
      sleep: [
        '  /\\_/\\> ',
        ' ( -.-) z',
        ' /|  |~  ',
        '/ |__|\\  ',
        ' d    b  ',
      ],
    },
  },
  {
    id: 'ghost',
    name: 'Ghost',
    frames: {
      idle: [
        '  .----.  ',
        ' ( o  o ) ',
        ' |  __  | ',
        ' |      | ',
        '  \\~/\\~/ ',
      ],
      happy: [
        '  .----.  ',
        ' ( ^  ^ ) ',
        ' |  __  | ',
        ' |      | ',
        '  \\~/\\~/ ',
      ],
      sad: [
        '  .----.  ',
        ' ( ;  ; ) ',
        ' |  __  | ',
        ' |      | ',
        '  \\~/\\~/ ',
      ],
      blink: [
        '  .----.  ',
        ' ( -  - ) ',
        ' |  __  | ',
        ' |      | ',
        '  \\~/\\~/ ',
      ],
      sleep: [
        '  .----.  ',
        ' ( -  - ) ',
        ' |  __ z| ',
        ' |      | ',
        '  \\~/\\~/ ',
      ],
    },
  },
  {
    id: 'blob',
    name: 'Blob',
    frames: {
      idle: [
        '  .---.  ',
        ' ( o o ) ',
        ' (  >  ) ',
        '  \\   /  ',
        '   `~\'   ',
      ],
      happy: [
        '  .---.  ',
        ' ( ^ ^ ) ',
        ' (  w  ) ',
        '  \\   /  ',
        '   `~\'   ',
      ],
      sad: [
        '  .---.  ',
        ' ( ; ; ) ',
        ' (  n  ) ',
        '  \\   /  ',
        '   `~\'   ',
      ],
      blink: [
        '  .---.  ',
        ' ( - - ) ',
        ' (  >  ) ',
        '  \\   /  ',
        '   `~\'   ',
      ],
      sleep: [
        '  .---.  ',
        ' ( - - ) ',
        ' (  > )z ',
        '  \\   /  ',
        '   `~\'   ',
      ],
    },
  },
];

// ---- Rarity Tiers ----

const RARITIES = [
  { id: 'common',    name: 'Common',    weight: 60, color: 'white',   symbol: '●' },
  { id: 'uncommon',  name: 'Uncommon',  weight: 25, color: 'green',   symbol: '●●' },
  { id: 'rare',      name: 'Rare',      weight: 10, color: 'cyan',    symbol: '●●●' },
  { id: 'epic',      name: 'Epic',      weight: 4,  color: 'magenta', symbol: '●●●●' },
  { id: 'legendary', name: 'Legendary', weight: 1,  color: 'yellow',  symbol: '●●●●●' },
];

// ---- Hats (Uncommon+) ----

const HATS = [
  { id: 'none', lines: ['         '] },
  { id: 'crown', lines: [' 👑      '] },
  { id: 'tophat', lines: ['  ┌─┐    '] },
  { id: 'wizard', lines: ['  /\\     '] },
  { id: 'tinyduck', lines: ['  🦆     '] },
];

// ---- Eye Styles ----

const EYE_STYLES = [
  { id: 'round', chars: 'o.o' },
  { id: 'dot',   chars: '·.·' },
  { id: 'big',   chars: '◕.◕' },
  { id: 'bold',  chars: '●.●' },
];

// ---- Names ----

const FIRST_NAMES = [
  'Pixel', 'Byte', 'Chip', 'Nano', 'Bit', 'Cache', 'Stack',
  'Hexa', 'Kernel', 'Ping', 'Node', 'Loop', 'Hash',
  'Spark', 'Dash', 'Flux', 'Glitch', 'Patch', 'Fuzz', 'Boop',
];

const TITLES = [
  'the Debugger', 'the Wise', 'the Chaotic', 'the Patient',
  'the Snarky', 'the Bold', 'the Sleepy', 'the Curious',
  'of Infinite Loops', 'the Compiler', 'the Minifier',
];

// ---- Personality Stats ----

const STAT_NAMES = ['debugging', 'patience', 'chaos', 'wisdom', 'snark'];

// ---- Comment Pools (personality-driven) ----

const COMMENT_POOLS = {
  read: {
    neutral: ['Hmm, interesting...', 'Let me see...', 'Reading...', 'Scanning...'],
    wisdom:  ['This file has secrets...', 'Knowledge is power!', 'I see patterns here...'],
    snark:   ['Another file? Really?', 'Oh great, more code...', 'This better be good...'],
    chaos:   ['WHAT IS THIS?!', 'Ooh shiny!', '*frantically reads*'],
  },
  edit: {
    neutral: ['Nice fix!', 'Good change!', 'Looking better!', 'Solid edit!'],
    wisdom:  ['A wise refactor!', 'Clean code is happy code', 'Elegant solution...'],
    snark:   ['Was that really necessary?', 'Bold move...', 'If you say so...'],
    chaos:   ['SHIP IT!', 'MORE CHANGES!', 'Break things faster!'],
  },
  bash: {
    neutral: ['Running...', 'Tests passing!', 'Executing...', 'Building...'],
    wisdom:  ['Test early, test often', 'CI will judge us all', 'The build speaks truth'],
    snark:   ['Hope this works...', 'Fingers crossed lol', 'What could go wrong?'],
    chaos:   ['YOLO!', 'sudo rm -rf vibes!', '*mashes keyboard*'],
  },
  error: {
    neutral: ['Oops!', 'Let me fix that...', 'That\'s unexpected...'],
    wisdom:  ['Errors are lessons', 'Debug with patience', 'Every bug teaches'],
    snark:   ['Called it.', 'Saw that coming...', 'Classic mistake...'],
    chaos:   ['EVERYTHING IS FINE 🔥', 'LOL', 'Embrace the chaos!'],
  },
  idle: {
    neutral: ['*purrs*', '*stretches*', 'Nice day for coding!', '...'],
    wisdom:  ['Sometimes rest is progress', 'Patience...', 'Contemplating...'],
    snark:   ['Bored yet?', 'Zzzz...', 'Wake me when interesting'],
    chaos:   ['*vibrates*', 'Do something!', '*bounces around*'],
  },
  pet: {
    neutral: ['Purrrr...', '♥ ♥ ♥', 'That feels nice!', '*happy noises*'],
    wisdom:  ['You are kind, human', 'Connection matters ♥', 'Gratitude...'],
    snark:   ['...fine, that was okay', 'Don\'t get used to it', '*reluctantly purrs*'],
    chaos:   ['AAARGH YES!', 'MORE MORE MORE!', '*explodes with joy*'],
  },
};

// ---- Deterministic Buddy Generation ----

function pickWeighted(rng, items, weightKey = 'weight') {
  const total = items.reduce((sum, item) => sum + item[weightKey], 0);
  let r = rng() * total;
  for (const item of items) {
    r -= item[weightKey];
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

function pickRandom(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function generatePersonality(rng) {
  const stats = {};
  for (const name of STAT_NAMES) {
    stats[name] = Math.floor(rng() * 10) + 1; // 1-10
  }
  return stats;
}

function getDominantTrait(personality) {
  let max = 0;
  let dominant = 'neutral';
  const traitMap = {
    debugging: 'neutral',
    patience: 'neutral',
    chaos: 'chaos',
    wisdom: 'wisdom',
    snark: 'snark',
  };
  for (const [stat, trait] of Object.entries(traitMap)) {
    if (personality[stat] > max) {
      max = personality[stat];
      dominant = trait;
    }
  }
  return dominant;
}

export function generateBuddy(userId = 'simulator-default-user') {
  const seed = fnv1aHash(userId);
  const rng = mulberry32(seed);

  const species = pickRandom(rng, SPECIES);
  const rarity = pickWeighted(rng, RARITIES);
  const personality = generatePersonality(rng);
  const eyeStyle = pickRandom(rng, EYE_STYLES);
  const isShiny = rng() < 0.01; // 1% shiny

  // Hats only for Uncommon+
  const rarityIndex = RARITIES.findIndex(r => r.id === rarity.id);
  const hat = rarityIndex >= 1 ? pickRandom(rng, HATS.slice(1)) : HATS[0];

  const firstName = pickRandom(rng, FIRST_NAMES);
  const title = rarity.id !== 'common' ? ` ${pickRandom(rng, TITLES)}` : '';
  const name = `${firstName}${title}`;

  return {
    species,
    rarity,
    personality,
    eyeStyle,
    hat,
    isShiny,
    name,
    dominantTrait: getDominantTrait(personality),
  };
}

// ---- Comment Selection (personality-aware) ----

export function pickComment(eventType, personality) {
  const pool = COMMENT_POOLS[eventType];
  if (!pool) return null;

  const dominant = getDominantTrait(personality);
  const traitPool = pool[dominant] || pool.neutral;

  // 70% trait-specific, 30% neutral for variety
  const useTraitPool = Math.random() < 0.7 && dominant !== 'neutral';
  const chosen = useTraitPool ? traitPool : pool.neutral;
  return chosen[Math.floor(Math.random() * chosen.length)];
}

// ---- Exports for rendering ----

export function getFrame(species, frameType, eyeStyle) {
  const frames = species.frames[frameType] || species.frames.idle;
  if (!eyeStyle || eyeStyle.id === 'round') return frames;

  // Substitute eye chars into the frame
  return frames.map(line =>
    line.replace('o.o', eyeStyle.chars)
        .replace('o  o', eyeStyle.chars.replace('.', '  '))
        .replace('o o', eyeStyle.chars.replace('.', ' '))
  );
}

export function getReactionEmoji(eventType) {
  const map = {
    read: '👀',
    edit: '😸',
    bash: '🎉',
    error: '😿',
    idle: '💤',
    pet: '❤️',
  };
  return map[eventType] || '💬';
}

export { SPECIES, RARITIES, HATS, EYE_STYLES, STAT_NAMES, COMMENT_POOLS };
