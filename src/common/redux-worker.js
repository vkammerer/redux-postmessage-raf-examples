import { mainMessager, workerMessager } from "./messagers";
import { addToPerf, resetPerf } from "./perf";
import { logWithPerf } from "./utils";

const handleToWorkerAction = ({ debug, messager, action }) => {
  if (debug) logWithPerf("TO WORKER  ", action);
  messager.dispatch(action);
};

const handleFromWorkerAction = ({ debug, messager, next, action }) => {
  if (debug) logWithPerf("FROM WORKER", action);
  if (action.type === "TICK_START") messager.startTicking();
  if (action.type === "TICK_STOP") messager.stopTicking();
  next(action);
};

const handleToMainAction = ({ debug, messager, action }) => {
  if (debug) logWithPerf("TO MAIN    ", action);
  messager.dispatch(action);
  if (action.type === "TICK_START") messager.startTicking();
  if (action.type === "TICK_STOP") messager.stopTicking();
};

const handleFromMainAction = ({ debug, messager, next, action }) => {
  if (debug) logWithPerf("FROM MAIN  ", action);
  if (action.type === "TICK_PING") messager.pong(action);
  next(action);
};

const createGetPingAction = debug =>
  function getPingAction(count) {
    const action = {
      type: "TICK_PING",
      payload: {
        count,
        time: performance.now()
      },
      meta: { toWorker: true }
    };
    if (debug) logWithPerf("TO WORKER  ", action);
    return action;
  };

const createGetPongAction = debug =>
  function getPongAction(pingAction) {
    const action = {
      type: "TICK_PONG",
      payload: {
        count: pingAction.payload.count,
        time: pingAction.payload.time
      },
      meta: { toMain: true }
    };
    if (debug) logWithPerf("TO MAIN    ", action);
    return action;
  };

export const createMainMiddleware = ({ debug, worker }) => store => {
  const messager = mainMessager({
    debug,
    worker,
    onAction: store.dispatch,
    getPingAction: createGetPingAction(debug)
  });
  return next =>
    function handleActionInMiddleware(action) {
      if (action.meta && action.meta.toWorker)
        return handleToWorkerAction({ debug, messager, action });
      if (action.meta && action.meta.toMain)
        return handleFromWorkerAction({ debug, messager, next, action });
      if (debug) console.log("WITHOUT DIRECTION", action);
    };
};

export const createWorkerMiddleware = ({ debug }) => store => {
  const messager = workerMessager({
    debug,
    onAction: store.dispatch,
    getPongAction: createGetPongAction(debug)
  });
  return next =>
    function handleActionInMiddleware(action) {
      if (action.meta && action.meta.toMain)
        return handleToMainAction({ debug, messager, action });
      if (action.meta && action.meta.toWorker) {
        return handleFromMainAction({ debug, messager, next, action });
      }
      if (debug) console.log("WITHOUT DIRECTION", action);
    };
};
