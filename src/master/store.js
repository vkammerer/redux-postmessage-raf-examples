import { createStore, applyMiddleware } from "redux";
import { createMainMiddleware } from "@vkammerer/redux-postmessage-raf";
// import { createMainMiddleware } from "../../../redux-postmessage-raf";
import { slaveWorker } from "./slaveWorker";

const defaultState = {
  pinging: false,
  scale: 0,
  name: "John",
  articles: []
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case "PING_START":
      return {
        ...state,
        pinging: true
      };
    case "PING_STOP":
      return {
        ...state,
        pinging: false
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

const mainMiddleware = createMainMiddleware({ worker: slaveWorker });

export const store = createStore(reducer, applyMiddleware(mainMiddleware));
