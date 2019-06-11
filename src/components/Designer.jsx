// Node Modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { FiEdit3 }from "react-icons/fi";
import axios from "axios";

// Images
import wallpaper from "../assets/images/wallpaper_designer.jpg";
import avatar from "../assets/images/avatar_designer.png";

// Constatns 
import { media, designers } from "../constants/API";

//Components
class Designer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: false,
      own: false,
      designer: {}
    };
  }

  async componentWillMount() {
    const {isSignedIn, designerId} = this.props.user;
    const pageId = parseInt(this.props.match.params.designerId);
    if(isSignedIn && designerId === pageId){
      this.setState({own: true});
    } else {
      this.setState({own: false});
    } 
    // get designer data
    try {
      const designer = await axios.get(`${designers}${pageId}`);
      if(designer.status === 200) {
        this.setState({
          designer: {
            ...designer.data, 
            avatar: `${media}${designer.data.avatar}`
          }
        });
        const dAvatar = this.state.designer.avatar;
        if(dAvatar === media || designer.data.avatar === undefined){
          this.setState({designer: {...this.state.designer, avatar: avatar}});
        }
      } else {
        throw new Error(designer.data.error); 
      }
    } catch(error) {
      alert(error);
      this.setState({render: true});
    }
  }

  render() {
    const {designer, own, render} = this.state;
    const {match} = this.props;
    if(render) {
      return <Redirect to="/error" /> 
    } else {
      return(
        <div className="user-panel-wrapper">
          <UserHeader 
            designer={designer}
            own={own}
            match={match}
          />
          <div className="user-panel">
            <DesignerAbilities designer={designer} own={own}/>
          </div>
        </div>
      );
    }
  }
}

function UserHeader({designer, own, match}) {
  console.log(designer);
  const {
    avatar, 
    first_name, 
    last_name, 
    phone_number, 
    city, 
    address, 
    description 
  } = designer;
  console.log({first_name,last_name,phone_number,city,address,description});
  const headerImageStyle = {
    backgroundImage: `url(${wallpaper})`,
  };
  return(
    <div className="designer-header-wrapper">
      <div 
        className="designer-header-wallpaper"
        style={headerImageStyle}
      >
      </div>
      <div className="designer-avatar-wrapper">
        <img src={avatar} alt="avatar" />
      </div>
      <div className="designer-info-wrapper">
        <ul className="designer-info">
          <li className="full-name">{`${first_name} ${last_name}`}</li>
          <li className="contact">آدرس: {city}، {address} {phone_number}</li>
          <li className="descrption">توضیحات: {description}</li>          
          {own ? <li className="edit"><Link to={`${match.url}/edit`}><FiEdit3 /></Link></li> : null}
        </ul>
      </div>
    </div>
  );
}

class DesignerAbilities extends Component {
  // FIX This Component
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
    // const {designer} = this.props;
    const {open} = this.state;
    this.setState({open: !open, images: []});
    if(!open) {
      // FIX HERE
      // show images
      // const id = jwt.decode(user.authKey, secretKey).user_id;
      // const config = {
      //   headers: {Authorization: user.authKey}
      // };
      // try {
      //   const likedsRes = await axios.get(`${users}${id}/rates_for_designs/`, config);
      //   const images = [];
      //   for(let i = 0; i < likedsRes.data.designs.length; i++){
      //     const imageId = likedsRes.data.designs[i];
      //     images.push((await axios.get(`${designs}${imageId}`)).data);
      //   }
      //   this.setState({images: images});
      // } catch(error) {
      //   console.log(error);
      //   // pass
      // }
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
      <div className="designer-collection">
        <div className="tab" onClick={this.open}>
          <div className="plus-minus-icon">
            <div className="horizontal-line" style={horizontalLineStyle}></div>
            <div className="vertical-line" style={verticalLineStyle}></div>
          </div>
          <div className="title">توانایی‌ها</div>
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
    user: state.user
  };
};
export default connect(mapStateToProps)(Designer);
