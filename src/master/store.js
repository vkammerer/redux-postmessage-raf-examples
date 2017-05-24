import { createStore, applyMiddleware } from "redux";
import { createWorkerMiddleware } from "../common/redux-worker";
import { createPongPerfMiddleware } from "../common/perf";
import { slaveWorker } from "./slaveWorker";

const defaultState = {
  count: 0,
  ticker: "stopped",
  perfData: [],
  perfMean: "-",
  perfMin: "-",
  perfMax: "-",
  name: "John",
  articles: []
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
        ticker: "stopped"
      };
    case "TICKER_PONG": {
      return {
        ...state,
        count: action.payload.count
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
  logger: true
});

const pongPerfMiddleware = createPongPerfMiddleware({ logger: true });

export const store = createStore(
  reducer,
  applyMiddleware(slaveWorkerMiddleware, pongPerfMiddleware)
);
