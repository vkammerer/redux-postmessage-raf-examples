import { createStore, applyMiddleware } from "redux";
import { createMainMiddleware } from "../common/redux-worker";
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
    case "TICK_START":
      return {
        ...state,
        ticker: "started"
      };
    case "TICK_STOP":
      return {
        ...state,
        ticker: "stopped"
      };
    case "TICK_PONG": {
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

const mainMiddleware = createMainMiddleware({
  worker: slaveWorker,
  debug: true
});

const pongPerfMiddleware = createPongPerfMiddleware({ debug: true });

export const store = createStore(
  reducer,
  applyMiddleware(mainMiddleware, pongPerfMiddleware)
);
