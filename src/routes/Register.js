import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PreloaderIcon, {ICON_TYPE} from 'react-preloader-icon';
import $ from 'jquery';
// import browseKeyStore from '../assets/js/crypto_object.js';

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
    }
  }
  console.log(event);
  setMissedHeartbeatsLimitToMin();
};

function setMissedHeartbeatsLimitToMax() {
  missed_heartbeats_limit = missed_heartbeats_limit_max;
}

function setMissedHeartbeatsLimitToMin() {
  missed_heartbeats_limit = missed_heartbeats_limit_min;
}

function pingLayer() {
  console.log("pinging...");
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
  console.log(1);
  // xmlToSign
  var signXml = {
      "method": "signXml",
      "args": [storageName, storagePath, alias, password, xmlToSign]
  };
  console.log(signXml);
  callback = callBack;
  setMissedHeartbeatsLimitToMax();
  webSocket.send(JSON.stringify(signXml));
}

function signXmlBack(result) {
  
  if (result['errorCode'] === "NONE") {
    let signedXml = result.result;
    console.log(typeof signedXml);
    var data = { XmlDoc: signedXml }
    $.ajax({
        url: window.url + 'api/Account/LoginCert',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        success: function (response) {
           // you will get response from your php page (what you echo or print)  
           alert('RESULT: ' + response);
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
  if (window.confirm("Ошибка при подключений к прослойке. Убедитесь что программа запущена и нажмите ОК") === true) {
    window.location.reload();
  }
}

export default class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "", 
      email: "", 
      pwd: "", 
      confirmPwd: "",
      loadingVisible: false,
      storageAlias: "PKCS12"
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
      } else {
        alert("Введите пароль к хранилищу");
      }
    } else {
      alert("Не выбран хранилище!");
    }
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
                <div className="form-group">
                  <label className="control-label">Путь к ЭЦП
                    <input className="form-control" type="text" id="storagePath" readonly />
                  </label>
                  <button className="btn btn-secondary btn-xs" type="button" onClick={this.btnChooseFile.bind(this)}>Выбрать файл</button> 
                </div>
                <div className="form-group">
                  <label className="control-label">Пароль ЭЦП
                    <input className="form-control" id="inpPassword" type="password" />
                  </label>
                  <button className="btn btn-primary" id="btnLogin" onClick={this.btnLogin.bind(this)}>Авторизация</button>
                </div>
                <hr />
                <form id="registerForm" onSubmit={this.register}>
                  <div className="form-group">
                    <label htmlFor="UserName" className="control-label">ИИН/БИН:</label>
                    <input type="text" className="form-control" required value={this.state.username} onChange={this.onUsernameChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="Email" className="control-label">E-mail:</label>
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