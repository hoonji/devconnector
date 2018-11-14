const filterByKeys = require('../filterByKeys');

it('filters an objects properties using a whitelist', () => {
  const whitelist = ['a', 'c'];
  const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };

  expect(filterByKeys(obj, whitelist)).toEqual({ a: 1, c: 3 });
});
