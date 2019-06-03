// Modules
import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

// Components
import Header from "./Header";
import Footer from "./Footer";
import Feed from "./Feed";
import Design from "./Design";
import Error from "./Error";
import User from "./User";

// Actions
import { heightsOf } from "../actions/index";

class App extends Component {
  componentDidUpdate() {
    if(
      this.props.heightsOf.header !== 0 
      && this.props.heightsOf.footer !== 0
      && !this.props.heightsOf.set
      && !this.props.heightsOf.dynamic
    ) {
      const main = () => { 
        return {
          main: this.props.heightsOf.window - (
            this.props.heightsOf.header + this.props.heightsOf.footer + 4
          )
        };
      };
      this.props.dispatch(heightsOf(main()));
      this.props.dispatch(heightsOf({set: true}));
    }
  }

  render() {
    const appRootStyle = {
      backgroundColor: "#fffffc",
      color: "#001011",
      fontFamily: "Tanha, cursive",
      fontSize: "16px",
      direction: "rtl",
      display: "flex",
      flexDirection: "column"
    };
    const mainStyle = {
      backgroundColor: "#ffbc42",
      height: this.props.heightsOf.set ? this.props.heightsOf.main : "auto"
    };
    return(
      <div className="app-root"
           style={ appRootStyle }>
        <Header />
        <div style={ mainStyle }
             className="main-wrapper">
          <Switch>
            <Route sensitive exact path="/feed" component={ Feed } />
            <Route sensitive exact path="/designs/:id"
                   render={ () => <Design render="design" /> } />
            <Route sensitive exact path="/users/:direction(|:id)" component={ User }/>
            <Route component={ Error } />
          </Switch>
        </div>
        <Footer />        
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    heightsOf: state.heightsOf
  };
} 
export default connect(mapStateToProps)(App);
