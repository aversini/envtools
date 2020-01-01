const ntc = require("../../utilities/ntc");
ntc.init();

test("exact colors are recognized", () => {
  let [hexa, name, exact] = ntc.name("#FFFFFF");
  expect(hexa).toEqual("#FFFFFF");
  expect(name).toEqual("White");
  expect(exact).toBeTruthy();

  [hexa, name, exact] = ntc.name("#800080");
  expect(hexa).toEqual("#800080");
  expect(name).toEqual("Purple");
  expect(exact).toBeTruthy();

  [hexa, name, exact] = ntc.name("#00A693");
  expect(hexa).toEqual("#00A693");
  expect(name).toEqual("Persian Green");
  expect(exact).toBeTruthy();
});

test("approximate colors are recognized", () => {
  let [hexa, name, exact] = ntc.name("#FFFFF9");
  expect(hexa).toEqual("#FFFEF6");
  expect(name).toEqual("Black White");
  expect(exact).toBeFalsy();

  [hexa, name, exact] = ntc.name("#800089");
  expect(hexa).toEqual("#660099");
  expect(name).toEqual("Purple");
  expect(exact).toBeFalsy();

  [hexa, name, exact] = ntc.name("#00A699");
  expect(hexa).toEqual("#00A693");
  expect(name).toEqual("Persian Green");
  expect(exact).toBeFalsy();
});
