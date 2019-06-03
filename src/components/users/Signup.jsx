// Modules
import React, { Component } from "react";
import { connect } from "react-redux";
import jwt from "jwt-simple";
import { Redirect } from "react-router-dom";
import { 
  FiArrowRight,
  FiUser,
  FiLock
} from "react-icons/fi";
import axios from "axios";

// Constants
import { secretKey, users } from "../../constants/API";

// Actions
import { user } from "../../actions/index";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      user: {}
    }
    this.login = this.login.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.signup = this.signup.bind(this);
  }

  componentWillMount() {
    const { isLoggedIn } = this.props.user;
    if(isLoggedIn){
      const { authToken } = this.props.user;
      const id = jwt.decode(authToken, secretKey).user_id;
      this.setState({redirect: true, redirectURL: `/users/${id}`});
     } else {
      this.setState({redirect: false});
    }
  }

  async signup(e) {
    e.preventDefault();
    const body = {data: jwt.encode(this.state.user, secretKey)}; 
    try {
      const signupResponse = await axios.post(users, body);
      if(signupResponse.status === 200) {
        const authToken = signupResponse.data.token
        this.props.dispatch(user({authToken: authToken, isLoggedIn: true}));
        this.props.cookies.set('authToken', authToken, { path: '/' });
        const id = jwt.decode(authToken, secretKey).user_id;
        this.setState({redirect: true, redirectURL: `/users/${id}`})
      } else {
        throw new Error(signupResponse);
      }
    } catch(error) {
      const message = error.response.data.error;
      alert(message);
    }
  }

  handleInput(e, name) {
    this.setState({user: {...this.state.user, [name]: e.target.value}});
  }

  login(e) {
    e.preventDefault();
    this.setState({redirect: true, redirectURL: `/users/login`});
  }

  render() {
    const { redirect, redirectURL } = this.state;
    if(redirect) {
      return <Redirect to={redirectURL} />;
    } else {
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
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(Signup);
