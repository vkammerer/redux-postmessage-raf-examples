import { createStore, applyMiddleware } from "redux";
import { createWorkerMiddleware } from "../common/redux-worker";
import { slaveWorker } from "./slaveWorker";

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
