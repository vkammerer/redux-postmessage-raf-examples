export const objectPropsToArray = obj =>
  Object.keys(obj).map(key => ({ key, value: obj[key] }));

export const logWithPerf = (label, obj) =>
  console.log(label, performance.now().toFixed(2), obj, "ok");
