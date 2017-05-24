import { sendToWorker } from "./worker";
import { logWithPerf } from "./utils";

class WorkerMessager {
  constructor({ logger, worker }) {
    this.logger = logger;
    this.ticking = false;
    this.count = 0;
    this.actions = [];
    this.send = sendToWorker(worker).bind(this);
    this.sendActions = this.sendActions.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.startTicking = this.startTicking.bind(this);
    this.stopTicking = this.stopTicking.bind(this);
    this.tick = this.tick.bind(this);
  }
  sendActions() {
    if (this.actions.length === 0) return;
    this.send({ actions: this.actions });
    this.actions.length = 0;
  }
  dispatch(action) {
    if (this.logger) logWithPerf("TO WORKER  ", action);
    this.actions.push(action);
    if (!this.ticking) this.sendActions();
  }
  startTicking() {
    this.ticking = true;
    this.count = 0;
    requestAnimationFrame(this.tick);
  }
  stopTicking() {
    this.ticking = false;
    this.sendActions();
  }
  tick() {
    if (!this.ticking) return;
    requestAnimationFrame(this.tick);
    this.dispatch({
      type: "TICKER_PING",
      payload: {
        count: this.count,
        time: performance.now()
      },
      meta: { toWorker: true }
    });
    this.sendActions();
    this.count++;
  }
}

export default WorkerMessager;
