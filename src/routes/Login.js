import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PreloaderIcon, {ICON_TYPE} from 'react-preloader-icon';
import $ from 'jquery';

var webSocket = new WebSocket('wss://127.0.0.1:13579/');
var heartbeat_msg = '--heartbeat--';
var heartbeat_interval = null;
var missed_heartbeats = 0;
var missed_heartbeats_limit_min = 3;
var missed_heartbeats_limit_max = 50;
var missed_heartbeats_limit = missed_heartbeats_limit_min;
var callback = null;
//var rw = null;
var storageAlias ="PKCS12";

webSocket.onopen = function (event) {
  if (heartbeat_interval === null) {
    missed_heartbeats = 0;
    heartbeat_interval = setInterval(pingLayer, 2000);
  }
  console.log("Connection opened");
};

webSocket.onclose = function (event) {
  if (event.wasClean) {
    console.log('connection has been closed');
  } 
  else {
    console.log('Connection error');
    openDialog();
  }
  console.log('Code: ' + event.code + ' Reason: ' + event.reason);
};

webSocket.onmessage = function (event) {
  if (event.data === heartbeat_msg) {
    missed_heartbeats = 0;
    return;
  }

  var result = JSON.parse(event.data);

  if (result != null) {
    var rw = {
      result: result['result'],
      secondResult: result['secondResult'],
      errorCode: result['errorCode'],
      getResult: function () {
        return this.result;
      },
      getSecondResult: function () {
        return this.secondResult;
      },
      getErrorCode: function () {
        return this.errorCode;
      }
    };
    
    switch (callback) {
      case 'chooseStoragePathBack':
        chooseStoragePathBack(rw);
        break;

      case 'loadKeysBack':
        loadKeysBack(rw);
        break;

      case 'signXmlBack':
        signXmlBack(rw);
        break;
      default:
        break;
    }
  }
  //console.log(event);
  setMissedHeartbeatsLimitToMin();
};

function setMissedHeartbeatsLimitToMax() {
  missed_heartbeats_limit = missed_heartbeats_limit_max;
}

function setMissedHeartbeatsLimitToMin() {
  missed_heartbeats_limit = missed_heartbeats_limit_min;
}

function pingLayer() {
  //console.log("pinging...");
  try {
    missed_heartbeats++;
    if (missed_heartbeats >= missed_heartbeats_limit)
        throw new Error("Too many missed heartbeats.");
    webSocket.send(heartbeat_msg);
  } catch (e) {
    clearInterval(heartbeat_interval);
    heartbeat_interval = null;
    console.warn("Closing connection. Reason: " + e.message);
    webSocket.close();
  }
}

function getKeys(storageName, storagePath, password, type, callBack) {
  var getKeys = {
      "method": "getKeys",
      "args": [storageName, storagePath, password, type]
  };
  callback = callBack;
  setMissedHeartbeatsLimitToMax();
  webSocket.send(JSON.stringify(getKeys));
}

function getTokenXml(alias) {
  let storagePath = $('#storagePath').val();
  let password = $('#inpPassword').val();
  $.get(window.url + 'api/Account/GetTokenXml', function (tokenXml) {
      if (storagePath !== null && storagePath !== "" && storageAlias !== null && storageAlias !== "") {
        if (password !== null && password !== "") {
          if (alias !== null && alias !== "") {
            if (tokenXml !== null && tokenXml !== "") {
              // console.log(tokenXml);
              signXml(storageAlias, storagePath, alias, password, tokenXml, "signXmlBack");
            }
            else {
              alert("Нет данных для подписания!");
            }
          }
          else {
            alert("Вы не выбрали ключ!");
          }
        }
        else {
          alert("Введите пароль к хранилищу");
        }
      } 
      else {
        alert("Не выбран хранилище!");
      }
  });
}

function signXml(storageName, storagePath, alias, password, xmlToSign, callBack) {
  // xmlToSign
  var signXml = {
      "method": "signXml",
      "args": [storageName, storagePath, alias, password, xmlToSign]
  };
  //console.log(signXml);
  callback = callBack;
  setMissedHeartbeatsLimitToMax();
  webSocket.send(JSON.stringify(signXml));
}

