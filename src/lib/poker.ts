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

function evaluate5CardHand(hand: Card[]): { rankName: HandRank; score: number; description: string } {
  const sorted = [...hand].sort((a, b) => b.value - a.value);
  const values = sorted.map((c) => c.value);
  const suits = sorted.map((c) => c.suit);

  const isFlush = suits.every((s) => s === suits[0]);

  let isStraight = false;
  let straightHigh = 0;
  if (
    values[0] - values[1] === 1 &&
    values[1] - values[2] === 1 &&
    values[2] - values[3] === 1 &&
    values[3] - values[4] === 1
  ) {
    isStraight = true;
    straightHigh = values[0];
  } else if (
    values[0] === 14 &&
    values[1] === 5 &&
    values[2] === 4 &&
    values[3] === 3 &&
    values[4] === 2
  ) {
    isStraight = true;
    straightHigh = 5;
  }

  const counts: Record<number, number> = {};
  for (const v of values) {
    counts[v] = (counts[v] || 0) + 1;
  }

  const freqEntries = Object.entries(counts)
    .map(([val, count]) => ({ val: Number(val), count }))
    .sort((a, b) => b.count - a.count || b.val - a.val);

  if (isFlush && isStraight) {
    if (straightHigh === 14) {
      return { rankName: "Royal Flush", score: 9000000, description: "Royal Flush" };
    }
    return {
      rankName: "Straight Flush",
      score: 8000000 + straightHigh,
      description: `Straight Flush, ${getRankName(straightHigh)} High`,
    };
  }

  if (freqEntries[0].count === 4) {
    const quad = freqEntries[0].val;
    const kicker = freqEntries[1].val;
    return {
      rankName: "Four of a Kind",
      score: 7000000 + quad * 100 + kicker,
      description: `Four of a Kind, ${getRankName(quad)}s`,
    };
  }

  if (freqEntries[0].count === 3 && freqEntries[1].count === 2) {
    const trip = freqEntries[0].val;
    const pair = freqEntries[1].val;
    return {
      rankName: "Full House",
      score: 6000000 + trip * 100 + pair,
      description: `Full House, ${getRankName(trip)}s full of ${getRankName(pair)}s`,
    };
  }

  if (isFlush) {
    const tieScore = values.reduce((acc, v, idx) => acc + v * Math.pow(15, 4 - idx), 0);
    return {
      rankName: "Flush",
      score: 5000000 + tieScore,
      description: `Flush, ${getRankName(values[0])} High`,
    };
  }

  if (isStraight) {
    return {
      rankName: "Straight",
      score: 4000000 + straightHigh,
      description: `Straight, ${getRankName(straightHigh)} High`,
    };
  }

  if (freqEntries[0].count === 3) {
    const trip = freqEntries[0].val;
    const kickers = [freqEntries[1].val, freqEntries[2].val];
    return {
      rankName: "Three of a Kind",
      score: 3000000 + trip * 1000 + kickers[0] * 15 + kickers[1],
      description: `Three of a Kind, ${getRankName(trip)}s`,
    };
  }

  if (freqEntries[0].count === 2 && freqEntries[1].count === 2) {
    const highPair = Math.max(freqEntries[0].val, freqEntries[1].val);
    const lowPair = Math.min(freqEntries[0].val, freqEntries[1].val);
    const kicker = freqEntries[2].val;
    return {
      rankName: "Two Pair",
      score: 2000000 + highPair * 1000 + lowPair * 50 + kicker,
      description: `Two Pair, ${getRankName(highPair)}s and ${getRankName(lowPair)}s`,
    };
  }

  if (freqEntries[0].count === 2) {
    const pair = freqEntries[0].val;
    const kickers = [freqEntries[1].val, freqEntries[2].val, freqEntries[3].val];
    const kickScore = kickers.reduce((acc, v, idx) => acc + v * Math.pow(15, 2 - idx), 0);
    return {
      rankName: "One Pair",
      score: 1000000 + pair * 5000 + kickScore,
      description: `Pair of ${getRankName(pair)}s`,
    };
  }

  const tieScore = values.reduce((acc, v, idx) => acc + v * Math.pow(15, 4 - idx), 0);
  return {
    rankName: "High Card",
    score: tieScore,
    description: `High Card, ${getRankName(values[0])}`,
  };
}

function getRankName(val: number): string {
  if (val === 14) return "Ace";
  if (val === 13) return "King";
  if (val === 12) return "Queen";
  if (val === 11) return "Jack";
  return val.toString();
}

export function evaluateHand(holeCards: Card[], communityCards: Card[]): HandEvaluation {
  const allCards = [...holeCards, ...communityCards];
  if (allCards.length < 5) {
    return {
      rankName: "High Card",
      score: 0,
      description: "Waiting for board cards...",
      bestCards: holeCards,
    };
  }

  const combos = getCombinations(allCards, 5);
  let bestEval: { rankName: HandRank; score: number; description: string } = {
    rankName: "High Card",
    score: -1,
    description: "",
  };
  let bestCards: Card[] = [];

  for (const combo of combos) {
    const currentEval = evaluate5CardHand(combo);
    if (currentEval.score > bestEval.score) {
      bestEval = currentEval;
      bestCards = combo;
    }
  }

  return {
    ...bestEval,
    bestCards,
  };
}

