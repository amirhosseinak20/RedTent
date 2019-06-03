import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import {
  FiUser,
  FiLock,
  FiArrowRight
} from "react-icons/fi";
import jwt from "jwt-simple";
import axios from "axios";

// Actions
import { heightsOf, user } from "../actions/index";

// Constatnts
import * as API from "../constants/API";

class User extends Component {
  constructor(props){
    super(props);
    this.state = {
      render: "login",
      user: {}
    }
    this.renderLogin = this.renderLogin.bind(this);
    this.renderSignup = this.renderSignup.bind(this);
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.handleInput = this.handleInput.bind(this);

    this.renderAdmin = this.renderAdmin.bind(this);
    this.renderDesigner = this.renderDesigner.bind(this);
    this.renderUser = this.renderUser.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(heightsOf({dynamic: true}));            
    const pathname = this.props.cURL.split(/\//);
    if(pathname.length === 2 && this.props.user.isLoggedIn){
      return <Redirect to={`/users/${this.props.user.id}`}/>
    } else if(!this.props.user.isLoggedIn) {
      this.setState({render: "login"});
    } else if(pathname.length === 3 && this.props.user.kind === "admin"){
      this.setState({render: "admin"});
    } else if(pathname.length === 3 && this.props.user.kind === "designer"){
      this.setState({render: "designer"});
    } else if(pathname.length === 3 && this.props.user.kind === "user"){
      this.setState({render: "user"});
    }
  }

  componentWillUnmount() {
    this.props.dispatch(heightsOf({dynamic: false}));    
  }

  handleInput(e, name) {
    this.setState({empty: false, user: {...this.state.user, [name]: e.target.value}});
  }

  async login(e) {
    e.preventDefault();
    if(!this.props.user.isLoggedIn && this.state.render !== "login"){
      this.setState({render: "login", user: {}});
    } else if(this.state.render === "login" && !this.props.user.isLoggedIn){
      const body = {data: jwt.encode(this.state.user, API.secretKey)};
      try {
      const res = await axios.post(`${API.users}signin/`, body);
      if(res.status === 200){
        console.log("123");
        this.props.dispatch(user({...res.data, isLoggedIn: true}));
        const userId = jwt.decode(res.data.token, API.secretKey).user_id;
        console.log(userId);
        const resp = await axios.get(`${API.users}${userId}`)
        console.log(resp)
        this.setState({user: {}, render: resp.data.kind});
      }} catch(err) {
        alert(err.response.data.error);
        this.setState({user: {}});
      } 
    } 
  }

  renderLogin() {
    return(
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 p-t-190 p-b-30">
            <form className="login100-form validate-form" onSubmit={this.login}>
              <div className="wrap-input100 validate-input m-b-10"
                   data-validate="Username is required">
                <input className="input100" 
                        type="text"
                        name="username" 
                        placeholder="Username"
                        value={this.state.user.username === undefined ? "" : this.state.user.username}
                        onChange={(e) => this.handleInput(e, "username")}/>
                <span className="focus-input100"></span>
                <span className="symbol-input100"><FiUser /></span>
              </div>
              <div className="wrap-input100 validate-input m-b-10"
                   data-validate="Password is required">
                <input className="input100" 
                       type="password"
                       name="pass" 
                       placeholder="Password"
                       value={this.state.user.password === undefined ? "" : this.state.user.password}
                       onChange={(e) => this.handleInput(e, "password")}/>                 
                <span className="focus-input100"></span>
                <span className="symbol-input100"><FiLock/></span>
                </div>
              <div className="container-login100-form-btn p-t-10">
                <button className="login100-form-btn">Login </button>
              </div>
              <div className="text-center w-full p-t-25 p-b-230">
                {/* <a href="/#" className="txt1">Forgot Username / Password? </a> */}
              </div>
              <div className="text-center w-full">
                <a className="txt1" 
                   href="#signup"
                   onClick={this.signup}>
                  Create new account <FiArrowRight />
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  async signup(e) {
    e.preventDefault();
    if(!this.props.user.isLoggedIn && this.state.render !== "signup"){
      this.setState({render: "signup", user: {}});
    } else if(this.state.render === "signup" && !this.props.user.isLoggedIn){
      const body = {data: jwt.encode(this.state.user, API.secretKey)};
      const res = await axios.post(`${API.users}`, body);
      if(res.status === 200) {
        this.props.dispatch(user({...res.data, isLoggedIn: true}));
      } else if(res.status === 201) {
        alert(res.data.error);
        this.setState({render: "login", user: {}});
      }
    }
  }

  renderSignup() {
    return(
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 p-t-190 p-b-30">
            <form className="login100-form validate-form" onSubmit={this.signup}>
              <div className="wrap-input100 validate-input m-b-10"
                   data-validate="Username is required">
                <input className="input100" 
                        type="text"
                        name="username" 
                        placeholder="Username"
                        value={this.state.user.username === undefined ? "" : this.state.user.username}
                        onChange={(e) => this.handleInput(e, "username")}/>
                <span className="focus-input100"></span>
                <span className="symbol-input100"><FiUser /></span>
              </div>
              <div className="wrap-input100 validate-input m-b-10"
                   data-validate="Password is required">
                <input className="input100" 
                       type="password"
                       name="pass" 
                       placeholder="Password"
                       value={this.state.user.password === undefined ? "" : this.state.user.password}
                       onChange={(e) => this.handleInput(e, "password")}/>
                <span className="focus-input100"></span>
                <span className="symbol-input100"><FiLock/></span>
                </div>
              <div className="container-login100-form-btn p-t-10">
                <button className="login100-form-btn">Signup </button>
              </div>
              <div className="text-center w-full p-t-25 p-b-230">
              </div>
              <div className="text-center w-full">
                <a className="txt1" 
                   href="#signup"
                   onClick={this.login}>
                  Have an account <FiArrowRight />
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  renderAdmin(){

  }

  renderDesigner(){

  }

  renderUser(){

  }

  render() {
    switch(this.state.render){
      case "login":
        return this.renderLogin();
      case "signup":
        return this.renderSignup();
      case "admin":
        return this.renderAdmin();
      case "designer":
        return this.renderDesigner();
      default:
        return this.renderLogin();
    };
  }
}

const mapStateToProps = state => {
  return {
    cURL: state.router.location.pathname,
    user: state.user
  };
} 
export default connect(mapStateToProps)(User);