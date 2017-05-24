import { sendToMain } from "./worker";
import { logWithPerf } from "./utils";

class MainMessager {
  constructor({ logger }) {
    this.logger = logger;
    this.actions = [];
    this.ticking = false;
    this.send = sendToMain.bind(this);
    this.pushAction = this.pushAction.bind(this);
    this.sendActions = this.sendActions.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.startTicking = this.startTicking.bind(this);
    this.stopTicking = this.stopTicking.bind(this);
    this.tick = this.tick.bind(this);
  }
  pushAction(action) {
    if (this.logger) logWithPerf("TO MAIN    ", action);
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
  }
  stopTicking() {
    this.ticking = false;
  }
  tick(pingAction) {
    this.pushAction({
      type: "TICKER_PONG",
      payload: {
        count: pingAction.payload.count,
        time: pingAction.payload.time
      },
      meta: { toMain: true }
    });
    this.sendActions();
  }
}

export default MainMessager;
