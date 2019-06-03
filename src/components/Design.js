// Modules
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  FiDownload, 
  FiHeart,
  FiPlus,
  FiBookmark,
  FiArchive,
  FiImage,
  FiMessageSquare
} from "react-icons/fi";
import { connect } from "react-redux";
import axios from "axios";

// Actions
import { heightsOf } from "../actions/index";

// Constants
import * as API from "../constants/API";

class Design extends Component {
  constructor(props){
    super(props);
    this.state = {
      design: {}
    }
    this.renderFeed = this.renderFeed.bind(this);

    this.renderDesign = this.renderDesign.bind(this);
    this.showImage = this.showImage.bind(this);
    this.showComment = this.showComment.bind(this);
    this.showList = this.showList.bind(this);
  }

  renderFeed() {
    const designStyle = {
      margin: "0 10px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      position: "relative",
      height: "100%"
    };
    const linkStyle = {
      height: "calc(100% - 35px)",
      width: "auto",
      textAlign: "center",
      display: "inline-block"
    };
    const imageStyle = {
      height: "100%",
      width: "auto",
      borderRadius: 8,
    };
    return(
      <div className="design-wrapper"
           ref={ rootDiv => this.rootDiv = rootDiv }
           style={ designStyle }>
        <Link to={ `/designs/${this.props.id}` }
              style={ linkStyle }>
          <img src={ this.props.src }
              alt={ this.props.alt }
              style={ imageStyle }/>
        </Link>
        <Buttons src={ this.props.src }
                 alt={ this.props.alt }
                 rate={ this.props.rate }
                 render={ this.props.render } />
      </div>
    );
  }

  async componentWillMount() {
    if(this.props.render === "design") {
      this.props.dispatch(heightsOf({set: false, dynamic: true}));            
      const id = this.props.location.split("/")[2];
      const response = await axios.get(`${API.designs}${id}`);
      this.setState({
        design: {
          id: id,
          src: `${API.files}${response.data.path}`,
          alt: response.data.alt,
          rate: response.data.rate,
          view: response.data.view
        },
        imageIsActive: true,
        commentIsActive: false,
        listIsActive: false
      })
    } 
  }
  
  componentWillUnmount() {
    if(this.props.render === "design") {
      this.props.dispatch(heightsOf({dynamic: false}));
    }  
  }

  showImage() {
    this.setState({
      imageIsActive: true,
      commentIsActive: false,
      listIsActive: false
    })
  }

  showComment() {
    this.setState({
      imageIsActive: false,
      commentIsActive: true,
      listIsActive: false
    })
  }

  showList() {
    this.setState({
      imageIsActive: false,
      commentIsActive: false,
      listIsActive: true
    })
  }

  renderDesign() {
    const style={
      width: "100%",
      height: "auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      backgroundColor:  "rgb(240, 239, 239)"
    };
    const imageContainerStyle = {
      width: "98%",
      height: "auto",
      padding: "0.5%",
      margin: "0.5%",
    };
    const imageStyle = {
      width: "100%",
      height: "auto",
      borderRadius: "16px",
      display: this.state.imageIsActive ? "inline-block" : "none"
    };
    const selectorsStyle = {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      padding: "5px"
    };
    const selectorsIconsStyle = {
      border: "1px solid black",
      width: "2em",
      height: "2em",
      padding: "5px",
      cursor: "pointer"
    };
    const commentsStyle = {
      ...imageStyle,
      display: this.state.commentIsActive ? "flex" : "none",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "baseline",
      backgroundColor: "rgb(219, 219, 219)",
    };
    const listStyle = {
      ...commentsStyle,
      display: this.state.listIsActive ? "flex" : "none"      
    };
    const buttonsStyle = {
      display: this.state.imageIsActive ? "flex" : "none",
    };
    return(
      <div className="design-wrapper"
           style={ style }>
          <div className="selectors-wrapper"
               style={ selectorsStyle }>
            <FiImage style={{ 
                      ...selectorsIconsStyle,
                      backgroundColor: this.state.imageIsActive ? "red" : "inherit"
                     }}
                     onClick={ this.showImage }/>
            <FiMessageSquare style={{ 
                                ...selectorsIconsStyle,
                                backgroundColor: this.state.commentIsActive ? "red" : "inherit"
                              }}
                              onClick={ this.showComment }/>
            <FiArchive style={{ 
                        ...selectorsIconsStyle,
                        backgroundColor: this.state.listIsActive ? "red" : "inherit"
                       }}
                       onClick={ this.showList }/>
          </div>
        <div className="image-container"
             style={ imageContainerStyle }>
          <img src={ this.state.design.src }
               alt={ this.state.design.alt }
               style={ imageStyle } />
          <div className="comment-container"
               style={ commentsStyle }>
            {/* { this.comments.map(this.eachComment) } */}
          </div>
          <div className="list-container"
               style={ listStyle }>

          </div>
          <Buttons render={ this.props.render }
                   src={ this.state.design.src }
                   alt={ this.state.design.alt }
                   rate={ this.state.design.rate }
                   style={ buttonsStyle }/>
        </div>
      </div>
    );
  }

