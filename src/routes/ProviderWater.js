import React from 'react';
//import * as esriLoader from 'esri-loader';
import EsriLoaderReact from 'esri-loader-react';
//import { NavLink } from 'react-router-dom';
import $ from 'jquery';
import { Route, NavLink, Link, Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';

export default class ProviderWater extends React.Component {
  render() {
    return (
      <div className="content container urban-apz-page">
        <div className="card">
          <div className="card-header">
          <h4 className="mb-0">Архитектурно-планировочное задание</h4></div>
          <div className="card-body">
            <Switch>
              <Route path="/providerwater/status/:status" component={AllApzs} />
              <Route path="/providerwater/:id" component={ShowApz} />
              <Redirect from="/providerwater" to="/providerwater/status/active" />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

class AllApzs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apzs: [],
      loaderHidden: false
    };

  }

  componentDidMount() {
    this.getApzs();
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.match.params.status !== nextProps.match.params.status) {
      this.getApzs(nextProps.match.params.status);
    }
  }

  getApzs(status = null) {
    if (!status) {
      status = this.props.match.params.status;
    }

    this.setState({ loaderHidden: false });

    var token = sessionStorage.getItem('tokenInfo');
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));

    if (roles == null) {
        sessionStorage.clear();
        alert("Token is expired, please login again!");
        this.props.history.replace("/login");
        return false;
    }

    var providerName = roles[1];
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/provider/" + providerName, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        
        switch (status) {
          case 'active':
            var apzs = data.in_process;
            break;

          case 'accepted':
            apzs = data.accepted;
            break;

          case 'declined':
            apzs = data.declined;
            break;

          default:
            apzs = data;
            break;
        }
        
        this.setState({apzs: apzs});
      }

      this.setState({ loaderHidden: true });
    }.bind(this);
    xhr.send();
  }

  toDate(date) {
    if(date === null) {
      return date;
    }

    var jDate = new Date(date);
    var curr_date = jDate.getDate() < 10 ? "0" + jDate.getDate() : jDate.getDate();
    var curr_month = (jDate.getMonth() + 1) < 10 ? "0" + (jDate.getMonth() + 1) : jDate.getMonth() + 1;
    var curr_year = jDate.getFullYear();
    var curr_hour = jDate.getHours() < 10 ? "0" + jDate.getHours() : jDate.getHours();
    var curr_minute = jDate.getMinutes() < 10 ? "0" + jDate.getMinutes() : jDate.getMinutes();
    var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;
    
    return formated_date;
  }

  render() {
    return (
      <div>
        {this.state.loaderHidden &&
          <div>
            <ul className="nav nav-tabs mb-2 pull-right">
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/providerwater/status/active" replace>Активные</NavLink></li>
              <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/providerwater/status/accepted" replace>Принятые</NavLink></li>
              <li className="nav-item"><NavLink activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/providerwater/status/declined" replace>Отказанные</NavLink></li>
            </ul>

            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '23%'}}>Название</th>
                  <th style={{width: '23%'}}>Заявитель</th>
                  <th style={{width: '20%'}}>Адрес</th>
                  <th style={{width: '20%'}}>Дата заявления</th>
                  <th style={{width: '14%'}}>Срок</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.state.apzs.map(function(apz, index) {
                  return(
                    <tr key={index}>
                      <td>
                        {apz.project_name} 

                        {apz.object_type &&
                          <span className="ml-1">({apz.object_type})</span>
                        }
                      </td>
                      <td>{apz.applicant}</td>
                      <td>{apz.project_address}</td>
                      <td>{this.toDate(apz.created_at)}</td>
                      <td>{apz.object_term}</td>
                      <td>
                        <Link className="btn btn-outline-info" to={'/providerwater/' + apz.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
                      </td>
                    </tr>
                    );
                  }.bind(this))
                }
              </tbody>
            </table>
          </div>
        }

        {!this.state.loaderHidden &&
          <div style={{textAlign: 'center'}}>
            <Loader type="Oval" color="#46B3F2" height="200" width="200" />
          </div>
        }
      </div>
    )
  }
}

class ShowApz extends React.Component {
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

    var roles = JSON.parse(sessionStorage.getItem('userRoles'));

    this.state = {
      apz: [],
      showMap: false,
      showButtons: false,
      showSignButtons: false,
      showTechCon: false,
      file: false,
      genWaterReq: "",
      drinkingWater: "",
      prodWater: "",
      fireFightingWaterIn: "",
      fireFightingWaterOut: "",
      connectionPoint: "",
      recomendation: "",
      docNumber: "",
      description: '',
      responseId: 0,
      response: false,
      responseFile: null,
      personalIdFile: false,
      confirmedTaskFile: false,
      titleDocumentFile: false,
      showMapText: 'Показать карту',
      accept: true,
      callSaveFromSend: false,
      waterStatus: 2,
      storageAlias: "PKCS12",
      xmlFile: false,
      isSigned: false,
      isPerformer: (roles.indexOf('PerformerWater') != -1),
      isHead: (roles.indexOf('HeadWater') != -1),
      isDirector: (roles.indexOf('DirectorWater') != -1),
      heads_responses: [],
      head_accepted: true,
      headComment: null
    };

