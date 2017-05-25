export const perfData = [];

export const addToPerf = action =>
  perfData.push(performance.now() - action.payload.time);

export const resetPerf = () => (perfData.length = 0);

export const getMetrics = () => {
  const data = perfData.slice(2, perfData.length);
  const total = data.length ? data.reduce((m1, m2) => m1 + m2, 0) : "-";
  const mean = data.length ? total / data.length : "-";
  const min = data.length ? Math.min(...data) : "-";
  const max = data.length ? Math.max(...data) : "-";
  return {
    data,
    mean,
    min,
    max
  };
};

export const createPongPerfMiddleware = ({ logger }) => store => next =>
  function handleActionInMiddleware(action) {
    if (action.type === "TICK_START") resetPerf();
    if (action.type === "TICK_PONG") addToPerf(action);
    return next(action);
  };
