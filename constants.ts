import { Suit, Rank, HandRank, Card } from './types';

export const translations = {
  en: {
    title: "Poker Decision Assistant",
    subtitle: "Enter your cards and the board to get the best move suggestion.",
    yourCards: "Your Cards",
    playerCard: "Card",
    tableCards: "Table Cards",
    selectCards: "Select Cards",
    bettingInfo: "Betting Information",
    potSize: "Pot Size",
    potSizePlaceholder: "e.g., 1000",
    stackSize: "Your Stack Size",
    stackSizePlaceholder: "e.g., 5000",
    amountToCall: "Current Bet to Face",
    amountToCallPlaceholder: "e.g., 200 (0 if none)",
    analyze: "Analyze",
    analyzing: "Analyzing...",
    reset: "Reset",
    selectTwoCardsError: "Please select 2 cards for yourself.",
    analysisError: "Error during analysis. Please try again.",
    simulatingMessage: "Simulating thousands of hands...",
    simulationWait: "This might take a few seconds.",
    analysisResult: "Analysis Result",
    ourSuggestion: "Our Suggestion:",
    suggestedAmount: "Suggested Amount:",
    winProbability: "Win Probability:",
    bestHand: "Your Best Possible Hand:",
    recommendationRaise: "Raise",
    recommendationCall: "Call",
    recommendationFold: "Fold",
    recommendationCheck: "Check",
    recommendationBet: "Bet",
    recommendationAllIn: "Go All-In!",
    creator: "Created by Armin Rafigh",
    contact: "armin.rafigh@gmail.com",
    languageSwitch: "فارسی",
    handNames: {
      [HandRank.ROYAL_FLUSH]: 'Royal Flush',
      [HandRank.STRAIGHT_FLUSH]: 'Straight Flush',
      [HandRank.FOUR_OF_A_KIND]: 'Four of a Kind',
      [HandRank.FULL_HOUSE]: 'Full House',
      [HandRank.FLUSH]: 'Flush',
      [HandRank.STRAIGHT]: 'Straight',
      [HandRank.THREE_OF_A_KIND]: 'Three of a Kind',
      [HandRank.TWO_PAIR]: 'Two Pair',
      [HandRank.ONE_PAIR]: 'One Pair',
      [HandRank.HIGH_CARD]: 'High Card',
    }
  },
  fa: {
    title: "دستیار تصمیم‌گیری پوکر",
    subtitle: "کارت‌های خود و میز را وارد کنید تا بهترین حرکت به شما پیشنهاد شود.",
    yourCards: "کارت‌های شما",
    playerCard: "کارت",
    tableCards: "کارت‌های میز",
    selectCards: "کارت‌ها را انتخاب کنید",
    bettingInfo: "اطلاعات شرط‌بندی",
    potSize: "اندازه پات",
    potSizePlaceholder: "مثال: ۱۰۰۰",
    stackSize: "موجودی ژتون شما",
    stackSizePlaceholder: "مثال: ۵۰۰۰",
    amountToCall: "مبلغ شرط حریف",
    amountToCallPlaceholder: "مثال: ۲۰۰ (اگر شرطی نیست ۰)",
    analyze: "تحلیل کن",
    analyzing: "در حال تحلیل...",
    reset: "شروع مجدد",
    selectTwoCardsError: "لطفاً ۲ کارت برای خودتان انتخاب کنید.",
    analysisError: "خطا در هنگام تحلیل. لطفاً دوباره تلاش کنید.",
    simulatingMessage: "در حال شبیه‌سازی هزاران دست...",
    simulationWait: "این فرآیند ممکن است چند ثانیه طول بکشد.",
    analysisResult: "نتیجه تحلیل",
    ourSuggestion: "پیشنهاد ما:",
    suggestedAmount: "مبلغ پیشنهادی:",
    winProbability: "احتمال برد:",
    bestHand: "بهترین دست ممکن شما:",
    recommendationRaise: "ریز کن (Raise)",
    recommendationCall: "کال کن (Call)",
    recommendationFold: "فولد کن (Fold)",
    recommendationCheck: "چک بده (Check)",
    recommendationBet: "بت کن (Bet)",
    recommendationAllIn: "آل این کن (All-In)!",
    creator: "ساخته شده توسط آرمین رفیق",
    contact: "armin.rafigh@gmail.com",
    languageSwitch: "English",
    handNames: {
      [HandRank.ROYAL_FLUSH]: 'رویال فلاش',
      [HandRank.STRAIGHT_FLUSH]: 'استریت فلاش',
      [HandRank.FOUR_OF_A_KIND]: 'کاره (چهار تایی)',
      [HandRank.FULL_HOUSE]: 'فول هاوس',
      [HandRank.FLUSH]: 'فلاش (رنگ)',
      [HandRank.STRAIGHT]: 'استریت (ردیف)',
      [HandRank.THREE_OF_A_KIND]: 'سه تایی',
      [HandRank.TWO_PAIR]: 'دو جفت',
      [HandRank.ONE_PAIR]: 'یک جفت',
      [HandRank.HIGH_CARD]: 'کارت بالا',
    }
  }
};

export type Language = keyof typeof translations;

export const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
export const RANKS: Rank[] = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

export const RANK_VALUES: { [key in Rank]: number } = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

export const FULL_DECK: Card[] = SUITS.flatMap(suit =>
    RANKS.map(rank => ({ suit, rank }))
);
