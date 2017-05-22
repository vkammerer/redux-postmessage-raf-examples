import { createStore, applyMiddleware } from "redux";
import { createWorkerMiddleware } from "../common/redux-worker";
import { slaveWorker } from "./slaveWorker";
import { perfData } from "../common/perf";

const defaultState = {
  tick: 0,
  ticker: "stopped",
  perfData: [],
  perfMean: "-",
  perfMin: "-",
  perfMax: "-",
  name: "John",
  articles: []
};

const getPerfMetrics = () => {
  const perfTotal = perfData.reduce((m1, m2) => m1 + m2, 0);
  const perfMean = perfTotal / perfData.length;
  const perfMin = Math.min(...perfData);
  const perfMax = Math.max(...perfData);
  return {
    perfData,
    perfMean,
    perfMin,
    perfMax
  };
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case "TICKER_START":
      return {
        ...state,
        ticker: "started"
      };
    case "TICKER_STOP":
      return {
        ...state,
        ticker: "stopped",
        ...getPerfMetrics()
      };
    case "TICKER_PONG": {
      return {
        ...state,
        tick: action.payload.tick
      };
    }

    case "NAME_SET":
      return {
        ...state,
        name: action.payload.name
      };
    case "ARTICLES_SET":
      return {
        ...state,
        articles: action.payload.articles
      };
    default:
      return state;
  }
};

const slaveWorkerMiddleware = createWorkerMiddleware({
  worker: slaveWorker,
  logger: false
});

export const store = createStore(
  reducer,
  applyMiddleware(slaveWorkerMiddleware)
);
