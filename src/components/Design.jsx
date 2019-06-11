import React, { Component } from "react";
import { connect } from "react-redux";

class Design extends Component {
  render() {
    return(
      <div></div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(Design);
