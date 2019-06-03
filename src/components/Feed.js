// Modules
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import Design from './Design';

// Actions
import { feed } from "../actions/index";

// Constants
import * as API from "../constants/API";

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.eachDesign = this.eachDesign.bind(this);
  }

  async componentWillMount() {
    await this.props.dispatch(feed(0, 10));
  }

  eachDesign(design, i) {
    return(
      <Design src={API.files + design.path}
              alt={design.title} 
              key={design.id} 
              index={i}
              id={design.id} 
              rate={ design.rate }
              render='feed' />
    );
  }

  render() {
    const feedStyle = {
      display: "flex",
      flexWrap: "nowrap",
      overflowX: "auto",
      direction: "ltr",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      height: "calc(100% - 20px)",
      padding: 10
    }
    return(
      <div className="feed-wrapper"
           style={ feedStyle }>
        { this.props.designs.map(this.eachDesign) }
        <div className="loadMore-wrapper">
          {/*TODO: LOAD MORE BUTTON*/}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    designs: state.designs.list,
    heightsOf: state.heightsOf
  };
} 
export default connect(mapStateToProps)(Feed);
