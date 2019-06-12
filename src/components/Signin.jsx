// Node Modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { FiLock } from "react-icons/fi";
import jwt from "jwt-simple";
import axios from "axios";
import { Redirect } from "react-router-dom";

// Constants
import * as API from "../constants/API";

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
    const data = jwt.encode(this.state.user, API.secretKey);
    const {dispatch, cookies} = this.props;
    try {
      const signinRes = await axios.post(API.signin, {data});
      if(signinRes.status === 200){
        const authKey = signinRes.data.token;
        const headers = {Authorization: authKey};
        const decodedAuth = jwt.decode(authKey, API.secretKey);        
        const id = decodedAuth.user_id;
        const userRes = await axios.get(`${API.users}${id}`, {headers});
        if(userRes.status === 200){
          const userStatus = {
            ...jwt.decode(userRes.data.data, API.secretKey),
            avatar: `${API.media}${userRes.data.avatar}`,
            id: id,
            designerId: decodedAuth.designer_id,
            authKey
          };
          if(userStatus.avatar === API.media) {
            userStatus.avatar = avatar
          }
          dispatch(user({...userStatus, isSignedIn: true}));
          cookies.set('user', userStatus, {path: '/'});
          this.setState({redirect: true});
        } else {
          throw new Error('نام کاربری یا کلمه‌ی عبور اشتباه است.');
        }
      } else {
          throw new Error('نام کاربری یا کلمه‌ی عبور اشتباه است.');
      }
    } catch(error) {
      this.setState({user: {}})
      alert(error.message);
    }
  }

  handleInput(e, name) {
    this.setState({user: {...this.state.user, [name]: e.target.value}});
  }

  inputValue(name) {
    return this.state.user[name] === undefined ? '' : this.state.user[name]; 
  }

  render() {
    const {isSignedIn} = this.props.user;
    const {redirect} = this.state;
    if(redirect || isSignedIn){
      return <Redirect to="/feed" />;
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
                  placeholder="نام‌کاربری" 
                  onChange={e => this.handleInput(e, "username")}
                  value={this.inputValue("username")}
                />
              </div>
              <div className="password-wrapper">
                <input 
                  type="password" 
                  name="password"
                  placeholder="رمز‌عبور"
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
