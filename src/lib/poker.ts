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

// Generate all 5-card combinations from 7 cards
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

// Evaluate single 5-card hand
function evaluate5CardHand(hand: Card[]): { rankName: HandRank; score: number; description: string } {
  const sorted = [...hand].sort((a, b) => b.value - a.value);
  const values = sorted.map((c) => c.value);
  const suits = sorted.map((c) => c.suit);

  const isFlush = suits.every((s) => s === suits[0]);

  // Check straight (including A-2-3-4-5 wheel)
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
    straightHigh = 5; // 5-high straight
  }

  // Count frequencies
  const counts: Record<number, number> = {};
  for (const v of values) {
    counts[v] = (counts[v] || 0) + 1;
  }

  const freqEntries = Object.entries(counts)
    .map(([val, count]) => ({ val: Number(val), count }))
    .sort((a, b) => b.count - a.count || b.val - a.val);

  // 1. Royal Flush & Straight Flush
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

  // 2. Four of a Kind
  if (freqEntries[0].count === 4) {
    const quad = freqEntries[0].val;
    const kicker = freqEntries[1].val;
    return {
      rankName: "Four of a Kind",
      score: 7000000 + quad * 100 + kicker,
      description: `Four of a Kind, ${getRankName(quad)}s`,
    };
  }

  // 3. Full House
  if (freqEntries[0].count === 3 && freqEntries[1].count === 2) {
    const trip = freqEntries[0].val;
    const pair = freqEntries[1].val;
    return {
      rankName: "Full House",
      score: 6000000 + trip * 100 + pair,
      description: `Full House, ${getRankName(trip)}s full of ${getRankName(pair)}s`,
    };
  }

  // 4. Flush
  if (isFlush) {
    const tieScore = values.reduce((acc, v, idx) => acc + v * Math.pow(15, 4 - idx), 0);
    return {
      rankName: "Flush",
      score: 5000000 + tieScore,
      description: `Flush, ${getRankName(values[0])} High`,
    };
  }

  // 5. Straight
  if (isStraight) {
    return {
      rankName: "Straight",
      score: 4000000 + straightHigh,
      description: `Straight, ${getRankName(straightHigh)} High`,
    };
  }

  // 6. Three of a Kind
  if (freqEntries[0].count === 3) {
    const trip = freqEntries[0].val;
    const kickers = [freqEntries[1].val, freqEntries[2].val];
    return {
      rankName: "Three of a Kind",
      score: 3000000 + trip * 1000 + kickers[0] * 15 + kickers[1],
      description: `Three of a Kind, ${getRankName(trip)}s`,
    };
  }

  // 7. Two Pair
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

  // 8. One Pair
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

  // 9. High Card
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

// Evaluate 7 cards and return the best 5-card hand
export function evaluateHand(holeCards: Card[], communityCards: Card[]): HandEvaluation {
  const allCards = [...holeCards, ...communityCards];
  if (allCards.length < 5) {
    return {
      rankName: "High Card",
      score: 0,
      description: "Waiting for cards...",
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

// AI Poker Bot Decision Logic (Alfred / Pro Casino AI)
export function getAIDecision(
  aiHole: Card[],
  community: Card[],
  pot: number,
  toCall: number,
  aiChips: number,
  stage: "preflop" | "flop" | "turn" | "river"
): { action: "fold" | "check" | "call" | "raise"; raiseAmount?: number; dialogue: string } {
  const evaluation = evaluateHand(aiHole, community);
  const v1 = aiHole[0].value;
  const v2 = aiHole[1].value;
  const isPocketPair = v1 === v2;
  const highCard = Math.max(v1, v2);
  const isSuited = aiHole[0].suit === aiHole[1].suit;

  // Pre-flop logic
  if (stage === "preflop") {
    // Monster hands: AA, KK, QQ, JJ, AK
    if ((isPocketPair && v1 >= 11) || (v1 >= 13 && v2 >= 13)) {
      if (aiChips >= toCall + 60 && Math.random() < 0.8) {
        return {
          action: "raise",
          raiseAmount: Math.min(aiChips, toCall + 60),
          dialogue: "A fine starting position. Let us test your resolve.",
        };
      }
      return { action: "call", dialogue: "I shall match your entry." };
    }

    // Decent hands: pairs, suited connectors, high broadways
    if (isPocketPair || (highCard >= 10 && (isSuited || Math.abs(v1 - v2) <= 2))) {
      if (toCall <= 40 || toCall <= aiChips * 0.15) {
        return { action: "call", dialogue: "Very well, let us see the flop." };
      }
    }

    // Weak cards
    if (toCall === 0) {
      return { action: "check", dialogue: "Check to you, sir." };
    }

    // Cheap call
    if (toCall <= 20 && Math.random() < 0.7) {
      return { action: "call", dialogue: "I shall see this through." };
    }

    return { action: "fold", dialogue: "Prudence dictates a fold. Your pot." };
  }

  // Post-flop (Flop, Turn, River)
  const rank = evaluation.rankName;

  // Monsters: Straight or better
  if (
    rank === "Royal Flush" ||
    rank === "Straight Flush" ||
    rank === "Four of a Kind" ||
    rank === "Full House" ||
    rank === "Flush" ||
    rank === "Straight"
  ) {
    if (aiChips >= toCall + 80 && Math.random() < 0.75) {
      return {
        action: "raise",
        raiseAmount: Math.min(aiChips, toCall + Math.max(80, Math.floor(pot * 0.6))),
        dialogue: "A rather formidable board. I raise.",
      };
    }
    return { action: "call", dialogue: "I shall call." };
  }

  // Strong: Three of a Kind or Two Pair
  if (rank === "Three of a Kind" || rank === "Two Pair") {
    if (toCall === 0) {
      if (Math.random() < 0.6) {
        return {
          action: "raise",
          raiseAmount: Math.min(aiChips, Math.max(40, Math.floor(pot * 0.4))),
          dialogue: "Pressing the advantage.",
        };
      }
      return { action: "check", dialogue: "Check." };
    }
    if (toCall <= aiChips * 0.6) {
      return { action: "call", dialogue: "An intriguing wager. I call." };
    }
  }

  // Moderate: One Pair
  if (rank === "One Pair") {
    if (toCall === 0) {
      return { action: "check", dialogue: "Check." };
    }
    if (toCall <= pot * 0.5 || toCall <= 60) {
      return { action: "call", dialogue: "I shall see the next card." };
    }
    // Occasional bluff
    if (Math.random() < 0.15 && stage === "river") {
      return {
        action: "raise",
        raiseAmount: Math.min(aiChips, toCall + 50),
        dialogue: "Let us see if you possess the courage to call.",
      };
    }
    return { action: "fold", dialogue: "I yield this hand." };
  }

  // Weak / High Card
  if (toCall === 0) {
    return { action: "check", dialogue: "Check." };
  }

  // Small random bluff (10%)
  if (Math.random() < 0.1 && aiChips >= toCall + 50) {
    return {
      action: "raise",
      raiseAmount: Math.min(aiChips, toCall + 50),
      dialogue: "Perhaps the pot belongs to me.",
    };
  }

  return { action: "fold", dialogue: "Nothing of note in my hand. Folded." };
}
