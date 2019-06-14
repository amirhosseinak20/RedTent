// Node Modules
import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiPlus, FiHeart, FiDownload, FiMessageCircle } from "react-icons/fi";

// Constansts
import * as API from "../constants/API";
import { GiSewingNeedle } from "react-icons/gi";

// Components

class Design extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: {
        id: 0, 
        design_picture: "",
        rate: 0.0, 
        cId: 0, 
        uRate: 0
      },
      comment: false,
      designers: false
    };
    this.handler = this.handler.bind(this);
    this.comment = this.comment.bind(this);
  }
  async componentWillMount() {
    const {match, user} = this.props;
    const id = match.params.id
    this.setState({image: {id}});
    try {
      const designResponse = await axios.get(`${API.designs}${id}`);
      const headers = {Authorization: user.authKey};
      const designsCollection = await axios.get(API.designsCollection, {headers});
      const cId = designsCollection.data[0].id;
      const uRateResponse = await axios.get(
        `${API.designs}${id}/get_my_rate/`, 
        {headers}
      );
      const uRate = uRateResponse.data.rate;
      if(
        designResponse.status === 200 && 
        designsCollection.status === 200 && 
        uRateResponse.status === 200
      ){
        this.setState({
          image: {
            ...designResponse.data, 
            cId,
            uRate
          }
        });
      } else {
        throw new Error('طرح مورد نظر موجود نمی‌باشد!')
      }
    } catch (error) {
      alert(error);
    }
  }

  handler(someValue) {
    this.setState(someValue);
  }

  comment(e) {
    e.preventDefault();
    this.setState({comment: !this.state.comment});
  }

  render() {
    const {id, design_picture, rate, cId, uRate} = this.state.image;
    const {user} = this.props;
    return(
      <div className="design-wrapper">
        <Link className="image-wrapper" to={`/designs/${id}`}>
          <img src={`${API.media}${design_picture}`} alt={design_picture} />
        </Link>
        <Add2Collection 
          user={user} 
          dId={id} 
          dscId={cId}
        />
        <div className="function-buttons-wrapper">
          <Like 
            avg={rate} 
            rate={uRate} 
            id={id} 
            user={user}
            handler={this.handler}
          />
          <div className="nd-wrapper">
            <Download href={`${API.media}design_picture`}/>
            <div className="comment" onClick={this.comment}>
              <FiMessageCircle className="button"/>
            </div>
            <div className="needle">
              <GiSewingNeedle className="button"/>
            </div>
          </div>
        </div>
        {this.state.comment ? <commentContainer id={id} user={user}/> : null}
      </div>
    );
  }
}
class Add2Collection extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.add = this.add.bind(this);
  }
  add() {
    const {user, dId, dscId} = this.props;
    try {
      const headers = {Authorization: user.authKey};
      const body = {
        design_id: dId
      }
      axios.post(`${API.designsCollection}${dscId}/designs/`, body, {headers});
    } catch (error) {
      alert(error);
    }
  }
  render() {
    return(
      <div className="add-to-collection" onClick={this.add}>
        <FiPlus className="button"/>
      </div>
    );
  }
}
class Like extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.like = this.like.bind(this);
    this.eachHeart = this.eachHeart.bind(this);
  }

  async like(e, n) {
    e.preventDefault();
    const {id, user, handler} = this.props;
    try {
      const headers = {Authorization: user.authKey};
      const body = {
        rate: n
      }
      const like = await axios.post(
        `${API.designs}${id}/rates_for_design/`,
        body, 
        {headers}
      );
      this.setState({...like.data});
      handler({...this.state});
    } catch (error) {
      alert(error);
    }
  }

  eachHeart(i) {
    const {avg, rate} = this.props;
    let r, a, style;
    parseFloat(avg) === 0 ? a = false : a = true;
    style = {
      fill: a && i >= avg ? '#FFCCCC' : '#FFFFFF'
    }
    parseInt(rate) === 0 ? r = false : r = true;
    style = {
      fill: r && i <= rate ? 'red' : '#FFFFFF'
    }
    return (
      <FiHeart
        id={i}
        style={style}
        className="heart"
        onClick={e => this.like(e, i)}
      />
    );
  }

  render() {
    let {avg} = this.props;
    console.log(this.props);
    let hearts = [];
    for(let i = 1; i < 6; i++)
      hearts.push(this.eachHeart(i));
    return(
      <div className="like">
        {hearts}
        <span className="avg-rate">{parseFloat(avg).toFixed(2)}</span>
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
class commentContainer extends Component {
  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.submit = this.submit.bind(this);
    this.eachComment = this.eachComment.bind(this);
  }

  async componentWillMount() {
    
  }

  render() {
    const {comments} = this.state;
    return(
      <div className="comment">
        <input 
          type="text" 
          placeholder="نظر‌شما" 
          onChange={this.handleInput} 
          onEnter={this.submit}
        />
        {comments.map(this.eachComment)}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(Design);
