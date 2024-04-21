import { BigJoker, Card, CardSuit, K, LittleJoker } from "./Cards";
import groupBy from "lodash.groupby";

const isSpecial = (card: Card, special: number) => {
  return card.rank === special && card.suit === CardSuit.heart;
};

const hasJoker = (cards: Card[]) => {
  return cards.some((c) => c.rank >= LittleJoker);
};

/**
 * check if cards has special one.
 *
 * @param cards cards to play
 * @param special special rank
 * @returns true if has special
 */
const hasSpecial = (cards: Card[], special: number) => {
  return cards.some((c) => isSpecial(c, special));
};

/**
 * check if special AND cards is valid.
 *
 * @param cards cards to play
 * @param special special rank
 * @returns true if cards has special and valid
 */
const hasSpecialValid = (cards: Card[], special: number) => {
  return (
    hasSpecial(cards, special) &&
    isValid(
      cards.filter((c) => !isSpecial(c, special)),
      special
    )
  );
};

const sortedWithoutSpecial = (cards: Card[], special: number) => {
  return cards
    .filter((c) => !isSpecial(c, special))
    .toSorted((c1, c2) => c1.rank - c2.rank);
};

/**
 * Check if is valid straight.
 * e.g valid examples:
 * 1,2,3,4,5
 * 10,J,Q,K,A
 *
 * @param cards cards to play
 * @param special special rank
 * @returns true if cards is valid
 */
const isStraight = (cards: Card[], special: number) => {
  if (cards.length !== 5) {
    return false;
  }
  if (hasJoker(cards)) {
    return false;
  }
  const sorted = sortedWithoutSpecial(cards, special);
  let specialSKip = 5 - sorted.length;

  if (new Set(sorted).size !== sorted.length) {
    return false;
  }

  const isStraightInner = (sorted: Card[], specialSKip: number) => {
    let head = sorted.shift().rank;
    for (let i = 0; i < sorted.length; ) {
      if (sorted[i].rank === head + 1) {
        i += 1;
        head += 1;
      } else if (specialSKip !== 0) {
        specialSKip -= 1;
        head += 1;
      } else {
        return false;
      }
    }
    return true;
  };

  let result = isStraightInner([...sorted], specialSKip);
  if (sorted[0].rank === 1) {
    sorted.shift();
    sorted.push(new Card(14, CardSuit.club));
    result = result || isStraightInner([...sorted], specialSKip);
  }
  return result;
};

/**
 * check if is valid three pairs.
 * e.g. valid examples,
 * 1,1,2,2,3,3
 * Q,Q,K,K,A,A
 *
 * @param cards cards to play
 * @param special special rank
 * @returns true if cards is valid three pairs
 */
const isValidThreePairs = (cards: Card[], special: number) => {
  if (cards.length !== 6) {
    return false;
  }
  if (hasJoker(cards)) {
    return false;
  }
  const sorted = sortedWithoutSpecial(cards, special);
  const groupedRank = groupBy(sorted.map((c) => c.rank));
  const keys = Object.keys(groupedRank);
  if (keys.length > 3 || keys.length < 2) {
    return false;
  }

  const isValidThreePairsInner = (sorted: Card[]) => {
    const count: Record<number, number> = {};
    for (let i = 0; i < sorted.length; i++) {
      count[sorted[i].rank] = (count[sorted[i].rank] || 0) + 1;
      if (count[sorted[i].rank] > 2) {
        return false;
      }
    }
    const keys = Object.keys(count).map(Number);
    const diff = keys.reduce(
      (s, c, i, a) => (i < a.length - 1 ? s + a[i + 1] - c : s),
      0
    );
    return diff <= 2;
  };

  let result = isValidThreePairsInner([...sorted]);
  result ||= isValidThreePairsInner(
    sorted
      .map((c) => (c.rank === 1 ? new Card(14, CardSuit.club) : c))
      .toSorted((c1, c2) => c1.rank - c2.rank)
  );

  return result;
};

/**
 * check if cards are valid to play.
 *
 * @param cards cards to play
 * @param special special card in current round
 * @returns true if cards are valid to play
 */
export const isValid = (cards: Card[], special: number) => {
  if (cards.length === 0) {
    return false;
  }
  if (cards.length === 1) {
    return true;
  }
  // pair
  if (cards.length === 2) {
    if (hasSpecialValid(cards, special)) {
      return true;
    }
    if (cards[0].rank === cards[1].rank) {
      return true;
    }
  }
  // threes
  if (cards.length === 3) {
    if (cards.some((card) => card.rank >= LittleJoker)) {
      return false;
    }
    if (hasSpecialValid(cards, special)) {
      return true;
    }
    return cards[0].rank === cards[1].rank && cards[1].rank === cards[2].rank;
  }
  // > 3
  if (cards.length > 3) {
    // bomb case
    if (hasSpecialValid(cards, special)) {
      return true;
    }
    if (cards.length > 8) {
      return false;
    }
    // joker case
    if (cards[0].rank > K) {
      return (
        cards.filter((card) => card.rank === LittleJoker).length === 2 &&
        cards.filter((card) => card.rank === BigJoker).length === 2
      );
    }
    const rank = cards[0].rank;
    if (cards.every((card) => card.rank === rank)) {
      // valid normal bomb
      return true;
    }
    if (cards.length === 5) {
      // 3 + 2
      const ranks = cards.map((c) => c.rank);
      const grouped = groupBy(ranks);
      const keys = Object.keys(grouped);
      if (keys.length === 2) {
        if (grouped[keys[0]].length === 2 || grouped[keys[1]].length === 2) {
          return true;
        }
      }
      if (
        hasSpecial(cards, special) &&
        cards
          .filter((c) => c.rank === special)
          .every((c) => c.suit === CardSuit.heart)
      ) {
        if (keys.length === 3) {
          return true;
        }
      }
      // straight
      if (isStraight([...cards], special)) {
        return true;
      }
    }
    // three pairs
    if (isValidThreePairs(cards, special)) {
      return true;
    }
  }
  return false;
};

/**
 * return true if cards are invalid to play.
 *
 * @param cards cards to play
 * @param special special card in current round
 * @param prev previous played cards, undefined if no play before.
 */
export const isValidPlay = (cards: Card[], special: number, prev?: Card[]) => {
  if (!prev) {
    return isValid(cards, special);
  }
  return false;
};
