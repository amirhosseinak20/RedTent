// Node Modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { FiEdit3, FiPlus }from "react-icons/fi";
import { GiSewingNeedle } from "react-icons/gi"
import axios from "axios";
import jwt from "jwt-simple";

// Images
import wallpaper from "../assets/images/wallpaper.jpg";

// Constatns 
import { users, secretKey, media, designs, designsCollection } from "../constants/API";

//Components
class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }

  componentWillMount() {
    const {isSignedIn, username} = this.props.user;
    const pageUsername = this.props.match.params.username;
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
    const {user, match} = this.props;
    const {avatar, username, first_name, last_name, isSignedIn, kind, designerId} = user;
    if(redirect || !isSignedIn){
      return <Redirect to="/users/signin" />
    } else {
      return(
        <div className="user-panel-wrapper">
          <UserHeader 
            username={username}
            firstname={first_name}
            lastname={last_name}
            avatar={avatar}
            wallpaper={wallpaper}
            kind={kind}
            match={match}
            designerId={designerId}
          />
          <div className="user-panel">
            <UserLikeds user={user} />
            <UserCollection user={user} />
          </div>
          <AddMore />
        </div>
      );
    }
  }
}

function UserHeader({username, firstname, lastname, avatar, kind, match, designerId}) {
  const headerImageStyle = {
    backgroundImage: `url(${wallpaper})`,
  };
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
          <li className="edit"><Link to={`/edit/${username}`}><FiEdit3 /></Link></li>
          {kind === "designer" ? <li className="needl"><Link to={`/designers/${designerId}`}><GiSewingNeedle /></Link></li> : null}
        </ul>
      </div>
    </div>
  );
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
    this.setState({open: !open, images: []});
    if(!open) {
      const id = jwt.decode(user.authKey, secretKey).user_id;
      const config = {
        headers: {Authorization: user.authKey}
      };
      try {
        const likedsRes = await axios.get(`${users}${id}/rates_for_designs/`, config);
        const images = [];
        for(let i = 0; i < likedsRes.data.designs.length; i++){
          const imageId = likedsRes.data.designs[i];
          images.push((await axios.get(`${designs}${imageId}`)).data);
        }
        this.setState({images: images});
      } catch(error) {
        console.log(error);
        // pass
      }
    }
  }

  clicked(e) {
    const {scale} = this.state;
    if(!scale) {
      e.target.style.transform = 'scale(2) translate(-25%, 0)';
      e.target.style.zIndex = 18;
      this.setState({scale: true});
    } else {
      e.target.style.transform = 'scale(1)';
      e.target.style.zIndex = 15;  
      this.setState({scale: false});
    }
  }

  eachImage(image, i) {
    return(
      <img 
        src={`${media}${image.design_picture}`} 
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
      padding: open ? '16px 16px' : '0 16px',
      borderBottom: open ? '0.8px solid #000000' : 'none'
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

class UserCollection extends Component {
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
    this.setState({open: !open, images: []});
    if(!open) {
      try {
        // Fix this line
        const headers = {Authorization: user.authKey};
        const params = {
          _from: 0,
          _row: 100
        }
        const designsCollectionRes = await axios.get(designsCollection, {headers});
        this.setState({designsCollection: designsCollectionRes.data});
        const dscId = this.state.designsCollection[0].id;
        const col = await axios.get(`${designsCollection}${dscId}/designs/`, {headers, params});
        const images = [];
        for(let i = 0; i < col.data.length; i++){
          const imageId = col.data[i].id;
          images.push((await axios.get(`${designs}${imageId}`)).data);
        }
        this.setState({images: images});
      } catch(error) {
        alert(error);
      }
    }
  }

  clicked(e) {
    const {scale} = this.state;
    if(!scale) {
      e.target.style.transform = 'scale(2) translate(-25%, 0)';
      e.target.style.zIndex = 18;
      this.setState({scale: true});
    } else {
      e.target.style.transform = 'scale(1)';
      e.target.style.zIndex = 15;  
      this.setState({scale: false});
    }
  }

  eachImage(image, i) {
    return(
      <img 
        src={`${media}${image.design_picture}`} 
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
      padding: open ? '16px 16px' : '0 16px',
      borderBottom: open ? '0.8px solid #000000' : 'none'
    }
    return(
      <div className="user-collection">
        <div className="tab" onClick={this.open}>
          <div className="plus-minus-icon">
            <div className="horizontal-line" style={horizontalLineStyle}></div>
            <div className="vertical-line" style={verticalLineStyle}></div>
          </div>
          <div className="title">مجموعه‌ی شما</div>
        </div>
        <div className="image-tab" style={imageTabStyle}>
          {this.state.images.map(this.eachImage)}
        </div>
      </div>
    );
  }
}

function AddMore() {
  return(
    <div className="add-more-fixed">
      <Link className="button" to="/search"><FiPlus className="button" /></Link>
    </div>
  );
}
const mapStateToProps = state => {
  return {
    user: state.user
  };
};
export default connect(mapStateToProps)(User);
