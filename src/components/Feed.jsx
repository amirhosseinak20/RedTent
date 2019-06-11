// Node Modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { FiShare, FiPlus, FiHeart, FiDownload } from "react-icons/fi";
import { Link, Redirect } from "react-router-dom";

// Images
import test from "../assets/images/test.jpg";

// Components
// Fix this component
// connect to api server
class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      redirect: false
    }
  }

  // Fetch Images from Server and fix variables
  componentWillMount() {
    const {user} = this.props;
    if(user.isSignedIn) {
      this.setState({redirect: false});
    } else {
      this.setState({redirect: true});
    }
  }
  
  eachImage(image, i) {
    return (
      <Image 
        id={image.id}
        src={image.src}
        avg={image.rate}
        rate={image.rate}
      />
    );
  }
  
  render() {
    const {images, redirect} = this.state;
    if(redirect) {
      return <Redirect to="/users/signin" />
    } else {
      return(
        <div className="feed-wrapper">
          {images.map(this.eachImage)}
        </div>
      );
    }
  }
}

function Image({id, src, avg, rate}) {
  return(
    <div className="each-wrapper">
      <Link className="image-wrapper" to={`/designs/${id}`}><img src={src} alt={src.split('/').pop()} /></Link>
      <Share href={src}/>
      <Add2Collection />
      <div className="function-buttons-wrapper">
        <Like avg={avg} rate={rate}/>
        <Download href={src}/>
      </div>
    </div>
  );
}
// FIX this component
// create circular menu
function Share({href}) {
  return(
    <div className="share-wrapper" style={{display: 'none'}}>
      <FiShare />
      <div className="share-menu">

      </div>
    </div>
  );
}
// FIX this component
// add functionality
function Add2Collection() {
  return(
    <div className="add-to-collection" onClick={e => {
      e.preventDefault();
    }}>
      <FiPlus className="button"/>
    </div>
  );
}
// FIX this component
// add functionality
class Like extends Component {
  render() {
    const {avg} = this.props;
    return(
      <div className="like">
        <FiHeart className="heart" />
        <FiHeart className="heart" />
        <FiHeart className="heart" />
        <FiHeart className="heart" />
        <FiHeart className="heart" />
        <span className="avg-rate">{parseFloat(avg)}</span>
      </div>
    );
  }
}
function Download ({href}) {
  return(
    <a href={href} className="download" download>
      <FiDownload className="button"/>
    </a>
  );
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(Feed);
