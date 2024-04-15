import shuffle from "lodash.shuffle";
import { s } from "vitest/dist/reporters-P7C2ytIv";

enum CardSuit {
  club = "♣",
  diamond = "♦",
  heart = "♥",
  spade = "♠",
}

export const Jack = 11;
export const Queen = 12;
export const King = 13;
export const LittleJoker = 14;
export const BigJoker = 15;

/**
 * 1-10
 * 11: Jack
 * 12: Queen
 * 13: King
 * 14: Little Joker
 * 15: Big Joker
 */
class Card {
  rank: number;
  suit?: CardSuit;

  constructor(rank, suit?) {
    this.rank = rank;
    this.suit = suit;
  }

  toString(): string {
    let rank;
    if(this.rank <= 10) {
      rank = this.rank;
    } else if(this.rank === 11) {
      rank = 'J';
    } else if(this.rank === 12) {
      rank = 'Q';
    } else if(this.rank === 13) {
      rank = 'K';
    } else if(this.rank === 14) {
      rank = 'LitJoker';
    } else if(this.rank === 15) {
      rank = 'BigJoker';
    }
    return `${this.suit || ''}${rank}`;
  }
}

interface Deck {
  cards: Card[];
}

export class MyDeck implements Deck {
  cards: Card[];

  constructor(cards: Card[]) {
    this.cards = cards;
  }

  shuffle() {
    this.cards = shuffle(this.cards);
    this.print();
    return this;
  }

  print() {
    console.log(
      this.cards.reduce((aggr, card) => {
        return aggr + ' ' + card.toString();
      }, "")
    );
  }
}

export const createDeck = (): MyDeck => {
  const cards: Card[] = [];
  for (const suit of [
    CardSuit.club,
    CardSuit.diamond,
    CardSuit.heart,
    CardSuit.spade,
  ]) {
    for (let rank = 1; rank < 14; rank++) {
      cards.push(new Card(rank, suit));
    }
  }
  cards.push(new Card(LittleJoker));
  cards.push(new Card(BigJoker));
  return new MyDeck(cards);
};
