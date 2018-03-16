import React from 'react';
//import * as esriLoader from 'esri-loader';
import EsriLoaderReact from 'esri-loader-react';
//import { NavLink } from 'react-router-dom';
import { Route, NavLink, Link, Switch, Redirect } from 'react-router-dom';

export default class ApzDepartment extends React.Component {
  render() {
    return (
      <div className="content container urban-apz-page">
        <div className="card">
          <div className="card-header">
          <h4 className="mb-0">Архитектурно-планировочное задание</h4></div>
          <div className="card-body">
            <Switch>
              <Route path="/apz_department/status/:status" component={AllApzs} />
              <Route path="/apz_department/:id" component={ShowApz} />
              <Redirect from="/apz_department" to="/apz_department/status/active" />
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
      apzs: []
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

    var token = sessionStorage.getItem('tokenInfo');

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/apz_department", true);
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
    var status = this.props.match.params.status;
    
    return (
      <div>
        <ul className="nav nav-tabs mb-2 pull-right">
          <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/apz_department/status/active" replace>Активные</NavLink></li>
          <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/apz_department/status/accepted" replace>Принятые</NavLink></li>
          <li className="nav-item"><NavLink activeClassName="nav-link active" className="nav-link" activeStyle={{color:"black"}} to="/apz_department/status/declined" replace>Отказанные</NavLink></li>
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
                    <Link className="btn btn-outline-info" to={'/apz_department/' + apz.id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Просмотр</Link>
                  </td>
                </tr>
                );
              }.bind(this))
            }
          </tbody>
        </table>
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

    this.state = {
      apz: [],
      showMap: false,
      showButtons: false,
      showSignButtons: false,
      showTechCon: false,
      file: null,
      elecReqPower: "",
      elecPhase: "Однофазная",
      elecSafeCategory: "",
      connectionPoint: "",
      recomendation: "",
      description: "",
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
      elecStatus: 2,
      storageAlias: "PKCS12",
      xmlFile: false,
      isSigned: false
    };

