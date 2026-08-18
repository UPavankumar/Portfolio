import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  createDeck,
  evaluateHand,
  getAIDecision,
  type Card as PokerCard,
  type HandEvaluation,
} from "../lib/poker";

// Casino Sound Synth using Web Audio API
function playCasinoSound(type: "deal" | "chip" | "check" | "win" | "fold" | "allin") {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "deal") {
      // Crisp card slide swish
      osc.type = "sine";
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "chip") {
      // Ceramic chips clack
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.06);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === "check") {
      // Table wood double knock
      osc.type = "sine";
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "win") {
      // Triumph fanfare chord
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.setValueAtTime(1046.5, now + 0.24); // C6
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === "fold") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "allin") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(900, now + 0.25);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch {
    // Web Audio blocked
  }
}

type Stage = "preflop" | "flop" | "turn" | "river" | "showdown";

export default function NotFound() {
  const [, setDeck] = useState<PokerCard[]>([]);
  const [playerHole, setPlayerHole] = useState<PokerCard[]>([]);
  const [aiHole, setAiHole] = useState<PokerCard[]>([]);
  const [communityCards, setCommunityCards] = useState<PokerCard[]>([]);

  const [playerChips, setPlayerChips] = useState(1000);
  const [aiChips, setAiChips] = useState(1000);
  const [pot, setPot] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);
  const [playerRoundBet, setPlayerRoundBet] = useState(0);
  const [aiRoundBet, setAiRoundBet] = useState(0);

  const [stage, setStage] = useState<Stage>("preflop");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiDialogue, setAiDialogue] = useState("Welcome to the 404 High-Stakes Lounge. Let's see if your bluff holds.");
  const [handResult, setHandResult] = useState<string | null>(null);
  const [raiseSlider, setRaiseSlider] = useState(40);

  const [playerHandEval, setPlayerHandEval] = useState<HandEvaluation | null>(null);
  const [aiHandEval, setAiHandEval] = useState<HandEvaluation | null>(null);

  const BIG_BLIND = 20;
  const SMALL_BLIND = 10;

  // Start fresh hand
  const startNewHand = useCallback(() => {
    if (playerChips <= 0 || aiChips <= 0) {
      // Re-buy
      setPlayerChips(1000);
      setAiChips(1000);
    }

    setHandResult(null);
    setCommunityCards([]);
    setStage("preflop");
    setPlayerRoundBet(0);
    setAiRoundBet(0);

    const newDeck = createDeck();
    const pCards = [newDeck.pop()!, newDeck.pop()!];
    const aiCards = [newDeck.pop()!, newDeck.pop()!];

    // Blinds post
    const pBlind = Math.min(playerChips, SMALL_BLIND);
    const aBlind = Math.min(aiChips, BIG_BLIND);

    setPlayerChips((prev) => prev - pBlind);
    setAiChips((prev) => prev - aBlind);
    setPot(pBlind + aBlind);
    setPlayerRoundBet(pBlind);
    setAiRoundBet(aBlind);
    setCurrentBet(BIG_BLIND);

    setPlayerHole(pCards);
    setAiHole(aiCards);
    setDeck(newDeck);

    playCasinoSound("deal");
    setAiDialogue("Cards are in the air. Big Blind $20 posted.");
  }, [playerChips, aiChips]);

  // Initial deal
  useEffect(() => {
    startNewHand();
  }, []);

  // Update real-time hand strength evaluation
  useEffect(() => {
    if (playerHole.length === 2) {
      setPlayerHandEval(evaluateHand(playerHole, communityCards));
    }
  }, [playerHole, communityCards]);

  // Advance street (Flop, Turn, River, Showdown)
  const advanceStreet = useCallback(() => {
    setPlayerRoundBet(0);
    setAiRoundBet(0);
    setCurrentBet(0);

    setDeck((prevDeck) => {
      const d = [...prevDeck];
      if (stage === "preflop") {
        d.pop(); // Burn card
        const flop = [d.pop()!, d.pop()!, d.pop()!];
        setCommunityCards(flop);
        setStage("flop");
        playCasinoSound("deal");
        setAiDialogue("Flop is dealt. What is your move?");
      } else if (stage === "flop") {
        d.pop(); // Burn
        const turn = d.pop()!;
        setCommunityCards((prev) => [...prev, turn]);
        setStage("turn");
        playCasinoSound("deal");
        setAiDialogue("Turn card is out. The pot grows thicker.");
      } else if (stage === "turn") {
        d.pop(); // Burn
        const river = d.pop()!;
        setCommunityCards((prev) => [...prev, river]);
        setStage("river");
        playCasinoSound("deal");
        setAiDialogue("River is dealt. The moment of truth.");
      } else if (stage === "river") {
        setStage("showdown");
        handleShowdown();
      }
      return d;
    });
  }, [stage]);

  // Showdown hand resolution
  const handleShowdown = useCallback(() => {
    if (playerHole.length < 2 || aiHole.length < 2) return;

    const pEval = evaluateHand(playerHole, communityCards);
    const aEval = evaluateHand(aiHole, communityCards);
    setPlayerHandEval(pEval);
    setAiHandEval(aEval);

    let winnerMsg = "";
    if (pEval.score > aEval.score) {
      winnerMsg = `🏆 You WIN $${pot}! (${pEval.description})`;
      setPlayerChips((prev) => prev + pot);
      playCasinoSound("win");
      setAiDialogue("Impeccable play. The pot is yours, sir.");
    } else if (aEval.score > pEval.score) {
      winnerMsg = `💀 Alfred WINS $${pot}! (${aEval.description})`;
      setAiChips((prev) => prev + pot);
      playCasinoSound("fold");
      setAiDialogue("Read like an open book. Better luck next hand.");
    } else {
      winnerMsg = `🤝 Split Pot! ($${Math.floor(pot / 2)} each)`;
      const half = Math.floor(pot / 2);
      setPlayerChips((prev) => prev + half);
      setAiChips((prev) => prev + half);
      playCasinoSound("chip");
      setAiDialogue("A deadlock. We divide the spoils.");
    }

    setHandResult(winnerMsg);
  }, [playerHole, aiHole, communityCards, pot]);

  // Player Actions
  const handlePlayerCheck = () => {
    if (isAiThinking || stage === "showdown") return;
    playCasinoSound("check");

    // Pass action to AI
    triggerAiTurn(0);
  };

  const handlePlayerCall = () => {
    if (isAiThinking || stage === "showdown") return;
    const toCall = currentBet - playerRoundBet;
    const actualCall = Math.min(playerChips, toCall);

    playCasinoSound("chip");
    setPlayerChips((prev) => prev - actualCall);
    setPot((prev) => prev + actualCall);
    setPlayerRoundBet((prev) => prev + actualCall);

    triggerAiTurn(0, true);
  };

  const handlePlayerRaise = (amount: number) => {
    if (isAiThinking || stage === "showdown") return;
    const totalWager = Math.min(playerChips, amount);

    playCasinoSound(totalWager === playerChips ? "allin" : "chip");
    setPlayerChips((prev) => prev - totalWager);
    setPot((prev) => prev + totalWager);
    setPlayerRoundBet((prev) => prev + totalWager);
    setCurrentBet(playerRoundBet + totalWager);

    triggerAiTurn(totalWager);
  };

  const handlePlayerFold = () => {
    if (isAiThinking || stage === "showdown") return;
    playCasinoSound("fold");
    setHandResult(`You Folded. Alfred collects $${pot}.`);
    setAiChips((prev) => prev + pot);
    setAiDialogue("Prudence is the better part of valour.");
    setStage("showdown");
  };

  // AI Turn handler with realistic latency
  const triggerAiTurn = (playerAddedBet: number, wasPlayerCall = false) => {
    setIsAiThinking(true);

    setTimeout(() => {
      setIsAiThinking(false);

      if (wasPlayerCall && playerRoundBet >= aiRoundBet) {
        // Both matched, advance street
        advanceStreet();
        return;
      }

      const toCallForAi = Math.max(0, currentBet - aiRoundBet + playerAddedBet);
      const decision = getAIDecision(aiHole, communityCards, pot, toCallForAi, aiChips, stage === "showdown" ? "river" : stage);
      setAiDialogue(decision.dialogue);

      if (decision.action === "fold") {
        playCasinoSound("fold");
        setHandResult(`Alfred Folds! You WIN $${pot}!`);
        setPlayerChips((prev) => prev + pot);
        playCasinoSound("win");
        setStage("showdown");
      } else if (decision.action === "call") {
        playCasinoSound("chip");
        const callAmt = Math.min(aiChips, toCallForAi);
        setAiChips((prev) => prev - callAmt);
        setPot((prev) => prev + callAmt);
        setAiRoundBet((prev) => prev + callAmt);

        // Advance to next street
        setTimeout(advanceStreet, 400);
      } else if (decision.action === "raise") {
        const raiseAmt = decision.raiseAmount || 40;
        playCasinoSound("chip");
        setAiChips((prev) => prev - raiseAmt);
        setPot((prev) => prev + raiseAmt);
        setAiRoundBet((prev) => prev + raiseAmt);
        setCurrentBet(aiRoundBet + raiseAmt);
      } else {
        // AI Checks
        playCasinoSound("check");
        if (playerRoundBet === aiRoundBet) {
          setTimeout(advanceStreet, 400);
        }
      }
    }, 650);
  };

  const toCall = Math.max(0, currentBet - playerRoundBet);

  return (
    <div className="fixed inset-0 z-[10000] bg-[#070b14] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      
      {/* Top Header & Bankroll HUD */}
      <header className="p-4 sm:p-6 flex items-center justify-between border-b border-white/10 bg-black/60 backdrop-blur-md z-20">
        
        {/* Title Badge */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black font-black flex items-center justify-center text-xl shadow-[0_0_20px_rgba(245,158,11,0.5)]">
            ♠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-amber-400 font-bold tracking-widest uppercase">
                404 High-Stakes Lounge
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                LIVE DEALER
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
              Texas Hold'em Poker Engine
            </h1>
          </div>
        </div>

        {/* Chip Bankroll Tracker */}
        <div className="flex items-center gap-4 sm:gap-6 font-mono">
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 block uppercase">Your Bankroll</span>
            <span className="text-lg sm:text-xl font-black text-emerald-400">${playerChips.toLocaleString()}</span>
          </div>

          <div className="h-8 w-px bg-white/10" />

          <div className="text-right">
            <span className="text-[10px] text-neutral-400 block uppercase">Alfred (AI)</span>
            <span className="text-base sm:text-lg font-bold text-neutral-300">${aiChips.toLocaleString()}</span>
          </div>

          {/* Quick Exit Links */}
          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-bold hover:bg-white hover:text-black transition-all hover:scale-105 ml-2"
          >
            ← Cash Out & Exit
          </Link>
        </div>
      </header>

      {/* Main Luxury Poker Felt Table */}
      <main className="relative flex-1 flex flex-col items-center justify-between p-4 sm:p-8 max-w-6xl w-full mx-auto">
        
        {/* Table Felt Glow & Oval Border */}
        <div className="absolute inset-4 sm:inset-8 rounded-[4rem] sm:rounded-[6rem] bg-gradient-to-b from-[#0b3b24] via-[#062416] to-[#04170e] border-[10px] sm:border-[16px] border-[#2a1a0f] shadow-[inset_0_0_80px_rgba(0,0,0,0.8),0_0_60px_rgba(0,0,0,0.9)] overflow-hidden pointer-events-none" />

        {/* AI Dealer Area */}
        <div className="relative z-10 flex flex-col items-center space-y-3 pt-2">
          
          {/* Alfred Speech Bubble */}
          <motion.div
            key={aiDialogue}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 rounded-2xl bg-black/80 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-mono max-w-md text-center shadow-lg backdrop-blur-md"
          >
            <span className="text-amber-400 font-bold mr-1">Alfred:</span> {aiDialogue}
          </motion.div>

          {/* AI Hand Evaluation Pill (Showdown only) */}
          {stage === "showdown" && aiHandEval && (
            <div className="px-3.5 py-1 rounded-full bg-black/80 border border-amber-500/40 text-amber-300 font-mono text-xs backdrop-blur-md shadow-md">
              Alfred's Hand: {aiHandEval.description}
            </div>
          )}

          {/* AI Avatar & Hidden Hole Cards */}
          <div className="flex items-center gap-4">
            <div className="relative size-12 sm:size-14 rounded-full border-2 border-amber-500/50 bg-[#121624] overflow-hidden flex items-center justify-center text-xl shadow-lg">
              🤵
              {isAiThinking && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="size-3 rounded-full bg-amber-400 animate-ping" />
                </div>
              )}
            </div>

            {/* AI Hole Cards (Face down unless showdown) */}
            <div className="flex items-center gap-2">
              {aiHole.map((card, i) => (
                <CardView
                  key={i}
                  card={card}
                  hidden={stage !== "showdown"}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center Community Board & Pot Area */}
        <div className="relative z-10 flex flex-col items-center space-y-4 my-auto">
          
          {/* Main Pot Counter with Chip Piles */}
          <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-black/80 border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.3)] backdrop-blur-xl">
            <span className="text-lg">🪙</span>
            <div>
              <span className="text-[10px] text-amber-300 font-mono block tracking-widest uppercase">
                TOTAL POT
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                ${pot.toLocaleString()}
              </span>
            </div>
            {currentBet > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                To Call: ${toCall}
              </span>
            )}
          </div>

          {/* 5 Community Cards (Flop, Turn, River) */}
          <div className="flex items-center gap-2 sm:gap-3 p-3 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl">
            {[0, 1, 2, 3, 4].map((index) => {
              const card = communityCards[index];
              return (
                <div key={index} className="transition-all duration-300">
                  {card ? (
                    <CardView card={card} />
                  ) : (
                    <div className="w-12 sm:w-16 h-16 sm:h-24 rounded-xl border-2 border-dashed border-white/15 bg-black/20 flex items-center justify-center text-neutral-600 font-mono text-xs">
                      {index < 3 ? "FLOP" : index === 3 ? "TURN" : "RIVER"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Showdown Result Banner */}
          <AnimatePresence>
            {handResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-black font-mono text-sm sm:text-base shadow-[0_0_40px_rgba(245,158,11,0.6)] flex items-center gap-3"
              >
                <span>{handResult}</span>
                <button
                  onClick={startNewHand}
                  className="px-4 py-1.5 rounded-xl bg-black text-white font-bold hover:bg-neutral-800 transition-colors text-xs cursor-pointer ml-2"
                >
                  Next Hand ↵
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Player Hole Cards & Hand Strength */}
        <div className="relative z-10 flex flex-col items-center space-y-3 pb-2">
          
          {/* Hand Evaluation Strength Pill */}
          {playerHandEval && (
            <div className="px-4 py-1.5 rounded-full bg-black/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs backdrop-blur-md shadow-md flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{playerHandEval.description}</span>
            </div>
          )}

          {/* Player Cards */}
          <div className="flex items-center gap-3">
            {playerHole.map((card, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <CardView card={card} isPlayer />
              </motion.div>
            ))}
          </div>
        </div>

      </main>

      {/* Bottom Interactive Action Panel */}
      <footer className="p-4 sm:p-6 bg-[#04070e] border-t border-white/10 backdrop-blur-xl z-20">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Raise Slider & Quick Bets */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-mono text-neutral-400 shrink-0">Raise:</span>
            <input
              type="range"
              min={toCall + 20}
              max={playerChips}
              step={10}
              value={raiseSlider}
              onChange={(e) => setRaiseSlider(Number(e.target.value))}
              disabled={isAiThinking || stage === "showdown" || playerChips <= toCall}
              className="w-full sm:w-40 accent-amber-500"
            />
            <span className="font-mono font-bold text-amber-400 text-sm min-w-[50px]">
              ${raiseSlider}
            </span>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5">
              {[
                { label: "1/2 Pot", val: Math.max(toCall + 20, Math.floor(pot / 2)) },
                { label: "Pot", val: Math.max(toCall + 20, pot) },
                { label: "All-In", val: playerChips },
              ].map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => setRaiseSlider(Math.min(playerChips, btn.val))}
                  disabled={isAiThinking || stage === "showdown"}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-300 hover:border-amber-500/50 hover:text-amber-300 transition-colors disabled:opacity-40"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            
            {/* FOLD */}
            <button
              type="button"
              onClick={handlePlayerFold}
              disabled={isAiThinking || stage === "showdown"}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 font-mono font-bold text-xs hover:bg-red-500 hover:text-white transition-all disabled:opacity-40 cursor-pointer shadow-lg"
            >
              FOLD
            </button>

            {/* CHECK / CALL */}
            {toCall === 0 ? (
              <button
                type="button"
                onClick={handlePlayerCheck}
                disabled={isAiThinking || stage === "showdown"}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-neutral-800 border border-white/20 text-white font-mono font-bold text-xs hover:bg-white hover:text-black transition-all disabled:opacity-40 cursor-pointer shadow-lg"
              >
                CHECK
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePlayerCall}
                disabled={isAiThinking || stage === "showdown"}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-emerald-500 text-black font-mono font-black text-xs hover:bg-emerald-400 transition-all disabled:opacity-40 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              >
                CALL ${toCall}
              </button>
            )}

            {/* RAISE */}
            <button
              type="button"
              onClick={() => handlePlayerRaise(raiseSlider)}
              disabled={isAiThinking || stage === "showdown" || playerChips <= toCall}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-mono font-black text-xs hover:from-amber-400 hover:to-yellow-400 transition-all disabled:opacity-40 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.5)]"
            >
              {raiseSlider >= playerChips ? "ALL-IN 🔥" : `RAISE TO $${raiseSlider}`}
            </button>

            {/* NEXT HAND BUTTON (when showdown) */}
            {stage === "showdown" && (
              <button
                type="button"
                onClick={startNewHand}
                className="px-6 py-3 rounded-2xl bg-white text-black font-mono font-black text-xs hover:bg-amber-400 transition-all cursor-pointer animate-pulse"
              >
                DEAL NEW HAND ↵
              </button>
            )}

          </div>

        </div>
      </footer>

    </div>
  );
}

// Crisp High-Res Casino Card Component
function CardView({ card, hidden = false, isPlayer = false }: { card: PokerCard; hidden?: boolean; isPlayer?: boolean }) {
  if (hidden) {
    return (
      <div className="w-12 sm:w-16 h-16 sm:h-24 rounded-xl border border-amber-500/40 bg-gradient-to-br from-[#1a1c29] via-[#0e101a] to-[#080910] shadow-xl flex items-center justify-center select-none transform hover:-translate-y-1 transition-transform">
        <div className="size-8 rounded-lg border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-xs">
          ♠
        </div>
      </div>
    );
  }

  const isRed = card.color === "red";

  return (
    <motion.div
      whileHover={isPlayer ? { y: -8, scale: 1.05 } : {}}
      className={`w-12 sm:w-16 h-16 sm:h-24 rounded-xl border border-white/20 bg-gradient-to-b from-white via-neutral-100 to-neutral-200 shadow-2xl p-1.5 flex flex-col justify-between select-none ${
        isPlayer ? "ring-2 ring-emerald-400/40" : ""
      }`}
    >
      {/* Top Left Rank + Suit */}
      <div className={`flex flex-col items-center leading-none ${isRed ? "text-red-600" : "text-black"}`}>
        <span className="text-xs sm:text-sm font-black font-mono">{card.rank}</span>
        <span className="text-[10px] sm:text-xs">{card.suit}</span>
      </div>

      {/* Center Large Suit Watermark */}
      <div className={`self-center text-lg sm:text-2xl font-black ${isRed ? "text-red-600" : "text-black"} opacity-90`}>
        {card.suit}
      </div>

      {/* Bottom Right Inverted Rank */}
      <div className={`flex flex-col items-center leading-none rotate-180 ${isRed ? "text-red-600" : "text-black"}`}>
        <span className="text-xs sm:text-sm font-black font-mono">{card.rank}</span>
        <span className="text-[10px] sm:text-xs">{card.suit}</span>
      </div>
    </motion.div>
  );
}
