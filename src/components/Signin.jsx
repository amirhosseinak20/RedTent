// Node Modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { FiLock } from "react-icons/fi";
import jwt from "jwt-simple";
import axios from "axios";
import { Redirect } from "react-router-dom";

// Constants
import { secretKey, userSignin, users, media } from "../constants/API";

// Images
import avatar from "../assets/images/avatar.png";

// Actions
import { user } from "../actions/index";

// components
class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      user: {}
    };
    this.handleInput = this.handleInput.bind(this);
    this.signin = this.signin.bind(this);
  }

  async signin(e) {
    e.preventDefault();
    const data = jwt.encode(this.state.user, secretKey);
    const {dispatch, cookies} = this.props;
    try {
      const signinRes = await axios.post(userSignin, {data});
      if(signinRes.status === 200){
        const authKey = signinRes.data.token;
        const headers = {Authorization: authKey};
        const decodedAuth = jwt.decode(authKey, secretKey);        
        const id = decodedAuth.user_id;
        const userRes = await axios.get(`${users}${id}`, {headers});
        if(userRes.status === 200){
          const userStatus = {
            ...jwt.decode(userRes.data.data, secretKey),
            avatar: `${media}${userRes.data.avatar}`,
            id: id,
            designerId: decodedAuth.designer_id,
            authKey
          };
          if(userStatus.avatar === media) {
            userStatus.avatar = avatar
          }
          dispatch(user({...userStatus, isSignedIn: true}));
          cookies.set('user', userStatus, {path: '/'});
          this.setState({redirect: true});
        } else {
          throw new Error(userRes);
        }
      } else {
        throw new Error(signinRes);
      }
    } catch(error) {
      this.setState({user: {}})
      const message = error.response.data.error;
      alert(message);
    }
  }

  handleInput(e, name) {
    this.setState({user: {...this.state.user, [name]: e.target.value}});
  }

  inputValue(name) {
    return this.state.user[name] === undefined ? '' : this.state.user[name]; 
  }

  render() {
    const {isSignedIn, username} = this.props.user;
    const {redirect} = this.state;
    if(redirect || isSignedIn){
      return <Redirect to={`/users/${username}`} />;
    } else {
      return(
        <div className="full-width-form-wrapper">
          <div className="signin-form-wrapper">
            <div className="logo"><FiLock className="lock-icon" /></div>
            <form className="form-wrapper" onSubmit={this.signin}>
              <div className="username-wrapper">
                <input 
                  type="text" 
                  name="username" 
                  placeholder="User Name" 
                  onChange={e => this.handleInput(e, "username")}
                  value={this.inputValue("username")}
                />
              </div>
              <div className="password-wrapper">
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password"
                  onChange={e => this.handleInput(e, "password")}
                  value={this.inputValue("password")}
                />
              </div>
              <button type="submit">ورود</button>
            </form>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};
export default connect(mapStateToProps)(Signin);
