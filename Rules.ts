import { Card, CardSuit, LittleJoker } from "./Cards";

const isSpecial = (card: Card, special: number) => {
  return card.rank === special && card.suit === CardSuit.heart;
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
  if (
    cards.some((card) => card.rank === special && card.suit === CardSuit.heart)
  ) {
    return isValid(
      cards.filter((card) => !isSpecial(card, special)),
      special
    );
  }
  // pair
  if (cards.length === 2) {
    if (cards[0].rank === cards[1].rank) {
      return true;
    }
  }
  // threes
  if (cards.length === 3) {
    if (cards.some((card) => card.rank >= LittleJoker)) {
      return false;
    }
    return cards[0].rank === cards[1].rank && cards[1].rank === cards[2].rank;
  }
  // > 3
  if (cards.length > 3) {
    if (cards.length > 8) {
      return false;
    }
    const rank = cards[0].rank;
    if (cards.every((card) => card.rank === rank)) {
      // valid bomb
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
