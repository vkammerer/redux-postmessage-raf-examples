import { createStore, applyMiddleware } from "redux";
import { createCycleMiddleware } from "redux-cycles";
import { createWorkerMiddleware } from "../common/redux-worker";

const defaultState = { ticking: false };

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case "TICK_TOGGLE":
      return {
        ...state,
        ticking: !state.ticking
      };
    default:
      return state;
  }
};

const mainMiddleware = createWorkerMiddleware({ debug: true });

const cycleMiddleware = createCycleMiddleware();
export const { makeActionDriver, makeStateDriver } = cycleMiddleware;

export const store = createStore(
  reducer,
  applyMiddleware(mainMiddleware, cycleMiddleware)
);
