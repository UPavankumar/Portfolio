export type Suit = "♠" | "♥" | "♦" | "♣";
export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number; // 2..14 (Ace = 14)
  color: "red" | "black";
}

export type HandRank =
  | "High Card"
  | "One Pair"
  | "Two Pair"
  | "Three of a Kind"
  | "Straight"
  | "Flush"
  | "Full House"
  | "Four of a Kind"
  | "Straight Flush"
  | "Royal Flush";

export interface HandEvaluation {
  rankName: HandRank;
  score: number; // For comparative tie-breaking
  description: string;
  bestCards: Card[];
}

export type PlayerArchetype =
  | "Observing..."
  | "Aggressive Bluffer"
  | "Calling Station"
  | "Tight Rock"
  | "Balanced Shark";

export interface PlayerProfile {
  totalHands: number;
  handsEntered: number; // VPIP
  totalRaises: number;
  totalCalls: number;
  totalFolds: number;
  totalChecks: number;
  timesBluffedCaught: number;
  timesFoldedToAiRaise: number;
  timesRaisedRiver: number;
  lastActions: string[];
  archetype: PlayerArchetype;
  readSummary: string;
  vpipPercent: number;
  aggressionRate: number;
}

const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
const RANKS: { rank: Rank; value: number }[] = [
  { rank: "2", value: 2 },
  { rank: "3", value: 3 },
  { rank: "4", value: 4 },
  { rank: "5", value: 5 },
  { rank: "6", value: 6 },
  { rank: "7", value: 7 },
  { rank: "8", value: 8 },
  { rank: "9", value: 9 },
  { rank: "10", value: 10 },
  { rank: "J", value: 11 },
  { rank: "Q", value: 12 },
  { rank: "K", value: 13 },
  { rank: "A", value: 14 },
];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    const color = suit === "♥" || suit === "♦" ? "red" : "black";
    for (const r of RANKS) {
      deck.push({
        suit,
        rank: r.rank,
        value: r.value,
        color,
      });
    }
  }
  return shuffle(deck);
}

