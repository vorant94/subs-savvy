import { expect, it } from "vitest";
import { roundToDecimal } from "./round-to-decimal";

it("should round to 2 decimal places", () => {
	expect(roundToDecimal(1.234567)).toBe(1.23);
});

it("should leave number as is if it is already rounded", () => {
	expect(roundToDecimal(1.24)).toBe(1.24);
});
