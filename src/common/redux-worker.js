import { makeWorkerMessager, makeMainMessager } from "./messagers";
import { addToPerf, resetPerf } from "./perf";
import { logWithPerf } from "./utils";

const listenToThread = (store, worker) => {
  const messageEmitter = worker || self;
  messageEmitter.addEventListener("message", function handleMessage(mE) {
    const message = JSON.parse(mE.data);
    if (message.actions) message.actions.forEach(store.dispatch);
  });
};

const handleToWorkerAction = ({ logger, messager, action }) => {
  if (logger) logWithPerf("TO WORKER  ", action);
  messager.dispatch(action);
};

const handleFromWorkerAction = ({ logger, messager, next, action }) => {
  if (logger) logWithPerf("FROM WORKER", action);
  if (action.type === "TICKER_START") messager.startTicking();
  if (action.type === "TICKER_STOP") messager.stopTicking();
  next(action);
};

const handleToMainAction = ({ logger, messager, action }) => {
  if (logger) logWithPerf("TO MAIN    ", action);
  messager.dispatch(action);
  if (action.type === "TICKER_START") messager.startTicking();
  if (action.type === "TICKER_STOP") messager.stopTicking();
};

const handleFromMainAction = ({ logger, messager, next, action }) => {
  if (logger) logWithPerf("FROM MAIN  ", action);
  if (action.type === "TICKER_PING") messager.tick(action);
  next(action);
};

const createGetMainTickAction = logger =>
  function getMainTickAction(count) {
    const action = {
      type: "TICKER_PING",
      payload: {
        count,
        time: performance.now()
      },
      meta: { toWorker: true }
    };
    if (logger) logWithPerf("TO WORKER  ", action);
    return action;
  };

const createGetWorkerTickAction = logger =>
  function getWorkerTickAction(pingAction) {
    const action = {
      type: "TICKER_PONG",
      payload: {
        count: pingAction.payload.count,
        time: pingAction.payload.time
      },
      meta: { toMain: true }
    };
    if (logger) logWithPerf("TO MAIN    ", action);
    return action;
  };

export const createWorkerMiddleware = ({ logger, worker }) => store => {
  listenToThread(store, worker);
  const messager = makeWorkerMessager({
    logger,
    worker,
    getTickAction: createGetMainTickAction(logger)
  });
  return next =>
    function handleActionInMiddleware(action) {
      if (action.meta && action.meta.toWorker)
        return handleToWorkerAction({ logger, messager, action });
      if (action.meta && action.meta.toMain)
        return handleFromWorkerAction({ logger, action, messager, next });
      if (logger) console.log("WITHOUT DIRECTION", action);
    };
};

export const createMainMiddleware = ({ logger }) => store => {
  listenToThread(store);
  const messager = makeMainMessager({
    logger,
    getTickAction: createGetWorkerTickAction(logger)
  });
  return next =>
    function handleActionInMiddleware(action) {
      if (action.meta && action.meta.toMain)
        return handleToMainAction({ logger, messager, action });
      if (action.meta && action.meta.toWorker) {
        return handleFromMainAction({ logger, messager, next, action });
      }
      if (logger) console.log("WITHOUT DIRECTION", action);
    };
};