export function shuffle(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getCombinations(cards: Card[], k = 5): Card[][] {
  const result: Card[][] = [];
  function backtrack(start: number, combo: Card[]) {
    if (combo.length === k) {
      result.push([...combo]);
      return;
    }
    for (let i = start; i < cards.length; i++) {
      combo.push(cards[i]);
      backtrack(i + 1, combo);
      combo.pop();
    }
  }
  backtrack(0, []);
  return result;
}

function evaluate5Cards(cards: Card[]): { rankName: HandRank; score: number; description: string } {
  const sorted = [...cards].sort((a, b) => b.value - a.value);

  const isFlush = sorted.every((c) => c.suit === sorted[0].suit);

  // Check straight
  let isStraight = false;
  let straightHigh = sorted[0].value;

  const isSequential = (vals: number[]) => {
    for (let i = 0; i < vals.length - 1; i++) {
      if (vals[i] - vals[i + 1] !== 1) return false;
    }
    return true;
  };

  const values = sorted.map((c) => c.value);
  if (isSequential(values)) {
    isStraight = true;
    straightHigh = values[0];
  } else if (
    values[0] === 14 &&
    values[1] === 5 &&
    values[2] === 4 &&
    values[3] === 3 &&
    values[4] === 2
  ) {
    // Ace-low straight (A-2-3-4-5)
    isStraight = true;
    straightHigh = 5;
  }

  // Count frequencies
  const counts: Record<number, number> = {};
  for (const v of values) {
    counts[v] = (counts[v] || 0) + 1;
  }

  const freq = Object.entries(counts)
    .map(([val, cnt]) => ({ value: Number(val), count: cnt }))
    .sort((a, b) => b.count - a.count || b.value - a.value);

  // Royal Flush & Straight Flush
  if (isFlush && isStraight) {
    if (straightHigh === 14) {
      return { rankName: "Royal Flush", score: 9000000, description: "Royal Flush" };
    }
    return {
      rankName: "Straight Flush",
      score: 8000000 + straightHigh,
      description: `Straight Flush, ${sorted[0].rank} High`,
    };
  }

  // Four of a Kind
  if (freq[0].count === 4) {
    const quadVal = freq[0].value;
    const kicker = freq[1].value;
    return {
      rankName: "Four of a Kind",
      score: 7000000 + quadVal * 100 + kicker,
      description: `Four of a Kind, ${freq[0].value}s`,
    };
  }

  // Full House
  if (freq[0].count === 3 && freq[1].count === 2) {
    const tripVal = freq[0].value;
    const pairVal = freq[1].value;
    return {
      rankName: "Full House",
      score: 6000000 + tripVal * 100 + pairVal,
      description: `Full House, ${freq[0].value}s full of ${freq[1].value}s`,
    };
  }

  // Flush
  if (isFlush) {
    let score = 5000000;
    values.forEach((v, idx) => {
      score += v * Math.pow(15, 4 - idx);
    });
    return {
      rankName: "Flush",
      score,
      description: `Flush, ${sorted[0].rank} High`,
    };
  }

  // Straight
  if (isStraight) {
    return {
      rankName: "Straight",
      score: 4000000 + straightHigh,
      description: `Straight, ${straightHigh === 5 ? "5" : sorted[0].rank} High`,
    };
  }

  // Three of a Kind
  if (freq[0].count === 3) {
    const tripVal = freq[0].value;
    const kickers = freq.slice(1).map((f) => f.value);
    return {
      rankName: "Three of a Kind",
      score: 3000000 + tripVal * 1000 + kickers[0] * 15 + kickers[1],
      description: `Three of a Kind, ${freq[0].value}s`,
    };
  }

  // Two Pair
  if (freq[0].count === 2 && freq[1].count === 2) {
    const highPair = Math.max(freq[0].value, freq[1].value);
    const lowPair = Math.min(freq[0].value, freq[1].value);
    const kicker = freq[2].value;
    return {
      rankName: "Two Pair",
      score: 2000000 + highPair * 1000 + lowPair * 15 + kicker,
      description: `Two Pair, ${highPair}s and ${lowPair}s`,
    };
  }

  // One Pair
  if (freq[0].count === 2) {
    const pairVal = freq[0].value;
    const kickers = freq.slice(1).map((f) => f.value);
    let score = 1000000 + pairVal * 10000;
    kickers.forEach((k, i) => {
      score += k * Math.pow(15, 2 - i);
    });
    return {
      rankName: "One Pair",
      score,
      description: `One Pair, ${pairVal}s`,
    };
  }

  // High Card
  let score = 0;
  values.forEach((v, idx) => {
    score += v * Math.pow(15, 4 - idx);
  });
  return {
    rankName: "High Card",
    score,
    description: `High Card, ${sorted[0].rank}`,
  };
}

// 7-card best 5 evaluation
export function evaluateHand(holeCards: Card[], communityCards: Card[]): HandEvaluation {
  const allCards = [...holeCards, ...communityCards];
  if (allCards.length < 5) {
    const sorted = [...allCards].sort((a, b) => b.value - a.value);
    return {
      rankName: "High Card",
      score: sorted[0]?.value || 0,
      description: sorted[0] ? `High Card: ${sorted[0].rank}` : "Evaluating...",
      bestCards: sorted,
    };
  }

  const combos = getCombinations(allCards, 5);
  let bestScore = -1;
  let bestRankName: HandRank = "High Card";
  let bestDesc = "";
  let best5: Card[] = [];

  for (const combo of combos) {
    const evalResult = evaluate5Cards(combo);
    if (evalResult.score > bestScore) {
      bestScore = evalResult.score;
      bestRankName = evalResult.rankName;
      bestDesc = evalResult.description;
      best5 = combo;
    }
  }

  return {
    rankName: bestRankName,
    score: bestScore,
    description: bestDesc,
    bestCards: best5,
  };
}

// Real-time Monte Carlo Poker Equity Calculator (250 trials)
export function calculateWinProbability(
  playerHole: Card[],
  communityCards: Card[],
  simulations = 250
): number {
  if (!playerHole || playerHole.length < 2) return 50;

  const usedCards = new Set<string>();
  playerHole.forEach((c) => usedCards.add(`${c.rank}_${c.suit}`));
  communityCards.forEach((c) => usedCards.add(`${c.rank}_${c.suit}`));

  const remainingDeck: Card[] = [];
  for (const suit of SUITS) {
    const color = suit === "♥" || suit === "♦" ? "red" : "black";
    for (const r of RANKS) {
      if (!usedCards.has(`${r.rank}_${suit}`)) {
        remainingDeck.push({
          suit,
          rank: r.rank,
          value: r.value,
          color,
        });
      }
    }
  }

  let wins = 0;
  let ties = 0;
  const cardsNeeded = 5 - communityCards.length;

  for (let i = 0; i < simulations; i++) {
    const deckCopy = shuffle([...remainingDeck]);
    const aiHoleSim = [deckCopy.pop()!, deckCopy.pop()!];
    const commSim = [...communityCards];

    for (let c = 0; c < cardsNeeded; c++) {
      commSim.push(deckCopy.pop()!);
    }

    const pScore = evaluateHand(playerHole, commSim).score;
    const aScore = evaluateHand(aiHoleSim, commSim).score;

    if (pScore > aScore) {
      wins++;
    } else if (pScore === aScore) {
      ties += 0.5;
    }
  }

  const equity = Math.round(((wins + ties) / simulations) * 100);
  return Math.max(5, Math.min(98, equity));
}

// Dynamic Player Profiling & Behavioral Classification
export function classifyPlayerProfile(profile: PlayerProfile): PlayerProfile {
  const { totalHands, handsEntered, totalRaises, totalCalls, totalFolds } = profile;

  if (totalHands < 2) {
    return {
      ...profile,
      archetype: "Observing...",
      readSummary: "Observing initial baseline betting frequency...",
      vpipPercent: 50,
      aggressionRate: 50,
    };
  }

  const vpip = Math.round((handsEntered / Math.max(1, totalHands)) * 100);
  const totalDecisions = Math.max(1, totalRaises + totalCalls + totalFolds);
  const aggression = Math.round((totalRaises / totalDecisions) * 100);

  let archetype: PlayerArchetype = "Balanced Shark";
  let summary = "";

  if (aggression > 55 && vpip > 50) {
    archetype = "Aggressive Bluffer";
    summary = "High aggression frequency with loose range. Exploitable via disciplined check-calls & trap-sets.";
  } else if (vpip > 65 && aggression <= 30) {
    archetype = "Calling Station";
    summary = "Passive high VPIP. Avoid dry bluffs; extract maximum value on solid made hands.";
  } else if (vpip <= 30 && aggression >= 40) {
    archetype = "Tight Rock";
    summary = "Selective conservative range. Yield when facing heavy aggression; attack unclaimed small pots.";
  } else {
    archetype = "Balanced Shark";
    summary = "Balanced variance and strategic timing. Proceed with standard GTO positional defense.";
  }

  return {
    ...profile,
    archetype,
    readSummary: summary,
    vpipPercent: vpip,
    aggressionRate: aggression,
  };
}

// Intelligent Adaptive AI Decision Engine
export interface AIDecision {
  action: "fold" | "call" | "raise" | "check";
  raiseAmount?: number;
  dialogue: string;
}

export function getAdaptiveAIDecision(
  aiHole: Card[],
  communityCards: Card[],
  pot: number,
  toCall: number,
  aiChips: number,
  stage: "preflop" | "flop" | "turn" | "river",
  playerProfile: PlayerProfile
): AIDecision {
  const isPocketPair = aiHole[0]?.rank === aiHole[1]?.rank;
  const highCard = Math.max(aiHole[0]?.value || 0, aiHole[1]?.value || 0);

  const currentEval = evaluateHand(aiHole, communityCards);
  const rank = currentEval.rankName;

  const isBluffer = playerProfile.archetype === "Aggressive Bluffer";
  const isCallingStation = playerProfile.archetype === "Calling Station";

  // 1. Monster Hands (Full House, Quads, Straight, Flush, Trips)
  if (
    rank === "Royal Flush" ||
    rank === "Straight Flush" ||
    rank === "Four of a Kind" ||
    rank === "Full House" ||
    rank === "Flush" ||
    rank === "Straight" ||
    rank === "Three of a Kind"
  ) {
    if (isBluffer && Math.random() < 0.4 && stage !== "river") {
      return {
        action: toCall > 0 ? "call" : "check",
        dialogue: "A cautious stance for the moment. Let us see what unfolds.",
      };
    }

    const valueRaise = Math.min(
      aiChips,
      Math.max(40, Math.floor(pot * (isCallingStation ? 0.75 : 0.5)))
    );
    return {
      action: "raise",
      raiseAmount: toCall + valueRaise,
      dialogue: "A commanding position. I must raise the stakes.",
    };
  }

  // 2. Two Pair / Top Pair Strong Kicker
  if (rank === "Two Pair" || (rank === "One Pair" && isPocketPair && highCard >= 10)) {
    if (toCall <= pot * 0.75 || toCall <= aiChips * 0.5) {
      if (toCall === 0 && Math.random() < 0.55 && aiChips >= 40) {
        return {
          action: "raise",
          raiseAmount: Math.min(aiChips, Math.max(30, Math.floor(pot * 0.5))),
          dialogue: "I fancy my holdings on this texture. A modest raise.",
        };
      }
      return { action: toCall > 0 ? "call" : "check", dialogue: toCall > 0 ? "I call your wager." : "Check." };
    }
  }

  // 3. Medium One Pair / Draws
  if (rank === "One Pair") {
    if (toCall === 0) {
      if (Math.random() < 0.45 && aiChips >= 40) {
        return {
          action: "raise",
          raiseAmount: Math.min(aiChips, Math.max(30, Math.floor(pot * 0.45))),
          dialogue: "A testing wager to probe your strength.",
        };
      }
      return { action: "check", dialogue: "Check." };
    }

    if (toCall <= pot * 0.6 || toCall <= aiChips * 0.4) {
      return { action: "call", dialogue: "I shall see the next street with my pair." };
    }

    if (stage === "river" && Math.random() < 0.22 && aiChips >= toCall + 60 && !isCallingStation) {
      return {
        action: "raise",
        raiseAmount: Math.min(aiChips, toCall + 70),
        dialogue: "A bold river maneuver. Do you dare look me up?",
      };
    }

    return { action: "fold", dialogue: "I yield this hand to your wager." };
  }

  // 4. Pure Air / High Card — ACTIVE BLUFF ENGINE
  if (toCall === 0) {
    if ((stage === "turn" || stage === "river") && Math.random() < 0.32 && aiChips >= 50 && !isCallingStation) {
      return {
        action: "raise",
        raiseAmount: Math.min(aiChips, Math.max(40, Math.floor(pot * 0.5))),
        dialogue: "The board favors my range. I raise.",
      };
    }
    return { action: "check", dialogue: "Check." };
  }

  if (highCard >= 12 && toCall <= 40 && Math.random() < 0.3) {
    return {
      action: "call",
      dialogue: "Holding overcards. I shall float this street.",
    };
  }

  if (stage === "river" && Math.random() < 0.18 && aiChips >= toCall + 60 && !isCallingStation) {
    return {
      action: "raise",
      raiseAmount: Math.min(aiChips, toCall + 60),
      dialogue: "Perhaps I hold the nuts, perhaps mere audacity. Call to find out.",
    };
  }

  return { action: "fold", dialogue: "Nothing of note in my hand. Folded." };
}

// Alfred's Witty & Articulate Card Commentary Engine
export function getAlfredCardCommentary(
  playerHole: Card[],
  _communityCards: Card[],
  pEval: HandEvaluation,
  result: "player_win" | "ai_win" | "split" | "player_folded"
): string {
  if (!playerHole || playerHole.length < 2) return "A curious hand, sir.";

  const c1 = playerHole[0];
  const c2 = playerHole[1];
  const isPocketPair = c1.rank === c2.rank;
  const isSuited = c1.suit === c2.suit;
  const highRank = Math.max(c1.value, c2.value);
  const isConnected = Math.abs(c1.value - c2.value) === 1;

  // 1. If player folded
  if (result === "player_folded") {
    if (isPocketPair) {
      return `Folding pocket ${c1.rank}s? A very cautious release, sir.`;
    }
    if (highRank === 14 && isSuited) {
      return `Releasing suited Ace-${c2.rank}? Prudence over bravado.`;
    }
    return "A disciplined fold. Live to fight another hand.";
  }

  // 2. Specific notable pocket card combinations
  // Pocket Rockets (A-A)
  if (isPocketPair && c1.rank === "A") {
    return result === "player_win"
      ? "Pocket Aces! 'Bullets' in the hole played with lethal precision, sir."
      : "Pocket Aces cracked! Even the best starting hand in poker can be humbled by the board.";
  }

  // Pocket Kings (K-K)
  if (isPocketPair && c1.rank === "K") {
    return result === "player_win"
      ? "Pocket Kings ('Cowboys')! You wielded the crown with authority, sir."
      : "Kings in the hole, yet the runout proved unkind. Tough break, sir.";
  }

  // Pocket Queens / Jacks
  if (isPocketPair && (c1.rank === "Q" || c1.rank === "J")) {
    return result === "player_win"
      ? `Pocket ${c1.rank}s! High-caliber paint in the pocket, beautifully navigated.`
      : `Pocket ${c1.rank}s didn't survive the showdown.`;
  }

  // Low/Mid Pocket Pairs
  if (isPocketPair) {
    return result === "player_win"
      ? `Pocket ${c1.rank}s! Small pair, but deadly when handled with care.`
      : `Pocket ${c1.rank}s — brave effort holding the small pair to the end.`;
  }

  // Big Slick (A-K)
  if ((c1.rank === "A" && c2.rank === "K") || (c1.rank === "K" && c2.rank === "A")) {
    return isSuited
      ? "Big Slick suited (A-K)! The quintessential drawing powerhouse."
      : "Ace-King offsuit! Classic high-stakes artillery.";
  }

  // 7-2 Offsuit (The Hammer / Worst hand)
  if (!isSuited && ((c1.rank === "7" && c2.rank === "2") || (c1.rank === "2" && c2.rank === "7"))) {
    return result === "player_win"
      ? "7-2 offsuit?! Winning with the statistical worst hand in Texas Hold'em is sheer psychological genius."
      : "Ah, the infamous 7-2 offsuit. Truly playing on veteran difficulty, sir.";
  }

  // Suited Connectors
  if (isSuited && isConnected) {
    return `Suited connectors (${c1.rank}${c1.suit} ${c2.rank}${c2.suit})! A connoisseur's choice for hidden straights and flushes.`;
  }

  // 3. Made hands commentary
  if (pEval.rankName === "Royal Flush") {
    return "A Royal Flush! In all my years at the felt, I have seldom witnessed such absolute perfection. Splendid!";
  }
  if (pEval.rankName === "Straight Flush") {
    return `A Straight Flush! An astronomical hand (${pEval.description}). A masterclass on the felt.`;
  }
  if (pEval.rankName === "Four of a Kind") {
    return `Quads! Devastating four-of-a-kind firepower (${pEval.description}).`;
  }
  if (pEval.rankName === "Full House") {
    return `A full boat! (${pEval.description}). Impeccable board texture connection.`;
  }
  if (pEval.rankName === "Flush") {
    return `A pristine flush in ${c1.suit}! Beautiful monochrome board connection.`;
  }
  if (pEval.rankName === "Straight") {
    return `A 5-card sequence straight (${pEval.description})! You connected the dots flawlessly.`;
  }
  if (pEval.rankName === "Three of a Kind") {
    return `Trips! (${pEval.description}). A concealed weapon on this board.`;
  }
  if (pEval.rankName === "Two Pair") {
    return `Two pair (${pEval.description}). Solid and disciplined execution.`;
  }
  if (pEval.rankName === "One Pair") {
    return result === "player_win"
      ? `A pair of ${pEval.description.split(", ")[1] || "cards"} held up! Crisp value.`
      : `Just a pair in the end. The board offered little assistance.`;
  }

  // High Card
  return result === "player_win"
    ? `You won that pot with mere High Card (${pEval.description})?! Ice in your veins, sir.`
    : `High Card only (${pEval.description}). A valiant attempt to contest the pot nonetheless.`;
}
