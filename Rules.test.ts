import { BigJoker, Card, CardSuit, King, LittleJoker } from "./Cards";
import { isValid, isValidPlay } from "./Rules";
import random from "lodash.random";

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
            const rank = random(1, King);
            const cards = [];
            for (let i = 0; i < num; i++) {
              cards.push(new Card(rank, CardSuit.club));
            }
            cards.push(new Card(speical, CardSuit.heart));
            expect(isValid(cards, speical)).toBeTruthy();
          }
        });
        it("2 - 8 cards bomb, with 2 specials", () => {
          for (let num = 3; num <= 8; num++) {
            const rank = random(1, King);
            const cards = [];
            for (let i = 0; i < num; i++) {
              cards.push(new Card(rank, CardSuit.club));
            }
            cards.push(new Card(speical, CardSuit.heart));
            cards.push(new Card(speical, CardSuit.heart));
            expect(isValid(cards, speical)).toBeTruthy();
          }
        });
        it("> 8 cards bomb", () => {
          const rank = random(1, King);
          const cards = [];
          for (let i = 0; i < 9; i++) {
            cards.push(new Card(rank, CardSuit.club));
          }
          expect(isValid(cards, speical)).toBeFalsy();
        });
        it("> 8 cards bomb, with specials", () => {
          const rank = random(1, King);
          const cards = [];
          for (let i = 0; i < 9; i++) {
            cards.push(new Card(rank, CardSuit.club));
          }
          cards.push(new Card(speical, CardSuit.heart));
          cards.push(new Card(speical, CardSuit.heart));
          expect(isValid(cards, speical)).toBeFalsy();
        });
      });
    });
  });
});
