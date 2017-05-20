class Ticker {
  constructor(fn) {
    this.fn = fn;
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.tick = this.tick.bind(this);
  }
  start() {
    this.count = 0;
    this.shouldTick = true;
    requestAnimationFrame(this.tick);
  }
  stop() {
    this.shouldTick = false;
  }
  tick() {
    if (!this.shouldTick) return;
    requestAnimationFrame(this.tick);
    this.fn(this.count);
    this.count++;
  }
}

export default Ticker;
