import React from "react";
import { connect } from "react-redux";

const toggleTickerAction = {
  type: "TICKER_TOGGLE",
  meta: { toWorker: true }
};

const Ticker = props => (
  <div>
    <h3>Ticker</h3>
    <p>
      Send ping to web worker on every requestAnimationFrame.
    </p>
    <button
      className={props.ticker === "started" ? "active" : ""}
      onClick={() => props.dispatch(toggleTickerAction)}
    >
      {props.ticker === "stopped" ? "Start ticker" : "Stop ticker"}
    </button>
    <p>
      Roundtrip time in ms:
    </p>
    <div className="output">
      <strong>Mean:</strong>
      <div>{props.perfMean}</div>
      <strong>Min:</strong>
      <div>{props.perfMin}</div>
      <strong>Max:</strong>
      <div>{props.perfMax}</div>
    </div>
    <div className="perfData">
      {props.perfData.map(perfD => (
        <div
          className="perfD"
          style={{ width: `${perfD / props.perfMax * 100}%` }}
        />
      ))}
    </div>
  </div>
);

export default connect(state => state)(Ticker);
