import React from "react";
import { connect } from "react-redux";

const getNameAction = {
  type: "GET_NAME",
  meta: { toWorker: true }
};

const Header = prop => (
  <div>
    <h3>Name</h3>
    <p>
      Get the name from the cyclejs application in the worker.
    </p>
    <button onClick={() => prop.dispatch(getNameAction)}>
      Get name
    </button>
    <p className="output">{prop.name}</p>
  </div>
);

export default connect(state => ({ name: state.name }))(Header);
