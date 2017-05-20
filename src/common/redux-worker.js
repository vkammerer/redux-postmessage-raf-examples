import Ticker from "./ticker";
import { sendToWorker, sendToMain } from "./worker";
import { perfData } from "./perf";

export const listenToWorkerActions = ({ worker, store }) => {
  worker.addEventListener("message", mE => {
    const action = JSON.parse(mE.data);
    if (!action || !action.type) return;
    return store.dispatch(action);
  });
};

export const listenToMainActions = store => {
  self.addEventListener("message", mE => {
    const action = JSON.parse(mE.data);
    if (!action || !action.type) return;
    return store.dispatch(action);
  });
};

const handleFromWorkerAction = ({ logger, ticker, action, thisTicker }) => {
  if (logger) console.log("ACTION FROM WORKER", performance.now(), action);
  if (ticker && action.type === "TICKER_START") {
    perfData.length = 0;
    thisTicker.start();
  }
  if (ticker && action.type === "TICKER_STOP") thisTicker.stop();
  if (action.type === "TICKER_PONG") {
    perfData.push(performance.now() - action.payload.time);
  }
};

const sendPingToWorker = (sendToThisWorker, logger) => tick => {
  const pingAction = {
    type: "TICKER_PING",
    payload: { tick, time: performance.now() },
    meta: { toWorker: true }
  };
  if (logger) console.log("ACTION TO WORKER", performance.now(), pingAction);
  sendToThisWorker(pingAction);
};

export const createWorkerMiddleware = ({ worker, logger, ticker }) => store => {
  listenToWorkerActions({ worker, store });
  const sendToThisWorker = sendToWorker(worker);
  const thisTicker = !ticker
    ? null
    : new Ticker(sendPingToWorker(sendToThisWorker, logger));
  return next => action => {
    if (!action) return console.log("NO ACTION");
    if (action.meta && action.meta.toWorker) {
      if (logger) console.log("ACTION TO WORKER", action, performance.now());
      return sendToThisWorker(action);
    }
    if (action.meta && action.meta.toMain) {
      handleFromWorkerAction({ store, logger, ticker, action, thisTicker });
      return next(action);
    }
    if (logger) console.log("ACTION WITHOUT DIRECTION", action);
  };
};

export const createMainMiddleware = ({ logger = false }) => store => {
  listenToMainActions(store);
  return next => action => {
    if (action && action.meta && action.meta.toMain) {
      if (logger) console.log("ACTION TO MAIN", performance.now(), action);
      sendToMain(action);
    } else if (action && action.meta && action.meta.toWorker) {
      if (logger) console.log("ACTION FROM MAIN", performance.now(), action);
      next(action);
    } else if (action) {
      if (logger) console.log("ACTION WITHOUT DIRECTION", action);
    }
  };
};
