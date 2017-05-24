import { sendToWorker } from "./worker";

class WorkerMessager {
  constructor({ logger, worker, getTickAction }) {
    this.logger = logger;
    this.worker = worker;
    this.getTickAction = getTickAction;
    this.ticking = false;
    this.count = 0;
    this.actions = [];
    this.sendActions = this.sendActions.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.startTicking = this.startTicking.bind(this);
    this.stopTicking = this.stopTicking.bind(this);
    this.tick = this.tick.bind(this);
  }
  sendActions() {
    if (this.actions.length === 0) return;
    sendToWorker(this.worker, { actions: this.actions });
    this.actions.length = 0;
  }
  dispatch(action) {
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
    this.dispatch(this.getTickAction(this.count));
    this.sendActions();
    this.count++;
  }
}

export default WorkerMessager;
