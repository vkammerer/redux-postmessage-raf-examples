import { createStore, applyMiddleware } from "redux";
import { createCycleMiddleware } from "redux-cycles";
import { createMainMiddleware } from "../common/redux-worker";

const defaultState = { ticking: false };

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case "TICKER_TOGGLE":
      return {
        ...state,
        ticking: !state.ticking
      };
    default:
      return state;
  }
};

const mainMiddleware = createMainMiddleware({ logger: true });

const cycleMiddleware = createCycleMiddleware();
export const { makeActionDriver, makeStateDriver } = cycleMiddleware;

export const store = createStore(
  reducer,
  applyMiddleware(mainMiddleware, cycleMiddleware)
);
