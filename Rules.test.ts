import { BigJoker, Card, CardSuit, King } from "./Cards";
import { isValidPlay } from "./Rules";
import random from "lodash.random";

describe("test Rules", () => {
  describe("test isValidPlay", () => {
    it("test no prev", () => {
      expect(
        isValidPlay([new Card(random(1, BigJoker), CardSuit.club)])
      ).toBeTruthy();
    });

    it("test no prev but cards is empty", () => {
      expect(isValidPlay([])).toBeFalsy();
    });
  });
});
