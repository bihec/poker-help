import { Card, HandRank, HandResult, RecommendationResult } from '../types';
import { RANK_VALUES, FULL_DECK } from '../constants';

// Helper to get all k-combinations of an array
function getCombinations<T,>(arr: T[], k: number): T[][] {
  if (k > arr.length || k <= 0) {
    return [];
  }
  if (k === arr.length) {
    return [arr];
  }
  if (k === 1) {
    return arr.map(item => [item]);
  }
  const combinations: T[][] = [];
  for (let i = 0; i < arr.length - k + 1; i++) {
    const head = arr.slice(i, i + 1);
    const tailCombinations = getCombinations(arr.slice(i + 1), k - 1);
    for (const tail of tailCombinations) {
      combinations.push(head.concat(tail));
    }
  }
  return combinations;
}

function evaluateFiveCardHand(hand: Card[]): HandResult {
    const sortedHand = [...hand].sort((a, b) => RANK_VALUES[b.rank] - RANK_VALUES[a.rank]);
    const ranks = sortedHand.map(c => c.rank);
    const rankValues = sortedHand.map(c => RANK_VALUES[c.rank]);
    const suits = sortedHand.map(c => c.suit);

    const isFlush = new Set(suits).size === 1;
    const rankCounts = ranks.reduce((acc, rank) => {
        acc[rank] = (acc[rank] || 0) + 1;
        return acc;
    }, {} as { [key in string]: number });

    const counts = Object.values(rankCounts).sort((a, b) => b - a);
    const isFourOfAKind = counts[0] === 4;
    const isThreeOfAKind = counts[0] === 3;
    const isPair = counts[0] === 2;
    const isTwoPair = isPair && counts[1] === 2;
    const isFullHouse = isThreeOfAKind && isPair;
    
    const isStraight = rankValues.every((v, i) => i === 0 || v === rankValues[i-1] - 1);
    const isAceLowStraight = JSON.stringify(rankValues) === JSON.stringify([14, 5, 4, 3, 2]);
    const finalIsStraight = isStraight || isAceLowStraight;

    const mainRanks = Object.entries(rankCounts).sort(([,a],[,b]) => b - a).map(([rank]) => RANK_VALUES[rank as keyof typeof RANK_VALUES]);
    const kickers = rankValues.filter(v => !mainRanks.includes(v)).sort((a,b) => b-a);
    const orderedRanks = [...mainRanks, ...kickers];
    
    const value = (rank: HandRank) => (rank << 20) | (orderedRanks[0] << 16) | (orderedRanks[1] << 12) | (orderedRanks[2] << 8) | (orderedRanks[3] << 4) | (orderedRanks[4]);

    if (finalIsStraight && isFlush) {
        if (rankValues[0] === 14) return { rank: HandRank.ROYAL_FLUSH, value: value(HandRank.ROYAL_FLUSH) };
        return { rank: HandRank.STRAIGHT_FLUSH, value: value(HandRank.STRAIGHT_FLUSH) };
    }
    if (isFourOfAKind) return { rank: HandRank.FOUR_OF_A_KIND, value: value(HandRank.FOUR_OF_A_KIND) };
    if (isFullHouse) return { rank: HandRank.FULL_HOUSE, value: value(HandRank.FULL_HOUSE) };
    if (isFlush) return { rank: HandRank.FLUSH, value: value(HandRank.FLUSH) };
    if (finalIsStraight) return { rank: HandRank.STRAIGHT, value: value(HandRank.STRAIGHT) };
    if (isThreeOfAKind) return { rank: HandRank.THREE_OF_A_KIND, value: value(HandRank.THREE_OF_A_KIND) };
    if (isTwoPair) return { rank: HandRank.TWO_PAIR, value: value(HandRank.TWO_PAIR) };
    if (isPair) return { rank: HandRank.ONE_PAIR, value: value(HandRank.ONE_PAIR) };
    
    return { rank: HandRank.HIGH_CARD, value: value(HandRank.HIGH_CARD) };
}

