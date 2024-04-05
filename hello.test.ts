import nock from "nock";
import axios from "axios";

const scope = nock("http://localhost:8080");
beforeEach(() => {
  nock.cleanAll(); // keep all tests isolated
})

describe("test nock", () => {
  it("test nock get", async () => {
    scope.get("/api/users/1").twice().reply(200, { name: "zyd" });
    let res = await axios.get("http://localhost:8080/api/users/1");
    expect(res.data).toEqual({ name: "zyd" });

    res = await axios.get("http://localhost:8080/api/users/1");
    expect(res.data).toEqual({ name: "zyd" });
    scope.done();
  });

  it("test nock get users", async () => {
    scope.get("/api/users").reply(200, [{ name: "zyd" }, {name: 'lh'}]);
    let res = await axios.get("http://localhost:8080/api/users");
    expect(res.data).toEqual([{ name: "zyd" }, {name: 'lh'}]);
    scope.done();
  });

  it("test nock without done", async () => {
    scope.get("/api/users").reply(200, [{ name: "zyd" }, {name: 'lh'}]);
  });

  it.skip("test nock use scope from previous test", async () => {
    let res = await axios.get("http://localhost:8080/api/users");
    expect(res.data).toEqual([{ name: "zyd" }, {name: 'lh'}]);
    scope.done();
  });
});
