import React, { Component } from "react";
import { connect } from "react-redux";

class Header extends Component {
  submit = e => {
    e.preventDefault();
    this.props.dispatch({
      type: "NAME_SUBMIT",
      payload: this.input.value,
      meta: {
        toWorker: true,
        ignoreSelf: true
      }
    });
  };
  render() {
    return (
      <div>
        <h3>Name</h3>
        <p>
          Set the name in the firebase DB.
        </p>
        <form onSubmit={this.submit}>
          <input type="text" ref={r => (this.input = r)} />
        </form>
        <p className="output">{this.props.name.name}</p>
      </div>
    );
  }
}

export default connect(state => ({ name: state.name }))(Header);
