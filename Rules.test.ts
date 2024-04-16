import {
  BigJoker,
  Card,
  CardSuit,
  Jack,
  King,
  LittleJoker,
  Queen,
} from "./Cards";
import { isValid, isValidPlay } from "./Rules";
import random from "lodash.random";

const createSameCards = (num: number, _rank?: number) => {
  const rank = _rank || random(1, King);
  const cards = [];
  for (let i = 0; i < num; i++) {
    cards.push(new Card(rank, CardSuit.club));
  }
  return cards;
};

describe("test Rules", () => {
  const speical = 2;
  describe("test isValidPlay", () => {
    describe("test no prev", () => {
      it("test cards is empty", () => {
        expect(isValidPlay([], speical)).toBeFalsy();
      });
      it("test cards is not empty but valid", () => {
        expect(
          isValidPlay([new Card(random(1, BigJoker), CardSuit.club)], speical)
        ).toBeTruthy();
      });
    });
  });

  describe("test isValid", () => {
    it("test single card", () => {
      expect(
        isValid([new Card(random(1, BigJoker), CardSuit.diamond)], speical)
      ).toBeTruthy();
    });

    describe("test pair", () => {
      it.each`
        rank1          | suit1            | rank2          | suit2               | expected
        ${1}           | ${CardSuit.club} | ${1}           | ${CardSuit.club}    | ${true}
        ${1}           | ${CardSuit.club} | ${1}           | ${CardSuit.diamond} | ${true}
        ${1}           | ${CardSuit.club} | ${2}           | ${CardSuit.club}    | ${false}
        ${1}           | ${CardSuit.club} | ${2}           | ${CardSuit.diamond} | ${false}
        ${1}           | ${CardSuit.club} | ${2}           | ${CardSuit.spade}   | ${false}
        ${1}           | ${CardSuit.club} | ${speical}     | ${CardSuit.heart}   | ${true}
        ${LittleJoker} | ${CardSuit.club} | ${BigJoker}    | ${CardSuit.diamond} | ${false}
        ${LittleJoker} | ${CardSuit.club} | ${LittleJoker} | ${CardSuit.diamond} | ${true}
      `(
        "$rank1, $suit1, $rank2, $suit2 -> $expected",
        ({ rank1, suit1, rank2, suit2, expected }) => {
          expect(
            isValid([new Card(rank1, suit1), new Card(rank2, suit2)], speical)
          ).toEqual(expected);
        }
      );
    });

    describe("test threes", () => {
      it.each`
        rank1          | suit1            | rank2          | suit2               | rank3          | suit3               | expected
        ${1}           | ${CardSuit.club} | ${1}           | ${CardSuit.club}    | ${1}           | ${CardSuit.spade}   | ${true}
        ${1}           | ${CardSuit.club} | ${2}           | ${CardSuit.club}    | ${2}           | ${CardSuit.club}    | ${false}
        ${1}           | ${CardSuit.club} | ${2}           | ${CardSuit.diamond} | ${3}           | ${CardSuit.diamond} | ${false}
        ${LittleJoker} | ${CardSuit.club} | ${BigJoker}    | ${CardSuit.diamond} | ${BigJoker}    | ${CardSuit.diamond} | ${false}
        ${LittleJoker} | ${CardSuit.club} | ${LittleJoker} | ${CardSuit.diamond} | ${LittleJoker} | ${CardSuit.diamond} | ${false}
        ${1}           | ${CardSuit.club} | ${1}           | ${CardSuit.diamond} | ${speical}     | ${CardSuit.heart}   | ${true}
        ${1}           | ${CardSuit.club} | ${speical}     | ${CardSuit.heart}   | ${speical}     | ${CardSuit.heart}   | ${true}
      `(
        "$rank1, $suit1, $rank2, $suit2, $rank3, $suit3 -> $expected",
        ({ rank1, suit1, rank2, suit2, rank3, suit3, expected }) => {
          expect(
            isValid(
              [
                new Card(rank1, suit1),
                new Card(rank2, suit2),
                new Card(rank3, suit3),
              ],
              speical
            )
          ).toEqual(expected);
        }
      );
    });

    describe("test bomb", () => {
      describe("test valid bomb", () => {
        it("4 - 8 cards bomb", () => {
          for (let num = 4; num <= 8; num++) {
            const rank = random(1, King);
            const cards = [];
            for (let i = 0; i < num; i++) {
              cards.push(new Card(rank, CardSuit.club));
            }
            expect(isValid(cards, speical)).toBeTruthy();
          }
        });
        it("3 - 8 cards bomb, with special", () => {
          for (let num = 3; num <= 8; num++) {
            const bomb = createSameCards(num);
            bomb.push(new Card(speical, CardSuit.heart));
            expect(isValid(bomb, speical)).toBeTruthy();
          }
        });
        it("2 - 8 cards bomb, with 2 specials", () => {
          for (let num = 3; num <= 8; num++) {
            const bomb = createSameCards(num);
            bomb.push(new Card(speical, CardSuit.heart));
            bomb.push(new Card(speical, CardSuit.heart));
            expect(isValid(bomb, speical)).toBeTruthy();
          }
        });
        it("test joker bomb", () => {
          expect(
            isValid(
              [
                new Card(LittleJoker),
                new Card(LittleJoker),
                new Card(BigJoker),
                new Card(BigJoker),
              ],
              speical
            )
          ).toBeTruthy();
        });
      });
      describe("invalid bomn", () => {
        it("> 8 cards bomb", () => {
          const bomb = createSameCards(9);
          expect(isValid(bomb, speical)).toBeFalsy();
        });
        it("> 8 cards bomb, with specials", () => {
          const bomb = createSameCards(9);
          bomb.push(new Card(speical, CardSuit.heart));
          bomb.push(new Card(speical, CardSuit.heart));
          expect(isValid(bomb, speical)).toBeFalsy();
        });
        it("> 4 but with joker", () => {
          const bomb = createSameCards(4);
          bomb.push(new Card(LittleJoker));
          expect(isValid(bomb, speical)).toBeFalsy();
        });
      });
    });

    describe("test 4 cards invalid case", () => {
      it("test 3 + 1", () => {
        const cards = createSameCards(3, King);
        cards.push(new Card(Queen, CardSuit.club));
        expect(cards).toHaveLength(4);
        expect(isValid(cards, speical)).toBeFalsy();
      });
      it("test 2 + 2", () => {
        const cards = createSameCards(2, King);
        cards.push(...createSameCards(2, Queen));
        expect(cards).toHaveLength(4);
        expect(isValid(cards, speical)).toBeFalsy();
      });
      it("test 2 + 1 + 1", () => {
        const cards = createSameCards(2, King);
        cards.push(new Card(Jack, CardSuit.club));
        cards.push(new Card(Queen, CardSuit.club));
        expect(cards).toHaveLength(4);
        expect(isValid(cards, speical)).toBeFalsy();
      });
      it("test 1 + 1 + 1 + 1", () => {
        const cards = [];
        cards.push(new Card(10, CardSuit.club));
        cards.push(new Card(Jack, CardSuit.club));
        cards.push(new Card(Queen, CardSuit.club));
        cards.push(new Card(King, CardSuit.club));
        expect(cards).toHaveLength(4);
        expect(isValid(cards, speical)).toBeFalsy();
      });
      it("test 2 + 1 + special", () => {
        const cards = createSameCards(2, King);
        cards.push(new Card(Queen, CardSuit.club));
        cards.push(new Card(speical, CardSuit.heart));
        expect(cards).toHaveLength(4);
        expect(isValid(cards, speical)).toBeFalsy();
      });
      it("test 3 + joker", () => {
        const cards = createSameCards(3, King);
        cards.push(new Card(LittleJoker));
        expect(cards).toHaveLength(4);
        expect(isValid(cards, speical)).toBeFalsy();
      });
    });

    describe("test 3 + 2", () => {
      describe("test valid case", () => {
        it("test 3 + 2", () => {
          const cards = createSameCards(3, King);
          const twos = createSameCards(2, Queen);
          cards.push(...twos);
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeTruthy();
        });
        it("test 3 + 2 big joker", () => {
          const cards = createSameCards(3, King);
          const twos = createSameCards(2, BigJoker);
          cards.push(...twos);
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeTruthy();
        });
        it("test 3 + 1 + speicial", () => {
          const cards = createSameCards(3, King);
          cards.push(new Card(Queen, CardSuit.club));
          cards.push(new Card(speical, CardSuit.heart));
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeTruthy();
        });
        it("test 2 + 2 + speicial", () => {
          const cards = createSameCards(2, King);
          const queens = createSameCards(2, Queen);
          cards.push(new Card(speical, CardSuit.heart));
          cards.push(...queens);
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeTruthy();
        });
        it("test 2 + 1 + 2 specials", () => {
          const cards = createSameCards(2, King);
          cards.push(new Card(Queen, CardSuit.club));
          cards.push(new Card(speical, CardSuit.heart));
          cards.push(new Card(speical, CardSuit.heart));
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeTruthy();
        });
      });
      describe("test invalid case", () => {
        it("test 3 + 1 + 1", () => {
          const cards = createSameCards(3, King);
          cards.push(new Card(Queen, CardSuit.club));
          cards.push(new Card(Jack, CardSuit.club));
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeFalsy();
        });
        it("test 2 + 1 + 1 + 1", () => {
          const cards = createSameCards(2, King);
          cards.push(new Card(Queen, CardSuit.club));
          cards.push(new Card(Jack, CardSuit.club));
          cards.push(new Card(10, CardSuit.club));
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeFalsy();
        });
        it("test 2 + 1 + 1 + special", () => {
          const cards = createSameCards(2, King);
          cards.push(new Card(Queen, CardSuit.club));
          cards.push(new Card(Jack, CardSuit.club));
          cards.push(new Card(speical, CardSuit.heart));
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeFalsy();
        });
        it("test 1 + 1 + 1 + 2 specials", () => {
          const cards = [new Card(King, CardSuit.club)];
          cards.push(new Card(Queen, CardSuit.club));
          cards.push(new Card(Jack, CardSuit.club));
          cards.push(new Card(speical, CardSuit.heart));
          cards.push(new Card(speical, CardSuit.heart));
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeFalsy();
        });
        it("test 1 + 1 + 1 + 1 + 1", () => {
          const cards = [new Card(King, CardSuit.club)];
          cards.push(new Card(Queen, CardSuit.club));
          cards.push(new Card(Jack, CardSuit.club));
          cards.push(new Card(10, CardSuit.club));
          cards.push(new Card(8, CardSuit.club));
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeFalsy();
        });
      });
    });
  });
});
