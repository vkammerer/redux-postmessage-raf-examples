import React from "react";
import { connect } from "react-redux";

const nameGetAction = {
  type: "NAME_GET",
  meta: { toWorker: true, ignoreSelf: true }
};

const Header = props => (
  <div>
    <h3>Name</h3>
    <p>
      Get the name from the cyclejs application in the worker.
    </p>
    <button onClick={() => props.dispatch(nameGetAction)}>
      Get name
    </button>
    <p className="output">{props.name.name}</p>
  </div>
);

export default connect(state => ({ name: state.name }))(Header);
