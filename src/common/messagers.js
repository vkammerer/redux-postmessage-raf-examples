import { sendToWorker, sendToMain } from "./worker";

const listenToPoster = ({ poster, onAction }) => {
  poster.addEventListener("message", function handleMessage(mE) {
    const message = JSON.parse(mE.data);
    if (message.actions) message.actions.forEach(onAction);
  });
};

export const mainMessager = ({ worker, getPingAction, onAction }) => {
  listenToPoster({ poster: worker, onAction });

  // STATE
  let ticking = false;
  let count = 0;
  const actions = [];

  // PRIVATE
  const sendActions = () => {
    if (actions.length === 0) return;
    sendToWorker(worker, { actions });
    actions.length = 0;
  };
  const ping = () => {
    if (!ticking) return;
    requestAnimationFrame(ping);
    dispatch(getPingAction(count));
    sendActions();
    count++;
  };

  // PUBLIC
  const dispatch = action => {
    actions.push(action);
    if (!ticking) sendActions();
  };
  const startTicking = () => {
    ticking = true;
    count = 0;
    requestAnimationFrame(ping);
  };
  const stopTicking = () => {
    ticking = false;
    sendActions();
  };
  return {
    dispatch,
    startTicking,
    stopTicking
  };
};

export const workerMessager = ({ getPongAction, onAction }) => {
  listenToPoster({ poster: self, onAction });

  // STATE
  let ticking = false;
  const actions = [];

  // PRIVATE
  const sendActions = () => {
    if (actions.length === 0) return;
    sendToMain({ actions });
    actions.length = 0;
  };

  // PUBLIC
  const dispatch = action => {
    actions.push(action);
    if (!ticking) sendActions();
  };
  const startTicking = () => {
    ticking = true;
  };
  const stopTicking = () => {
    ticking = false;
    sendActions();
  };
  const pong = pingAction => {
    if (!ticking) return;
    dispatch(getPongAction(pingAction));
    sendActions();
  };
  return {
    dispatch,
    startTicking,
    stopTicking,
    pong
  };
};
