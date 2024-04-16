import { BigJoker, Card, CardSuit, King, LittleJoker } from "./Cards";
import groupBy from "lodash.groupby";

const isSpecial = (card: Card, special: number) => {
  return card.rank === special && card.suit === CardSuit.heart;
};

const hasSpecial = (cards: Card[], special: number) => {
  return cards.some((c) => isSpecial(c, special));
};

const hasSpecialValid = (cards: Card[], special: number) => {
  return (
    hasSpecial(cards, special) &&
    isValid(
      cards.filter((c) => !isSpecial(c, special)),
      special
    )
  );
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
    if (cards[0].rank > King) {
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
      if (hasSpecial(cards, special)) {
        if (keys.length === 3) {
          return true;
        }
      }
      // flush
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
