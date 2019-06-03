// Modules
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  FiBox,
  FiUser,
  FiSearch
} from "react-icons/fi";
import { connect } from "react-redux";
// Components

// Actions
import { heightsOf } from "../actions/index";

class Header extends Component {
  componentDidMount() {
    this.props.dispatch(heightsOf({header: this.header.clientHeight}));

    this.props.dispatch(heightsOf({window: window.innerHeight}));
    window.addEventListener("resize", () => {
      this.props.dispatch(heightsOf({window: window.innerHeight}))
      this.props.dispatch(heightsOf({set: false}));      
    });
  }

  render() {
    const headerStyle = {
      backgroundColor: "#a5907e",
      padding: "8px",
      fontSize: "2rem",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottom: "#001011 solid 2px"
    };
    const headerNavStyle = {      
      display: "flex",
      flexDirection: "row",
      justifyContent: "right"
    };
    return(
      <header className="header-wrapper" 
              ref={ header => this.header = header }
              style={ headerStyle }>
        <nav style={ headerNavStyle }>
          <Link to="/signin"><FiUser /></Link>
          <Link to="/feed"><FiBox /></Link>
          <Link to="/search"><FiSearch /></Link>
        </nav>
        <div className="logo-wrapper">
          <Link to="/feed"><FiBox /></Link>
        </div>
      </header>
    );
  }
}

export default connect()(Header);
