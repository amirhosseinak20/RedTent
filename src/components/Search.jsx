// Node Modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import axios from "axios";

// Helpers
import { getUnique } from "../helpers/index";

// Constans
import * as API from "../constants/API";

// Components
// FIX this component
// connect it to API
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      openSearch: false,
      search: ""
    }
    this.fetchSearchRoot = this.fetchSearchRoot.bind(this);
    this.eachImage = this.eachImage.bind(this);
    this.openSearch = this.openSearch.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.search = this.search.bind(this);
  }

  async componentWillMount() {
    await this.fetchSearchRoot(10);
  }

  async fetchSearchRoot(n) {
    try {
      const params = {
        _from: 0,
        _row: n
      }
      const latest = await axios.get(API.latestDesigns, params);
      const popular = await axios.get(API.popularDesigns, params);
      const mostViewd = await axios.get(API.mostVisitedDesigns, params);
      if(latest.status === 500){
        throw new Error(latest.data.error);
      } else if(popular.status === 500) {
        throw new Error(popular.data.error);
      } else if(mostViewd.status === 500) {
        throw new Error(mostViewd.data.error);
      }
      const uniq = getUnique([...latest.data, ...popular.data, ...mostViewd.data]);
      this.setState({images: uniq});
    } catch (error) {
      alert(error);
    }
  }

  eachImage(image, i){
    return(
      <Link className="link" to={`/designs/${image.id}`}>
        <img
          src={`${API.media}${image.picture}`}
          alt={image.picture}
          key={i}
        />
      </Link>
    )
  }

  openSearch() {
    this.setState({openSearch: !this.state.openSearch});
  }

  handleInput(e, name) {
    this.setState({[name]: e.target.value});
  }

  async search(e) {
    e.preventDefault();
    try {
      const {search} = this.state;
      const params = {
        _tag: search,
        _from: 0,
        _row: 100
      };
      const searchResponse = await axios.get(API.designs, {params});
      console.log(searchResponse);
      if(searchResponse.status === 204){
        throw new Error("گشتم نبود، نگرد نیست!");
      }
      this.setState({images: searchResponse.data});
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  render() {
    const {images, openSearch} = this.state;
    const inputStyle = {
      width: openSearch ? 300 : 0,
      padding: openSearch ? 8 : 0
    };
    const searchStyle = {
      borderRadius: openSearch ? '50%' : 'initial',
      backgroundColor: openSearch ? 'rgba(0, 0, 0, 1)' : 'initial',
      color: openSearch ? '#ffffff' : 'initial',
      padding: openSearch ? 4 : 'initial',
      transform: openSearch ? 'rotate(360deg)' : 'initial',
    }
    return(
      <div className="search-wrapper">
        <div className="each-wrapper">
          {images.map(this.eachImage)}
        </div>
        <form className="search" onSubmit={this.search}>
          <FiSearch 
            style={searchStyle}
            className="button" 
            onClick={this.openSearch}
          />
          <input 
            style={inputStyle}
            type="search" 
            name="search" 
            id="search" 
            placeholder="جست‌و‌جو"
            onChange={e => this.handleInput(e, "search")}
          />
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(Search);
