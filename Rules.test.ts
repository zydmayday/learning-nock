import { BigJoker, Card, CardSuit, J, K, LittleJoker, Q } from "./Cards";
import { isValid, isValidPlay } from "./Rules";
import random from "lodash.random";

const createSameCards = (num: number, _rank?: number) => {
  const rank = _rank || random(1, K);
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
            const rank = random(1, K);
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
        const cards = createSameCards(3, K);
        cards.push(new Card(Q, CardSuit.club));
        expect(cards).toHaveLength(4);
        expect(isValid(cards, speical)).toBeFalsy();
      });
      it("test 2 + 2", () => {
        const cards = createSameCards(2, K);
        cards.push(...createSameCards(2, Q));
        expect(cards).toHaveLength(4);
        expect(isValid(cards, speical)).toBeFalsy();
      });
      it("test 2 + 1 + 1", () => {
        const cards = createSameCards(2, K);
        cards.push(new Card(J, CardSuit.club));
        cards.push(new Card(Q, CardSuit.club));
        expect(cards).toHaveLength(4);
        expect(isValid(cards, speical)).toBeFalsy();
      });
      it("test 1 + 1 + 1 + 1", () => {
        const cards = [];
        cards.push(new Card(10, CardSuit.club));
        cards.push(new Card(J, CardSuit.club));
        cards.push(new Card(Q, CardSuit.club));
        cards.push(new Card(K, CardSuit.club));
        expect(cards).toHaveLength(4);
        expect(isValid(cards, speical)).toBeFalsy();
      });
      it("test 2 + 1 + special", () => {
        const cards = createSameCards(2, K);
        cards.push(new Card(Q, CardSuit.club));
        cards.push(new Card(speical, CardSuit.heart));
        expect(cards).toHaveLength(4);
        expect(isValid(cards, speical)).toBeFalsy();
      });
      it("test 3 + joker", () => {
        const cards = createSameCards(3, K);
        cards.push(new Card(LittleJoker));
        expect(cards).toHaveLength(4);
        expect(isValid(cards, speical)).toBeFalsy();
      });
    });

    describe("test 3 + 2", () => {
      describe("test valid case", () => {
        it("test 3 + 2", () => {
          const cards = createSameCards(3, K);
          const twos = createSameCards(2, Q);
          cards.push(...twos);
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeTruthy();
        });
        it("test 3 + 2 big joker", () => {
          const cards = createSameCards(3, K);
          const twos = createSameCards(2, BigJoker);
          cards.push(...twos);
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeTruthy();
        });
        it("test 3 + 1 + speicial", () => {
          const cards = createSameCards(3, K);
          cards.push(new Card(Q, CardSuit.club));
          cards.push(new Card(speical, CardSuit.heart));
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeTruthy();
        });
        it("test 2 + 2 + speicial", () => {
          const cards = createSameCards(2, K);
          const queens = createSameCards(2, Q);
          cards.push(new Card(speical, CardSuit.heart));
          cards.push(...queens);
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeTruthy();
        });
        it("test 2 + 1 + 2 specials", () => {
          const cards = createSameCards(2, K);
          cards.push(new Card(Q, CardSuit.club));
          cards.push(new Card(speical, CardSuit.heart));
          cards.push(new Card(speical, CardSuit.heart));
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeTruthy();
        });
      });
      describe("test invalid case", () => {
        it("test 3 + 1 + 1", () => {
          const cards = createSameCards(3, K);
          cards.push(new Card(Q, CardSuit.club));
          cards.push(new Card(J, CardSuit.club));
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeFalsy();
        });
        it("test 2 + 1 + 1 + 1", () => {
          const cards = createSameCards(2, K);
          cards.push(new Card(Q, CardSuit.club));
          cards.push(new Card(J, CardSuit.club));
          cards.push(new Card(10, CardSuit.club));
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeFalsy();
        });
        it("test 2 + 1 + 1 + special", () => {
          const cards = createSameCards(2, K);
          cards.push(new Card(Q, CardSuit.club));
          cards.push(new Card(J, CardSuit.club));
          cards.push(new Card(speical, CardSuit.heart));
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeFalsy();
        });
        it("test 1 + 1 + 1 + 2 specials", () => {
          const cards = [new Card(K, CardSuit.club)];
          cards.push(new Card(Q, CardSuit.club));
          cards.push(new Card(8, CardSuit.club));
          cards.push(new Card(speical, CardSuit.heart));
          cards.push(new Card(speical, CardSuit.heart));
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeFalsy();
        });
        it("test 1 + 1 + 1 + 1 + 1", () => {
          const cards = [new Card(K, CardSuit.club)];
          cards.push(new Card(Q, CardSuit.club));
          cards.push(new Card(J, CardSuit.club));
          cards.push(new Card(10, CardSuit.club));
          cards.push(new Card(8, CardSuit.club));
          expect(cards).toHaveLength(5);
          expect(isValid(cards, speical)).toBeFalsy();
        });
      });
    });

    describe("test straight", () => {
      describe("test valid case", () => {
        it.each`
          r1    | r2    | r3    | r4    | r5
          ${1}  | ${2}  | ${3}  | ${4}  | ${5}
          ${2}  | ${3}  | ${4}  | ${5}  | ${6}
          ${3}  | ${4}  | ${5}  | ${6}  | ${7}
          ${4}  | ${5}  | ${6}  | ${7}  | ${8}
          ${5}  | ${6}  | ${7}  | ${8}  | ${9}
          ${6}  | ${7}  | ${8}  | ${9}  | ${10}
          ${7}  | ${8}  | ${9}  | ${10} | ${J}
          ${8}  | ${9}  | ${10} | ${J}  | ${Q}
          ${9}  | ${10} | ${J}  | ${Q}  | ${K}
          ${10} | ${J}  | ${Q}  | ${K}  | ${1}
        `(
          "test valid case without special: $r1, $r2, $r3, $r4, $r5",
          ({ r1, r2, r3, r4, r5 }) => {
            const cards = [
              new Card(r1, CardSuit.club),
              new Card(r2, CardSuit.club),
              new Card(r3, CardSuit.club),
              new Card(r4, CardSuit.club),
              new Card(r5, CardSuit.club),
            ];
            expect(isValid(cards, speical)).toBeTruthy();
          }
        );

        it.each`
          r1         | r2    | r3   | r4   | r5
          ${speical} | ${2}  | ${3} | ${4} | ${5}
          ${speical} | ${1}  | ${3} | ${4} | ${5}
          ${speical} | ${1}  | ${2} | ${4} | ${5}
          ${speical} | ${1}  | ${2} | ${3} | ${5}
          ${speical} | ${1}  | ${2} | ${3} | ${4}
          ${speical} | ${10} | ${J} | ${Q} | ${K}
          ${speical} | ${10} | ${Q} | ${K} | ${1}
          ${speical} | ${10} | ${J} | ${K} | ${1}
          ${speical} | ${10} | ${J} | ${Q} | ${1}
          ${speical} | ${J}  | ${Q} | ${K} | ${1}
        `(
          "test valid case with 1 speicial: $r1♥, $r2, $r3, $r4, $r5",
          ({ r1, r2, r3, r4, r5 }) => {
            const cards = [
              new Card(r1, CardSuit.heart),
              new Card(r2, CardSuit.club),
              new Card(r3, CardSuit.club),
              new Card(r4, CardSuit.club),
              new Card(r5, CardSuit.club),
            ];
            expect(isValid(cards, speical)).toBeTruthy();
          }
        );

        it.each`
          r1         | r2         | r3    | r4   | r5
          ${speical} | ${speical} | ${1}  | ${2} | ${3}
          ${speical} | ${speical} | ${1}  | ${2} | ${4}
          ${speical} | ${speical} | ${1}  | ${2} | ${5}
          ${speical} | ${speical} | ${1}  | ${3} | ${4}
          ${speical} | ${speical} | ${1}  | ${3} | ${5}
          ${speical} | ${speical} | ${1}  | ${4} | ${5}
          ${speical} | ${speical} | ${2}  | ${3} | ${4}
          ${speical} | ${speical} | ${2}  | ${3} | ${5}
          ${speical} | ${speical} | ${2}  | ${4} | ${5}
          ${speical} | ${speical} | ${3}  | ${4} | ${5}
          ${speical} | ${speical} | ${10} | ${J} | ${Q}
          ${speical} | ${speical} | ${10} | ${J} | ${K}
          ${speical} | ${speical} | ${10} | ${J} | ${1}
          ${speical} | ${speical} | ${10} | ${Q} | ${K}
          ${speical} | ${speical} | ${10} | ${Q} | ${1}
          ${speical} | ${speical} | ${10} | ${K} | ${1}
          ${speical} | ${speical} | ${J}  | ${Q} | ${K}
          ${speical} | ${speical} | ${J}  | ${Q} | ${1}
          ${speical} | ${speical} | ${J}  | ${K} | ${1}
          ${speical} | ${speical} | ${Q}  | ${K} | ${1}
        `(
          "test valid case with 2 speicials: $r1♥, $r2♥, $r3, $r4, $r5",
          ({ r1, r2, r3, r4, r5 }) => {
            const cards = [
              new Card(r1, CardSuit.heart),
              new Card(r2, CardSuit.heart),
              new Card(r3, CardSuit.club),
              new Card(r4, CardSuit.club),
              new Card(r5, CardSuit.club),
            ];
            expect(isValid(cards, speical)).toBeTruthy();
          }
        );
      });
      describe("test invalid case", () => {
        it.each`
          r1    | r2   | r3   | r4             | r5
          ${1}  | ${2} | ${3} | ${4}           | ${6}
          ${1}  | ${3} | ${4} | ${5}           | ${6}
          ${2}  | ${2} | ${3} | ${4}           | ${5}
          ${1}  | ${2} | ${3} | ${4}           | ${4}
          ${1}  | ${1} | ${2} | ${2}           | ${3}
          ${1}  | ${1} | ${1} | ${2}           | ${3}
          ${1}  | ${1} | ${1} | ${1}           | ${2}
          ${J}  | ${Q} | ${K} | ${1}           | ${2}
          ${10} | ${J} | ${Q} | ${K}           | ${LittleJoker}
          ${J}  | ${Q} | ${K} | ${LittleJoker} | ${BigJoker}
        `(
          "test invalid case without special: $r1, $r2, $r3, $r4, $r5",
          ({ r1, r2, r3, r4, r5 }) => {
            const cards = [
              new Card(r1, CardSuit.club),
              new Card(r2, CardSuit.club),
              new Card(r3, CardSuit.club),
              new Card(r4, CardSuit.club),
              new Card(r5, CardSuit.club),
            ];
            expect(isValid(cards, speical)).toBeFalsy();
          }
        );

        it.each`
          r1         | r2    | r3   | r4             | r5
          ${speical} | ${2}  | ${3} | ${4}           | ${7}
          ${speical} | ${1}  | ${3} | ${4}           | ${6}
          ${speical} | ${1}  | ${2} | ${4}           | ${6}
          ${speical} | ${2}  | ${2} | ${3}           | ${5}
          ${speical} | ${1}  | ${2} | ${3}           | ${6}
          ${speical} | ${8}  | ${J} | ${Q}           | ${K}
          ${speical} | ${10} | ${Q} | ${K}           | ${2}
          ${speical} | ${10} | ${J} | ${K}           | ${2}
          ${speical} | ${9}  | ${J} | ${Q}           | ${1}
          ${speical} | ${J}  | ${Q} | ${K}           | ${2}
          ${speical} | ${10} | ${J} | ${Q}           | ${LittleJoker}
          ${speical} | ${J}  | ${Q} | ${LittleJoker} | ${BigJoker}
        `(
          "test invalid case with 1 speicial: $r1♥, $r2, $r3, $r4, $r5",
          ({ r1, r2, r3, r4, r5 }) => {
            const cards = [
              new Card(r1, CardSuit.heart),
              new Card(r2, CardSuit.club),
              new Card(r3, CardSuit.club),
              new Card(r4, CardSuit.club),
              new Card(r5, CardSuit.club),
            ];
            expect(isValid(cards, speical)).toBeFalsy();
          }
        );

        it.each`
          r1         | r2         | r3    | r4             | r5
          ${speical} | ${speical} | ${1}  | ${2}           | ${6}
          ${speical} | ${speical} | ${1}  | ${3}           | ${6}
          ${speical} | ${speical} | ${1}  | ${4}           | ${6}
          ${speical} | ${speical} | ${2}  | ${3}           | ${7}
          ${speical} | ${speical} | ${2}  | ${4}           | ${7}
          ${speical} | ${speical} | ${3}  | ${4}           | ${8}
          ${speical} | ${speical} | ${10} | ${J}           | ${2}
          ${speical} | ${speical} | ${10} | ${Q}           | ${2}
          ${speical} | ${speical} | ${10} | ${K}           | ${2}
          ${speical} | ${speical} | ${J}  | ${Q}           | ${2}
          ${speical} | ${speical} | ${J}  | ${K}           | ${2}
          ${speical} | ${speical} | ${Q}  | ${K}           | ${2}
          ${speical} | ${speical} | ${10} | ${J}           | ${LittleJoker}
          ${speical} | ${speical} | ${J}  | ${Q}           | ${LittleJoker}
          ${speical} | ${speical} | ${J}  | ${Q}           | ${BigJoker}
          ${speical} | ${speical} | ${J}  | ${LittleJoker} | ${BigJoker}
        `(
          "test invalid case with 2 speicials: $r1♥, $r2♥, $r3, $r4, $r5",
          ({ r1, r2, r3, r4, r5 }) => {
            const cards = [
              new Card(r1, CardSuit.heart),
              new Card(r2, CardSuit.heart),
              new Card(r3, CardSuit.club),
              new Card(r4, CardSuit.club),
              new Card(r5, CardSuit.club),
            ];
            expect(isValid(cards, speical)).toBeFalsy();
          }
        );
      });
    });

    describe("test three pairs", () => {
      describe("test valid case", () => {
        it.each`
          r1    | r2   | r3
          ${1}  | ${2} | ${3}
          ${4}  | ${2} | ${3}
          ${4}  | ${5} | ${3}
          ${4}  | ${5} | ${6}
          ${7}  | ${5} | ${6}
          ${7}  | ${8} | ${6}
          ${7}  | ${8} | ${9}
          ${10} | ${8} | ${9}
          ${10} | ${J} | ${9}
          ${10} | ${J} | ${Q}
          ${K}  | ${J} | ${Q}
          ${K}  | ${1} | ${Q}
        `("test without special: $r1, $r2, $r3", ({ r1, r2, r3 }) => {
          const cards = [
            new Card(r1, CardSuit.club),
            new Card(r2, CardSuit.club),
            new Card(r3, CardSuit.club),
            new Card(r1, CardSuit.club),
            new Card(r2, CardSuit.club),
            new Card(r3, CardSuit.club),
          ];
          expect(isValid(cards, speical)).toBeTruthy();
        });
        it.each`
          r1   | r2   | r3   | r4   | r5
          ${1} | ${1} | ${2} | ${2} | ${3}
          ${1} | ${2} | ${2} | ${3} | ${3}
          ${1} | ${1} | ${2} | ${3} | ${3}
          ${Q} | ${Q} | ${K} | ${K} | ${1}
          ${Q} | ${Q} | ${K} | ${1} | ${1}
          ${Q} | ${K} | ${K} | ${1} | ${1}
        `(
          "test with 1 special: $r1, $r2, $r3, $r4, $r5",
          ({ r1, r2, r3, r4, r5 }) => {
            const cards = [
              new Card(speical, CardSuit.heart),
              new Card(r1, CardSuit.club),
              new Card(r2, CardSuit.club),
              new Card(r3, CardSuit.club),
              new Card(r4, CardSuit.club),
              new Card(r5, CardSuit.club),
            ];
            expect(isValid(cards, speical)).toBeTruthy();
          }
        );
        it.each`
          r1   | r2   | r3   | r4
          ${1} | ${1} | ${2} | ${2}
          ${1} | ${1} | ${2} | ${3}
          ${1} | ${1} | ${3} | ${3}
          ${1} | ${2} | ${2} | ${3}
          ${1} | ${2} | ${3} | ${3}
          ${2} | ${2} | ${3} | ${3}
          ${Q} | ${Q} | ${K} | ${K}
          ${Q} | ${Q} | ${K} | ${1}
          ${Q} | ${Q} | ${1} | ${1}
          ${Q} | ${K} | ${K} | ${1}
          ${Q} | ${K} | ${1} | ${1}
          ${1} | ${K} | ${K} | ${1}
        `("test with 2 specials: $r1, $r2, $r3, $r4", ({ r1, r2, r3, r4 }) => {
          const cards = [
            new Card(speical, CardSuit.heart),
            new Card(speical, CardSuit.heart),
            new Card(r1, CardSuit.club),
            new Card(r2, CardSuit.club),
            new Card(r3, CardSuit.club),
            new Card(r4, CardSuit.club),
          ];
          expect(isValid(cards, speical)).toBeTruthy();
        });
      });

      describe("test invalid case", () => {
        it.each`
          r1   | r2   | r3          | r4          | r5             | r6
          ${1} | ${1} | ${2}        | ${2}        | ${3}           | ${4}
          ${1} | ${1} | ${2}        | ${3}        | ${3}           | ${4}
          ${1} | ${2} | ${2}        | ${3}        | ${3}           | ${4}
          ${1} | ${1} | ${1}        | ${2}        | ${2}           | ${3}
          ${1} | ${1} | ${2}        | ${2}        | ${2}           | ${3}
          ${1} | ${1} | ${2}        | ${3}        | ${3}           | ${3}
          ${Q} | ${Q} | ${K}        | ${K}        | ${1}           | ${LittleJoker}
          ${Q} | ${Q} | ${K}        | ${K}        | ${LittleJoker} | ${LittleJoker}
          ${K} | ${K} | ${BigJoker} | ${BigJoker} | ${LittleJoker} | ${LittleJoker}
        `(
          "test without speicial: $r1, $r2, $r3, $r4, $r5, $r6",
          ({ r1, r2, r3, r4, r5, r6 }) => {
            const cards = [
              new Card(r1, CardSuit.club),
              new Card(r2, CardSuit.club),
              new Card(r3, CardSuit.club),
              new Card(r4, CardSuit.club),
              new Card(r5, CardSuit.club),
              new Card(r6, CardSuit.club),
            ];
            expect(isValid(cards, speical)).toBeFalsy();
          }
        );
        it.each`
          r1   | r2   | r3   | r4   | r5
          ${1} | ${1} | ${2} | ${2} | ${4}
          ${1} | ${1} | ${2} | ${3} | ${4}
          ${1} | ${2} | ${2} | ${3} | ${4}
          ${1} | ${1} | ${1} | ${2} | ${3}
          ${1} | ${1} | ${1} | ${1} | ${2}
          ${Q} | ${Q} | ${K} | ${K} | ${2}
          ${Q} | ${Q} | ${K} | ${1} | ${2}
          ${Q} | ${K} | ${K} | ${1} | ${2}
        `(
          "test without 1 speicial: $r1, $r2, $r3, $r4, $r5",
          ({ r1, r2, r3, r4, r5 }) => {
            const cards = [
              new Card(r1, CardSuit.club),
              new Card(r2, CardSuit.club),
              new Card(r3, CardSuit.club),
              new Card(r4, CardSuit.club),
              new Card(r5, CardSuit.club),
              new Card(speical, CardSuit.heart),
            ];
            expect(isValid(cards, speical)).toBeFalsy();
          }
        );
        it.each`
          r1   | r2   | r3   | r4
          ${1} | ${1} | ${2} | ${4}
          ${1} | ${1} | ${4} | ${3}
          ${1} | ${2} | ${2} | ${4}
          ${1} | ${2} | ${3} | ${4}
          ${2} | ${2} | ${3} | ${5}
          ${Q} | ${Q} | ${K} | ${2}
          ${Q} | ${Q} | ${1} | ${2}
          ${Q} | ${K} | ${K} | ${2}
          ${Q} | ${K} | ${1} | ${2}
          ${1} | ${K} | ${K} | ${2}
        `("test with 2 specials: $r1, $r2, $r3, $r4", ({ r1, r2, r3, r4 }) => {
          const cards = [
            new Card(speical, CardSuit.heart),
            new Card(speical, CardSuit.heart),
            new Card(r1, CardSuit.club),
            new Card(r2, CardSuit.club),
            new Card(r3, CardSuit.club),
            new Card(r4, CardSuit.club),
          ];
          expect(isValid(cards, speical)).toBeFalsy();
        });
      });
    });
  });
});
