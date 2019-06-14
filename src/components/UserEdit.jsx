// Node Modules
import React, { Component } from "react";
import { connect } from "react-redux";
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
class UserEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      user: {},
      avatarImage: avatar
    };
    this.register = this.register.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.inputValue = this.inputValue.bind(this);
    this.convert = this.convert.bind(this);
  }

  componentWillMount() {
    const {user} = this.props;
    this.setState({user: {...user, firstname: user.first_name, lastname: user.last_name}});
  }

  async register(e) {
    e.preventDefault();
    const {avatarFile} = this.state;
    const body = new FormData();
    body.append('data', jwt.encode(this.state.user, API.secretKey));
    if(avatarFile !== undefined) {
      body.append('avatar', avatarFile);
    }
    const {dispatch, cookies} = this.props;
    try {
      const headers = {Authorization: user.authKey};
      const registerRes = await axios.put(API.users, body, headers);
      if(registerRes.status === 200){
        const authKey = registerRes.data.token;
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
          throw new Error(userRes.data.error);
        }
      } else {
        throw new Error("کاربر در سیستم وجود دارد.");
      }
    } catch(error) {
      this.setState({user: {}})
      alert(error.message);
    }
  }

  uploadAvatar(e) {
    this.setState({avatarFile: e.target.files[0]});
    const reader = new FileReader();
    reader.onload = event => {
      this.setState({avatarImage: event.target.result});
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  handleInput(e, name) {
    this.setState({user: {...this.state.user, [name]: e.target.value}});
  }

  inputValue(name) {
    return this.state.user[name] === undefined ? '' : this.state.user[name]; 
  }

  async convert(e) {
    e.preventDefault();
    try {
      const {user} = this.props;
      const inUser = this.state.user;
      let newUser = {...user, ...inUser, kind: "designer"};
      const encodedNewUser = jwt.encode(newUser, API.secretKey);
      const body = new FormData();
      body.append('data', encodedNewUser);
      const {avatarFile} = this.state;
      if(avatarFile !== undefined) {
        body.append('avatar', avatarFile);
      } else {
        body.append('avatar', "");
      }
      const headers = {Authorization: newUser.authKey};      
      const userUpdate = await axios.put(`${API.users}${newUser.id}`, body, {headers});
      if(userUpdate.status === 200){
        headers.Authorization = userUpdate.data.token;
        newUser = await axios.get(`${API.users}${newUser.id}`, headers);
        console.log()
        this.setState({redirect: true});
      } else {
        throw new Error("اطلاعات را درست وارد کنید.");
      }
    } catch (error) {
      alert(error);   
    }
  }

  render() {
    const {isSignedIn} = this.props.user;
    const {redirect} = this.state;
    const {user} = this.props;
    if(redirect || !isSignedIn){
      return <Redirect to={`/users/${user.id}`} />;
    } else {
      return(
        <div className="full-width-form-wrapper">
          <div className="register-form-wrapper">
            <div className="avatar">
              <img 
                className="avatar-img"
                src={this.state.avatarImage} 
                alt="avatar"
                onClick={() => this.inputFileElement.click()}
              />
              <input 
                type="file" 
                ref={input => this.inputFileElement = input}
                onChange={this.uploadAvatar}
                style={{display: "none"}} 
              />
            </div>
            <form className="form-wrapper" onSubmit={this.register}>
              <div className="username-wrapper">
                <input 
                  type="text" 
                  name="username" 
                  placeholder="نام‌کاربری" 
                  onChange={e => this.handleInput(e, "username")}
                  value={this.inputValue("username")}
                />
              </div>
              <div className="firstname-wrapper">
                <input 
                  type="text" 
                  name="firstname" 
                  placeholder="نام" 
                  onChange={e => this.handleInput(e, "firstname")}
                  value={this.inputValue("firstname")}
                />
              </div>
              <div className="lastname-wrapper">
                <input 
                  type="text" 
                  name="username" 
                  placeholder="نام‌خانوادگی" 
                  onChange={e => this.handleInput(e, "lastname")}
                  value={this.inputValue("lastname")}
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
              <button type="submit">ویرایش</button>
            </form>
            <button className="convert" type="submit" onClick={this.convert}>من طراح هستم!</button>
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
export default connect(mapStateToProps)(UserEdit);
