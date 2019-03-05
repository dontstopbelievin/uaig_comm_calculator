import React from 'react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import {Switch} from 'react-router-dom';
import Loader from 'react-loader-spinner';
import ShowMap from './ShowMap';

export default class ShowSketch extends React.Component {
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
      sketch: [],
      showMap: false,
      showMapText: 'Показать карту',
      loaderHidden: false,
      showButtons: false,
      showSignButtons: false,
      responseText: '',
      callSaveFromSend: false,
      file: [],
      storageAlias: "PKCS12",
      xmlFile: false,
      isSigned: false,
    };

    this.onResponseTextChange = this.onResponseTextChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
  }
  componentDidMount() {
    this.props.breadCrumbs();
  }

  onResponseTextChange(e) {
    this.setState({ responseText: e.target.value });
  }

  onFileChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  componentWillMount() {
    this.getSketchInfo();
  }

  getSketchInfo() {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');

    this.setState({ loaderHidden: false });

    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/sketch/apz_department/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var sketch = JSON.parse(xhr.responseText);

        if (sketch.status_id === 6 && !sketch.apz_department_response) {
          this.setState({showButtons: true});
        }

        if (sketch.status_id === 6 && sketch.apz_department_response && !this.state.xmlFile) {
          this.setState({showSignButtons: true});
        }

        if (sketch.apz_department_response && sketch.apz_department_response.files) {
          this.setState({xmlFile: sketch.apz_department_response.files.filter(function(obj) { return obj.category_id === 18})[0]});
        }

        if (this.state.xmlFile) {
          this.setState({isSigned: true});
        }

        if (sketch.status_id === 6 && this.state.xmlFile) {
          this.setState({showSendButton: true});
        }

        this.setState({sketch: sketch});
        this.setState({loaderHidden: true});
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this)
    xhr.send();
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

  downloadFile(id) {
    var token = sessionStorage.getItem('tokenInfo');
    var url = window.url + 'api/file/download/' + id;

    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
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
              setTimeout(function() {window.URL.revokeObjectURL(url);},0);
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
    xhr.open("get", window.url + 'api/sketch/apz_department/get_xml/' + this.state.sketch.id, true);
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
      xhr.open("post", window.url + 'api/sketch/apz_department/save_xml/' + this.state.sketch.id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          this.setState({ isSigned: true });
          this.setState({ showSendButton: true });
        } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
          alert(JSON.parse(xhr.responseText).message);
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

  chooseStorage(storage) {
    this.browseKeyStore(storage, "P12", '', "chooseStoragePathBack");
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
      if (this.heartbeat_interval === "") {
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

  saveForm(sketchId, status) {
    var token = sessionStorage.getItem('tokenInfo');
    var file = this.state.file;

    if (!file) {
      alert('Не выбран файл');
      return false;
    }

    var formData = new FormData();
    formData.append('file', file);
    formData.append('Response', status);
    formData.append('Message', this.state.responseText);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/sketch/apz_department/save/" + sketchId, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        alert("Ответ сохранен!");

        this.setState({ showButtons: false });
        this.setState({ showSignButtons: true });
      }
      else if(xhr.status === 401){
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send(formData);

    $('.modal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  sendForm(sketchId, status) {
    var token = sessionStorage.getItem('tokenInfo');
    var formData = new FormData();
    formData.append('response', status);
    formData.append('message', this.state.responseText);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/sketch/apz_department/status/" + sketchId, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
      if (xhr.status === 200) {
        alert("Заявление отправлено!");
        this.setState({ showSendButton: false });
      } else if(xhr.status === 401){
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
        alert(JSON.parse(xhr.responseText).message);
      }
    }.bind(this);
    xhr.send(formData);
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
    var sketch = this.state.sketch;

    if (sketch.length === 0) {
      return (
        <div>
          {!this.state.loaderHidden &&
            <div style={{textAlign: 'center'}}>
              <Loader type="Oval" color="#46B3F2" height="200" width="200" />
            </div>
          }
        </div>
      );
    }

    return (
      <div>
        {this.state.loaderHidden &&
          <div>
            <h5 className="block-title-2 mt-3 mb-3">Общая информация</h5>

            <table className="table table-bordered table-striped">
              <tbody>
                <tr>
                  <td style={{width: '22%'}}><b>ИД заявки</b></td>
                  <td>{sketch.id}</td>
                </tr>
                <tr>
                  <td><b>Заявитель</b></td>
                  <td>{sketch.applicant}</td>
                </tr>
                <tr>
                  <td><b>Телефон</b></td>
                  <td>{sketch.phone}</td>
                </tr>
                <tr>
                  <td><b>Заказчик</b></td>
                  <td>{sketch.customer}</td>
                </tr>
                <tr>
                  <td><b>Проектировщик №ГСЛ, категория</b></td>
                  <td>{sketch.designer}</td>
                </tr>
                <tr>
                  <td><b>Название проекта</b></td>
                  <td>{sketch.project_name}</td>
                </tr>
                <tr>
                  <td><b>Адрес проектируемого объекта</b></td>
                  <td>{sketch.project_address}</td>
                </tr>
                <tr>
                  <td><b>Дата заявления</b></td>
                  <td>{sketch.created_at && this.toDate(sketch.created_at)}</td>
                </tr>
              </tbody>
            </table>

            {sketch.files.length > 0 &&
              <table className="table table-bordered table-striped">
                <tbody>
                  {sketch.files.map(function(file, index) {
                    return(
                      <tr key={index}>
                        <td style={{width: '22%'}}>{file.category.name_ru} </td>
                        <td><a className="text-info pointer" onClick={this.downloadFile.bind(this, file.id)}>Скачать</a></td>
                      </tr>
                      );
                    }.bind(this))
                  }
                </tbody>
              </table>
            }

            {this.state.showMap && <ShowMap />}

            <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
              {this.state.showMapText}
            </button>

            {this.state.showSignButtons && !this.state.isSigned &&
              <div style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                <div>Выберите хранилище</div>

                <div className="btn-group mb-2" role="group" style={{margin: 'auto', display: 'table'}}>
                  <button className="btn btn-raised" style={{marginRight: '5px'}} onClick={this.chooseFile.bind(this)}>файловое хранилище</button>
                  <button className="btn btn-raised" onClick={this.chooseStorage.bind(this, 'AKKaztokenStore')}>eToken</button>
                </div>

                <div className="form-group">
                  <input className="form-control" placeholder="Путь к ключу" type="hidden" id="storagePath" />
                  <input className="form-control" placeholder="Пароль" id="inpPassword" type="password" />
                </div>

                <div className="form-group">
                  <button className="btn btn-secondary" type="button" onClick={this.signMessage.bind(this)}>Подписать</button>
                </div>
              </div>
            }

            {this.state.showButtons &&
              <div>
                <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                  <button className="btn btn-raised btn-success" style={{marginRight: '5px'}} data-toggle="modal" data-target="#AcceptSketchForm">
                    Одобрить
                  </button>
                  <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#DeclineSketchForm">Отказать</button>
                </div>

                <div className="modal fade" id="AcceptSketchForm" tabIndex="-1" role="dialog" aria-hidden="true">
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Одобрение заявки</h5>
                        <button type="button" id="AcceptSketchFormModalClose" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label htmlFor="docNumber">Текст</label>
                          <textarea className="form-control" value={this.state.responseText} onChange={this.onResponseTextChange} cols="30" rows="5"></textarea>
                        </div>
                        <div className="form-group">
                          <label htmlFor="upload_file">Прикрепить файл</label>
                          <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={this.saveForm.bind(this, sketch.id, true)}>Отправить</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal fade" id="DeclineSketchForm" tabIndex="-1" role="dialog" aria-hidden="true">
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Отказ заявки</h5>
                        <button type="button" id="DeclineSketchFormModalClose" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label htmlFor="docNumber">Причина отказа</label>
                          <textarea className="form-control" value={this.state.responseText} onChange={this.onResponseTextChange} cols="30" rows="5"></textarea>
                        </div>
                        <div className="form-group">
                          <label htmlFor="upload_file">Прикрепить файл</label>
                          <input type="file" id="upload_file" className="form-control" onChange={this.onFileChange} />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={this.sendForm.bind(this, sketch.id, false)}>Отправить</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }

            {this.state.showSendButton &&
              <div className="form-group text-center">
                <button type="button" className="btn btn-raised btn-success" onClick={this.sendForm.bind(this, sketch.id, true)}>Отправить</button>
              </div>
            }

            <div className="col-sm-12">
              <hr />
              <button className="btn btn-outline-secondary pull-right" onClick={this.props.history.goBack}><i className="glyphicon glyphicon-chevron-left"></i> Назад</button>
            </div>
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
