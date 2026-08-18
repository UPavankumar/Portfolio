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

// Adaptive Pattern-Recognition AI Poker Decision Engine
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
          raiseAmount: Math.min(aiChips, toCall + (isCallingStation ? 80 : 50)),
          dialogue: isCallingStation
            ? "A commanding starting hand. Since you rarely fold pre-flop, let us make it worthwhile."
            : isAggressive
            ? "An exceptional starting holding. Let us test your habitual aggression, sir."
            : "A fine starting position. I raise.",
        };
      }
      return { action: "call", dialogue: "I shall match your wager." };
    }

    // Playable hands: pairs, connectors, high broadways
    if (isPocketPair || (highCard >= 9 && (isSuited || Math.abs(v1 - v2) <= 2))) {
      if (toCall <= 40 || toCall <= aiChips * 0.2) {
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
    if (isTight && totalHands >= 3 && Math.random() < 0.35 && aiChips >= 50) {
      return {
        action: "raise",
        raiseAmount: Math.min(aiChips, toCall + 40),
        dialogue: "You fold often under pre-flop pressure. Let us test that discipline.",
      };
    }

    // Cheap call
    if (toCall <= 20) {
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
    // TRAP AGGRESSIVE PLAYERS by checking monster
    if (isAggressive && toCall === 0 && (stage === "flop" || stage === "turn") && Math.random() < 0.75) {
      return {
        action: "check",
        dialogue: "Check. (I anticipate your customary attack, sir.)",
      };
    }

    // Charge Calling Stations MAXIMUM value
    if (isCallingStation) {
      const hugeRaise = Math.min(aiChips, toCall + Math.max(90, Math.floor(pot * 0.85)));
      return {
        action: "raise",
        raiseAmount: hugeRaise,
        dialogue: `My analysis shows you rarely fold post-flop. Allow me to price this ${rank} accordingly.`,
      };
    }

    // Standard Value Raise
    if (aiChips >= toCall + 60) {
      return {
        action: "raise",
        raiseAmount: Math.min(aiChips, toCall + Math.max(60, Math.floor(pot * 0.6))),
        dialogue: `A formidable board. My holding is well ahead.`,
      };
    }
    return { action: "call", dialogue: "I shall call." };
  }

  // 2. Strong Hands: Three of a Kind or Two Pair
  if (rank === "Three of a Kind" || rank === "Two Pair") {
    if (toCall === 0) {
      if (isAggressive && Math.random() < 0.55) {
        return {
          action: "check",
          dialogue: "Check to you. Let us see if you attempt to buy this pot.",
        };
      }
      return {
        action: "raise",
        raiseAmount: Math.min(aiChips, Math.max(40, Math.floor(pot * 0.5))),
        dialogue: isCallingStation
          ? "Value bet for Two Pair+. You'll call, of course."
          : "Pressing the statistical advantage.",
      };
    }

    // Call aggressive raises with Two Pair / Trips
    if (isAggressive) {
      return {
        action: "call",
        dialogue: `I have profiled your high raise frequency (${playerProfile.aggressionRate}%). My ${rank} is more than sufficient to call.`,
      };
    }

    // If Tight player pushes ALL-IN, proceed with caution
    if (isTight && toCall >= aiChips * 0.7 && rank === "Two Pair") {
      return {
        action: "fold",
        dialogue: "You only push this hard when holding an unbeatable hand. I concede.",
      };
    }

    return { action: "call", dialogue: "An intriguing wager. I call." };
  }

  // 3. Medium Hands: One Pair
  if (rank === "One Pair") {
    if (toCall === 0) {
      // Steal against Tight players
      if (isTight && Math.random() < 0.65) {
        return {
          action: "raise",
          raiseAmount: Math.min(aiChips, Math.max(30, Math.floor(pot * 0.45))),
          dialogue: "You concede easily on check. I shall take the initiative.",
        };
      }
      return { action: "check", dialogue: "Check." };
    }

    // Catch habitual bluffers with One Pair
    if (isAggressive && (playerProfile.timesBluffedCaught >= 1 || playerProfile.aggressionRate >= 60)) {
      if (toCall <= aiChips * 0.5) {
        return {
          action: "call",
          dialogue: `I've caught you bluffing with air before. My ${evaluation.description} is calling you down.`,
        };
      }
    }

    // Fold to Tight player big bets
    if (isTight && toCall >= 50) {
      return {
        action: "fold",
        dialogue: "Your betting pattern is strictly value-oriented. My single pair cannot survive this.",
      };
    }

    if (toCall <= pot * 0.45 || toCall <= 40) {
      return { action: "call", dialogue: "I shall see the next street." };
    }

    return { action: "fold", dialogue: "I yield this hand to your wager." };
  }

  // 4. Weak / High Card
  if (toCall === 0) {
    // Steal bluff against Tight players
    if (isTight && totalHands >= 3 && Math.random() < 0.45 && aiChips >= 40) {
      return {
        action: "raise",
        raiseAmount: Math.min(aiChips, 40),
        dialogue: "Exploiting your passive tendencies with a position probe.",
      };
    }
    return { action: "check", dialogue: "Check." };
  }

  // NEVER bluff against Calling Station
  if (isCallingStation) {
    return {
      action: "fold",
      dialogue: "Bluffing a calling station is folly. I fold gracefully.",
    };
  }

  return { action: "fold", dialogue: "Nothing of note in my hand. Folded." };
}
