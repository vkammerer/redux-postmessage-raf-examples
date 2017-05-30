import { combineReducers, createStore, applyMiddleware } from "redux";
import { logger, createLogger } from "redux-logger";
import { createCycleMiddleware } from "redux-cycles";
// import { createWorkerMiddleware } from "@vkammerer/redux-postmessage-raf";
import { createWorkerMiddleware } from "../../../redux-postmessage-raf";
import { messager } from "../common/reducers/messager";
import { articles } from "../common/reducers/articles";
import { name } from "../common/reducers/name";

const reducers = combineReducers({
  messager,
  name,
  articles
});

// MIDDLEWARES

const messagerMiddleware = createWorkerMiddleware({ dispatchAfterPong: true });

const cycleMiddleware = createCycleMiddleware();
export const { makeActionDriver, makeStateDriver } = cycleMiddleware;

export const store = createStore(
  reducers,
  applyMiddleware(messagerMiddleware, cycleMiddleware)
  // applyMiddleware(messagerMiddleware, cycleMiddleware, logger)
);
