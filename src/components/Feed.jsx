// Node Modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { FiShare, FiPlus, FiHeart, FiDownload } from "react-icons/fi";
import { Link, Redirect } from "react-router-dom";
import { GiSewingNeedle } from "react-icons/gi";
import axios from "axios";

// Helpers
import { getUnique, shuffle } from "../helpers/index";

// Actions
// import * as action from "../actions/index";

// Constants
import * as API from "../constants/API";

// Images

// Components
class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      redirect: false,
      fetched: false
    };
    this.eachImage = this.eachImage.bind(this);
    this.fetchFeed = this.fetchFeed.bind(this);
  }

  // Fetch Images from Server and fix variables
  async componentWillMount() {
    await this.fetchFeed(100);
  }

  async fetchFeed(n) {
    const {user} = this.props;
    if(user.isSignedIn) {
      try {
        const params = {
          _from: 0,
          _row: n
        }
        const headers = {Authorization: user.authKey};
        const latest = await axios.get(API.latestDesigns, {params});
        const popular = await axios.get(API.popularDesigns, {params});
        const mostViewd = await axios.get(API.mostVisitedDesigns, {params});
        const userFavs = await axios.get(
          `${API.users}${user.id}/favorites`, 
          {params, headers}
        );
        const designsCollection = await axios.get(API.designsCollection, {headers});
        this.setState({designsCollection: designsCollection.data});
        if(latest.status === 500){
          throw new Error(latest.data.error);
        } else if(popular.status === 500) {
          throw new Error(popular.data.error);
        } else if(mostViewd.status === 500) {
          throw new Error(mostViewd.data.error);
        }
        const uniq = getUnique([
          ...latest.data,
          ...popular.data, 
          ...mostViewd.data,
          ...userFavs.data
        ]);
        this.setState({images: shuffle(uniq)});
      } catch (error) {
        alert(error);
      }
    }
  }

  eachImage(image, i) {
    const {user} = this.props;
    const {designsCollection} = this.state;
    return (
      <Image 
        id={image.id} 
        user={user} 
        key={image.id} 
        designsCollection={designsCollection}
      />
    );
  }
  
  render() {
    const {images, redirect} = this.state;
    const {user} = this.props;
    if(redirect || !user.isSignedIn) {
      return <Redirect to="/users/signin" />
    } else {
      return(
        <div className="feed-wrapper">
          {images.map(this.eachImage)}
        </div>
      );
    }
  }
}

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.handler = this.handler.bind(this);
  }

  async componentWillMount() {
    try {
      const {user, id} = this.props;
      const headers = {Authorization: user.authKey};      
      const design = await axios.get(`${API.designs}${id}`, {headers});
      const userDeisgnRate = await axios.get(
        `${API.designs}${id}/get_my_rate/`, 
        {headers}
      );
      let image = {
        id: design.data.id,
        src: `${API.media}${design.data.design_picture}`,
        avg: design.data.rate,
        rate: userDeisgnRate.data
      }
      image = {
        ...image,
        rate: image.rate.rate
      }
      this.setState({...image});
    } catch (error) {
      alert(error);
    }
  }

  handler(someValue) {
    this.setState(someValue);
  }

  render() {
    const {user, designsCollection} = this.props;
    const {id, src, avg, rate} = this.state;
    return(
      <div className="each-wrapper">
        <Link className="image-wrapper" to={`/designs/${id}`}>
          <img src={src} alt={src} />
        </Link>
        <Share href={src}/>
        <Add2Collection 
          user={user} 
          dId={id} 
          dscId={designsCollection[0].id}
        />
        <div className="function-buttons-wrapper">
          <Like 
            avg={avg} 
            rate={rate} 
            id={id} 
            user={user}
            handler={this.handler}
          />
          <div className="nd-wrapper">
            <Download href={src}/>
            {user.kind === "designer" ? <Needle /> : null}
          </div>
        </div>
      </div>
    );
  }
}
// FIX this component
// create circular menu
function Share({href}) {
  return(
    <div className="share-wrapper" style={{display: 'none'}}>
      <FiShare />
      <div className="share-menu">

      </div>
    </div>
  );
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

// FIX this component
// add functionality
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

// FIX this component
// add functionality
function Needle() {
  return(
    <div className="needle">
      <GiSewingNeedle className="button"/>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(Feed);
