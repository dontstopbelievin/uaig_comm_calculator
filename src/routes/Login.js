import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Login extends Component {
  constructor(props) {
    super(props);
    //console.log(props)

    this.state = {
      username: "", 
      pwd: ""
    }

    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPwdChange = this.onPwdChange.bind(this);
    this.login = this.login.bind(this);
    this.onUpdateLogStatus = this.onUpdateLogStatus.bind(this);
    this.onUpdateUsername = this.onUpdateUsername.bind(this);
  }

  onUsernameChange(e) {
    this.setState({username: e.target.value});
  }
  onPwdChange(e) {
    this.setState({pwd: e.target.value});
  }

  onUpdateLogStatus(status) {
    sessionStorage.setItem('logStatus', status);
    // window.updateLogStatus(status);
  }

  onUpdateUsername(name) {
    sessionStorage.setItem('userName', name);
    // window.updateUsername(name);
  }

  //user login function
  login(e) {
    e.preventDefault();
    console.log("login function started");
    var tokenKey = "tokenInfo";
    var userNameKey = "userName";
    var userRoleKey = "userRole";
    var logStatusKey = "logStatus";
    var username = this.state.username.trim();
    var pwd = this.state.pwd.trim();
    var params = 'grant_type=password&username=' + username + '&password='+ pwd;
      
    //========================================
    /*var loginData = {
      grant_type: 'password',
      user_name: username,
      password: pwd
    };*/
    //var data = JSON.stringify(loginData);
    //========================================
    
    //========================================
    /*var fData = new FormData();
    fData.append('grant_type', 'password');
    fData.append('username', username);
    fData.append('password', pwd);*/
    //========================================

    if (!username || !pwd) {
      return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "Token", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.onload = function(e) {
      var loading = document.getElementById('loginModal');
      loading.style.cssText = 'position: relative; z-index: -1; -webkit-filter: blur(5px); -moz-filter: blur(5px); -o-filter: blur(5px); -ms-filter: blur(5px); filter: blur(5px);';

      if (xhr.status === 200) {
        console.log("success"); //console.log(e.target.response);
        // сохраняем в хранилище sessionStorage токен доступа
        sessionStorage.setItem(tokenKey, JSON.parse(e.target.response).access_token);
        sessionStorage.setItem(userNameKey, JSON.parse(e.target.response).userName);
        sessionStorage.setItem(userRoleKey, JSON.parse(e.target.response).role);
        sessionStorage.setItem(logStatusKey, true);
        if(JSON.parse(e.target.response).role === "Urban") {
          this.onUpdateLogStatus(true);
          this.onUpdateUsername(JSON.parse(e.target.response).userName);
          console.log(JSON.parse(e.target.response).userName);
          this.props.history.push('/urban');
        } else if(JSON.parse(e.target.response).role === "Temporary"){
          this.onUpdateLogStatus(true);
          this.onUpdateUsername(JSON.parse(e.target.response).userName);
          console.log(JSON.parse(e.target.response).userName);
          this.props.history.push('/temporary');
        } else if(JSON.parse(e.target.response).role === "Citizen"){
          this.onUpdateLogStatus(true);
          this.onUpdateUsername(JSON.parse(e.target.response).userName);
          console.log(JSON.parse(e.target.response).userName);
          this.props.history.push('/citizen');
        } else if(JSON.parse(e.target.response).role === "Provider"){
          this.onUpdateLogStatus(true);
          this.onUpdateUsername(JSON.parse(e.target.response).userName);
          console.log(JSON.parse(e.target.response).userName);
          this.props.history.push('/provider');
        } else if(JSON.parse(e.target.response).role === "Admin"){
          this.onUpdateLogStatus(true);
          this.onUpdateUsername(JSON.parse(e.target.response).userName);
          console.log(JSON.parse(e.target.response).userName);
          this.props.history.push('/admin');
        }
      } else if(xhr.status === 400) {
        alert("The user name or password is incorrect.");
        loading.style.cssText = '';
      }
        }.bind(this);
        xhr.send(params);
  }

  componentWillMount() {
    //console.log("LoginComponent will mount");
    if(sessionStorage.getItem('tokenInfo')){
      var userRole = sessionStorage.getItem('userRole');
      this.props.history.replace('/' + userRole);
    }
  }

  componentDidMount() {
    //console.log("LoginComponent did mount");
  }

  componentWillUnmount() {
    //console.log("LoginComponent will unmount");
  }

  render() {
    // console.log(window.checkToken);
    //console.log("rendering the LoginComponent");
    return (
      <div>
        <div id="loginModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <Link to="/">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </Link>
                <h4 className="modal-title" id="myModalLabel">Вход в систему</h4>
              </div>
              <div className="modal-body">
                <form id="loginForm" onSubmit={this.login}>
                  <div className="form-group">
                    <label className="control-label">Логин:</label>
                    <input type="text" className="form-control" value={this.state.username} onChange={this.onUsernameChange} required />
                  </div>
                  <div className="form-group">
                    <label className="control-label">Пароль:</label>
                    <input type="password" className="form-control" value={this.state.pwd} onChange={this.onPwdChange} required />
                  </div>
                  <div className="modal-footer">
                    <input type="submit" className="btn btn-primary" value="Войти" />
                    <Link to="/" style={{marginRight:'5px'}}>
                      <button type="button" className="btn btn-default" data-dismiss="modal">Закрыть</button>
                    </Link>
                  </div>
                </form>
              </div>
              
              
            </div>
          </div>
        </div>
      </div>
    )
  }
}