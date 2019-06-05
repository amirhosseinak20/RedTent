import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

// Constants
import { secretKey } from "../../constants/API";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  componentWillMount() {
  }

  render() {
    return(
      <div>

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(User);
