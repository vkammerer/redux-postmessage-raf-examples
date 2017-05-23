import Messager from "./messager";
import { sendToWorker, sendToMain } from "./worker";
import { addToPerf, resetPerf } from "./perf";

export const listenToWorkerActions = ({ worker, store }) => {
  worker.addEventListener("message", mE => {
    const action = JSON.parse(mE.data);
    if (!action || !action.type) return;
    return store.dispatch(action);
  });
};

export const listenToMainActions = store => {
  self.addEventListener("message", mE => {
    const message = JSON.parse(mE.data);
    if (message.actions)
      message.actions.forEach(action => {
        store.dispatch(action);
      });
  });
};

const handleFromWorkerAction = ({ logger, action, messager, next }) => {
  if (logger) console.log("FROM WORKER", performance.now(), action);
  if (action.type === "TICKER_START") {
    resetPerf();
    messager.startTicking();
  }
  if (action.type === "TICKER_STOP") messager.stopTicking();
  if (action.type === "TICKER_PONG") {
    addToPerf(action);
  }
  return next(action);
};

export const createWorkerMiddleware = ({ logger, worker }) => store => {
  listenToWorkerActions({ worker, store });
  const messager = new Messager({ logger, worker });
  const sendToThisWorker = sendToWorker(worker);
  return next => action => {
    if (action.meta && action.meta.toWorker) return messager.dispatch(action);
    if (action.meta && action.meta.toMain) {
      return handleFromWorkerAction({ logger, action, messager, next });
    }
    if (logger) console.log("WITHOUT DIRECTION", action);
  };
};

export const createMainMiddleware = ({ logger }) => store => {
  listenToMainActions(store);
  return next => action => {
    if (action && action.meta && action.meta.toMain) {
      if (logger) console.log("TO MAIN    ", performance.now(), action);
      sendToMain(action);
    } else if (action && action.meta && action.meta.toWorker) {
      if (logger) console.log("FROM MAIN  ", performance.now(), action);
      next(action);
    } else if (action) {
      if (logger) console.log("WITHOUT DIRECTION", action);
    }
  };
};
