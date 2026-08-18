import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  createDeck,
  evaluateHand,
  calculateWinProbability,
  getAdaptiveAIDecision,
  classifyPlayerProfile,
  getAlfredCardCommentary,
  type Card as PokerCard,
  type HandEvaluation,
  type PlayerProfile,
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
      osc.type = "sine";
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "chip") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.06);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === "check") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "win") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      osc.frequency.setValueAtTime(1046.5, now + 0.24);
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

interface ChatMessage {
  id: string;
  sender: "Alfred" | "You" | "Dealer";
  text: string;
  time: string;
}

export default function NotFound() {
  const [deck, setDeck] = useState<PokerCard[]>([]);
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
  const [aiDialogue, setAiDialogue] = useState("404: This page is not available. But since you're here... let's play poker!");
  const [handResult, setHandResult] = useState<string | null>(null);
  const [raiseSlider, setRaiseSlider] = useState(40);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showChatSidebar, setShowChatSidebar] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  
  // Dedicated Tournament End State: Champion vs Busted
  const [tournamentResult, setTournamentResult] = useState<"player_champion" | "player_busted" | null>(null);

  // Red Dot Laser Cursor Tracking
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isMouseInside, setIsMouseInside] = useState(false);

  // Live Win Probability Equity %
  const [winProbability, setWinProbability] = useState(50);

  // Guard ref to strictly prevent duplicate street advancements
  const isAdvancingStreetRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsMouseInside(true);
    };
    const handleMouseLeave = () => setIsMouseInside(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Chat message stream (no duplicate consecutive messages)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "Alfred",
      text: "404: This page is not available. But since you're here... let's play poker!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const isChatReplyingRef = useRef(false);

  const [playerHandEval, setPlayerHandEval] = useState<HandEvaluation | null>(null);
  const [aiHandEval, setAiHandEval] = useState<HandEvaluation | null>(null);

  // Persistent Player Behavioral Pattern Memory
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>({
    totalHands: 0,
    handsEntered: 0,
    totalRaises: 0,
    totalCalls: 0,
    totalFolds: 0,
    totalChecks: 0,
    timesBluffedCaught: 0,
    timesFoldedToAiRaise: 0,
    timesRaisedRiver: 0,
    lastActions: [],
    archetype: "Observing...",
    readSummary: "Calibrating baseline tendencies...",
    vpipPercent: 50,
    aggressionRate: 50,
  });

  const BIG_BLIND = 20;
  const SMALL_BLIND = 10;

  // Strict deduplicated chat message adder
  const addChatMessage = useCallback((sender: "Alfred" | "You" | "Dealer", text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setChatMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.sender === sender && last.text === trimmed) {
        return prev;
      }
      return [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          sender,
          text: trimmed,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ];
    });
  }, []);

  const updateAiDialogue = useCallback(
    (text: string) => {
      setAiDialogue(text);
      addChatMessage("Alfred", text);
    },
    [addChatMessage]
  );

  // Auto-scroll chat internally
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Restart match with fresh stacks ($1,000 each)
  const handleRebuy = useCallback(() => {
    setTournamentResult(null);
    setHandResult(null);
    setCommunityCards([]);
    setStage("preflop");
    setPlayerRoundBet(0);
    setAiRoundBet(0);

    const newDeck = createDeck();
    const pCards = [newDeck.pop()!, newDeck.pop()!];
    const aiCards = [newDeck.pop()!, newDeck.pop()!];

    const pBlind = 10;
    const aBlind = 20;

    setPlayerChips(1000 - pBlind);
    setAiChips(1000 - aBlind);
    setPot(pBlind + aBlind);
    setPlayerRoundBet(pBlind);
    setAiRoundBet(aBlind);
    setCurrentBet(BIG_BLIND);

    setPlayerHole(pCards);
    setAiHole(aiCards);
    setDeck(newDeck);

    playCasinoSound("deal");
    updateAiDialogue("Fresh $1,000 bankrolls reloaded. Cards are in the air!");
  }, [updateAiDialogue]);

  // Start fresh hand
  const startNewHand = useCallback(() => {
    setTournamentResult(null);

    if (playerChips <= 0 || aiChips <= 0) {
      handleRebuy();
      return;
    }

    setHandResult(null);
    setCommunityCards([]);
    setStage("preflop");
    setPlayerRoundBet(0);
    setAiRoundBet(0);

    const newDeck = createDeck();
    const pCards = [newDeck.pop()!, newDeck.pop()!];
    const aiCards = [newDeck.pop()!, newDeck.pop()!];

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

    setPlayerProfile((prev) =>
      classifyPlayerProfile({
        ...prev,
        totalHands: prev.totalHands + 1,
      })
    );

    playCasinoSound("deal");
    const dealMsg =
      playerProfile.totalHands >= 2
        ? `Hand #${playerProfile.totalHands + 1}. Profiled as: ${playerProfile.archetype}. Cards dealt.`
        : "Cards are in the air. Big Blind $20 posted. What's your move?";
    updateAiDialogue(dealMsg);
  }, [playerChips, aiChips, playerProfile.totalHands, playerProfile.archetype, updateAiDialogue, handleRebuy]);

  // Initial deal
  useEffect(() => {
    startNewHand();
  }, []);

  // Update real-time hand strength evaluation & Win Equity %
  useEffect(() => {
    if (playerHole.length === 2) {
      setPlayerHandEval(evaluateHand(playerHole, communityCards));
      const equity = calculateWinProbability(playerHole, communityCards);
      setWinProbability(equity);
    }
  }, [playerHole, communityCards]);

  // Showdown hand resolution with Alfred card commentary
  const handleShowdown = useCallback((finalCommunity?: PokerCard[]) => {
    const board = finalCommunity || communityCards;
    if (playerHole.length < 2 || aiHole.length < 2) return;

    setStage("showdown");
    const pEval = evaluateHand(playerHole, board);
    const aEval = evaluateHand(aiHole, board);
    setPlayerHandEval(pEval);
    setAiHandEval(aEval);

    let winnerMsg = "";
    let resultType: "player_win" | "ai_win" | "split" = "split";
    const awardPot = pot;

    if (pEval.score > aEval.score) {
      resultType = "player_win";
      winnerMsg = `🏆 You WIN $${awardPot.toLocaleString()}! (${pEval.description})`;
      playCasinoSound("win");

      setPlayerChips((prev) => {
        const nextChips = prev + awardPot;
        setAiChips((aiPrev) => {
          if (aiPrev <= 0) {
            setTimeout(() => setTournamentResult("player_champion"), 1400);
          }
          return aiPrev;
        });
        return nextChips;
      });

    } else if (aEval.score > pEval.score) {
      resultType = "ai_win";
      winnerMsg = `💀 Alfred WINS $${awardPot.toLocaleString()}! (${aEval.description})`;
      playCasinoSound("fold");

      setAiChips((prev) => prev + awardPot);
      setPlayerChips((prev) => {
        if (prev <= 0) {
          setTimeout(() => setTournamentResult("player_busted"), 1400);
        }
        return prev;
      });

    } else {
      resultType = "split";
      const half = Math.floor(awardPot / 2);
      winnerMsg = `🤝 Split Pot! ($${half.toLocaleString()} each)`;
      playCasinoSound("chip");
      setPlayerChips((prev) => prev + half);
      setAiChips((prev) => prev + half);
    }

    setHandResult(winnerMsg);
    const commentary = getAlfredCardCommentary(playerHole, board, pEval, resultType);
    updateAiDialogue(commentary);
  }, [playerHole, aiHole, communityCards, pot, updateAiDialogue]);

  // Robust, single-transition street advancement based on exact board card count
  const advanceStreet = useCallback(() => {
    if (isAdvancingStreetRef.current) return;
    isAdvancingStreetRef.current = true;

    setPlayerRoundBet(0);
    setAiRoundBet(0);
    setCurrentBet(0);

    setDeck((prevDeck) => {
      const d = [...prevDeck];
      setCommunityCards((prevComm) => {
        const len = prevComm.length;
        if (len === 0) {
          // Preflop -> Flop: Deal exactly 3 cards
          d.pop(); // Burn card
          const flop = [d.pop()!, d.pop()!, d.pop()!];
          setStage("flop");
          playCasinoSound("deal");
          updateAiDialogue("Flop is dealt (3 cards). Your turn to act, sir.");
          return flop;
        } else if (len === 3) {
          // Flop -> Turn: Deal exactly 1 card (total 4)
          d.pop(); // Burn card
          const turn = d.pop()!;
          setStage("turn");
          playCasinoSound("deal");
          updateAiDialogue("Turn card is dealt (4th card). Your turn to act.");
          return [...prevComm, turn];
        } else if (len === 4) {
          // Turn -> River: Deal exactly 1 card (total 5)
          d.pop(); // Burn card
          const river = d.pop()!;
          setStage("river");
          playCasinoSound("deal");
          updateAiDialogue("River is dealt (5th card). Final betting round.");
          return [...prevComm, river];
        } else {
          // River -> Showdown
          setTimeout(() => handleShowdown(prevComm), 100);
          return prevComm;
        }
      });
      return d;
    });

    setTimeout(() => {
      isAdvancingStreetRef.current = false;
    }, 400);
  }, [updateAiDialogue, handleShowdown]);

  // Suspenseful, staggered All-In board runout (Card by Card / Street by Street)
  const runoutAllIn = useCallback(
    (currentDeck: PokerCard[], currentCommunity: PokerCard[]) => {
      playCasinoSound("allin");
      addChatMessage("Dealer", "🔥 ALL-IN SHOWDOWN! Dealing the board...");

      const d = [...currentDeck];
      const startLen = currentCommunity.length;
      let runningCommunity = [...currentCommunity];

      const dealStep = (targetLen: number, delayMs: number, onDone: () => void) => {
        setTimeout(() => {
          d.pop(); // Burn card
          while (runningCommunity.length < targetLen && d.length > 0) {
            runningCommunity.push(d.pop()!);
          }
          setCommunityCards([...runningCommunity]);
          playCasinoSound("deal");
          onDone();
        }, delayMs);
      };

      if (startLen === 0) {
        // Preflop all-in: Deal Flop (3) -> Turn (4) -> River (5)
        dealStep(3, 400, () => {
          dealStep(4, 550, () => {
            dealStep(5, 550, () => {
              handleShowdown(runningCommunity);
            });
          });
        });
      } else if (startLen === 3) {
        // Flop all-in: Deal Turn (4) -> River (5)
        dealStep(4, 450, () => {
          dealStep(5, 550, () => {
            handleShowdown(runningCommunity);
          });
        });
      } else if (startLen === 4) {
        // Turn all-in: Deal River (5)
        dealStep(5, 450, () => {
          handleShowdown(runningCommunity);
        });
      } else {
        handleShowdown(runningCommunity);
      }
    },
    [handleShowdown, addChatMessage]
  );

  // Player Actions with Texas Hold'em Round Closure
  const handlePlayerCheck = useCallback(() => {
    if (isAiThinking || stage === "showdown") return;
    playCasinoSound("check");
    addChatMessage("You", "Checked.");

    setPlayerProfile((prev) =>
      classifyPlayerProfile({
        ...prev,
        totalChecks: prev.totalChecks + 1,
        lastActions: [...prev.lastActions.slice(-6), "Check"],
      })
    );

    triggerAiTurn(0, false);
  }, [isAiThinking, stage, addChatMessage]);

  // Player Calls: Matches Alfred's bet
  const handlePlayerCall = useCallback(() => {
    if (isAiThinking || stage === "showdown") return;
    const toCall = currentBet - playerRoundBet;
    const actualCall = Math.min(playerChips, toCall);
    const isPlayerAllIn = playerChips - actualCall <= 0;

    playCasinoSound(isPlayerAllIn ? "allin" : "chip");
    addChatMessage("You", isPlayerAllIn ? `Called $${actualCall} (ALL-IN!) 🔥` : `Called $${actualCall}.`);
    
    setPlayerChips((prev) => prev - actualCall);
    setPot((prev) => prev + actualCall);
    setPlayerRoundBet((prev) => prev + actualCall);

    setPlayerProfile((prev) =>
      classifyPlayerProfile({
        ...prev,
        totalCalls: prev.totalCalls + 1,
        handsEntered: prev.handsEntered + 1,
        lastActions: [...prev.lastActions.slice(-6), isPlayerAllIn ? "ALL-IN Call" : "Call"],
      })
    );

    // IF ANY PLAYER IS ALL-IN -> DEAL ALL COMMUNITY CARDS STAGGERED!
    if (isPlayerAllIn || aiChips <= 0) {
      runoutAllIn(deck, communityCards);
      return;
    }

    // Pre-flop limp to Big Blind option
    if (stage === "preflop" && aiRoundBet === BIG_BLIND && currentBet === BIG_BLIND) {
      triggerAiTurn(0, false);
      return;
    }

    // Standard call closes street -> advance to next street
    setTimeout(() => {
      advanceStreet();
    }, 450);
  }, [isAiThinking, stage, currentBet, playerRoundBet, playerChips, aiChips, deck, communityCards, runoutAllIn, advanceStreet, addChatMessage]);

  // Player Raise / All-In
  const handlePlayerRaise = useCallback(
    (amount: number) => {
      if (isAiThinking || stage === "showdown" || playerChips <= 0) return;
      const totalWager = Math.min(playerChips, amount);
      const isAllIn = totalWager === playerChips;

      playCasinoSound(isAllIn ? "allin" : "chip");
      addChatMessage("You", isAllIn ? `Went ALL-IN for $${totalWager}! 🔥` : `Raised to $${totalWager}.`);

      setPlayerChips((prev) => prev - totalWager);
      setPot((prev) => prev + totalWager);
      setPlayerRoundBet((prev) => prev + totalWager);
      setCurrentBet(playerRoundBet + totalWager);

      setPlayerProfile((prev) =>
        classifyPlayerProfile({
          ...prev,
          totalRaises: prev.totalRaises + 1,
          handsEntered: prev.handsEntered + 1,
          timesRaisedRiver: stage === "river" ? prev.timesRaisedRiver + 1 : prev.timesRaisedRiver,
          lastActions: [...prev.lastActions.slice(-6), isAllIn ? "ALL-IN" : "Raise"],
        })
      );

      triggerAiTurn(totalWager, isAllIn);
    },
    [isAiThinking, stage, playerChips, playerRoundBet, pot, addChatMessage]
  );

  const handlePlayerFold = useCallback(() => {
    if (isAiThinking || stage === "showdown") return;
    playCasinoSound("fold");
    addChatMessage("You", "Folded hand.");
    setHandResult(`You Folded. Alfred collects $${pot}.`);
    setAiChips((prev) => prev + pot);
    setStage("showdown");

    setPlayerProfile((prev) =>
      classifyPlayerProfile({
        ...prev,
        totalFolds: prev.totalFolds + 1,
        timesFoldedToAiRaise: currentBet > playerRoundBet ? prev.timesFoldedToAiRaise + 1 : prev.timesFoldedToAiRaise,
        lastActions: [...prev.lastActions.slice(-6), "Fold"],
      })
    );

    const foldComment = getAlfredCardCommentary(
      playerHole,
      communityCards,
      evaluateHand(playerHole, communityCards),
      "player_folded"
    );
    updateAiDialogue(foldComment);

    setPlayerChips((prev) => {
      if (prev <= 0) {
        setTimeout(() => setTournamentResult("player_busted"), 1400);
      }
      return prev;
    });
  }, [isAiThinking, stage, pot, currentBet, playerRoundBet, playerHole, communityCards, updateAiDialogue, addChatMessage]);

  // AI Turn handler
  const triggerAiTurn = (playerAddedBet: number, isPlayerAllIn = false) => {
    setIsAiThinking(true);

    setTimeout(() => {
      setIsAiThinking(false);

      const toCallForAi = Math.max(0, currentBet - aiRoundBet + playerAddedBet);
      const decision = getAdaptiveAIDecision(
        aiHole,
        communityCards,
        pot,
        toCallForAi,
        aiChips,
        stage === "showdown" ? "river" : stage,
        playerProfile
      );
      updateAiDialogue(decision.dialogue);

      if (decision.action === "fold") {
        playCasinoSound("fold");
        setHandResult(`Alfred Folds! You WIN $${pot}!`);
        setPlayerChips((prev) => prev + pot);
        playCasinoSound("win");
        setStage("showdown");

        setAiChips((aiPrev) => {
          if (aiPrev <= 0) {
            setTimeout(() => setTournamentResult("player_champion"), 1400);
          }
          return aiPrev;
        });

      } else if (decision.action === "call") {
        playCasinoSound("chip");
        const callAmt = Math.min(aiChips, toCallForAi);
        const isAiAllIn = aiChips - callAmt <= 0;

        setAiChips((prev) => prev - callAmt);
        setPot((prev) => prev + callAmt);
        setAiRoundBet((prev) => prev + callAmt);

        if (isPlayerAllIn || isAiAllIn || playerChips <= 0) {
          runoutAllIn(deck, communityCards);
        } else {
          setTimeout(advanceStreet, 450);
        }
      } else if (decision.action === "raise") {
        const raiseAmt = Math.min(aiChips, decision.raiseAmount || 40);
        const isAiAllIn = aiChips - raiseAmt <= 0;

        playCasinoSound(isAiAllIn ? "allin" : "chip");
        setAiChips((prev) => prev - raiseAmt);
        setPot((prev) => prev + raiseAmt);
        setAiRoundBet((prev) => prev + raiseAmt);
        setCurrentBet(aiRoundBet + raiseAmt);

        if (isAiAllIn || isPlayerAllIn) {
          runoutAllIn(deck, communityCards);
        }
      } else {
        playCasinoSound("check");
        setTimeout(advanceStreet, 450);
      }
    }, 650);
  };

  // User chat submit with lock to prevent double responses
  const handleUserSendChat = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isChatReplyingRef.current) return;

    isChatReplyingRef.current = true;
    addChatMessage("You", trimmed);
    setChatInput("");

    setTimeout(() => {
      const lower = trimmed.toLowerCase();
      let reply = "A fascinating comment, sir. Keep your focus on the cards.";
      if (lower.includes("bluff")) reply = "A gentleman never reveals his secrets until the showdown.";
      else if (lower.includes("raise") || lower.includes("all-in")) reply = "Let us see if the cards support such conviction.";
      else if (lower.includes("hi") || lower.includes("hello")) reply = "Good day! Best of luck on the felt.";
      else if (lower.includes("good") || lower.includes("nice")) reply = "Much obliged. The cards favor the bold.";
      
      updateAiDialogue(reply);
      isChatReplyingRef.current = false;
    }, 400);
  };

  const toCall = Math.max(0, currentBet - playerRoundBet);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === "h" || key === "?") {
        setShowRulesModal((prev) => !prev);
        return;
      }

      if (key === "escape") {
        setShowRulesModal(false);
        setShowWelcomeModal(false);
        setTournamentResult(null);
        return;
      }

      if (showRulesModal || showWelcomeModal || tournamentResult !== null) return;

      if (stage === "showdown") {
        if (e.code === "Enter" || e.code === "Space") {
          e.preventDefault();
          startNewHand();
        }
        return;
      }

      if (key === "f") {
        e.preventDefault();
        handlePlayerFold();
      } else if (key === "c" || e.code === "Space") {
        e.preventDefault();
        if (toCall === 0) handlePlayerCheck();
        else handlePlayerCall();
      } else if (key === "r") {
        e.preventDefault();
        if (playerChips > toCall) handlePlayerRaise(raiseSlider);
      } else if (key === "a") {
        e.preventDefault();
        handlePlayerRaise(playerChips);
      } else if (key === "1") {
        e.preventDefault();
        setRaiseSlider(Math.min(playerChips, Math.max(toCall + 20, Math.floor(pot / 2))));
      } else if (key === "2") {
        e.preventDefault();
        setRaiseSlider(Math.min(playerChips, Math.max(toCall + 20, pot)));
      } else if (key === "3") {
        e.preventDefault();
        setRaiseSlider(playerChips);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    showRulesModal,
    showWelcomeModal,
    tournamentResult,
    stage,
    toCall,
    playerChips,
    raiseSlider,
    pot,
    handlePlayerFold,
    handlePlayerCheck,
    handlePlayerCall,
    handlePlayerRaise,
    startNewHand,
  ]);

  return (
    <div className="fixed inset-0 z-[10000] bg-[#070b14] text-white flex flex-col justify-between overflow-hidden select-none font-sans cursor-none">
      
      {/* RED DOT CASINO LASER CURSOR */}
      {isMouseInside && (
        <div
          className="fixed pointer-events-none z-[60000] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
          style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        >
          <div className="size-3.5 rounded-full bg-red-500 border border-white shadow-[0_0_15px_#ef4444,0_0_5px_#ffffff] animate-pulse" />
        </div>
      )}

      {/* Top Header & Bankroll HUD */}
      <header className="p-3 sm:p-4 flex items-center justify-between border-b border-white/10 bg-black/70 backdrop-blur-md z-20">
        
        {/* 404 Headline Badge */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black font-black flex items-center justify-center text-xl shadow-[0_0_20px_rgba(245,158,11,0.5)]">
            ♠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-red-400 font-bold tracking-wider uppercase">
                404: Page Not Found
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                TEXAS HOLD'EM
              </span>
            </div>
            <h1 className="text-xs sm:text-sm font-bold text-neutral-300">
              This page is not available — but since you're here, <span className="text-amber-400 font-black">let's play poker!</span>
            </h1>
          </div>
        </div>

        {/* Bankroll Tracker & Actions */}
        <div className="flex items-center gap-3 sm:gap-5 font-mono">
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 block uppercase">Your Bankroll</span>
            <span className="text-base sm:text-lg font-black text-emerald-400">${playerChips.toLocaleString()}</span>
          </div>

          <div className="h-8 w-px bg-white/10" />

          <div className="text-right">
            <span className="text-[10px] text-neutral-400 block uppercase">Alfred (AI)</span>
            <span className="text-base sm:text-lg font-bold text-neutral-300">${aiChips.toLocaleString()}</span>
          </div>

          {/* Toggle Chat Button */}
          <button
            type="button"
            onClick={() => setShowChatSidebar((prev) => !prev)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
              showChatSidebar
                ? "bg-amber-500 text-black border-amber-400"
                : "bg-white/10 text-white border-white/20 hover:bg-white hover:text-black"
            }`}
          >
            <span>💬 Dealer Chat</span>
          </button>

          {/* Rules & Instructions Button */}
          <button
            type="button"
            onClick={() => setShowRulesModal(true)}
            className="px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-300 hover:bg-amber-500 hover:text-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>📜 Rules [H]</span>
          </button>

          {/* Exit */}
          <Link
            to="/"
            className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-bold hover:bg-white hover:text-black transition-all hover:scale-105"
          >
            ← Exit
          </Link>
        </div>
      </header>

      {/* Main Body: Poker Table on Left + Chat Sidebar on Right */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Main Poker Felt Area */}
        <main className="relative flex-1 flex flex-col items-center justify-between p-3 sm:p-6 w-full mx-auto">
          
          {/* Table Felt Glow & Oval Border */}
          <div className="absolute inset-2 sm:inset-4 rounded-[3rem] sm:rounded-[5rem] bg-gradient-to-b from-[#0b3b24] via-[#062416] to-[#04170e] border-[8px] sm:border-[14px] border-[#2a1a0f] shadow-[inset_0_0_80px_rgba(0,0,0,0.8),0_0_60px_rgba(0,0,0,0.9)] overflow-hidden pointer-events-none" />

          {/* AI Dealer Area */}
          <div className="relative z-10 flex flex-col items-center space-y-2 pt-1">
            
            {/* Alfred Speech Bubble with Specific Card Commentary */}
            <motion.div
              key={aiDialogue}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-2 rounded-2xl bg-black/85 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-mono max-w-lg text-center shadow-lg backdrop-blur-md"
            >
              <span className="text-amber-400 font-bold mr-1">Alfred:</span> {aiDialogue}
            </motion.div>

            {/* AI Hand Evaluation Pill (Showdown only) */}
            {stage === "showdown" && aiHandEval && (
              <div className="px-3.5 py-1 rounded-full bg-black/80 border border-amber-500/40 text-amber-300 font-mono text-xs backdrop-blur-md shadow-md">
                Alfred's Hand: {aiHandEval.description}
              </div>
            )}

            {/* AI Avatar & Hole Cards */}
            <div className="flex items-center gap-4">
              <div className="relative size-12 sm:size-14 rounded-full border-2 border-amber-500/50 bg-[#121624] overflow-hidden flex items-center justify-center text-xl shadow-lg">
                🤵
                {isAiThinking && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="size-3 rounded-full bg-amber-400 animate-ping" />
                  </div>
                )}
              </div>

              {/* AI Hole Cards */}
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
          <div className="relative z-10 flex flex-col items-center space-y-3 my-auto">
            
            {/* Main Pot Counter with Chip Piles */}
            <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-black/80 border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.3)] backdrop-blur-xl">
              <span className="text-lg">🪙</span>
              <div>
                <span className="text-[10px] text-amber-300 font-mono block tracking-widest uppercase">
                  TOTAL POT
                </span>
                <span className="text-xl sm:text-3xl font-black text-white font-mono">
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
            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl">
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
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-black font-mono text-xs sm:text-sm shadow-[0_0_40px_rgba(245,158,11,0.6)] flex items-center gap-3"
                >
                  <span>{handResult}</span>
                  <button
                    onClick={startNewHand}
                    className="px-4 py-1.5 rounded-xl bg-black text-white font-bold hover:bg-neutral-800 transition-colors text-xs cursor-pointer ml-2 flex items-center gap-1.5"
                  >
                    <span>Next Hand</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] text-white">↵ Enter</kbd>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Player Hole Cards, Hand Strength & Live Win Probability % */}
          <div className="relative z-10 flex flex-col items-center space-y-2 pb-1">
            
            {/* Real-time Hand Strength & Win Probability Equity Bar */}
            <div className="flex items-center gap-2">
              {playerHandEval && (
                <div className="px-3.5 py-1 rounded-full bg-black/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs backdrop-blur-md shadow-md flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{playerHandEval.description}</span>
                </div>
              )}

              {/* Dynamic Win Equity % Pill */}
              <div className="px-3.5 py-1 rounded-full bg-black/80 border border-white/15 font-mono text-xs backdrop-blur-md shadow-md flex items-center gap-2">
                <span className="text-[10px] text-neutral-400 uppercase">Win Chance:</span>
                <span
                  className={`font-black ${
                    winProbability >= 65
                      ? "text-emerald-400"
                      : winProbability >= 40
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {winProbability}%
                </span>
              </div>
            </div>

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

        {/* RIGHT SIDEBAR: CHAT INTERFACE WITH ALFRED */}
        <AnimatePresence>
          {showChatSidebar && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="hidden md:flex flex-col justify-between border-l border-white/10 bg-[#040813]/90 backdrop-blur-xl w-80 h-full z-20 font-mono text-xs shadow-2xl"
            >
              {/* Sidebar Header */}
              <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white uppercase text-[11px]">Alfred's Table Chat</span>
                </div>
                <button
                  onClick={() => setShowChatSidebar(false)}
                  className="text-neutral-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Chat Message Stream */}
              <div ref={chatScrollRef} className="flex-1 p-3.5 overflow-y-auto space-y-3">
                {chatMessages.map((msg) => {
                  const isAlfred = msg.sender === "Alfred";
                  const isDealer = msg.sender === "Dealer";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col space-y-1 ${
                        isDealer ? "items-center text-center" : isAlfred ? "items-start" : "items-end"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                        <span
                          className={
                            isDealer
                              ? "text-amber-400 font-bold"
                              : isAlfred
                              ? "text-amber-400 font-bold"
                              : "text-emerald-400 font-bold"
                          }
                        >
                          {msg.sender}
                        </span>
                        <span>•</span>
                        <span>{msg.time}</span>
                      </div>
                      <div
                        className={`p-2.5 rounded-2xl text-xs max-w-[90%] leading-relaxed ${
                          isDealer
                            ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 text-center font-bold"
                            : isAlfred
                            ? "bg-amber-500/10 border border-amber-500/20 text-amber-200"
                            : "bg-emerald-500/15 border border-emerald-500/25 text-emerald-200"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Chat Chips */}
              <div className="px-3 py-1.5 border-t border-white/5 flex gap-1.5 overflow-x-auto text-[10px]">
                {["Nice hand!", "Are you bluffing?", "All-in coming!"].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleUserSendChat(chip)}
                    className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 hover:border-amber-400/50 hover:text-amber-300 text-neutral-400 shrink-0 cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUserSendChat(chatInput);
                }}
                className="p-3 border-t border-white/10 bg-black/40 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Chat with Alfred..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-amber-500/60"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Send
                </button>
              </form>
            </motion.aside>
          )}
        </AnimatePresence>

      </div>

      {/* Bottom Interactive Action Panel with KEY BINDINGS SHOWN */}
      <footer className="p-3 sm:p-4 bg-[#04070e] border-t border-white/10 backdrop-blur-xl z-20">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          
          {/* Raise Slider & Quick Bets */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-mono text-neutral-400 shrink-0">Raise:</span>
            <input
              type="range"
              min={toCall + 20}
              max={playerChips}
              step={10}
              value={Math.min(playerChips, Math.max(toCall + 20, raiseSlider))}
              onChange={(e) => setRaiseSlider(Number(e.target.value))}
              disabled={isAiThinking || stage === "showdown" || playerChips <= toCall}
              className="w-full sm:w-36 accent-amber-500"
            />
            <span className="font-mono font-bold text-amber-400 text-sm min-w-[50px]">
              ${Math.min(playerChips, Math.max(toCall + 20, raiseSlider))}
            </span>

            {/* Quick Presets with KEY SHORTCUTS */}
            <div className="flex items-center gap-1.5">
              {[
                { label: "1/2 Pot", key: "1", val: Math.max(toCall + 20, Math.floor(pot / 2)) },
                { label: "Pot", key: "2", val: Math.max(toCall + 20, pot) },
                { label: "All-In", key: "3", val: playerChips },
              ].map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => setRaiseSlider(Math.min(playerChips, btn.val))}
                  disabled={isAiThinking || stage === "showdown" || playerChips <= 0}
                  className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-300 hover:border-amber-500/50 hover:text-amber-300 transition-colors disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  <span>{btn.label}</span>
                  <kbd className="px-1 py-0.2 rounded bg-black/40 text-[8px] text-neutral-400 border border-white/10">
                    {btn.key}
                  </kbd>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons with CLEAR KEYS DISPLAYED */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            
            {/* FOLD [F] */}
            <button
              type="button"
              onClick={handlePlayerFold}
              disabled={isAiThinking || stage === "showdown" || playerChips <= 0}
              className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 font-mono font-bold text-xs hover:bg-red-500 hover:text-white transition-all disabled:opacity-40 cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              <span>FOLD</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] text-red-200 border border-red-500/30">
                F
              </kbd>
            </button>

            {/* CHECK [C] / CALL [C / Space] */}
            {toCall === 0 ? (
              <button
                type="button"
                onClick={handlePlayerCheck}
                disabled={isAiThinking || stage === "showdown" || playerChips <= 0}
                className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-neutral-800 border border-white/20 text-white font-mono font-bold text-xs hover:bg-white hover:text-black transition-all disabled:opacity-40 cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <span>CHECK</span>
                <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] text-neutral-300 border border-white/20">
                  C / Space
                </kbd>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePlayerCall}
                disabled={isAiThinking || stage === "showdown" || playerChips <= 0}
                className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-emerald-500 text-black font-mono font-black text-xs hover:bg-emerald-400 transition-all disabled:opacity-40 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2"
              >
                <span>CALL ${toCall}</span>
                <kbd className="px-1.5 py-0.5 rounded bg-black/30 text-[9px] text-black border border-black/20">
                  C
                </kbd>
              </button>
            )}

            {/* RAISE [R] / ALL-IN [A] */}
            <button
              type="button"
              onClick={() => handlePlayerRaise(raiseSlider)}
              disabled={isAiThinking || stage === "showdown" || playerChips <= toCall}
              className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-mono font-black text-xs hover:from-amber-400 hover:to-yellow-400 transition-all disabled:opacity-40 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2"
            >
              <span>{raiseSlider >= playerChips ? "ALL-IN 🔥" : `RAISE $${Math.min(playerChips, raiseSlider)}`}</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/30 text-[9px] text-black border border-black/20">
                {raiseSlider >= playerChips ? "A" : "R"}
              </kbd>
            </button>

            {/* NEXT HAND BUTTON (when showdown) */}
            {stage === "showdown" && (
              <button
                type="button"
                onClick={startNewHand}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-white text-black font-mono font-black text-xs hover:bg-amber-400 transition-all cursor-pointer animate-pulse flex items-center gap-2 shadow-lg"
              >
                <span>NEXT HAND</span>
                <kbd className="px-1.5 py-0.5 rounded bg-black text-[9px] text-white">
                  ↵ Enter
                </kbd>
              </button>
            )}

          </div>

        </div>
      </footer>

      {/* 404 INITIAL WELCOME POP-UP / ROUTE BANNER */}
      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[40000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setShowWelcomeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0b101d] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-6 shadow-[0_0_80px_rgba(245,158,11,0.3)] font-mono relative"
            >
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="absolute top-4 right-4 size-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="size-16 rounded-2xl bg-amber-500 text-black font-black flex items-center justify-center text-3xl mx-auto shadow-lg">
                ♠
              </div>

              <div className="space-y-2">
                <span className="text-red-400 text-xs font-bold tracking-widest uppercase">
                  ERROR 404 /// ROUTE NOT FOUND
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  This page is not available.
                </h2>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans mt-2">
                  The page you are looking for does not exist. But since you've arrived at <strong>Alfred's High-Stakes Lounge</strong>, pull up a chair and play Texas Hold'em against our AI dealer!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowWelcomeModal(false)}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black uppercase text-xs hover:bg-amber-400 transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                >
                  ♠ LET'S PLAY POKER [ESC]
                </button>
                <Link
                  to="/"
                  className="px-5 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white font-bold uppercase text-xs hover:bg-white hover:text-black transition-all flex items-center justify-center"
                >
                  ← Return to Portfolio
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🏆 CHAMPION VICTORY MODAL (TRIGGERED ONLY WHEN ALFRED HAS $0 CHIPS) */}
      <AnimatePresence>
        {tournamentResult === "player_champion" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[30000] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#091510] border-2 border-emerald-500/50 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-[0_0_80px_rgba(16,185,129,0.4)] font-mono"
            >
              <div className="size-20 rounded-3xl mx-auto flex items-center justify-center text-4xl bg-emerald-500/20 border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                👑
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40 uppercase tracking-widest">
                  TOURNAMENT VICTORY 🏆
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-2">
                  CHAMPION! ALFRED BUSTED
                </h2>
                <p className="text-xs text-emerald-200/80 leading-relaxed font-sans">
                  You cleaned Alfred out of all $1,000 chips! Flawless poker mastery and fearless conviction on the felt, sir.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleRebuy}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:bg-white transition-all cursor-pointer"
                >
                  START NEW TOURNAMENT ↵
                </button>
                <Link
                  to="/"
                  className="w-full py-3.5 rounded-2xl bg-white/10 text-white font-bold uppercase tracking-wider text-xs hover:bg-white hover:text-black transition-all"
                >
                  Return to Portfolio
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 💸 BUSTED MODAL (TRIGGERED ONLY WHEN PLAYER HAS $0 CHIPS) */}
      <AnimatePresence>
        {tournamentResult === "player_busted" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[30000] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#190d0e] border-2 border-red-500/50 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-[0_0_80px_rgba(239,68,68,0.3)] font-mono"
            >
              <div className="size-20 rounded-3xl mx-auto flex items-center justify-center text-4xl bg-red-500/10 border border-red-500/30">
                💸
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/40 uppercase tracking-widest">
                  STACK DEPLETED
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-2">
                  YOU ARE BUSTED!
                </h2>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  You ran out of chips after the final showdown. Re-buy $1,000 to get back in the action!
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleRebuy}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:bg-white transition-all cursor-pointer"
                >
                  RE-BUY $1,000 & PLAY AGAIN ↵
                </button>
                <Link
                  to="/"
                  className="w-full py-3.5 rounded-2xl bg-white/10 text-white font-bold uppercase tracking-wider text-xs hover:bg-white hover:text-black transition-all"
                >
                  Return to Portfolio
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POP-UP INSTRUCTIONS & KEYBINDINGS MODAL */}
      <AnimatePresence>
        {showRulesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[20000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setShowRulesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0b101d] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-[0_0_60px_rgba(245,158,11,0.25)] space-y-6 font-sans max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-2xl bg-amber-500 text-black font-black flex items-center justify-center text-xl">
                    ♠
                  </div>
                  <div>
                    <span className="text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
                      404 LOUNGE
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                      Poker Rules & Adaptive AI
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setShowRulesModal(false)}
                  className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center text-xs font-mono transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* 404 Mission Statement */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 font-mono text-xs">
                <h3 className="text-amber-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <span>♠</span> 404: Route Not Found
                </h3>
                <p className="text-neutral-300 leading-relaxed font-sans text-sm">
                  This page is not available. But since you've stumbled into the high-stakes lounge... <strong>let's play poker!</strong>
                </p>
              </div>

              {/* Keyboard Shortcuts Table */}
              <div className="space-y-3 font-mono text-xs">
                <h3 className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <span>⌨️</span> Keyboard Shortcuts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-300">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span>Check / Call</span>
                    <kbd className="px-2 py-0.5 rounded bg-black/60 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold">
                      C / Space
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span>Fold Hand</span>
                    <kbd className="px-2 py-0.5 rounded bg-black/60 text-red-400 border border-red-500/40 text-[11px] font-bold">
                      F
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span>Raise Bet</span>
                    <kbd className="px-2 py-0.5 rounded bg-black/60 text-amber-400 border border-amber-500/40 text-[11px] font-bold">
                      R
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span>Go All-In</span>
                    <kbd className="px-2 py-0.5 rounded bg-black/60 text-amber-400 border border-amber-500/40 text-[11px] font-bold">
                      A
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span>Quick Bets (1/2, Pot, All)</span>
                    <div className="flex gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-black/60 text-neutral-300 border border-white/20 text-[10px]">1</kbd>
                      <kbd className="px-1.5 py-0.5 rounded bg-black/60 text-neutral-300 border border-white/20 text-[10px]">2</kbd>
                      <kbd className="px-1.5 py-0.5 rounded bg-black/60 text-neutral-300 border border-white/20 text-[10px]">3</kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span>Deal Next Hand</span>
                    <kbd className="px-2 py-0.5 rounded bg-black/60 text-white border border-white/40 text-[11px] font-bold">
                      Enter ↵
                    </kbd>
                  </div>
                </div>
              </div>

              {/* Playful Disclaimer Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200 font-mono">
                <span className="text-lg">⚠️</span>
                <div>
                  <span className="font-bold text-amber-300 block uppercase tracking-wider text-[11px]">
                    CASINO ENTERTAINMENT NOTICE:
                  </span>
                  <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed font-sans">
                    This Texas Hold'em engine is built <strong>just for fun</strong> on this 404 page! Minor experimental quirks, edge cases, or wild AI bluffs might occasionally happen — take it easy, enjoy the game, and test your poker face!
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowRulesModal(false)}
                className="w-full py-3.5 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-wider font-mono text-xs hover:bg-amber-400 transition-all cursor-pointer shadow-lg"
              >
                GOT IT, LET'S PLAY ♠ [ESC]
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
