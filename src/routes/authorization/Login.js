import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import $ from 'jquery';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.webSocket = new WebSocket('wss://127.0.0.1:13579/');
    this.heartbeat_msg = '--heartbeat--';
    this.heartbeat_interval = null;
    this.missed_heartbeats = 0;
    this.missed_heartbeats_limit_min = 3;
    this.missed_heartbeats_limit_max = 50;
    this.missed_heartbeats_limit = this.missed_heartbeats_limit_min;
    this.callback = null;
    this.state = {
      username: "",
      pwd: "",
      loaderHidden: true,
      storageAlias: "PKCS12",
      openECP: false,
      closeecp: true,
      inviseBtn: true,
      aboutNCALayer: false
    }

    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPwdChange = this.onPwdChange.bind(this);
    this.login = this.login.bind(this);
    this.onUpdateLogStatus = this.onUpdateLogStatus.bind(this);
    this.onUpdateUsername = this.onUpdateUsername.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.openecp = this.openecp.bind(this);
    // this.openIIN = this.openIIN.bind(this);
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

  showAlert() {
    this.setState({aboutNCALayer: true});
  }
  componentDidMount () {
    this.props.breadCrumbs();
  }
  //user login function
  login(e) {
    e.preventDefault();
    this.props.handler;
    //console.log("login function started");
    var tokenKey = "tokenInfo";
    var userIdKey = "userId";
    var userNameKey = "userName";
    var userIinKey = "userIin";
    var userBinKey = "userBin";
    var userRoleKey = "userRoles";
    var logStatusKey = "logStatus";
    var username = this.state.username.trim();
    var pwd = this.state.pwd.trim();
    var params = 'grant_type=password&username=' + username + '&password='+ pwd + '&client_secret=' + window.clientSecret + '&client_id=2';

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
      this.setState({loaderHidden: false});
      this.setState({inviseBtn: false});
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/token", true);
      //Send the proper header information along with the request
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
      xhr.onload = function(e) {
        if (xhr.status === 200) {
          var data = JSON.parse(e.target.response).user;
          this.setState({loaderHidden: true});
          console.log("loggedIn");
          //console.log(JSON.parse(e.target.response));
          var roles = [];
          for(var index = 0; index < data.roles.length; index++){
            roles.push(data.roles[index].name);
          }
          // сохраняем в хранилище sessionStorage токен доступа
          sessionStorage.setItem(tokenKey, data.access_token);
          sessionStorage.setItem(userIdKey, data.id);
          sessionStorage.setItem(userNameKey, data.name);
          sessionStorage.setItem(userIinKey, data.iin ? data.iin : '');
          sessionStorage.setItem(userBinKey, data.bin ? data.bin : '');
          sessionStorage.setItem(userRoleKey, JSON.stringify(roles));
          sessionStorage.setItem(logStatusKey, true);
          //console.log(roles);
          //console.log(this.props.location);
          if(JSON.parse(e.target.response).checkFirstLogin == true){
            return this.props.history.push("/panel/common/edit-password");
          }
          switch (roles[0]) {
            case "Citizen":
              if(this.props.location.state != null && this.props.location.state.url_apz_id){
                return this.props.history.push("/panel/citizen/apz/show/"+this.props.location.state.url_apz_id);
              }else{
                return this.props.history.push("/panel/base-page");
              }
              break;
            case 'Urban':
              switch(roles[1]){
                case 'Region':
                  if(this.props.location.state != null && this.props.location.state.url_apz_id){
                    return this.props.history.replace("/panel/urban/apz/show/"+this.props.location.state.url_apz_id);
                  }else{
                    return this.props.history.push("/panel/base-page");
                  }
                break;

                case 'Engineer':
                  if(this.props.location.state != null && this.props.location.state.url_apz_id){
                    return this.props.history.push("/panel/engineer/apz/show/"+this.props.location.state.url_apz_id);
                  }else{
                    return this.props.history.push("/panel/base-page");
                  }
                break;

                case 'Head':
                  if(this.props.location.state != null && this.props.location.state.url_apz_id){
                    return this.props.history.push("/panel/head/apz/show/"+this.props.location.state.url_apz_id);
                  }else{
                    return this.props.history.push("/panel/base-page");
                  }
                break;

                default: return this.props.history.push("/panel/base-page");
              }
            break;
          case "ApzDepartment":
            if(this.props.location.state != null && this.props.location.state.url_apz_id){
              return this.props.history.push("/panel/apz-department/apz/show/"+this.props.location.state.url_apz_id);
            }else{
              return this.props.history.push("/panel/base-page");
            }
            break;
          case 'Provider':
            switch (roles[1]) {
              case 'Water':
                if(this.props.location.state != null && this.props.location.state.url_apz_id){
                  return this.props.history.push("/panel/water-provider/apz/show/"+this.props.location.state.url_apz_id);
                }else{
                  return this.props.history.push("/panel/base-page");
                }
                break;
                case 'Gas':
                  if(this.props.location.state != null && this.props.location.state.url_apz_id){
                    return this.props.history.push("/panel/gas-provider/apz/show/"+this.props.location.state.url_apz_id);
                  }else{
                    return this.props.history.push("/panel/base-page");
                  }
                  break;
                case 'Heat':
                  if(this.props.location.state != null && this.props.location.state.url_apz_id){
                    return this.props.history.push("/panel/heat-provider/apz/show/"+this.props.location.state.url_apz_id);
                  }else{
                    return this.props.history.push("/panel/base-page");
                  }
                  break;
                case 'Electricity':
                  if(this.props.location.state != null && this.props.location.state.url_apz_id){
                    return this.props.history.push("/panel/elector-provider/apz/show/"+this.props.location.state.url_apz_id);
                  }else{
                    return this.props.history.push("/panel/base-page");
                  }
                  break;
                case 'Phone':
                  if(this.props.location.state != null && this.props.location.state.url_apz_id){
                    return this.props.history.push("/panel/phnone-provider/apz/show/"+this.props.location.state.url_apz_id);
                  }else{
                    return this.props.history.push("/panel/base-page");
                  }
                  break;
              default:
            }
            break;
          default: return this.props.history.push("/panel/base-page");
          }
        }
        else if(xhr.status === 400) {
          this.setState({loaderHidden: true});
          this.setState({inviseBtn: true});
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
    this.callback = "chooseStoragePathBack";
    this.webSocketFunction();
    this.setMissedHeartbeatsLimitToMax();
    this.webSocket.send(JSON.stringify(browseKeyStore));
  }

  btnLogin() {
    this.setState({loaderHidden: false});
    let password = $('#inpPassword').val();
    let path = $('#storagePath').val();
    let keyType = "AUTH";
    if (path !== null && path !== "" && this.state.storageAlias !== null && this.state.storageAlias !== "") {
      if (password !== null && password !== "") {
          this.getKeys(this.state.storageAlias, path, password, keyType, "loadKeysBack");
        //console.log(this.state.resultIIN);
      } else {
          this.setState({loaderHidden: true});
          alert("Введите пароль к хранилищу");
      }
    } else {
        this.setState({loaderHidden: true});
        alert("Не выбран хранилище!");
        // this.setState({loaderHidden: true});

    }
  }
  openecp(){

  }

  webSocketFunction() {
    this.webSocket.onopen = function (event) {
      if (this.heartbeat_interval == "") {
        this.missed_heartbeats = 0;
        this.heartbeat_interval = setInterval(this.pingLayer, 2000);
      }
      console.log("Connection opened");
    }.bind(this);

    this.webSocket.onclose = function (event) {
      if (event.wasClean) {
        console.log('connection has been closed');
      }
      else {
        console.log('Connection error');
        this.openDialog();
      }
      console.log('Code: ' + event.code + ' Reason: ' + event.reason);
    }.bind(this);

    this.webSocket.onmessage = function (event) {
      if (event.data === this.heartbeat_msg) {
        this.missed_heartbeats = 0;
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

        switch (this.callback) {
          case 'chooseStoragePathBack':
            this.chooseStoragePathBack(rw);
            break;

          case 'loadKeysBack':
            this.loadKeysBack(rw);
            break;

          case 'signXmlBack':
            this.signXmlBack(rw);
            break;
          default:
            break;
        }
      }
      //console.log(event);
      this.setMissedHeartbeatsLimitToMin();
    }.bind(this);
  }

  setMissedHeartbeatsLimitToMax() {
    this.missed_heartbeats_limit = this.missed_heartbeats_limit_max;
  }

  setMissedHeartbeatsLimitToMin() {
    this.missed_heartbeats_limit = this.missed_heartbeats_limit_min;
  }

  pingLayer() {
    //console.log("pinging...");
    try {
      this.missed_heartbeats++;
      if (this.missed_heartbeats >= this.missed_heartbeats_limit)
          throw new Error("Too many missed heartbeats.");
      this.webSocket.send(this.heartbeat_msg);
    } catch (e) {
      clearInterval(this.heartbeat_interval);
      this.heartbeat_interval = null;
      console.warn("Closing connection. Reason: " + e.message);
      this.webSocket.close();
    }
  }

  getKeys(storageName, storagePath, password, type, callBack) {
    var getKeys = {
        "method": "getKeys",
        "args": [storageName, storagePath, password, type]
    };
    this.callback = callBack;
    this.webSocketFunction();
    this.setMissedHeartbeatsLimitToMax();
    this.webSocket.send(JSON.stringify(getKeys));
  }

  getTokenXml(alias) {
    let storagePath = $('#storagePath').val();
    let password = $('#inpPassword').val();
    $.get(window.url + 'api/get_token_xml', function (tokenXml) {
        if (storagePath !== null && storagePath !== "" && this.state.storageAlias !== null && this.state.storageAlias !== "") {
          if (password !== null && password !== "") {
            if (alias !== null && alias !== "") {
              if (tokenXml !== null && tokenXml !== "") {
                // console.log(tokenXml);
                this.signXml(this.state.storageAlias, storagePath, alias, password, tokenXml, "signXmlBack");
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
    }.bind(this));
  }

  signXml(storageName, storagePath, alias, password, xmlToSign, callBack) {
    // xmlToSign
    var signXml = {
        "method": "signXml",
        "args": [storageName, storagePath, alias, password, xmlToSign]
    };
    //console.log(signXml);
    this.callback = callBack;
    this.webSocketFunction();
    this.setMissedHeartbeatsLimitToMax();
    this.webSocket.send(JSON.stringify(signXml));
  }

  signXmlBack(result) {

    if (result['errorCode'] === "NONE") {
      let signedXml = result.result;
      var data = { XmlDoc: signedXml }
      $.ajax({
          url: window.url + 'api/login_with_cert',
          type: "POST",
          //contentType: "application/json; charset=utf-8",
          data: data,
          success: function (response) {
                 this.setState({openECP: !this.state.openECP});
                 this.setState({closeecp: !this.state.closeecp});
                 this.setState({loaderHidden: true});
             // var commonName = response.commonName;
             // var commonNameValues = commonName.split("?");
             // you will get response from your php page (what you echo or print)
              //window.result = response;
              //$('#userName').val(response.IIN);

              //var roles = response.role1;
              //if(response.role2)
              //  roles.push(response.role2);
              //if(response.role3)
              //  roles.push(response.role3);
              //// сохраняем в хранилище sessionStorage токен доступа
              //sessionStorage.setItem('tokenInfo', response.access_token);
              //sessionStorage.setItem('userName', response.userName);
              //sessionStorage.setItem('userRoles', JSON.stringify(roles));
              //sessionStorage.setItem('logStatus', true);
              //window.location.reload();

              if(response.iin){
                this.setState({username: response.iin});
              }else if(response.bin){
                this.setState({username: response.bin});
              }

              //$('#firstName').val(response.firstName);
              //$('#lastName').val(response.lastName);
              //$('#middleName').val(response.middleName);
              //alert(response.firstName + ", ЭЦП успешно загружен! Заполните остальные поля.");
          }.bind(this),
          error: function(jqXHR, textStatus, errorThrown) {
             console.log(textStatus, errorThrown);
             this.setState({loaderHidden: true});
             alert('Во время авторизации по ЭЦП произошла ошибка. Возможно срок действия вашего ЭЦП истек или он был отозван');
          }.bind(this)
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

  loadKeysBack(result) {
    if (result.errorCode === "WRONG_PASSWORD") {
      this.setState({loaderHidden: true});
      return alert('Неправильный пароль!');
    }

    let alias = "";
    if (result && result.result) {
      let arr = result.result.split('|');
      alias = arr[3];
    } else {
      this.setState({loaderHidden: true});
      alert('Неверный ключ')
    }
    this.getTokenXml(alias);
  }

  chooseStoragePathBack(rw) {
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

  openDialog() {
    //if (window.confirm("Ошибка при подключений к прослойке. Убедитесь что программа запущена и нажмите ОК") === true) {
    //  window.location.reload();
    //}
  }

  componentWillMount() {
    //console.log("LoginComponent will mount")
    if (sessionStorage.getItem('tokenInfo'))
    {
      return this.props.history.push("/panel/base-page");
    }
    this.webSocketFunction();
  }


  componentWillUnmount() {
    //console.log("LoginComponent will unmount");
  }

  render() {
    // console.log(window.checkToken);
    //console.log("rendering the LoginComponent");
    return (
      <div>
      <div className="container">
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
                <ul className="nav nav-tabs">
                  <li className="nav-item"><a className="nav-link active" data-toggle="tab" href="#menu1">Вход без ЭЦП</a></li>
                  <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#menu2">Вход с ЭЦП</a></li>
                </ul>

                <div className="tab-content">
                  <div id="menu1" className="tab-pane fade active show">
                    <p>&nbsp;</p>
                    <form id="loginForm" onSubmit={this.login}>
                      <div className="form-group">
                        <input type="text" className="form-control" id="userName" value={this.state.username} onChange={this.onUsernameChange} required />
                      </div>
                      <div className="form-group">
                        <label className="control-label">Пароль:</label>
                        <input type="password" className="form-control no-bg" autoComplete="off" value={this.state.pwd} onChange={this.onPwdChange} required />
                      </div>
                      <div className="modal-footer">
                        {!this.state.loaderHidden &&
                          <div style={{margin: '0 auto'}}>
                            <Loader type="Ball-Triangle" color="#46B3F2" height="70" width="70" />
                          </div>
                        }
                        {this.state.loaderHidden &&
                          <div>
                            <button type="submit" className="btn btn-primary">Войти</button>
                            <Link to="/" style={{marginRight:'5px'}}>
                              <button type="button" className="btn btn-default" data-dismiss="modal">Закрыть</button>
                            </Link>
                              <div className="row">
                                  <div className="col-md-2"></div>
                                  <div className="col-md-10">
                                      <Link to="/forgotPassword" >Забыли пароль?</Link>
                                  </div>
                              </div>
                          </div>
                        }
                      </div>
                    </form>
                  </div>
                  <div id="menu2" className="tab-pane fade">
                    {this.state.aboutNCALayer &&
                      <div className="modal-body">
                        <h5 className="modal-title">Информация</h5>
                        У вас не установлен/запущен NCALayer. <br/>Для авторизации/регистрации установите NCALayer
                        на сайте НУЦ РК. <br/>
                        Для установки пройдите по ссылке:&nbsp;
                        <a onClick={() => document.getElementById("alertModalClose").click()}
                           href="http://pki.gov.kz/index.php/ru/ncalayer" target="_blank">
                          pki.gov.kz
                        </a>
                      </div>
                    }
                    {this.state.closeecp &&
                      <div>
                        <div className="form-group">
                            <p style={{margin: '0px'}}>
                                &nbsp;
                            </p>
                          <label className="control-label">Путь к ЭЦП
                            <input className="form-control" type="text" id="storagePath" readOnly required />
                          </label>
                          <button className="btn btn-secondary btn-xs" type="button" onClick={this.btnChooseFile.bind(this)} style={{marginLeft:'5px',marginTop:'0px',borderRadius:'2px'}}>Выбрать файл</button>
                        </div>
                        <div className="form-group">
                          <label className="control-label" >Пароль от ЭЦП
                            <input className="form-control" id="inpPassword" type="password" required/>
                          </label>
                            {!this.state.loaderHidden &&
                            <div style={{margin: '0 auto', display: 'table'}}>
                                <Loader type="Ball-Triangle" color="#46B3F2" height="100" width="100" />
                            </div>
                            }
                            {this.state.loaderHidden &&
                              this.state.inviseBtn &&
                              <button className="btn btn-primary" id="btnLogin" onClick={this.btnLogin.bind(this)}
                                style={{marginLeft: '5px', marginTop: '0px'}}>Загрузить ЭЦП</button>
                            }
                        </div>
                      </div>
                    }



                    {this.state.openECP &&
                      <form id="loginForm" onSubmit={this.login}>
                        <div className="form-group">
                          <label className="control-label">ИИН/БИН:</label>
                          <input type="text" className="form-control" value={this.state.username} readOnly required />
                        </div>
                        <div className="form-group">
                          <label className="control-label">Пароль:</label>
                          <input type="password" className="form-control" value={this.state.pwd} onChange={this.onPwdChange} required />
                        </div>
                        <div className="modal-footer">
                          {this.state.loaderHidden &&
                            <div>
                              <button type="submit" className="btn btn-primary">Войти</button>
                              <Link to="/" style={{marginRight:'5px'}}>
                                <button type="button" className="btn btn-default" data-dismiss="modal">Закрыть</button>
                              </Link>
                            </div>
                          }
                          {!this.state.loaderHidden &&
                            <div style={{margin: '0 auto', display: 'table'}}>
                              <Loader type="Ball-Triangle" color="#46B3F2" height="100" width="100" />
                            </div>
                          }
                        </div>

                      </form>
                    }
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