function signXmlBack(result) {
  
  if (result['errorCode'] === "NONE") {
    let signedXml = result.result;
    var data = { XmlDoc: signedXml }
    $.ajax({
        url: window.url + 'api/Account/LoginCert',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        success: function (response) {
           // var commonName = response.commonName;
           // var commonNameValues = commonName.split("?");
           // you will get response from your php page (what you echo or print)  
            window.result = response;
            $('#userName').val(response.IIN);
            //$('#firstName').val(response.firstName);
            //$('#lastName').val(response.lastName);
            //$('#middleName').val(response.middleName);
            alert(response.firstName + ", ЭЦП успешно загружен! Заполните остальные поля.");
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(textStatus, errorThrown);
        }
    });

    // $.post(window.url + 'api/Account/LoginCert', {
    //     xml: signedXml
    // }, function (data) {
    //     alert('RESULT: ' + data);
    // });
  }
  else {
    if (result['errorCode'] === "WRONG_PASSWORD" && result['result'] > -1) {
        alert("Неправильный пароль! Количество оставшихся попыток: " + result['result']);
    } else if (result['errorCode'] === "WRONG_PASSWORD") {
        alert("Неправильный пароль!");
    } else {
        alert(result['errorCode']);
        console.log('ошибка');
    }
  }
}

function loadKeysBack(result) {
  let alias = "";
  if (result && result.result) {
    let arr = result.result.split('|');
    alias = arr[3];
  } else {
    alert('Неверный ключ')
  }
  getTokenXml(alias);
}

function chooseStoragePathBack(rw) {
  if (rw.getErrorCode() === "NONE") {
    var storagePath = rw.getResult();
    if (storagePath !== null && storagePath !== "") {
      $('#storagePath').val(storagePath);
    }
    else {
      $("#storagePath").val("");
    }
  } 
  else {
    $("#storagePath").val("");
  }
}

function openDialog() {
  //if (window.confirm("Ошибка при подключений к прослойке. Убедитесь что программа запущена и нажмите ОК") === true) {
  //  window.location.reload();
  //}
}

export default class Login extends Component {
  constructor(props) {
    super(props);
    //console.log(props)

    this.state = {
      username: "", 
      pwd: "",
      loadingVisible: false,
      storageAlias: "PKCS12"
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
          if(roles[0] === 'Urban'){
            this.props.history.push('/urbanreport');
          }
          else{
            this.props.history.push('/');
          }
        } 
        else if(xhr.status === 400) {
          this.setState({loadingVisible: false});
          alert("Вы ввели неверный логин и/или пароль.");
        }
      }.bind(this);
      xhr.send(params);
    }
  }

  btnChooseFile() {
    var browseKeyStore = {
      "method": "browseKeyStore",
      "args": [this.state.storageAlias, "P12", '']
    };
    callback = "chooseStoragePathBack";
    //TODO: CHECK CONNECTION
    setMissedHeartbeatsLimitToMax();
    webSocket.send(JSON.stringify(browseKeyStore));
  }

  btnLogin() {
    let password = $('#inpPassword').val();
    let path = $('#storagePath').val();
    let keyType = "AUTH";
    if (path !== null && path !== "" && storageAlias !== null && storageAlias !== "") {
      if (password !== null && password !== "") {
        getKeys(storageAlias, path, password, keyType, "loadKeysBack");
        //console.log(this.state.resultIIN);
      } else {
        alert("Введите пароль к хранилищу");
      }
    } else {
      alert("Не выбран хранилище!");
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
                <ul className="nav nav-tabs">
                  <li className="nav-item"><a className="nav-link active" data-toggle="tab" href="#menu1">Вход без ЭЦП</a></li>
                  <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#menu2">Вход с ЭЦП</a></li>
                </ul>

                <div className="tab-content">
                  <div id="menu1" className="tab-pane fade active show">
                    <p>&nbsp;</p>
                    <form id="loginForm" onSubmit={this.login}>
                      <div className="form-group">
                        <label className="control-label">ИИН/БИН:</label>
                        <input type="text" className="form-control" id="userName" value={this.state.username} onChange={this.onUsernameChange} required />
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
                  <div id="menu2" className="tab-pane fade">
                    <p>&nbsp;</p>
                    <div className="form-group">
                      <label className="control-label">Путь к ЭЦП
                        <input className="form-control" type="text" id="storagePath" readOnly />
                      </label>
                      <button className="btn btn-secondary btn-xs" type="button" onClick={this.btnChooseFile.bind(this)}>Выбрать файл</button> 
                    </div>
                    <div className="form-group">
                      <label className="control-label">Пароль от ЭЦП
                        <input className="form-control" id="inpPassword" type="password" />
                      </label>
                      <button className="btn btn-primary" id="btnLogin" onClick={this.btnLogin.bind(this)}>Загрузить ЭЦП</button>
                    </div>
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-primary">Войти</button>
                      <Link to="/" style={{marginRight:'5px'}}>
                        <button type="button" className="btn btn-default" data-dismiss="modal">Закрыть</button>
                      </Link>
                      </div>
                  </div>
                </div>
                
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