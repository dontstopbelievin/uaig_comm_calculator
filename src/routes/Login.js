import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PreloaderIcon, {ICON_TYPE} from 'react-preloader-icon';

export default class Login extends Component {
  constructor(props) {
    super(props);
    //console.log(props)

    this.state = {
      username: "", 
      pwd: "",
      loadingVisible: false
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
  }

  onUpdateUsername(name) {
    sessionStorage.setItem('userName', name);
  }

  //user login function
  login(e) {
    e.preventDefault();
    console.log("login function started");
    var tokenKey = "tokenInfo";
    var userNameKey = "userName";
    var userRoleKey = "userRoles";
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
    else {
      this.setState({loadingVisible: true});
      
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "Token", true);
      //Send the proper header information along with the request
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
      xhr.onload = function(e) {
        if (xhr.status === 200) {
          this.setState({loadingVisible: false});
          console.log("success");
          //console.log(e.target.response);
          var roles = [JSON.parse(e.target.response).role1];
          if(JSON.parse(e.target.response).role2)
            roles.push(JSON.parse(e.target.response).role2);
          if(JSON.parse(e.target.response).role3)
            roles.push(JSON.parse(e.target.response).role3);
          // сохраняем в хранилище sessionStorage токен доступа
          sessionStorage.setItem(tokenKey, JSON.parse(e.target.response).access_token);
          sessionStorage.setItem(userNameKey, JSON.parse(e.target.response).userName);
          sessionStorage.setItem(userRoleKey, JSON.stringify(roles));
          sessionStorage.setItem(logStatusKey, true);
          this.props.history.push('/');
        } 
        else if(xhr.status === 400) {
          this.setState({loadingVisible: false});
          alert("The user name or password is incorrect.");
        }
      }.bind(this);
      xhr.send(params);
    }
  }

  componentWillMount() {
    //console.log("LoginComponent will mount");
    if(sessionStorage.getItem('tokenInfo')){
      var userRole = JSON.parse(sessionStorage.getItem('userRoles'))[0];
      this.props.history.replace('/' + userRole);
    }else {
      this.props.history.replace('/login');
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
            <div id="loading">
              {
                this.state.loadingVisible
                  ? <Loading />
                  : <div></div>
              }
            </div>
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

class Loading extends Component {
  render() {
    return (
      <PreloaderIcon type={ICON_TYPE.OVAL} size={32} strokeWidth={8} strokeColor="#135ead" duration={800} />
      )
  }
}