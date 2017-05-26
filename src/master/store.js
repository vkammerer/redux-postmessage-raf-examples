import { createStore, applyMiddleware } from "redux";
import { createMainMiddleware } from "@vkammerer/redux-postmessage-raf";
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
    case "PING_START":
      return {
        ...state,
        ticker: "started"
      };
    case "PING_STOP":
      return {
        ...state,
        ticker: "stopped"
      };
    case "ANIMATION": {
      return {
        ...state,
        scale: action.payload
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
  // debug: true,
  worker: slaveWorker
});

export const store = createStore(reducer, applyMiddleware(mainMiddleware));
