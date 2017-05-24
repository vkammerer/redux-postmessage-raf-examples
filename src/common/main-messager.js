import { sendToMain } from "./worker";

class MainMessager {
  constructor({ logger, getTickAction }) {
    this.logger = logger;
    this.getTickAction = getTickAction;
    this.ticking = false;
    this.actions = [];
    this.sendActions = this.sendActions.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.startTicking = this.startTicking.bind(this);
    this.stopTicking = this.stopTicking.bind(this);
    this.tick = this.tick.bind(this);
  }
  sendActions() {
    if (this.actions.length === 0) return;
    sendToMain({ actions: this.actions });
    this.actions.length = 0;
  }
  dispatch(action) {
    this.actions.push(action);
    if (!this.ticking) return this.sendActions();
  }
  startTicking() {
    this.ticking = true;
  }
  stopTicking() {
    this.ticking = false;
    this.sendActions();
  }
  tick(pingAction) {
    if (!this.ticking) return;
    this.dispatch(this.getTickAction(pingAction));
    this.sendActions();
  }
}

export default MainMessager;
