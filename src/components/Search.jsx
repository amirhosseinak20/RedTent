// Node Modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

// Images
import test from "../assets/images/test.jpg";

// Components
// FIX this component
// connect it to API
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      openSearch: false
    }
    this.eachImage = this.eachImage.bind(this);
    this.openSearch = this.openSearch.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.search = this.search.bind(this);
  }

  eachImage(image, i){
    return(
      <Link className="link" to={`/designs/${image.id}`}>
        <img
          src={image.src}
          alt={image.alt}
          key={image.id}
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

  search(e) {
    e.preventDefault();
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
