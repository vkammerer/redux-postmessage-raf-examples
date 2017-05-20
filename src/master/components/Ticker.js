import React from "react";
import { connect } from "react-redux";

const toggleTickerAction = {
  type: "TICKER_TOGGLE",
  meta: { toWorker: true }
};

const Ticker = prop => (
  <div>
    <h3>Ticker</h3>
    <p>
      Send ping to web worker on every requestAnimationFrame.
    </p>
    <button
      className={prop.ticker === "started" ? "active" : ""}
      onClick={() => prop.dispatch(toggleTickerAction)}
    >
      {prop.ticker === "stopped" ? "Start ticker" : "Stop ticker"}
    </button>
    <p>
      Roundtrip time in ms:
    </p>
    <div className="output">
      <strong>Mean:</strong>
      <div>{prop.perfMean}</div>
      <strong>Min:</strong>
      <div>{prop.perfMin}</div>
      <strong>Max:</strong>
      <div>{prop.perfMax}</div>
    </div>
  </div>
);

export default connect(state => state)(Ticker);
