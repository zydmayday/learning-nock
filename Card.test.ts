import { BigJoker, CardSuit, LittleJoker, createDeck } from "./Cards";

describe("test Cards", () => {
  const deck = createDeck();
  it("test create Deck", () => {
    expect(deck.cards).toHaveLength(108);
    for (let i = 1; i <= 13; i++) {
      expect(deck.cards.filter((card) => card.rank === i)).toHaveLength(8);
    }
    expect(deck.cards.filter((card) => card.rank === LittleJoker)).toHaveLength(
      2
    );
    expect(deck.cards.filter((card) => card.rank === BigJoker)).toHaveLength(2);
    expect(
      deck.cards.filter((card) => card.suit === CardSuit.club)
    ).toHaveLength(26);
    expect(
      deck.cards.filter((card) => card.suit === CardSuit.diamond)
    ).toHaveLength(26);
    expect(
      deck.cards.filter((card) => card.suit === CardSuit.heart)
    ).toHaveLength(26);
    expect(
      deck.cards.filter((card) => card.suit === CardSuit.spade)
    ).toHaveLength(26);
  });

  it("test shuffle deck", () => {
    const shuffledDeck = deck.shuffle();
    expect(shuffledDeck.cards).toHaveLength(108);
  });
});
