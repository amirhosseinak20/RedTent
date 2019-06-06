// Node Modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { FiLock } from "react-icons/fi";
import jwt from "jwt-simple";
import axios from "axios";
import { Redirect } from "react-router-dom";

// Constants
import { secretKey, users } from "../constants/API";

// Actions
import { user } from "../actions/index";

// components
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      user: {}
    };
    this.handleInput = this.handleInput.bind(this);
    this.register = this.register.bind(this);
  }

  async register(e) {
    e.preventDefault();
    const data = jwt.encode(this.state.user, secretKey);
    const {dispatch, cookies} = this.props;
    try {
      const registerRes = await axios.post(users, {data});
      if(registerRes.status === 200){
        const authKey = registerRes.data.token;
        const headers = {Authorization: authKey};
        const id = jwt.decode(authKey, secretKey).user_id;
        const userRes = await axios.get(`${users}${id}`, {headers});
        if(userRes.status === 200){
          const userStatus = {
            ...jwt.decode(userRes.data.data, secretKey),
            avatar: userRes.data.avatar,
            authKey 
          };          
          dispatch(user({...userStatus, isSignedIn: true}));
          cookies.set('user', userStatus, {path: '/'});
          this.setState({redirect: true});
        } else {
          throw new Error(userRes.data.error);
        }
      } else {
        console.log(registerRes);
        throw new Error(registerRes.data.error);
      }
    } catch(error) {
      this.setState({user: {}})
      alert(error);
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
          <div className="register-form-wrapper">
            <div className="logo"><FiLock className="lock-icon" /></div>
            <form className="form-wrapper" onSubmit={this.register}>
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
              <button type="submit">ثبت‌نام</button>
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
export default connect(mapStateToProps)(Register);