    this.onFileChange = this.onFileChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.sendForm = this.sendForm.bind(this);
  }

  onFileChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  onDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  componentWillMount() {
    this.getApzInfo();
  }

  getApzInfo() {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/apz_department/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        //console.log(data);
        this.setState({apz: data});
        this.setState({showButtons: false});
        this.setState({showTechCon: false});
        this.setState({personalIdFile: data.files.filter(function(obj) { return obj.category_id === 3 })[0]});
        this.setState({confirmedTaskFile: data.files.filter(function(obj) { return obj.category_id === 9 })[0]});
        this.setState({titleDocumentFile: data.files.filter(function(obj) { return obj.category_id === 10 })[0]});

        if (data.status_id === 6) { 
          this.setState({showButtons: true}); 
        }

        this.setState({xmlFile: data.files.filter(function(obj) { return obj.category_id === 18})[0]});
      }
    }.bind(this)
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
    xhr.open("get", window.url + 'api/apz/apz_department/get_xml/' + this.state.apz.id, true);
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
      xhr.open("post", window.url + 'api/apz/apz_department/save_xml/' + this.state.apz.id, true);
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

  sendForm(apzId, status, comment) {
    var token = sessionStorage.getItem('tokenInfo');

    var formData = new FormData();
    formData.append('response', status);
    formData.append('message', comment);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/apz/apz_department/status/" + apzId, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        alert("Заявление отправлено!");
        this.setState({ showButtons: false });
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
      xhr.open("get", window.url + "api/apz/print/tc/electro/" + apzId, true);
      xhr.responseType = "blob";
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
        if (xhr.status === 200) {
          //test of IE
          if (typeof window.navigator.msSaveBlob === "function") {
            window.navigator.msSaveBlob(xhr.response, "tc-" + new Date().getTime() + ".pdf");
          } 
          else {
            var blob = xhr.response;
            var link = document.createElement('a');
            var today = new Date();
            var curr_date = today.getDate();
            var curr_month = today.getMonth() + 1;
            var curr_year = today.getFullYear();
            var formated_date = "(" + curr_date + "-" + curr_month + "-" + curr_year + ")";
            //console.log(curr_day);
            link.href = window.URL.createObjectURL(blob);
            link.download = "ТУ-Электр-" + project + formated_date + ".pdf";

            //append the link to the document body
            document.body.appendChild(link);
            link.click();
          }
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
  
  render() {
    var apz = this.state.apz;

    if (apz.length === 0) {
      return false;
    }

    return (
      <div>
        <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>
        
        <table className="table table-bordered table-striped">
          <tbody>
            <tr>
              <td style={{width: '22%'}}><b>ИД заявки</b></td>
              <td>{apz.id}</td>
            </tr>
            <tr>
              <td><b>Заявитель</b></td>
              <td>{apz.applicant}</td>
            </tr>
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
            <tr>
              <td><b>Дата заявления</b></td>
              <td>{apz.created_at && this.toDate(apz.created_at)}</td>
            </tr>
            
            {this.state.personalIdFile &&
              <tr>
                <td><b>Уд. лич./ Реквизиты</b></td>
                <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.personalIdFile.id)}>Скачать</a></td>
              </tr>
            }

            {this.state.confirmedTaskFile &&
              <tr>
                <td><b>Утвержденное задание</b></td>
                <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.confirmedTaskFile.id)}>Скачать</a></td>
              </tr>
            }

            {this.state.titleDocumentFile &&
              <tr>
                <td><b>Правоустанавл. документ</b></td>
                <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, this.state.titleDocumentFile.id)}>Скачать</a></td>
              </tr>
            }
          </tbody>
        </table>

        {this.state.showButtons &&
          <div>
            {!this.state.xmlFile && !this.state.isSigned ?
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
                  <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#declined_modal">Вернуть архитектору</button>
                </div>
              </div>
              :
              <div className={this.state.showButtons ? '' : 'invisible'}>
                <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                  <button className="btn btn-raised btn-success" onClick={this.sendForm.bind(this, apz.id, true, "")}>
                    Одобрить
                  </button>
                  <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#declined_modal">Вернуть архитектору</button>
                </div>
              </div>
            }

            <div className="modal fade" id="declined_modal" tabIndex="-1" role="dialog" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Вернуть архитектору</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Причина отклонения</label>
                      <textarea rows="5" className="form-control" value={this.state.description} onChange={this.onDescriptionChange} placeholder="Описание"></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.sendForm.bind(this, apz.id, false, this.state.description)}>
                      Вернуть архитектору
                    </button>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} />} 

        <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
          {this.state.showMapText}
        </button>

        <hr />
        <Link className="btn btn-outline-secondary pull-right" to={'/providerelectro/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
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
                  id: "b8c18c52c9a342c98d04f3ecd08c3f28"
                }
              });

              /*
              var electroLines = new FeatureLayer({
                url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%9B%D0%B8%D0%BD%D0%B5%D0%B9%D0%BD%D1%8B%D0%B9_%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82_%D0%B3%D0%B8%D0%B4%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B82/FeatureServerkb",
                outFields: ["*"],
                title: "Линии электроснабжения"
              });
              map.add(electroLines);

              var electroLinesUnderground = new FeatureLayer({
                url: "http://gis.uaig.kz/server/rest/services/Hosted/%D0%AD%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BA%D0%B0%D0%B1%D0%B5%D0%BB%D0%B8_%D0%BF%D0%BE%D0%B4%D0%B7%D0%B5%D0%BC%D0%BD%D1%8B%D0%B5/FeatureServer",
                outFields: ["*"],
                title: "Электрокабели подземные"
              });
              map.add(electroLinesUnderground);

              var sysElectroLines = new FeatureLayer({
                url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%A1%D0%BE%D0%BE%D1%80%D1%83%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F_%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B_%D1%8D%D0%BD%D0%B5%D1%80%D0%B3%D0%BE%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F/FeatureServer",
                outFields: ["*"],
                title: "Cооружения системы электроснабжения"
              });
              map.add(sysElectroLines);

              var stolby = new FeatureLayer({
                url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%A1%D1%82%D0%BE%D0%BB%D0%B1%D1%8B_%D0%B2%D0%BE%D0%B7%D0%B4%D1%83%D1%88%D0%BD%D1%8B%D1%85_%D0%BB%D0%B8%D0%BD%D0%B8%D0%B9_%D1%8D%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%D0%B0%D1%872/FeatureServer",
                outFields: ["*"],
                title: "Cтолбы возд. линий электропередач"
              });
              map.add(stolby);
              
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