// Monte Carlo Win Equity Calculation Engine
export function calculateWinProbability(
  playerHole: Card[],
  communityCards: Card[],
  simulations = 250
): number {
  if (playerHole.length < 2) return 50;

  const usedSet = new Set([...playerHole, ...communityCards].map((c) => `${c.rank}${c.suit}`));
  const fullDeck = createDeck();
  const availableDeck = fullDeck.filter((c) => !usedSet.has(`${c.rank}${c.suit}`));

  if (availableDeck.length < 2) return 50;

  let wins = 0;
  let ties = 0;
  const remainingCommunity = 5 - communityCards.length;

  for (let s = 0; s < simulations; s++) {
    const simDeck = shuffle(availableDeck);
    const simAiHole = [simDeck[0], simDeck[1]];

    const simCommunity = [...communityCards];
    for (let i = 0; i < remainingCommunity; i++) {
      simCommunity.push(simDeck[2 + i]);
    }

    const pEval = evaluateHand(playerHole, simCommunity);
    const aEval = evaluateHand(simAiHole, simCommunity);

    if (pEval.score > aEval.score) {
      wins++;
    } else if (pEval.score === aEval.score) {
      ties += 0.5;
    }
  }

  return Math.max(5, Math.min(95, Math.round(((wins + ties) / simulations) * 100)));
}

// Classify player pattern into actionable archetype
export function classifyPlayerProfile(profile: PlayerProfile): PlayerProfile {
  const total = profile.totalHands;
  if (total < 2) {
    return {
      ...profile,
      archetype: "Observing...",
      readSummary: "Calibrating baseline tendencies...",
      vpipPercent: 50,
      aggressionRate: 50,
    };
  }

  const vpip = Math.round((profile.handsEntered / total) * 100);
  const totalActions = profile.totalRaises + profile.totalCalls + profile.totalChecks + profile.totalFolds;
  const aggRate = totalActions > 0 ? Math.round((profile.totalRaises / Math.max(1, profile.totalRaises + profile.totalCalls)) * 100) : 40;

  let archetype: PlayerArchetype = "Balanced Shark";
  let summary = "Balanced, versatile opponent.";

  if (aggRate >= 65 || profile.timesBluffedCaught >= 2) {
    archetype = "Aggressive Bluffer";
    summary = `High aggression (${aggRate}%) & bluff frequency. Susceptible to check-traps and light call-downs.`;
  } else if (vpip >= 70 && aggRate <= 35) {
    archetype = "Calling Station";
    summary = `High VPIP (${vpip}%) with low fold rate. Value-bet big; avoid bluffing.`;
  } else if (vpip <= 40 && profile.totalFolds >= total * 0.4) {
    archetype = "Tight Rock";
    summary = `Disciplined (${vpip}% VPIP). Steal unchecked pots; respect sudden raises.`;
  } else {
    archetype = "Balanced Shark";
    summary = `Calculated player (${vpip}% VPIP, ${aggRate}% Agg). Using standard GTO mixed strategy.`;
  }

  return {
    ...profile,
    vpipPercent: vpip,
    aggressionRate: aggRate,
    archetype,
    readSummary: summary,
  };
}

