import React from 'react';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import Loader from 'react-loader-spinner';
import NavBar from './Navbar.js';
let e = new LocalizedStrings({ru,kk});

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.state = {
      rolename: "",
      showBottomNavbar: false,
      loaderHidden: true,
      searchText: ""
    };

    this.checkToken = this.checkToken.bind(this);
    this.logout = this.logout.bind(this);
    this.toggleBottomNavbar = this.toggleBottomNavbar.bind(this);
    this.handler = this.handler.bind(this);
    this.search = this.search.bind(this);
    // this.loaderHidden = this.loaderHidden.bind(this);
  }

  logout() {
    this.setState({ loaderHidden: false });
    var token = sessionStorage.getItem('tokenInfo');
    //console.log(token);
    if (token)
    {
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/logout", true);
      //Send the proper header information along with the request
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

      xhr.onload = function () {
        if (xhr.status === 200) {
          sessionStorage.clear();
          this.props.history.replace('/');
          console.log("loggedOut");
        }
        else if(xhr.status === 401){
          sessionStorage.clear();
          this.props.history.replace("/");
        }

        this.setState({ loaderHidden: true });
      }.bind(this);
      xhr.send();
    }
  }

  search(e) {
    e.preventDefault();

    var query = document.getElementById('search_field');
    this.props.history.push('/search/' + query.value);
  }

  updateLanguage(name){
    localStorage.setItem('lang', name);
    window.location.reload();
    // this.props.history.replace('/');
  }

  checkToken() {
    console.log("checkToken function started");
    var token = sessionStorage.getItem('tokenInfo');
    //var name = sessionStorage.getItem('userName');
    //var logstatus = sessionStorage.getItem('logStatus');
    if(token){
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/user_info", true);
      //Send the proper header information along with the request
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function(e) {
        if (xhr.status === 200) {
          console.log("valid token");
          // this.updateLogStatus(logstatus);
          // this.updateUsername(name);
        }else {
          console.log("invalid token");
          sessionStorage.clear();
          this.props.history.replace('/');
          //alert("Your token is invalid please refresh the page.");
        }
      }.bind(this);
      xhr.send();
    }
  }

  toggleBottomNavbar() {
    this.setState({showBottomNavbar: !this.state.showBottomNavbar});
  }

  componentWillMount() {
    //console.log("Header will mount");
    this.checkToken();
  }

  componentDidMount() {
    //console.log("Header did mount");
  }

  handler () {
    if(this.state.loaderHidden){
        this.setState({
        loaderHidden: false
      })
    }else{
        this.setState({
        loaderHidden: true
      })
    }
  }

  componentWillUnmount() {
    //console.log("Header will unmount");
  }

  render() {
    var panelTrue;
      panelTrue = true;
      return (
        <div style={{position: 'relative'}}>
          {!this.state.loaderHidden &&
          <div className="bigLoaderDiv">
            <div className="loaderDiv" style={{textAlign: 'center'}}>
              <Loader type="Oval" color="#46B3F2" height="200" width="200"/>
            </div>
          </div>
          }
          {this.state.loaderHidden &&
          <NavBar pathName={this.props.location.pathname} logout={this.logout.bind(this)} panelTrue={panelTrue} />
          }
        </div>
      );
  }
}
