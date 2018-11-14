module.exports = (obj, whitelist) =>
  Object.keys(obj)
    .filter(key => whitelist.includes(key))
    .reduce((newObj, key) => {
      newObj[key] = obj[key];
      return newObj;
    }, {});
