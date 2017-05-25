import { sendToWorker, sendToMain } from "./worker";

export const makeWorkerMessager = ({ logger, worker, getTickAction }) => {
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
  const tick = () => {
    if (!ticking) return;
    requestAnimationFrame(tick);
    dispatch(getTickAction(count));
    sendActions();
    count++;
  };

  // PUBLIC API
  const dispatch = action => {
    actions.push(action);
    if (!ticking) sendActions();
  };
  const startTicking = () => {
    ticking = true;
    count = 0;
    requestAnimationFrame(tick);
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

export const makeMainMessager = ({ logger, worker, getTickAction }) => {
  // STATE
  let ticking = false;
  let count = 0;
  const actions = [];

  // PRIVATE
  const sendActions = () => {
    if (actions.length === 0) return;
    sendToMain({ actions });
    actions.length = 0;
  };

  // PUBLIC API
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
  const tick = pingAction => {
    if (!ticking) return;
    dispatch(getTickAction(pingAction));
    sendActions();
  };
  return {
    dispatch,
    startTicking,
    stopTicking,
    tick
  };
};
