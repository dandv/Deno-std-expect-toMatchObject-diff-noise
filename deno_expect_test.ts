import { expect } from "@std/expect";
import { article, expected } from "./data.ts";

Deno.test("article matches expected shape — @std/expect (deliberate mismatch)", () => {
  expect(article).toMatchObject(expected);
});