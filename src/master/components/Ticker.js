import React from "react";
import { connect } from "react-redux";

const FRAMES_TILL_FULL = 80;

const Button = props => (
  <button
    className={props.ticker === "started" ? "active" : ""}
    onClick={() => props.dispatch(toggleTickerAction)}
  >
    {props.ticker === "stopped" ? "Start ticker" : "Stop ticker"}
  </button>
);

const ConnectedButton = connect(state => ({ ticker: state.ticker }))(Button);

const toggleTickerAction = {
  type: "PING_TOGGLE",
  meta: { toWorker: true }
};

const Animation = props => (
  <div className="animation">
    <div
      className="animated"
      style={{
        transform: `scale(${props.scale % FRAMES_TILL_FULL / FRAMES_TILL_FULL})`
      }}
    />
  </div>
);

const ConnectedAnimation = connect(state => ({ scale: state.scale }))(
  Animation
);

const Ticker = props => (
  <div>
    <h3>Ticker</h3>
    <p>
      Send ping to web worker on every requestAnimationFrame.
    </p>
    <ConnectedButton />
    <ConnectedAnimation />
  </div>
);

export default Ticker;
