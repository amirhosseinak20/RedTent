import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

// Constants
import { secretKey } from "../../constants/API";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // redirect: false
    };
  }
  
  componentWillMount() {
    // const { isLoggedIn } = this.props.user
    // if(isLoggedIn){
    //   this.setState({redirect: false});
    //  } else {
    //   this.setState({redirect: true, redirectURL: `/users/login`});
    // }
  }

  render() {
    // const { redirect, redirectURL } = this.state;
    // if(redirect) {
    //   return <Redirect to={redirectURL} />;
    // } else {
      return(
        <div>

        </div>
      );
    // }
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(User);
