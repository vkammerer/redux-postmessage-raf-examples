import { mainMessager, workerMessager } from "./messagers";
import { addToPerf, resetPerf } from "./perf";
import { logWithPerf } from "./utils";

function postPingAction(debug, post, count) {
  const action = {
    type: "PING",
    payload: {
      count,
      time: performance.now()
    },
    meta: { toWorker: true }
  };
  if (debug) logWithPerf("TO WORKER  ", action);
  post(action);
}

const postPongAction = (debug, post, pingData) => {
  const action = {
    type: "PONG",
    payload: {
      count: pingData.count,
      time: pingData.time
    },
    meta: { toMain: true }
  };
  if (debug) logWithPerf("TO MAIN    ", action);
  post(action);
};

export const createMainMiddleware = ({ debug, worker }) => store => {
  const messager = mainMessager({
    debug,
    worker,
    onReceiveAction: store.dispatch,
    onBeforePing: (post, count) => postPingAction(debug, post, count)
  });
  return next =>
    function handleActionInMiddleware(action) {
      if (action.meta && action.meta.toWorker) {
        if (debug) logWithPerf("TO WORKER  ", action);
        return messager.post(action);
      }
      if (action.meta && action.meta.toMain) {
        if (debug) logWithPerf("FROM WORKER", action);
        return next(action);
      }
      if (debug) console.log("WITHOUT DIRECTION", action);
    };
};

export const createWorkerMiddleware = ({ debug }) => store => {
  const messager = workerMessager({
    debug,
    onReceiveAction: store.dispatch,
    onBeforePong: (post, pingData) => postPongAction(debug, post, pingData)
  });
  return next =>
    function handleActionInMiddleware(action) {
      if (action.meta && action.meta.toMain) {
        if (debug) logWithPerf("TO MAIN    ", action);
        messager.post(action);
        if (action.type === "PING_START") messager.startPing();
        if (action.type === "PING_STOP") messager.stopPing();
        return;
      }
      if (action.meta && action.meta.toWorker) {
        if (debug) logWithPerf("FROM MAIN  ", action);
        return next(action);
      }
      if (debug) console.log("WITHOUT DIRECTION", action);
    };
};
