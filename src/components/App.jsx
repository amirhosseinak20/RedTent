// Node Modules
import React, { Component } from "react";
import { withCookies } from "react-cookie";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

// Actions
import { user } from "../actions/index";

// Components
import Header from  "./Header";
import Signin from "./Signin";
import Register from "./Register";
import User from "./User";

class App extends Component {
  constructor(props) {
    super(props);

    // check for user signin
    const { dispatch, cookies } = this.props;
    const userObject = cookies.get("user");
    if (userObject === undefined) {
      dispatch(user({isSignedIn: false}));
    } else {
      dispatch(user({isSignedIn: true, ...userObject}));
    }
  }

  render() {
    const {cookies} = this.props;
    return(
      <div>
        <Header cookies={cookies}/>
        <Switch>
          <Route path="/users/signin" render={() => <Signin cookies={cookies}/>} />
          <Route path="/users/register" render={() => <Register cookies={cookies}/>} />
          <Route path="/users/:username" render={() => <User cookies={cookies}/>} />
        </Switch>
      </div>
    );
  }
}

export default withCookies(connect()(App));