  render() {
    switch(this.props.render){
      case "feed":
        return this.renderFeed();
      case "design":
        return this.renderDesign();
      default:
        return this.renderDesign();
    }
  }
}

const Download = props => {
  return(
    <div style={props.style} 
         className="download-wrapper">
      <a href={props.href} 
         download={props.name}
         style={{
          width: "100%",
          height: "100%",
          lineHeight: "100%",
          display: "inline-block"
         }}>
        <FiDownload style={{
                      width: "100%",
                      height: "100%"
                    }}/>
      </a>
    </div>
  );
}

class Plus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      added: false
    };
    this.add2Collection = this.add2Collection.bind(this);
  }

  add2Collection() {
    this.setState({added: true});
    alert("Added to your collecton!");
  }

  render() {
    const plusStyle = {
      width: "2em",
      height: "2em",
      cursor: "pointer",
      display: this.state.added ? "none" : "inline-block"
    }

    return(
      <div className="plus-wrapper">
        <FiPlus style={ plusStyle }
                onClick={ this.add2Collection }
                />
      </div>
    );
  }
}

class Bookmark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      added: false
    };
    this.add2Collection = this.add2Collection.bind(this);
  }

  add2Collection() {
    this.setState({added: true});
    alert("Added to your Resume!");
  }

  render() {
    const plusStyle = {
      width: "2em",
      height: "2em",
      cursor: "pointer",
      display: this.state.added ? "none" : "inline-block"
    }

    return(
      <div className="bookmark-wrapper"
           display={ this.props.style }>
        <FiBookmark style={ plusStyle }
                onClick={ this.add2Collection }
                />
      </div>
    );
  }
}

class Like extends Component {
  constructor(props){
    super(props);
    this.state = {
      limit: 5,
      rate: this.props.rate,
      rated: false
    }
    this.hearts = this.hearts.bind(this);
  }

  hearts(i){
    const style = {
      fill: i < this.state.rate ? "brown" : "none",
      width: "2em",
      height: "2em",
      cursor: "pointer"
    }
    return(
      <FiHeart style={ style }
               key={ i }
               onClick={ () => this.setState({rate: i + 1, rated: true}) }/>
    );
  }

  render(){
    const style = {
      display: "flex",
      flexDirection: "row-reverse",
      justifyContent: "flex-start",
      alignItems: "center",
    }
    let hearts = [];
    for(let i = 0; i < this.state.limit; i++)
      hearts.push(this.hearts(i));
    return(
      <div className="Like Wrapper"
           style={ style }>
        { hearts }
      </div>
    );
  }
}

const Buttons = props => {
  const buttonsStyle = {
    direction: "rtl",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    width: "100%",
    height: 35,
    marginTop: 8,
  }
  const downloadStyle = {
    width: "2em",
    height: "2em"
  };
  const dlplusStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  }
  const bookmarkStyle = {
    // display: this.props.user.kind === "tailor" ? "inline-block" : "none" // this is for tailors
  }
  return(
    <div className="buttons-wrapper"
         style={{ 
          ...buttonsStyle,
          ...props.style 
         }} >
      <div className="dlplus-wrapper"
           style={ dlplusStyle }>
        <Download href={ props.src } 
                  name={ props.alt }
                  style={ downloadStyle } />
        <Plus href={ props.src }/>
        <Bookmark href={ props.src } 
                  style={ bookmarkStyle }/>
      </div>
      <Like src={ props.src }
            rate={ props.rate } />
    </div>
  );
}
const mapStateToProps = state => {
  return {
    height: state.heightsOf.main,
    location: state.router.location.pathname
  };
} 
export default connect(mapStateToProps)(Design);
