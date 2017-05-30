import { combineReducers, createStore, applyMiddleware } from "redux";
import { logger, createLogger } from "redux-logger";
// import { createMainMiddleware } from "@vkammerer/redux-postmessage-raf";
import { createMainMiddleware } from "../../../redux-postmessage-raf";
import { slaveWorker } from "./slaveWorker";
import { messager } from "../common/reducers/messager";
import { articles } from "../common/reducers/articles";
import { name } from "../common/reducers/name";
import { animation } from "./reducers/animation";

const reducers = combineReducers({
  messager,
  animation,
  name,
  articles
});

// MIDDLEWARES
const messagerMiddleware = createMainMiddleware(slaveWorker);

export const store = createStore(
  reducers,
  applyMiddleware(messagerMiddleware)
  // applyMiddleware(messagerMiddleware, logger)
);
