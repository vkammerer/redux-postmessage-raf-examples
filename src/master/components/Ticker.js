import React from "react";
import { connect } from "react-redux";
import { getMetrics } from "../../common/perf";

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
  type: "TICKER_TOGGLE",
  meta: { toWorker: true }
};

const Animation = props => (
  <div className="animation">
    <div
      className="animated"
      style={{ transform: `scale(${props.tick % 200 / 200})` }}
    />
  </div>
);

const ConnectedAnimation = connect(state => ({ tick: state.tick }))(Animation);

const Metrics = props => {
  const perf = getMetrics();
  return (
    <div>
      <div className="output">
        <p>
          Roundtrip time in ms:
        </p>
        <strong>Mean:</strong>
        <div>{perf.mean}</div>
        <strong>Min:</strong>
        <div>{perf.min}</div>
        <strong>Max:</strong>
        <div>{perf.max}</div>
      </div>
      <div className="perfData">
        {props.ticker === "stopped" &&
          perf.data.map((perfD, index) => (
            <div
              key={index}
              className="perfD"
              style={{
                width: `${perfD / perf.max * 100}%`
              }}
            />
          ))}
      </div>
    </div>
  );
};

const ConnectedMetrics = connect(state => ({ ticker: state.ticker }))(Metrics);

const Ticker = props => (
  <div>
    <h3>Ticker</h3>
    <p>
      Send ping to web worker on every requestAnimationFrame.
    </p>
    <ConnectedButton />
    <ConnectedAnimation />
    <ConnectedMetrics />
  </div>
);

export default Ticker;
