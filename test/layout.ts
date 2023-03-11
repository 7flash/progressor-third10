import { assertEquals } from "https://deno.land/std@0.179.0/testing/asserts.ts";
import { buildInlineKeyboard } from "../layout.ts";

Deno.test("buildInlineKeyboard returns expected output", () => {
  const remainingTraits = ["trait1", "trait2", "trait3", "trait4", "trait5"];
  const expectedOutput = [
    [
      { text: "trait1", callback_data: "trait1" },
      { text: "trait2", callback_data: "trait2" },
    ],
    [
      { text: "trait3", callback_data: "trait3" },
      { text: "trait4", callback_data: "trait4" },
    ],
    [{ text: "trait5", callback_data: "trait5" }],
  ];
  const actualOutput = buildInlineKeyboard(remainingTraits);
  assertEquals(actualOutput, expectedOutput);
});
