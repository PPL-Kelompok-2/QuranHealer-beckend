import isJSON from "../../src/utils/isJSON";

test("mengembalikan true", () => {
  const data = JSON.stringify({
    name: "akbar",
    number: 123,
  });
  expect(isJSON(data)).toBe(true);
});
