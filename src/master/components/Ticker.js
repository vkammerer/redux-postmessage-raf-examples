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
    <div className="animation">
      <div
        className="animated"
        style={{ transform: `scale(${props.tick % 200 / 200})` }}
      />
    </div>
    <div className="output">
      <p>
        Roundtrip time in ms:
      </p>
      <strong>Mean:</strong>
      <div>{props.perfMean}</div>
      <strong>Min:</strong>
      <div>{props.perfMin}</div>
      <strong>Max:</strong>
      <div>{props.perfMax}</div>
    </div>
    <div className="perfData">
      {props.ticker === "stopped" &&
        props.perfData.map((perfD, index) => (
          <div
            key={index}
            className="perfD"
            style={{ width: `${perfD / Math.max(...props.perfData) * 100}%` }}
          />
        ))}
    </div>
  </div>
);

export default connect(state => state)(Ticker);
