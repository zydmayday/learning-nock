import { createDeck } from "./Cards";

describe("test Cards", () => {
    const deck = createDeck();
  it("test create Deck", () => {
    expect(deck.cards).toHaveLength(54);
  });

  it("test shuffle deck", () => {
    const shuffledDeck = deck.shuffle();
    expect(shuffledDeck.cards).toHaveLength(54);
  });
});
