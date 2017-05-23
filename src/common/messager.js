import { sendToWorker } from "./worker";

class Messager {
  constructor({ logger, worker }) {
    this.logger = logger;
    this.ticking = false;
    this.count = 0;
    this.actions = [];
    this.send = sendToWorker(worker);
    this.startTicking = this.startTicking.bind(this);
    this.stopTicking = this.stopTicking.bind(this);
    this.tick = this.tick.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.sendActions = this.sendActions.bind(this);
  }
  pushAction(action) {
    if (this.logger) console.log("TO WORKER  ", performance.now(), action);
    this.actions.push(action);
  }
  sendActions() {
    this.send({ actions: this.actions });
    this.actions.length = 0;
  }
  dispatch(action) {
    this.pushAction(action);
    if (!this.ticking) return this.sendActions();
  }
  startTicking() {
    this.ticking = true;
    this.count = 0;
    requestAnimationFrame(this.tick);
  }
  stopTicking() {
    this.ticking = false;
  }
  tick() {
    this.pushAction({
      type: "TICKER_PING",
      payload: {
        tick: this.count,
        time: performance.now()
      },
      meta: { toWorker: true }
    });
    this.sendActions();
    if (this.ticking) requestAnimationFrame(this.tick);
    this.count++;
  }
}

export default Messager;