    this.onGenWaterReqChange = this.onGenWaterReqChange.bind(this);
    this.onDrinkingWaterChange = this.onDrinkingWaterChange.bind(this);
    this.onProdWaterChange = this.onProdWaterChange.bind(this);
    this.onFireFightingWaterInChange = this.onFireFightingWaterInChange.bind(this);
    this.onFireFightingWaterOutChange = this.onFireFightingWaterOutChange.bind(this);
    this.onConnectionPointChange = this.onConnectionPointChange.bind(this);
    this.onRecomendationChange = this.onRecomendationChange.bind(this);
    this.onDocNumberChange = this.onDocNumberChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.saveResponseForm = this.saveResponseForm.bind(this);
    this.sendWaterResponse = this.sendWaterResponse.bind(this);
    this.onHeadCommentChange = this.onHeadCommentChange.bind(this);
  }

  onGenWaterReqChange(e) {
    this.setState({ genWaterReq: e.target.value });
  }

  onDrinkingWaterChange(e) {
    this.setState({ drinkingWater: e.target.value });
  }

  onProdWaterChange(e) {
    this.setState({ prodWater: e.target.value });
  }

  onFireFightingWaterInChange(e) {
    this.setState({ fireFightingWaterIn: e.target.value });
  }

  onFireFightingWaterOutChange(e) {
    this.setState({ fireFightingWaterOut: e.target.value });
  }

  onConnectionPointChange(e) {
    this.setState({ connectionPoint: e.target.value });
  }

  onRecomendationChange(e) {
    this.setState({ recomendation: e.target.value });
  }

  onDocNumberChange(e) {
    this.setState({ docNumber: e.target.value });
  }

  onDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  onHeadCommentChange(e) {
    this.setState({ headComment: e.target.value });
  }

  onFileChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  // this function to show one of the forms Accept/Decline
  toggleAcceptDecline(value) {
    this.setState({accept: value});
  }

  componentWillMount() {
    this.getApzInfo();
  }

  getApzInfo() {
    var id = this.props.match.params.id;
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));
    var userId = JSON.parse(sessionStorage.getItem('userId'));

    if (roles == null) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
        return false;
    }

    var providerName = roles[1];
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/provider/" + providerName + "/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data);
        
        this.setState({apz: data});
        this.setState({showButtons: false});
        this.setState({showTechCon: false});
        this.setState({personalIdFile: data.files.filter(function(obj) { return obj.category_id === 3 })[0]});
        this.setState({confirmedTaskFile: data.files.filter(function(obj) { return obj.category_id === 9 })[0]});
        this.setState({titleDocumentFile: data.files.filter(function(obj) { return obj.category_id === 10 })[0]});

        if (data.commission && data.commission.apz_water_response) {
          this.setState({description: data.commission.apz_water_response.response_text});
          this.setState({connectionPoint: data.commission.apz_water_response.connection_point});
          this.setState({genWaterReq: data.commission.apz_water_response.gen_water_req});
          this.setState({drinkingWater: data.commission.apz_water_response.drinking_water});
          this.setState({prodWater: data.commission.apz_water_response.prod_water});
          this.setState({fireFightingWaterIn: data.commission.apz_water_response.fire_fighting_water_in});
          this.setState({fireFightingWaterOut: data.commission.apz_water_response.fire_fighting_water_out});
          this.setState({recomendation: data.commission.apz_water_response.recommendation});
          this.setState({docNumber: data.commission.apz_water_response.doc_number});
          this.setState({responseId: data.commission.apz_water_response.id})
          this.setState({response: data.commission.apz_water_response.response});
          if(data.commission.apz_water_response.id !== -1){
            this.setState({accept: data.commission.apz_water_response.response});
          }
          this.setState({responseFile: data.commission.apz_water_response.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12})[0]});
          this.setState({xmlFile: data.commission.apz_water_response.files.filter(function(obj) { return obj.category_id === 13})[0]});
        }

        this.setState({waterStatus: data.apz_water.status})

        if(data.apz_water.status === 1){
          this.setState({showTechCon: true});
        }

        if (data.status_id === 5 && data.apz_water.status === 2) { 
          this.setState({showButtons: true});
        }

        if (this.state.xmlFile) {
          this.setState({isSigned: true});
        }

        this.setState({heads_responses: data.apz_provider_head_response.filter(function(obj) { return obj.role_id === 30 })});

        if (this.state.isHead && data.apz_provider_head_response.filter(function(obj) { return obj.role_id === 30 && obj.user_id === userId }).length === 0) {
          this.setState({head_accepted: false});
        }
      }
    }.bind(this);
    xhr.send();
  }

  downloadFile(id) {
    var token = sessionStorage.getItem('tokenInfo');

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + 'api/file/download/' + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          var base64ToArrayBuffer = (function () {
        
            return function (base64) {
              var binaryString = window.atob(base64);
              var binaryLen = binaryString.length;
              var bytes = new Uint8Array(binaryLen);
              
              for (var i = 0; i < binaryLen; i++) {
                var ascii = binaryString.charCodeAt(i);
                bytes[i] = ascii;
              }
              
              return bytes; 
            }
            
          }());

          var saveByteArray = (function () {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            
            return function (data, name) {
              var blob = new Blob(data, {type: "octet/stream"}),
                  url = window.URL.createObjectURL(blob);
              a.href = url;
              a.download = name;
              a.click();
              window.URL.revokeObjectURL(url);
            };

          }());

          saveByteArray([base64ToArrayBuffer(data.file)], data.file_name);
        } else {
          alert('Не удалось скачать файл');
        }
      }
    xhr.send();
  }

  setMissedHeartbeatsLimitToMax() {
    this.missed_heartbeats_limit = this.missed_heartbeats_limit_max;
  }

  setMissedHeartbeatsLimitToMin() {
    this.missed_heartbeats_limit = this.missed_heartbeats_limit_min;
  }

  browseKeyStore(storageName, fileExtension, currentDirectory, callBack) {
    var browseKeyStore = {
      "method": "browseKeyStore",
      "args": [storageName, fileExtension, currentDirectory]
    };
    this.callback = callBack;
    this.webSocketFunction();
    this.setMissedHeartbeatsLimitToMax();
    this.webSocket.send(JSON.stringify(browseKeyStore));
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

  chooseFile() {
    var browseKeyStore = {
      "method": "browseKeyStore",
      "args": [this.state.storageAlias, "P12", '']
    };
    this.callback = "chooseStoragePathBack";
    this.webSocketFunction();
    this.setMissedHeartbeatsLimitToMax();
    this.webSocket.send(JSON.stringify(browseKeyStore));
  }

  signMessage() {
    let password = document.getElementById("inpPassword").value;
    let path = document.getElementById("storagePath").value;
    let keyType = "SIGN";
    if (path !== null && path !== "" && this.state.storageAlias !== null && this.state.storageAlias !== "") {
      if (password !== null && password !== "") {
        this.getKeys(this.state.storageAlias, path, password, keyType, "loadKeysBack");
      } else {
        alert("Введите пароль к хранилищу");
      }
    } else {
      alert("Не выбран хранилище!");
    }
  }

  loadKeysBack(result) {
    if (result.errorCode === "WRONG_PASSWORD") {
      alert("Неверный пароль!");
      return false;
    }

    let alias = "";
    if (result && result.result) {
      let keys = result.result.split('/n');
      if (keys && keys.length > 0) {
        let arr = keys[0].split('|');
        alias = arr[3];
        this.getTokenXml(alias);
      }
    }
    if (!alias) {
      alert('Нет ключа подписания');
    }
  }

  getTokenXml(alias) {
    let password = document.getElementById("inpPassword").value;
    let storagePath = document.getElementById("storagePath").value;
    var token = sessionStorage.getItem('tokenInfo');

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + 'api/apz/provider/get_xml/water/' + this.state.apz.id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      var tokenXml = xhr.responseText;

      if (storagePath !== null && storagePath !== "" && this.state.storageAlias !== null && this.state.storageAlias !== "") {
        if (password !== null && password !== "") {
          if (alias !== null && alias !== "") {
            if (tokenXml !== null && tokenXml !== "") {
                this.signXml(this.state.storageAlias, storagePath, alias, password, tokenXml, "signXmlBack");
            }
            else {
                alert("Нет данных для подписания!");
            }
          } else {
              alert("Вы не выбрали ключ!");
          }
        } else {
            alert("Введите пароль к хранилищу");
        }
      } else {
          alert("Не выбран хранилище!");
      }
    }.bind(this);
    xhr.send();
  }

  signXml(storageName, storagePath, alias, password, xmlToSign, callBack) {
    var signXml = {
      "method": "signXml",
      "args": [storageName, storagePath, alias, password, xmlToSign]
    };
    this.callback = callBack;
    this.webSocketFunction();
    this.setMissedHeartbeatsLimitToMax();
    this.webSocket.send(JSON.stringify(signXml));
  }

  signXmlBack(result) {
    if (result['errorCode'] === "NONE") {
      let signedXml = result.result;
      var token = sessionStorage.getItem('tokenInfo');
      var data = {xml: signedXml}

      console.log("SIGNED XML ------> \n", signedXml);

      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + 'api/apz/provider/save_xml/water/' + this.state.apz.id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          this.setState({ isSigned: true });
        } else {
          alert("Не удалось подписать файл");
        }
      }.bind(this);
      xhr.send(JSON.stringify(data));
    }
    else {
      if (result['errorCode'] === "WRONG_PASSWORD" && result['result'] > -1) {
        alert("Неправильный пароль! Количество оставшихся попыток: " + result['result']);
      } else if (result['errorCode'] === "WRONG_PASSWORD") {
        alert("Неправильный пароль!");
      } else {
        alert(result['errorCode']);
      }
    }
  }

  chooseStoragePathBack(rw) {
    if (rw.getErrorCode() === "NONE") {
      var storagePath = rw.getResult();
      if (storagePath !== null && storagePath !== "") {
        document.getElementById("storagePath").value = storagePath;
      }
      else {
        document.getElementById("storagePath").value = "";
      }
    } else {
      document.getElementById("storagePath").value = "";
    }
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

  openDialog() {
    if (window.confirm("Ошибка при подключений к прослойке. Убедитесь что программа запущена и нажмите ОК") === true) {
      window.location.reload();
    }
  }

  // this function is to save the respones form when any change is made
  saveResponseForm(apzId, status, comment){
    var token = sessionStorage.getItem('tokenInfo');
    var file = this.state.file;

    if (!file) {
      alert('Не выбран файл');
      return false;
    }

    var formData = new FormData();
    formData.append('file', file);
    formData.append('Response', status);
    formData.append('Message', comment);
    if(status === false){
      formData.append('GenWaterReq', 0);
      formData.append('DrinkingWater', 0);
      formData.append('ProdWater', 0);
      formData.append('FireFightingWaterIn', 0);
      formData.append('FireFightingWaterOut', 0);
      formData.append('ConnectionPoint', "");
      formData.append('Recomendation', "");
    }
    else{
      formData.append('GenWaterReq', this.state.genWaterReq);
      formData.append('DrinkingWater', this.state.drinkingWater);
      formData.append('ProdWater', this.state.prodWater);
      formData.append('FireFightingWaterIn', this.state.fireFightingWaterIn);
      formData.append('FireFightingWaterOut', this.state.fireFightingWaterOut);
      formData.append('ConnectionPoint', this.state.connectionPoint);
      formData.append('Recomendation', this.state.recomendation);
    }
    formData.append('DocNumber', this.state.docNumber);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/apz/provider/water/" + apzId + '/save', true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        this.setState({responseId: data.id});
        this.setState({response: data.response});
        this.setState({accept: data.response});
        this.setState({description: data.response_text});
        this.setState({responseFile: data.files.filter(function(obj) { return obj.category_id === 11 || obj.category_id === 12 })[0]});
        this.setState({connectionPoint: data.connection_point});
        this.setState({genWaterReq: data.gen_water_req});
        this.setState({drinkingWater: data.drinking_water});
        this.setState({prodWater: data.prod_water});
        this.setState({fireFightingWaterIn: data.fire_fighting_water_in});
        this.setState({fireFightingWaterOut: data.fire_fighting_water_out});
        this.setState({recomendation: data.recommendation});
        if(this.state.callSaveFromSend){
          this.setState({callSaveFromSend: false});
          this.sendWaterResponse(apzId, status, comment);
        }
        else{
          alert("Ответ сохранен!");

          this.setState({showSignButtons: true});
        }
      }
      else if(xhr.status === 401){
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send(formData);
  }

  // this function is to send the final response
  sendWaterResponse(apzId, status, comment) {
    if(this.state.responseId <= 0){
      this.setState({callSaveFromSend: true});
      this.saveResponseForm(apzId, status, comment);
    }
    else{
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/provider/water/" + apzId + '/update', true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);

          if(data.response === 1) {
            alert("Заявление принято!");
            this.setState({ showButtons: false });
            this.setState({ waterStatus: 1 });
            this.setState({ showTechCon: true });
          } 
          else if(data.response === 0) {
            alert("Заявление отклонено!");
            this.setState({ showButtons: false });
            this.setState({ waterStatus: 0 });
          }
        }
        else if(xhr.status === 401){
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        }
      }.bind(this);
      xhr.send();
    } 
  }

  sendHeadResponse(apzId, status, comment) {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();

    if (!comment) {
      alert('Заполните поле "Комментарий"');
      return false;
    }

    var formData = new FormData();
    formData.append('status', status);
    formData.append('comment', comment);

    xhr.open("post", window.url + "api/apz/provider/headwater/" + apzId + '/response', true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        alert('Ответ успешно отправлен');
        this.setState({head_accepted: true});
        this.setState({heads_responses: data.head_responses});
      }
      else if(xhr.status === 401){
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send(formData);
  }

  // print technical condition
  printTechCon(apzId, project) {
    var token = sessionStorage.getItem('tokenInfo');
    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/print/tc/water/" + apzId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          //test of IE
          if (typeof window.navigator.msSaveBlob === "function") {
            window.navigator.msSaveBlob(xhr.response, "tc-" + new Date().getTime() + ".pdf");
          } else {
            var data = JSON.parse(xhr.responseText);
            var today = new Date();
            var curr_date = today.getDate();
            var curr_month = today.getMonth() + 1;
            var curr_year = today.getFullYear();
            var formated_date = "(" + curr_date + "-" + curr_month + "-" + curr_year + ")";

            var base64ToArrayBuffer = (function () {
        
              return function (base64) {
                var binaryString =  window.atob(base64);
                var binaryLen = binaryString.length;
                var bytes = new Uint8Array(binaryLen);
                
                for (var i = 0; i < binaryLen; i++) {
                  var ascii = binaryString.charCodeAt(i);
                  bytes[i] = ascii;
                }
                
                return bytes; 
              }
              
            }());

            var saveByteArray = (function () {
              var a = document.createElement("a");
              document.body.appendChild(a);
              a.style = "display: none";
              
              return function (data, name) {
                var blob = new Blob(data, {type: "octet/stream"}),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = name;
                a.click();
                window.URL.revokeObjectURL(url);
              };

            }());

            saveByteArray([base64ToArrayBuffer(data.file)], "ТУ-Вода-" + project + formated_date + ".pdf");
          }
        } else {
          alert('Не удалось скачать файл');
        }
      }
      xhr.send();
    } else {
      console.log('Время сессии истекло.');
    }
  }

  toggleMap(value) {
    this.setState({
      showMap: value
    })

    if (value) {
      this.setState({
        showMapText: 'Скрыть карту'
      })
    } else {
      this.setState({
        showMapText: 'Показать карту'
      })
    }
  }

  toDate(date) {
    if(date === null) {
      return date;
    }

    var jDate = new Date(date);
    var curr_date = jDate.getDate();
    var curr_month = jDate.getMonth() + 1;
    var curr_year = jDate.getFullYear();
    var curr_hour = jDate.getHours();
    var curr_minute = jDate.getMinutes() < 10 ? "0" + jDate.getMinutes() : jDate.getMinutes();
    var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;
    
    return formated_date;
  }

  printData()
{
   var divToPrint=document.getElementById("printTable");
   var divToPrints=document.getElementById("detail_table");
   var newWin= window.open("");
   newWin.document.write(divToPrint.outerHTML + divToPrints.outerHTML);
    var elements = newWin.document.getElementsByClassName('shukichi');
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
   newWin.print();
   newWin.close();
}
  
  render() {
    var apz = this.state.apz;

    if (apz.length === 0) {
      return false;
    }

    return (
      <div className="row">
        <div className="col-sm-12">
          <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>
        </div>
        
        <div className="col-sm-6">  
          <table className="table table-bordered table-striped"  style={{textAlign: 'left'}} id="printTable">
            <tbody>
              <tr>
                <td><b>ИД заявки</b></td>
                <td>{apz.id}</td>
              </tr>
              <tr>
                <td><b>Заявитель</b></td>
                <td>{apz.applicant}</td>
              </tr>
              {apz.user.bin &&
                <tr> 
                  <td><b>БИН</b></td>
                  <td>{apz.user.bin}</td>
                </tr>
              }
              {!apz.user.bin &&
                <tr> 
                  <td><b>ИИН</b></td>
                  <td>{apz.user.iin}</td>
                </tr>
              }
              <tr>
                <td><b>Телефон</b></td>
                <td>{apz.phone}</td>
              </tr>
              <tr>
                <td><b>Заказчик</b></td>
                <td>{apz.customer}</td>
              </tr>
              <tr>
                <td><b>Разработчик</b></td>
                <td>{apz.designer}</td>
              </tr>
              <tr>
                <td><b>Название проекта</b></td>
                <td>{apz.project_name}</td>
              </tr>
              <tr>
                <td><b>Адрес проектируемого объекта</b></td>
                <td>
                  {apz.project_address}

                  {apz.project_address_coordinates &&
                    <a className="ml-2 pointer text-info" onClick={this.toggleMap.bind(this, true)}>Показать на карте</a>
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="col-sm-6">  
          <table className="table table-bordered table-striped" style={{textAlign: 'left'}}>
            <tbody>
              <tr>
                <td><b>Срок строительства</b></td>
                <td>{apz.object_term}</td>
              </tr>
              <tr>
                <td><b>Этажность</b></td>
                <td>{apz.object_level}</td>
              </tr>
              <tr>
                <td><b>Площадь здания</b></td>
                <td>{apz.object_area}</td>
              </tr>
              <tr>
                <td><b>Количество квартир</b></td>
                <td>{apz.object_rooms}</td>
              </tr> 
              <tr>
                <td><b>Дата заявления</b></td>
                <td>{apz.created_at && this.toDate(apz.created_at)}</td>
              </tr>
              
              {this.state.personalIdFile &&
                <tr className="shukichi">
                  <td><b>Уд. лич./ Реквизиты</b></td>
                  <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.personalIdFile.id)}>Скачать</a></td>
                </tr>
              }

              {this.state.confirmedTaskFile &&
                <tr className="shukichi">
                  <td><b>Утвержденное задание</b></td>
                  <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.confirmedTaskFile.id)}>Скачать</a></td>
                </tr>
              }

              {this.state.titleDocumentFile &&
                <tr className="shukichi">
                  <td><b>Правоустанавл. документ</b></td>
                  <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.titleDocumentFile.id)}>Скачать</a></td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div className="col-sm-6">
          <h5 className="block-title-2 mt-3 mb-3">Детали водоснабжения</h5>

          <table className="table table-bordered table-striped" style={{textAlign: 'left'}} id="detail_table">
            <tbody>
              <tr>
                <td>Общая потребность (м<sup>3</sup>/сутки)</td> 
                <td>{apz.apz_water.requirement}</td>
              </tr>
              <tr>
                <td>Общая потребность питьевой воды (м<sup>3</sup>/час)</td> 
                <td>{apz.apz_water.requirement_hour}</td>
              </tr>
              <tr>
                <td>Общая потребность (л/сек макс)</td> 
                <td>{apz.apz_water.requirement_sec}</td>
              </tr>
              <tr>
                <td>Хозпитьевые нужды (м<sup>3</sup>/сутки)</td>
                <td>{apz.apz_water.drinking}</td>
              </tr>
              <tr>
                <td>Хозпитьевые нужды (м<sup>3</sup>/час)</td>
                <td>{apz.apz_water.drinking_hour}</td>
              </tr>
              <tr>
                <td>Хозпитьевые нужды (л/сек макс)</td>
                <td>{apz.apz_water.drinking_sec}</td>
              </tr>
              <tr>
                <td>Производственные нужды (м<sup>3</sup>/сутки)</td>
                <td>{apz.apz_water.production}</td>
              </tr>
              <tr>
                <td>Производственные нужды (м<sup>3</sup>/час)</td>
                <td>{apz.apz_water.production_hour}</td>
              </tr>
              <tr>
                <td>Производственные нужды (л/сек макс)</td>
                <td>{apz.apz_water.production_sec}</td>
              </tr>
              <tr>
                <td>Расходы пожаротушения (л/сек наружное)</td>
                <td>{apz.apz_water.fire_fighting}</td>
              </tr>
              <tr>
                <td>Расходы пожаротушения (л/сек внутреннее)</td>
                <td>{apz.apz_water.fire_fighting}</td>
              </tr>
            </tbody>
          </table>
          <button className="btn btn-raised btn-success" onClick={this.printData}>Печать</button>
        </div>

        <div className="col-sm-6">
          <h5 className="block-title-2 mt-3 mb-3">Детали водоотведения</h5>

          <table className="table table-bordered table-striped" style={{textAlign: 'left'}}>
            <tbody>
              <tr>
                <td>Общее количество сточных вод (м<sup>3</sup>/сутки)</td>
                <td>{apz.apz_sewage.amount}</td>
              </tr>
              <tr>
                <td>Общее количество сточных вод (м<sup>3</sup>/час макс)</td>
                <td>{apz.apz_sewage.amount_hour}</td>
              </tr>
              <tr>
                <td>Фекальных (м<sup>3</sup>/сутки)</td>
                <td>{apz.apz_sewage.feksal}</td>
              </tr>
              <tr>
                <td>Фекальных (м<sup>3</sup>/час макс)</td>
                <td>{apz.apz_sewage.feksal_hour}</td>
              </tr>
              <tr>
                <td>Производственно-загрязненных (м<sup>3</sup>/сутки)</td>
                <td>{apz.apz_sewage.production}</td>
              </tr>
              <tr>
                <td>Производственно-загрязненных (м<sup>3</sup>/час макс)</td>
                <td>{apz.apz_sewage.production_hour}</td>
              </tr>
              <tr>
                <td>Условно-чистых сбрасываемых на городскую сеть (м<sup>3</sup>/сутки)</td>
                <td>{apz.apz_sewage.to_city}</td>
              </tr>
              <tr>
                <td>Условно-чистых сбрасываемых на городскую сеть (м<sup>3</sup>/час макс)</td>
                <td>{apz.apz_sewage.to_city_hour}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="col-sm-12">
          {(!this.state.isHead && !this.state.isDirector) && this.state.heads_responses.length > 0 &&
            <div style={{marginBottom: '50px'}}>
              <h5 className="block-title-2 mt-4 mb-3">Комментарии:</h5>

              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <th>ФИО</th>
                    <th>Комментарий</th>
                    <th>Дата</th>
                  </tr>
                  {this.state.heads_responses.map(function(item, index) {
                    return(
                      <tr key={index}>
                        <td width="40%">
                          {item.user.name} 
                        </td>
                        <td width="40%">{item.comments}</td>
                        <td>{this.toDate(item.created_at)}</td>
                      </tr>
                      );
                    }.bind(this))
                  }
                </tbody>
              </table>
            </div>
          }

          <div className="row" style={{margin: '16px 0'}}>
            {(this.state.isPerformer === true || this.state.responseId != 0) &&
              <div className="col-sm-6">
                <h5 className="block-title-2 mt-3 mb-3" style={{display: 'inline'}}>Ответ</h5> 
              </div>
            }
            
            <div className="col-sm-6">
              {this.state.showButtons && !this.state.isSigned && this.state.isPerformer &&
                <div className="btn-group" style={{float: 'right', margin: '0'}}>
                  <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.toggleAcceptDecline.bind(this, true)}>
                    Одобрить
                  </button>
                  <button className="btn btn-raised btn-danger" onClick={this.toggleAcceptDecline.bind(this, false)}>
                    Отклонить
                  </button>
                </div>
              }
            </div>
          </div>

          {(this.state.accept === true || this.state.accept === 1) && this.state.waterStatus === 2 && !this.state.xmlFile && !this.state.isSigned && this.state.isPerformer &&
            <form style={{border: 'solid 3px #46A149', padding: '5px'}}>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Точка подключения</label>
                    <input type="text" className="form-control" id="connectionPoint" placeholder="" value={this.state.connectionPoint} onChange={this.onConnectionPointChange} />
                  </div>
                  <div className="form-group">
                    <label>Номер документа</label>
                    <input type="text" className="form-control" id="docNumber" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
                  </div>
                  <div className="form-group">
                    <label>Общая потребность (м<sup>3</sup>/сутки)</label>
                    <input type="number" step="any" className="form-control" placeholder="" value={this.state.genWaterReq} onChange={this.onGenWaterReqChange} />
                  </div>
                  <div className="form-group">
                    <label>Хозпитьевые нужды (м<sup>3</sup>/сутки)</label>
                    <input type="number" step="any" className="form-control" placeholder="" value={this.state.drinkingWater} onChange={this.onDrinkingWaterChange} />
                  </div>
                  <div className="form-group">
                    <label>Производственные нужды (м<sup>3</sup>/сутки)</label>
                    <input type="number" step="any" className="form-control" placeholder="" value={this.state.prodWater} onChange={this.onProdWaterChange} />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Расходы пожаротушения внутренные (л/сек)</label>
                    <input type="number" step="any" className="form-control" value={this.state.fireFightingWaterIn} onChange={this.onFireFightingWaterInChange} />
                  </div>
                  <div className="form-group">
                    <label>Расходы пожаротушения внешные (л/сек)</label>
                    <input type="number" step="any" className="form-control" value={this.state.fireFightingWaterOut} onChange={this.onFireFightingWaterOutChange} />
                  </div>
                  <div className="form-group">
                    <label>Рекомендация</label>
                    <textarea rows="5" className="form-control" value={this.state.recomendation} onChange={this.onRecomendationChange} placeholder="Описание"></textarea>
                  </div>
                  {(this.state.response === true && this.state.responseFile) &&
                    <div className="form-group">
                      <label style={{display: 'block'}}>Прикрепленный файл</label>
                      <a className="pointer text-info" title="Скачать" onClick={this.downloadFile.bind(this, this.state.responseFile.id)}>
                        Скачать
                      </a>
                    </div>
                  }
                  <div className="form-group">
                    <label htmlFor="upload_file">Прикрепить файл</label>
                    <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
                  </div>

                  {!this.state.xmlFile &&
                    <div className="form-group">
                      <button type="button" className="btn btn-secondary" onClick={this.saveResponseForm.bind(this, apz.id, true, "")}>
                        Сохранить
                      </button>

                      {this.state.responseFile &&
                        <button type="button" className="btn btn-secondary" onClick={this.printTechCon.bind(this, apz.id, apz.project_name)}>
                          Предварительный просмотр
                        </button>
                      }
                    </div>
                  }
                </div>
              </div>
            </form>
          }

          {(this.state.accept === 1 || this.state.accept === true) && this.state.responseId != 0 && (this.state.waterStatus === 1 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
            <div>
              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td style={{width: '40%'}}>Точка подключения</td> 
                    <td>{this.state.connectionPoint}</td>
                  </tr>
                  <tr>
                    <td>Номер документа</td>
                    <td>{this.state.docNumber}</td>
                  </tr>
                  <tr>
                    <td>Общая потребность (м<sup>3</sup>/сутки)</td>
                    <td>{this.state.genWaterReq}</td>
                  </tr>
                  <tr>
                    <td>Хозпитьевые нужды (м<sup>3</sup>/сутки)</td>
                    <td>{this.state.drinkingWater}</td>
                  </tr>
                  <tr>
                    <td>Производственные нужды (м<sup>3</sup>/час)</td>
                    <td>{this.state.prodWater}</td>
                  </tr>
                  <tr>
                    <td>Расходы пожаротушения внутренные (л/сек)</td>
                    <td>{this.state.fireFightingWaterIn}</td>
                  </tr>
                  <tr>
                    <td>Расходы пожаротушения внешные (л/сек)</td>
                    <td>{this.state.fireFightingWaterOut}</td>
                  </tr>
                  <tr>
                    <td>Рекомендация</td>
                    <td>{this.state.recomendation}</td>
                  </tr>
                  {this.state.responseFile &&
                    <tr>
                      <td>Прикрепленный файл</td>
                      <td>
                        <a className="pointer text-info" title="Скачать" onClick={this.downloadFile.bind(this, this.state.responseFile.id)}>
                          Скачать 
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>

              {this.state.heads_responses.length > 0 &&
                <div>
                  <h5 className="block-title-2 mt-4 mb-3">Комментарии:</h5>

                  <table className="table table-bordered table-striped">
                    <tbody>
                      <tr>
                        <th>ФИО</th>
                        <th>Комментарий</th>
                        <th>Дата</th>
                      </tr>
                      {this.state.heads_responses.map(function(item, index) {
                        return(
                          <tr key={index}>
                            <td width="40%">
                              {item.user.name} 
                            </td>
                            <td width="40%">{item.comments}</td>
                            <td>{this.toDate(item.created_at)}</td>
                          </tr>
                          );
                        }.bind(this))
                      }
                    </tbody>
                  </table>
                </div>
              }

              {this.state.isHead &&
                <div className={this.state.showButtons ? '' : 'invisible'}>
                  <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                    <textarea style={{marginBottom: '10px'}} placeholder="Комментарий" rows="7" cols="50" className="form-control" value={this.state.headComment} onChange={this.onHeadCommentChange}></textarea>
                    <button className="btn btn-raised btn-success" onClick={this.sendHeadResponse.bind(this, apz.id, true, this.state.headComment)}>
                      Отправить
                    </button>
                  </div>
                </div>
              }

              {this.state.isDirector &&
                <div>
                  {!this.state.xmlFile && !this.state.isSigned &&
                    <div style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                      <div className="row form-group">
                        <div className="col-sm-7">
                          <input className="form-control" placeholder="Путь к ключу" type="text" id="storagePath" />
                        </div>

                        <div className="col-sm-5 p-0">
                          <button className="btn btn-outline-secondary btn-sm" type="button" onClick={this.chooseFile.bind(this)}>Выбрать файл</button>
                        </div>
                      </div>

                      <div className="form-group">
                        <input className="form-control" placeholder="Пароль" id="inpPassword" type="password" />
                      </div>

                      <div className="form-group">
                        <button className="btn btn-secondary" type="button" onClick={this.signMessage.bind(this)}>Подписать</button>
                      </div>
                    </div>
                  }

                  {this.state.waterStatus === 2 && this.state.isSigned &&
                    <div className="form-group">
                      <button type="button" className="btn btn-primary" onClick={this.sendWaterResponse.bind(this, apz.id, true, "")}>
                        Отправить
                      </button>
                    </div>
                  }
                </div>
              }
            </div>
          }
          
          {(this.state.accept === false || this.state.accept === 0) && this.state.waterStatus === 2 && !this.state.xmlFile && !this.state.isSigned && this.state.isPerformer &&
            <form style={{border: 'solid 3px #F55549', padding: '5px'}}>
              <div className="form-group">
                <label>Номер документа</label>
                <input type="text" className="form-control" placeholder="" value={this.state.docNumber} onChange={this.onDocNumberChange} />
              </div>
              <div className="form-group">
                <label>Причина отклонения</label>
                <textarea rows="5" className="form-control" value={this.state.description} onChange={this.onDescriptionChange} placeholder="Описание"></textarea>
              </div>
              
              {(this.state.response === false && this.state.responseFile) &&
                <div className="form-group">
                  <label style={{display: 'block'}}>Прикрепленный файл</label>
                  <a className="pointer text-info" title="Скачать" onClick={this.downloadFile.bind(this, this.state.responseFile.id)}>
                    Скачать 
                  </a>
                </div>
              }

              <div className="form-group">
                <label htmlFor="upload_file">Прикрепить файл</label>
                <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
              </div>
              <div className="form-group">
                <button type="button" className="btn btn-secondary" onClick={this.sendWaterResponse.bind(this, apz.id, false, this.state.description)}>
                  Вернуть архитектору
                </button>
              </div>
            </form>
          }

          {(this.state.accept === 0 || this.state.accept === false) && this.state.responseId != 0 && (this.state.waterStatus === 0 || this.state.isSigned || this.state.isHead || this.state.isDirector) &&
            <div>
              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td style={{width: '40%'}}>Причина отклонения</td> 
                    <td>{this.state.description}</td>
                  </tr>
                  <tr>
                    <td>Номер документа</td>
                    <td>{this.state.docNumber}</td>
                  </tr>

                  {this.state.responseFile &&
                    <tr>
                      <td>Прикрепленный файл</td>
                      <td>
                        <a className="pointer text-info" title="Скачать" onClick={this.downloadFile.bind(this, this.state.responseFile.id)}>
                          Скачать 
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          <div className={this.state.showTechCon ? '' : 'invisible'}>
            <table className="table table-bordered table-striped">
              <tbody>
                <tr>
                  <td><b>Сформированный ТУ</b></td>
                  <td><a className="text-info pointer" onClick={this.printTechCon.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-sm-12">
           {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} />}

          <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
            {this.state.showMapText}
          </button>
        </div>

        <div className="col-sm-12">
          <hr />
          <Link className="btn btn-outline-secondary pull-right" to={'/providerwater/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
        </div>
      </div>
    )
  }
}

class ShowMap extends React.Component {
  render() {
    const options = {
      url: 'https://js.arcgis.com/4.6/'
    };

    var coordinates = this.props.coordinates;

    return (
      <div>
        <h5 className="block-title-2 mt-5 mb-3">Карта</h5>
        <div className="col-md-12 viewDiv"> 
          <EsriLoaderReact options={options} 
            modulesToLoad={[
              'esri/views/MapView',
              
              'esri/widgets/LayerList',

              'esri/WebScene',
              'esri/layers/FeatureLayer',
              'esri/layers/TileLayer',
              'esri/widgets/Search',
              'esri/WebMap',
              'esri/geometry/support/webMercatorUtils',
              'dojo/dom',
              'esri/Graphic',
              'dojo/domReady!'
            ]}    
            
            onReady={({loadedModules: [MapView, LayerList, WebScene, FeatureLayer, TileLayer, Search, WebMap, webMercatorUtils, dom, Graphic], containerNode}) => {
              var map = new WebMap({
                portalItem: {
                  id: "a0b7247966fa4754ad21634c3844371f"
                }
              });

              /*
              var waterLines = new FeatureLayer({
                url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%A2%D1%80%D1%83%D0%B1%D0%BE%D0%BF%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%D1%8B_%D0%B2%D0%BE%D0%B4%D0%BE%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F2/FeatureServer",
                outFields: ["*"],
                title: "Трубопроводы водоснабжения"
              });
              map.add(waterLines);

              var waterLineSafetyZone = new FeatureLayer({
                url: 'https://gis.uaig.kz/server/rest/services/Hosted/%D0%9E%D1%85%D1%80%D0%B0%D0%BD%D0%BD%D0%B0%D1%8F_%D0%B7%D0%BE%D0%BD%D0%B0_%D0%B2%D0%BE%D0%B4%D0%BE%D0%BF%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%D0%B0/FeatureServer',
                outFields: ["*"],
                title: "Охранная зона водопровода"
              });
              map.add(waterLineSafetyZone);

              var waterResourse = new FeatureLayer({
                url: 'https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%BE%D0%BD%D0%B0_%D0%BE%D0%B1%D0%B5%D1%81%D0%BF%D0%B5%D1%87%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8_%D0%B2%D0%BE%D0%B4%D0%BD%D1%8B%D0%BC%D0%B8_%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%B0%D0%BC%D0%B8/FeatureServer',
                outFields: ["*"],
                title: "Зоны обеспеч. водными ресурсами"
              });
              map.add(waterResourse);

              var flGosAkts = new FeatureLayer({
                url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
                outFields: ["*"],
                title: "Гос акты"
              });
              map.add(flGosAkts);
              */

              if (coordinates) {
                var coordinatesArray = coordinates.split(", ");

                var view = new MapView({
                  container: containerNode,
                  map: map,
                  center: [parseFloat(coordinatesArray[0]), parseFloat(coordinatesArray[1])], 
                  scale: 10000
                });

                var point = {
                  type: "point",
                  longitude: parseFloat(coordinatesArray[0]),
                  latitude: parseFloat(coordinatesArray[1])
                };

                var markerSymbol = {
                  type: "simple-marker",
                  color: [226, 119, 40],
                  outline: {
                    color: [255, 255, 255],
                    width: 2
                  }
                };

                var pointGraphic = new Graphic({
                  geometry: point,
                  symbol: markerSymbol
                });

                view.graphics.add(pointGraphic);
              } else {
                  view = new MapView({
                  container: containerNode,
                  map: map,
                  center: [76.886, 43.250], 
                  scale: 10000
                });
              }
              
              var searchWidget = new Search({
                view: view,
                sources: [{
                  featureLayer: new FeatureLayer({
                    url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
                    popupTemplate: { // autocasts as new PopupTemplate()
                      title: "Кадастровый номер: {cadastral_number} </br> Назначение: {function} <br/> Вид собственности: {ownership}"
                    }
                  }),
                  searchFields: ["cadastral_number"],
                  displayField: "cadastral_number",
                  exactMatch: false,
                  outFields: ["cadastral_number", "function", "ownership"],
                  name: "Зарегистрированные государственные акты",
                  placeholder: "Кадастровый поиск"
                }]
              });
    
              view.when( function(callback){
                var layerList = new LayerList({
                  view: view
                });

                // Add the search widget to the top right corner of the view
                view.ui.add(searchWidget, {
                  position: "top-right"
                });

                // Add widget to the bottom right corner of the view
                view.ui.add(layerList, "bottom-right");

              }, function(error) {
                console.log('MapView promise rejected! Message: ', error);
              });
            }}
          /> 
        </div>
      </div>
    )
  }
}