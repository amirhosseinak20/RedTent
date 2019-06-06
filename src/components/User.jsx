// Node Modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { FiEdit3 }from "react-icons/fi";
import axios from "axios";
import jwt from "jwt-simple";

// Images
import wallpaper from "../assets/images/wallpaper.jpg";
import avatar from "../assets/images/avatar.png";

// Constatns 
import { users, secretKey, media } from "../constants/API";

//Components
class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }

  componentWillMount() {
    const {url} = this.props;
    const {isSignedIn, username} = this.props.user;
    const pageUsername = url.split(/\//).pop();
    if(isSignedIn && username === pageUsername){
      this.setState({redirect: false});
    } else if(isSignedIn) {
      this.setState({redirect: true});
    } else {
      this.setState({redirect: true});
    } 
  }

  render() {
    const {redirect} = this.state;
    const {user} = this.props;
    const {avatar, username, firstname, lastname, isSignedIn} = user;
    if(redirect || !isSignedIn){
      return <Redirect to="/users/signin" />
    } else {
      return(
        <div className="user-panel-wrapper">
          <UserHeader 
            username={username}
            firstname={firstname}
            lastname={lastname}
            avatar={avatar}
            wallpaper={wallpaper}
          />
          <div className="user-panel">
            <UserLikeds user={user}/>
          </div>
        </div>
      );
    }
  }
}

class UserHeader extends Component {
  render() {
    const headerImageStyle = {
      backgroundImage: `url(${wallpaper})`,
    };
    const {username, firstname, lastname} = this.props;
    return(
      <div className="user-header-wrapper">
        <div 
          className="user-header-wallpaper"
          style={headerImageStyle}
        >
        </div>
        <div className="user-avatar-wrapper">
          <img src={avatar} alt={username}></img>
        </div>
        <div className="user-info-wrapper">
          <ul className="user-info">
            <li className="full-name">{`${firstname} ${lastname}`}</li>
            <li className="username">@{username}</li>
            <li className="edit"><FiEdit3 /></li>
          </ul>
        </div>
      </div>
    );
  }
}

class UserLikeds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      scale: false,
      images: []
    }
    this.open = this.open.bind(this);
    this.clicked = this.clicked.bind(this);
    this.eachImage = this.eachImage.bind(this);
  }

  async open() {
    const {user} = this.props;
    const {open} = this.state
    const id = jwt.decode(user.authKey, secretKey).user_id;
    this.setState({open: !open});
    const config = {
      headers: {Authorization: user.authKey}
    };
    try {
    const likedsRes = await axios.get(`${users}${id}/rates_for_designs/`, config);
    this.setState({images: likedsRes.data.designs});
    } catch(error) {
      console.log(error);
      // pass
    }
  }

  clicked(e) {
    const {scale} = this.state;
    if(!scale) {
      e.target.style.transform = 'scale(3) translate(-25%, 0)';
      e.target.style.zIndex = 18;
      this.setState({scale: true});
    } else {
      e.target.style.transform = 'scale(1)';
      e.target.style.zIndex = 15;  
      this.setState({scale: false});
    }
    console.log(e.target.style.transform);
  }

  eachImage(image, i) {
    return(
      <img 
        src={`${media}${image.path}`} 
        alt={image.title} 
        onClick={this.clicked} 
        key={i}
      />
    );
  }

  render() {
    const {open} = this.state
    const horizontalLineStyle = {
      transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
    }
    const verticalLineStyle = {
      transform: open ? 'rotate(0deg)' : 'rotate(90deg)'
    }
    const imageTabStyle = {
      overflow: open ? 'initial' : 'hidden',
      height: open ? 'auto' : 0,
      padding: open ? '16px 16px' : '0 16px' 
    }
    return(
      <div className="user-likeds">
        <div className="tab" onClick={this.open}>
          <div className="plus-minus-icon">
            <div className="horizontal-line" style={horizontalLineStyle}></div>
            <div className="vertical-line" style={verticalLineStyle}></div>
          </div>
          <div className="title">پست‌هایی که لایک‌کرده‌اید</div>
        </div>
        <div className="image-tab" style={imageTabStyle}>
          {this.state.images.map(this.eachImage)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    url: state.router.location.pathname,
    user: state.user
  };
};
export default connect(mapStateToProps)(User);