// Adaptive Risk-Tolerant & Bluff-Capable AI Poker Decision Engine
export function getAdaptiveAIDecision(
  aiHole: Card[],
  community: Card[],
  pot: number,
  toCall: number,
  aiChips: number,
  stage: "preflop" | "flop" | "turn" | "river",
  playerProfile: PlayerProfile
): { action: "fold" | "check" | "call" | "raise"; raiseAmount?: number; dialogue: string } {
  const evaluation = evaluateHand(aiHole, community);
  const v1 = aiHole[0].value;
  const v2 = aiHole[1].value;
  const isPocketPair = v1 === v2;
  const highCard = Math.max(v1, v2);
  const isSuited = aiHole[0].suit === aiHole[1].suit;
  const rank = evaluation.rankName;

  const { archetype, totalHands } = playerProfile;
  const isAggressive = archetype === "Aggressive Bluffer";
  const isCallingStation = archetype === "Calling Station";
  const isTight = archetype === "Tight Rock";

  // Pre-Flop Street
  if (stage === "preflop") {
    // Monster pockets
    if ((isPocketPair && v1 >= 10) || (v1 >= 13 && v2 >= 13)) {
      if (aiChips >= toCall + 60) {
        return {
          action: "raise",
          raiseAmount: Math.min(aiChips, toCall + (isCallingStation ? 80 : 60)),
          dialogue: isCallingStation
            ? "A commanding starting hand. Since you rarely fold pre-flop, let us make it worthwhile."
            : isAggressive
            ? "An exceptional holding. Let us test your customary aggression, sir."
            : "A fine starting position. I raise.",
        };
      }
      return { action: "call", dialogue: "I shall match your entry wager." };
    }

    // High risk bluff raise pre-flop (20% chance with suited connectors/high card)
    if (Math.random() < 0.22 && highCard >= 10 && aiChips >= toCall + 50) {
      return {
        action: "raise",
        raiseAmount: Math.min(aiChips, toCall + 40),
        dialogue: "Applying early positional pressure. Let us see who yields.",
      };
    }

    // Playable hands: pairs, connectors, high broadways
    if (isPocketPair || (highCard >= 8 && (isSuited || Math.abs(v1 - v2) <= 3))) {
      if (toCall <= 60 || toCall <= aiChips * 0.25) {
        return {
          action: "call",
          dialogue: isTight
            ? "You entered the pot, which implies strength. Let us see the flop."
            : "Very well, cards on the felt.",
        };
      }
    }

    // Free check
    if (toCall === 0) {
      return { action: "check", dialogue: "Check to you, sir." };
    }

    // Steal against tight players
    if (isTight && totalHands >= 2 && Math.random() < 0.45 && aiChips >= 50) {
      return {
        action: "raise",
        raiseAmount: Math.min(aiChips, toCall + 40),
        dialogue: "You fold often under pre-flop pressure. Let us test that resolve.",
      };
    }

    // Cheap call
    if (toCall <= 30) {
      return { action: "call", dialogue: "A modest price to pay. I shall call." };
    }

    return {
      action: "fold",
      dialogue: isTight
        ? "Given how rarely you raise, sir, I must respect your pocket. Folded."
        : "Prudence dictates a fold. Your pot.",
    };
  }

  // Post-Flop Streets (Flop, Turn, River)

  // 1. Monster Hands: Straight, Flush, Full House, Quads, Straight Flush
  if (
    rank === "Royal Flush" ||
    rank === "Straight Flush" ||
    rank === "Four of a Kind" ||
    rank === "Full House" ||
    rank === "Flush" ||
    rank === "Straight"
  ) {
    // Check-trap aggressive players
    if (isAggressive && toCall === 0 && (stage === "flop" || stage === "turn") && Math.random() < 0.7) {
      return {
        action: "check",
        dialogue: "Check. (I anticipate your customary attack, sir.)",
      };
    }

    // Value raise
    if (aiChips >= toCall + 60) {
      const raiseSize = isCallingStation ? Math.floor(pot * 0.8) : Math.floor(pot * 0.6);
      return {
        action: "raise",
        raiseAmount: Math.min(aiChips, toCall + Math.max(60, raiseSize)),
        dialogue: `A formidable board. My holding is well ahead.`,
      };
    }
    return { action: "call", dialogue: "I shall call." };
  }

  // 2. Strong Hands: Three of a Kind or Two Pair
  if (rank === "Three of a Kind" || rank === "Two Pair") {
    if (toCall === 0) {
      if (Math.random() < 0.65 && aiChips >= 50) {
        return {
          action: "raise",
          raiseAmount: Math.min(aiChips, Math.max(50, Math.floor(pot * 0.55))),
          dialogue: "Pressing the statistical advantage.",
        };
      }
      return { action: "check", dialogue: "Check to you." };
    }

    return { action: "call", dialogue: `My ${rank} warrants a solid call.` };
  }

  // 3. Medium Hands: One Pair
  if (rank === "One Pair") {
    if (toCall === 0) {
      // Semi-bluff / Value probe (40% chance)
      if (Math.random() < 0.45 && aiChips >= 40) {
        return {
          action: "raise",
          raiseAmount: Math.min(aiChips, Math.max(30, Math.floor(pot * 0.45))),
          dialogue: "A testing wager to probe your strength.",
        };
      }
      return { action: "check", dialogue: "Check." };
    }

    // Call moderate bets with One Pair
    if (toCall <= pot * 0.6 || toCall <= aiChips * 0.4) {
      return { action: "call", dialogue: "I shall see the next street with my pair." };
    }

    // River bluff re-raise (20% high-risk maneuver)
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
    // 30% Pure Bluff steal on Turn / River
    if ((stage === "turn" || stage === "river") && Math.random() < 0.32 && aiChips >= 50 && !isCallingStation) {
      return {
        action: "raise",
        raiseAmount: Math.min(aiChips, Math.max(40, Math.floor(pot * 0.5))),
        dialogue: "The board favors my range. I raise.",
      };
    }
    return { action: "check", dialogue: "Check." };
  }

  // Floating / Semi-bluff call with high cards (25% risk tolerance)
  if (highCard >= 12 && toCall <= 40 && Math.random() < 0.3) {
    return {
      action: "call",
      dialogue: "Holding overcards. I shall float this street.",
    };
  }

  // Random aggressive check-raise bluff (15% chance)
  if (stage === "river" && Math.random() < 0.18 && aiChips >= toCall + 60 && !isCallingStation) {
    return {
      action: "raise",
      raiseAmount: Math.min(aiChips, toCall + 60),
      dialogue: "Perhaps I hold the nuts, perhaps mere audacity. Call to find out.",
    };
  }

  return { action: "fold", dialogue: "Nothing of note in my hand. Folded." };
}
