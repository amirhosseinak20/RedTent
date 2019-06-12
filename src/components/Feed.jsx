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
    await this.fetchFeed(10);
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
        console.log(designsCollection);
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
      const image = {
        id: design.data.id,
        src: `${API.media}${design.data.design_picture}`,
        avg: design.data.rate,
        rate: userDeisgnRate.data
      }
      this.setState({...image});
    } catch (error) {
      alert(error);
    }
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
        <Add2Collection user={user} dId={id} dscId={designsCollection[0].id}/>
        <div className="function-buttons-wrapper">
          <Like avg={avg} rate={rate}/>
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
  render() {
    const {avg} = this.props;
    return(
      <div className="like">
        <FiHeart className="heart" />
        <FiHeart className="heart" />
        <FiHeart className="heart" />
        <FiHeart className="heart" />
        <FiHeart className="heart" />
        <span className="avg-rate">{parseFloat(avg)}</span>
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
