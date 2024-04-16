import { Card } from "./Cards";

/**
 * check if cards are valid to play.
 *
 * @param cards cards to play
 * @returns true if cards are valid to play
 */
export const isValid = (cards: Card[]) => {
  if (cards.length === 0) {
    return false;
  }
  return true;
};

/**
 * return true if cards are invalid to play.
 *
 * @param cards cards to play
 * @param prev previous played cards, undefined if no play before.
 */
export const isValidPlay = (cards: Card[], prev?: Card[]) => {
  if (!prev) {
    return isValid(cards);
  }
  return false;
};
