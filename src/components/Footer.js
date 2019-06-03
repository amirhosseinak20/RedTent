// Modules
import React, { Component } from "react";
import { connect } from "react-redux";

// Actions
import { heightsOf } from "../actions/index";

class Footer extends Component {
  componentDidMount() {
    const footer = () => { return {footer: this.footer.clientHeight} };
    this.props.dispatch(heightsOf(footer()));
  }

  render() {
    const footerStyle = {
      backgroundColor: "#a5907e",
      padding: "8px",
      fontSize: "1.5rem",
      textAlign: "center",
      borderTop: "#001011 solid 2px"
    };
    return(
      <footer ref={ footer => this.footer = footer }
              style={ footerStyle }>
        <p>&copy; 2019</p>
      </footer>
    );
  }
}
export default connect()(Footer);
