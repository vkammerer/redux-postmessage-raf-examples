import WorkerMessager from "./worker-messager";
import MainMessager from "./main-messager";
import { sendToWorker, sendToMain } from "./worker";
import { addToPerf, resetPerf } from "./perf";
import { logWithPerf } from "./utils";

const messageHandler = store => {
  const handleMessage = mE => {
    const message = JSON.parse(mE.data);
    if (message.actions) message.actions.forEach(store.dispatch);
  };
  return handleMessage;
};

const listenToThread = (store, worker) => {
  const messageEmitter = worker || self;
  messageEmitter.addEventListener("message", messageHandler(store));
};

const handleFromWorkerAction = ({ logger, action, messager, next }) => {
  if (logger) logWithPerf("FROM WORKER", action);
  if (action.type === "TICKER_START") {
    resetPerf();
    messager.startTicking();
  }
  if (action.type === "TICKER_STOP") messager.stopTicking();
  if (action.type === "TICKER_PONG") addToPerf(action);
  return next(action);
};

const handleToMainAction = ({ logger, action, messager }) => {
  messager.dispatch(action);
  if (action.type === "TICKER_STOP") messager.stopTicking();
  if (action.type === "TICKER_START") messager.startTicking();
};

const handleFromMainAction = ({ logger, action, messager, next }) => {
  if (logger) logWithPerf("FROM MAIN  ", action);
  if (action.type === "TICKER_START") {
    resetPerf();
    messager.startTicking();
  }
  if (action.type === "TICKER_STOP") messager.stopTicking();
  if (action.type === "TICKER_PING") messager.tick(action);
  return next(action);
};

export const createWorkerMiddleware = ({ logger, worker }) => store => {
  listenToThread(store, worker);
  const messager = new WorkerMessager({ logger, worker });
  return next => action => {
    if (action.meta && action.meta.toWorker) return messager.dispatch(action);
    if (action.meta && action.meta.toMain)
      return handleFromWorkerAction({ logger, action, messager, next });
    if (logger) console.log("WITHOUT DIRECTION", action);
  };
};

export const createMainMiddleware = ({ logger }) => store => {
  listenToThread(store);
  const messager = new MainMessager({ logger });
  return next => action => {
    if (action && action.meta && action.meta.toMain)
      return handleToMainAction({ logger, action, messager });
    if (action && action.meta && action.meta.toWorker) {
      return handleFromMainAction({ logger, action, messager, next });
    }
    if (logger) console.log("WITHOUT DIRECTION", action);
  };
};
