// Node Modules
import React, { Component } from "react";
import { withCookies } from "react-cookie";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

// Actions
import { user } from "../actions/index";

// Images
import logo from "../assets/images/logo.png";

// Components
import Header from  "./Header";
import Signin from "./Signin";
import Register from "./Register";
import User from "./User";
import Designer from "./Designer";
import Feed from "./Feed";
import Design from "./Design";

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
          <Route 
            path="/users/signin" 
            render={({match}) => <Signin cookies={cookies} match={match} />}
          />
          <Route 
            path="/users/register" 
            render={({match}) => <Register cookies={cookies}match={match} />} 
          />
          <Route
            path="/users/:username" 
            render={({match}) => <User cookies={cookies}match={match} />} 
          />
          <Route 
            path="/designers/:designerId" 
            render={({match}) => <Designer cookies={cookies}match={match} />} 
          />
          <Route 
            path="/feed" 
            render={({match}) => <Feed cookies={cookies}match={match} />} 
          />
          <Route 
            path="/designs/:id" 
            render={({match}) => <Design cookies={cookies}match={match} />} 
          />
          <Route component={ErrorPanel} />
        </Switch>
      </div>
    );
  }
}

function ErrorPanel() {
  return(
    <div className="error-wrapper">
      <div className="error-logo-wrapper"><img src={logo} alt="logo" /></div>
      <span className="error">404</span>
      <span className="error">صفحه‌ی مورد‌نظر یافت‌ نشد. </span>
    </div>
  );
}
export default withCookies(connect()(App));
