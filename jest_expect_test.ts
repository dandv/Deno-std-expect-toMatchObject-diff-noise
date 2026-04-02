import { expect } from "npm:expect";
import { article, expected } from "./data.ts";

Deno.test("article matches expected shape — Jest expect (deliberate mismatch)", () => {
  expect(article).toMatchObject(expected);
});