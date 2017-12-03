import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PreloaderIcon, {ICON_TYPE} from 'react-preloader-icon';

export default class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "", 
      email: "", 
      pwd: "", 
      confirmPwd: "",
      loadingVisible: false
    }

    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPwdChange = this.onPwdChange.bind(this);
    this.onConfirmPwdChange = this.onConfirmPwdChange.bind(this);
    this.register = this.register.bind(this);
  }

  onUsernameChange(e) {
    this.setState({username: e.target.value});
  }
  
  onEmailChange(e) {
    this.setState({email: e.target.value});
  }

  onPwdChange(e) {
    this.setState({pwd: e.target.value});
  }

  onConfirmPwdChange(e) {
    this.setState({confirmPwd: e.target.value});
  }

  //use register function
  register() {
    console.log("register function started");
    var username = this.state.username.trim();
    var email = this.state.email.trim();
    var pwd = this.state.pwd.trim();
    var confirmPwd = this.state.confirmPwd.trim();

    var registerData = {
      UserName: username,
      Email: email,
      Password: pwd,
      ConfirmPassword: confirmPwd
    };

    var data = JSON.stringify(registerData);

    if (!username || !email || !pwd || !confirmPwd) {
      return;
    }

    this.setState({loadingVisible: true});
    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/Account/Register", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        alert("Вы успешно зарегистрировались!\n Можете войти через созданный аккаунт!");
        this.setState({loadingVisible: false});
      }else {
        console.log(xhr.response);
        this.setState({loadingVisible: false}); 
        //alert("Ошибка " + xhr.status + ': ' + xhr.statusText);
      }
    }.bind(this);
    //console.log(data);
    xhr.send(data);
  }

  componentWillMount() {
    //console.log("RegisterComponent will mount");
    if(sessionStorage.getItem('tokenInfo')){
      var userRole = JSON.parse(sessionStorage.getItem('userRoles'))[0];
      this.props.history.replace('/' + userRole);
    }else {
      this.props.history.replace('/register');
    }
  }

  componentDidMount() {
    //console.log("RegisterComponent did mount");
  }

  componentWillUnmount() {
    //console.log("RegisterComponent will unmount");
  }

  render() {
    //console.log("rendering the RegisterComponent");
    return (
      <div>
        <div className="" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
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
                <h4 className="modal-title" id="myModalLabel">Регистрация</h4>
              </div>
              <div className="modal-body">
                <form id="registerForm" onSubmit={this.register}>
                  <div className="form-group">
                    <label htmlFor="UserName" className="control-label">Логин:</label>
                    <input type="text" className="form-control" required value={this.state.username} onChange={this.onUsernameChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="Email" className="control-label">Почта:</label>
                    <input type="email" className="form-control" required value={this.state.email} onChange={this.onEmailChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="Pwd" className="control-label">Пароль:</label>
                    <input type="password" className="form-control" required value={this.state.pwd} onChange={this.onPwdChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ConfirmPwd" className="control-label">Подтвердите Пароль:</label>
                    <input type="password" className="form-control" required value={this.state.confirmPwd} onChange={this.onConfirmPwdChange} />
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">Регистрация</button>
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