export function evaluateHand(allCards: Card[]): HandResult {
    const combinations = getCombinations(allCards, 5);
    let bestHand: HandResult | null = null;

    for (const combo of combinations) {
        const currentHand = evaluateFiveCardHand(combo);
        if (!bestHand || currentHand.value > bestHand.value) {
            bestHand = currentHand;
        }
    }
    return bestHand!;
}

export async function calculateWinProbability(
  playerCards: Card[],
  tableCards: Card[],
  numSimulations: number = 2000
): Promise<number> {
    let wins = 0;
    const knownCards = [...playerCards, ...tableCards];
    const deck = FULL_DECK.filter(deckCard => 
        !knownCards.some(knownCard => knownCard.rank === deckCard.rank && knownCard.suit === deckCard.suit)
    );

    if (deck.length < (2 + 5 - tableCards.length)) {
        console.error("Not enough cards in the deck for a simulation.");
        return 50;
    }

    for (let i = 0; i < numSimulations; i++) {
        const shuffledDeck = [...deck].sort(() => Math.random() - 0.5);
        
        const opponentCards = shuffledDeck.slice(0, 2);
        const numRemainingTableCards = 5 - tableCards.length;
        const remainingTableCards = shuffledDeck.slice(2, 2 + numRemainingTableCards);

        const finalTable = [...tableCards, ...remainingTableCards];
        const playerFullHand = [...playerCards, ...finalTable];
        const opponentFullHand = [...opponentCards, ...finalTable];
        
        const playerBestHand = evaluateHand(playerFullHand);
        const opponentBestHand = evaluateHand(opponentFullHand);

        if (playerBestHand.value > opponentBestHand.value) {
            wins++;
        } else if (playerBestHand.value === opponentBestHand.value) {
            wins += 0.5; // Split pot
        }
    }

    return (wins / numSimulations) * 100;
}

export function getRecommendation(winProbability: number, potSize: number, amountToCall: number, stackSize: number): RecommendationResult {
  const effectiveStack = stackSize > 0 ? stackSize : 0;

  // Case 1: No bet to face. We can check or bet.
  if (amountToCall === 0) {
    if (winProbability > 60) {
      // Suggest a bet between 50% and 100% of the pot for value.
      const amountMin = Math.floor(potSize * 0.5);
      const amountMax = Math.floor(potSize * 1.0);
      
      if (amountMax > 0 && effectiveStack > 0) {
        return { 
          key: 'Bet', 
          amountMin: Math.min(effectiveStack, amountMin), 
          amountMax: Math.min(effectiveStack, amountMax) 
        };
      }
    }
    return { key: 'Check' };
  }

  // Case 2: Facing a bet. We need to calculate pot odds.
  const currentPot = potSize + amountToCall;
  const totalPotIfWeCall = currentPot + amountToCall;
  const requiredEquity = (amountToCall / totalPotIfWeCall) * 100;

  // If the bet is more than our stack, it's an all-in decision.
  if (amountToCall >= effectiveStack) {
     if (winProbability > requiredEquity) {
       return { key: 'AllIn' };
     } else {
       return { key: 'Fold' };
     }
  }

  // If we have a very strong hand (e.g., >70% equity), we should consider raising for value.
  if (winProbability > 70) {
    // A standard raise is 2.5x to 3.5x the opponent's bet.
    const raiseMin = Math.floor(amountToCall * 2.5);
    const raiseMax = Math.floor(amountToCall * 3.5);
    
    // The raise must be at least the size of the previous bet, on top of the call amount.
    // Our raise amount should be compared to the effective stack.
    const totalRaiseAmountMin = raiseMin;
    const totalRaiseAmountMax = raiseMax;
    
    if (totalRaiseAmountMin > effectiveStack) {
      // If even the minimum raise is more than our stack, we go all-in.
      return { key: 'AllIn' };
    }

    return { 
      key: 'Raise', 
      amountMin: Math.min(effectiveStack, totalRaiseAmountMin), 
      amountMax: Math.min(effectiveStack, totalRaiseAmountMax) 
    };
  }

  // If our equity is better than the pot odds, a call is profitable.
  if (winProbability > requiredEquity) {
    return { key: 'Call' };
  }

  // If none of the above, our hand is not strong enough to continue.
  return { key: 'Fold' };
}
