import React from 'react';
import Loader from 'react-loader-spinner';
import {NavLink} from 'react-router-dom';
import $ from 'jquery';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CommissionAnswersList from '../components/CommissionAnswersList';
import ShowMap from "./ShowMap";

export default class ShowApz extends React.Component {
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
        showButtons: true,
        description: '',
        showMapText: 'Показать карту',
        loaderHidden: false,
        personalIdFile: false,
        confirmedTaskFile: false,
        titleDocumentFile: false,
        additionalFile: false,
        engineerReturnedState: false,
        apzReturnedState: false,
        needSign: false,
        storageAlias: "PKCS12",
        //acceptSign: false,
        backFromHead: false,
        apz_head_id: '',
        apz_heads_id: [],
        engineerSign: false,
        apzSign: false,
        xmlFile: false,
        loaderHiddenSign:true
      };

      this.onDescriptionChange = this.onDescriptionChange.bind(this);
    }

    onDescriptionChange(e) {
      this.setState({ description: e.target.value });
    }

    componentDidMount() {
      this.props.breadCrumbs();
    }
    componentWillMount() {
      if(!sessionStorage.getItem('tokenInfo')){
        let fullLoc = window.location.href.split('/');
        this.props.history.replace({pathname: "/panel/common/login", state:{url_apz_id: fullLoc[fullLoc.length-1]}});
      }else {
        console.log('MOUNTING');
        this.getHeads();
        this.getApzInfo();
        this.webSocketFunction();
      }
    }

    getHeads(){
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/getheads", true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          //console.log(data);
          var select_directors = [];
          for (var i = 0; i < data.length; i++) {
            select_directors.push(<option key={i} value={data[i].user_id}> {data[i].last_name +' ' + data[i].first_name+' '+data[i].middle_name} </option>);
          }
          this.setState({apz_heads_id: select_directors});
          if((this.state.apz_head_id === "" || this.state.apz_head_id === " ") && data.length > 0){
              this.setState({apz_head_id: data[0].user_id});
          }
        }
      }.bind(this);
      xhr.send();
    }

    getApzInfo() {
      var id = this.props.match.params.id;
      var token = sessionStorage.getItem('tokenInfo');
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/apz/region/detail/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          var apz = JSON.parse(xhr.responseText);
          this.setState({apz: apz});
          this.setState({personalIdFile: apz.files.filter(function(obj) { return obj.category_id === 3 })[0]});
          this.setState({confirmedTaskFile: apz.files.filter(function(obj) { return obj.category_id === 9 })[0]});
          this.setState({titleDocumentFile: apz.files.filter(function(obj) { return obj.category_id === 10 })[0]});
          this.setState({additionalFile: apz.files.filter(function(obj) { return obj.category_id === 27 })[0]});
          this.setState({reglamentFile: apz.files.filter(function(obj) { return obj.category_id === 29 })[0]});
          this.setState({showButtons: false});
          for(var data_index = apz.state_history.length-1; data_index >= 0; data_index--){
            switch (apz.state_history[data_index].state_id) {
              case 33:
                this.setState({backFromHead: apz.state_history[data_index]});
                break;
              default:
                continue;
            }
            break;
          }
          this.setState({engineerReturnedState: apz.state_history.filter(function(obj) { return obj.state_id === 1 && obj.sender === 'engineer'})[0]});
          this.setState({apzReturnedState: apz.state_history.filter(function(obj) { return obj.state_id === 1 && obj.sender === 'apz'})[0]});
          this.setState({needSign: apz.state_history.filter(function(obj) { return obj.state_id === 1 && obj.comment === null })[0]});
          this.setState({engineerSign: apz.files.filter(function(obj) { return obj.category_id === 28 })[0]});
          this.setState({apzSign: apz.files.filter(function(obj) { return obj.category_id === 18 })[0]});
          if(apz.apz_head_id){this.setState({apz_head_id: apz.apz_head_id});}

          if (apz.status_id === 3) {
            this.setState({showButtons: true});
          }

          this.setState({loaderHidden: true});
          // BE CAREFUL OF category_id should be xml регионального архитектора
          this.setState({xmlFile: apz.files.filter(function(obj) { return obj.category_id === 21})[0]});
          this.setState({needSign: apz.files.filter(function(obj) { return obj.category_id === 21})[0]});
          if(apz.state_history.filter(function(obj) { return obj.state_id === 33 })[0] != null){
              this.setState({needSign: false});
          }
          //use instead new columns from table
          if(!apz.urban_sign_returned){
              this.setState({xmlFile: false});
          }
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        }
      }.bind(this);
      xhr.send();
    }

    handleHeadIDChange(event){
      this.setState({apz_head_id: event.target.value});
    }

    downloadFile(id, progbarId = null) {
      var token = sessionStorage.getItem('tokenInfo');

      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + 'api/file/download/' + id, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        var vision = $('.text-info[data-category='+progbarId+']');
        var progressbar = $('.progress[data-category='+progbarId+']');
        vision.css('display', 'none');
        progressbar.css('display', 'flex');
        xhr.onprogress = function(event) {
          $('div', progressbar).css('width', parseInt(event.loaded / parseInt(event.target.getResponseHeader('Last-Modified'), 10) * 100, 10) + '%');
        }
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
                setTimeout(function() {
                  window.URL.revokeObjectURL(url);
                  $('div', progressbar).css('width', 0);
                  progressbar.css('display', 'none');
                  vision.css('display','inline');
                  alert("Файлы успешно загружены");
                },1000);
              };

            }());

            saveByteArray([base64ToArrayBuffer(data.file)], data.file_name);
          } else {
            $('div', progressbar).css('width', 0);
            progressbar.css('display', 'none');
            vision.css('display','inline');
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
      //console.log(browseKeyStore);
      this.callback = callBack;
      this.webSocketFunction();
      this.setMissedHeartbeatsLimitToMax();
      //console.log(browseKeyStore);
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
      this.setState({loaderHiddenSign: false});
      let password = document.getElementById("inpPassword").value;
      let path = document.getElementById("storagePath").value;
      let keyType = "SIGN";
      //console.log(path);
      if (path !== null && path !== "" && this.state.storageAlias !== null && this.state.storageAlias !== "") {
        if (password !== null && password !== "") {
            this.getKeys(this.state.storageAlias, path, password, keyType, "loadKeysBack");
        } else {
          alert("Введите пароль к хранилищу");
          this.setState({loaderHiddenSign: true});
        }
      } else {
        alert("Не выбран хранилище!");
        this.setState({loaderHiddenSign: true});
      }
    }

    loadKeysBack(result) {
      if (result.errorCode === "WRONG_PASSWORD") {
        alert("Неверный пароль!");
        this.setState({loaderHiddenSign: true});
        return false;
      }

      let alias = "";
      //console.log(result);
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
      xhr.open("get", window.url + 'api/apz/region/get_xml/' + this.state.apz.id, true);
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
        xhr.open("post", window.url + 'api/apz/region/save_xml/' + this.state.apz.id, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onload = function() {
          if (xhr.status === 200) {
            this.setState({ xmlFile: true });
            alert("Успешно подписан!");
          } else {
            alert("Не удалось подписать файл");
            this.setState({loaderHiddenSign: true})
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
        console.log(rw.getErrorCode());
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
        this.setMissedHeartbeatsLimitToMin();
      }.bind(this);
    }

    openDialog() {
      alert("Ошибка при подключении к прослойке NCALayer. Убедитесь, что программа запущена и перезагрузите страницу");
    }

    acceptDeclineApzForm(apzId, status, comment) {
      var token = sessionStorage.getItem('tokenInfo');

      var registerData = {
        response: status,
        message: comment,
        apz_head_id: this.state.apz_head_id
      };

      if (!status && !comment) {
        alert('Заполните причину отказа');
        return false;
      }

      var data = JSON.stringify(registerData);

      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/apz/region/status/" + apzId, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function () {
        if (xhr.status === 200) {
          //var data = JSON.parse(xhr.responseText);

          if(status === true) {
            alert("Заявление принято!");
            this.setState({ showButtons: false });
          } else {
            alert("Заявление отклонено!");
            this.setState({ showButtons: false });
          }
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        } else if (xhr.status === 403 && JSON.parse(xhr.responseText).message) {
          alert(JSON.parse(xhr.responseText).message);
        }

        if (!status) {
          $('#accDecApzForm').modal('hide');
          $('#ReturnApzForm').modal('hide');
        }
      }.bind(this);
      xhr.send(data);
    }

    sendToApz() {
      this.setState({needSign: true });
    }
    hideSignBtns() {
      this.setState({needSign: false });
    }

    /*sendToApzAccept(){
      this.setState({acceptSign: true });
    }*/

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
      var curr_date = jDate.getDate() < 10 ? "0" + jDate.getDate() : jDate.getDate();
      var curr_month = (jDate.getMonth() + 1) < 10 ? "0" + (jDate.getMonth() + 1) : jDate.getMonth() + 1;
      var curr_year = jDate.getFullYear();
      var curr_hour = jDate.getHours() < 10 ? "0" + jDate.getHours() : jDate.getHours();
      var curr_minute = jDate.getMinutes() < 10 ? "0" + jDate.getMinutes() : jDate.getMinutes();
      var formated_date = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_minute;

      return formated_date;
    }

    printApz(apzId, project) {
      var token = sessionStorage.getItem('tokenInfo');
      if (token) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/print/apz/" + apzId, true);
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
                  setTimeout(function() {window.URL.revokeObjectURL(url);},0);
                };

              }());

              saveByteArray([base64ToArrayBuffer(data.file)], "апз-" + project + formated_date + ".pdf");
            }
          } else {
            alert('Не удалось скачать файл');
          }
        }
        xhr.send();
      } else {
        console.log('session expired');
      }
    }

    printRegionAnswer(apzId) {
      var token = sessionStorage.getItem('tokenInfo');
      if (token) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/print/region/" + apzId, true);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.onload = function () {
          if (xhr.status === 200) {
            //test of IE
            if (typeof window.navigator.msSaveBlob === "function") {
              window.navigator.msSaveBlob(xhr.response, "МО.pdf");
            } else {
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

              saveByteArray([base64ToArrayBuffer(data.file)], "МО.pdf");
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

    render() {
      var apz = this.state.apz;

      return (
        <div>
          {this.state.loaderHidden &&
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
                    <td>
                      {apz.applicant}
                      <NavLink style={{marginLeft:'5px'}} exact className="btn btn-raised btn-primary btn-sm" to={"/panel/apz/all_history/"+apz.user_id+"/1"}>История заявлений</NavLink>
                    </td>
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
                      <td><a className="text-info pointer" data-category="1" onClick={this.downloadFile.bind(this, this.state.personalIdFile.id, 1)}>Скачать</a>
                        <div className="progress mb-2" data-category="1" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }

                  {this.state.confirmedTaskFile &&
                    <tr>
                      <td><b>Утвержденное задание</b></td>
                      <td><a className="text-info pointer" data-category="2" onClick={this.downloadFile.bind(this, this.state.confirmedTaskFile.id, 2)}>Скачать</a>
                        <div className="progress mb-2" data-category="2" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }

                  {this.state.titleDocumentFile &&
                    <tr>
                      <td><b>Правоустанавл. документ</b></td>
                      <td><a className="text-info pointer" data-category="3" onClick={this.downloadFile.bind(this, this.state.titleDocumentFile.id, 3)}>Скачать</a>
                        <div className="progress mb-2" data-category="3" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }

                  {this.state.additionalFile &&
                    <tr>
                      <td><b>Дополнительно</b></td>
                      <td><a className="text-info pointer" data-category="4" onClick={this.downloadFile.bind(this, this.state.additionalFile.id, 4)}>Скачать</a>
                        <div className="progress mb-2" data-category="4" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>

              <h5 className="block-title-2 mb-3">Службы</h5>

              <table className="table table-bordered table-striped">
                <tbody>
                  {!!apz.need_water_provider && apz.apz_water &&
                    <tr>
                      <td style={{width: '40%'}}><b>Водоснабжение</b></td>
                      <td><a className="text-info pointer" data-toggle="modal" data-target="#water_modal">Просмотр</a></td>
                    </tr>
                  }

                  {!!apz.need_heat_provider && apz.apz_heat &&
                    <tr>
                      <td style={{width: '40%'}}><b>Теплоснабжение</b></td>
                      <td><a className="text-info pointer" data-toggle="modal" data-target="#heat_modal">Просмотр</a></td>
                    </tr>
                  }

                  {!!apz.need_electro_provider && apz.apz_electricity &&
                    <tr>
                      <td style={{width: '40%'}}><b>Электроснабжение</b></td>
                      <td><a className="text-info pointer" data-toggle="modal" data-target="#electro_modal">Просмотр</a></td>
                    </tr>
                  }

                  {!!apz.need_gas_provider && apz.apz_gas &&
                    <tr>
                      <td style={{width: '40%'}}><b>Газоснабжение</b></td>
                      <td><a className="text-info pointer" data-toggle="modal" data-target="#gas_modal">Просмотр</a></td>
                    </tr>
                  }

                  {!!apz.need_phone_provider && apz.apz_phone &&
                    <tr>
                      <td style={{width: '40%'}}><b>Телефонизация</b></td>
                      <td><a className="text-info pointer" data-toggle="modal" data-target="#phone_modal">Просмотр</a></td>
                    </tr>
                  }
                </tbody>
              </table>

              {apz.apz_water &&
                <div className="modal fade" id="water_modal" tabIndex="-1" role="dialog" aria-hidden="true">
                  <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Водоснабжение</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <table className="table table-bordered table-striped" style={{textAlign: 'left'}}>
                          <tbody>
                            <tr>
                              <td style={{width: '70%'}}>Общая потребность (м<sup>3</sup>/сутки)</td>
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

                        {apz.apz_sewage &&
                          <table className="table table-bordered table-striped" style={{textAlign: 'left'}}>
                            <tbody>
                              <tr>
                                <td style={{width: '70%'}}>Общее количество сточных вод (м<sup>3</sup>/сутки)</td>
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
                        }
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                      </div>
                    </div>
                  </div>
                </div>
              }

              {apz.apz_heat &&
                <div className="modal fade" id="heat_modal" tabIndex="-1" role="dialog" aria-hidden="true">
                  <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Теплоснабжение</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <table className="table table-bordered table-striped">
                          <tbody>
                            <tr>
                              <td style={{width: '70%'}}>Общая нагрузка (Гкал/ч)</td>
                              <td>{apz.apz_heat.general}</td>
                            </tr>
                            <tr>
                              <td>Отопление (Гкал/ч)</td>
                              <td>{apz.apz_heat.main_heat}</td>
                            </tr>
                            <tr>
                              <td>Вентиляция (Гкал/ч)</td>
                              <td>{apz.apz_heat.main_ven}</td>
                            </tr>
                            <tr>
                              <td>Горячее водоснабжение, ср (Гкал/ч)</td>
                              <td>{apz.apz_heat.main_water}</td>
                            </tr>
                            <tr>
                              <td>Горячее водоснабжение, макс (Гкал/ч)</td>
                              <td>{apz.apz_heat.main_water_max}</td>
                            </tr>
                            <tr>
                              <td>Энергосб. мероприятие</td>
                              <td>{apz.apz_heat.saving}</td>
                            </tr>
                            <tr>
                              <td>Технолог. нужды(пар) (Т/ч)</td>
                              <td>{apz.apz_heat.tech}</td>
                            </tr>

                            {apz.apz_heat.contract_num &&
                              <tr>
                                <td>Номер договора</td>
                                <td>{apz.apz_heat.contract_num}</td>
                              </tr>
                            }

                            {apz.apz_heat.general_in_contract &&
                              <tr>
                                <td>Общая тепловая нагрузка по договору (Гкал/ч)</td>
                                <td>{apz.apz_heat.general_in_contract}</td>
                              </tr>
                            }

                            {apz.apz_heat.tech_in_contract &&
                              <tr>
                                <td>Технологическая нагрузка(пар) по договору (Гкал/ч)</td>
                                <td>{apz.apz_heat.tech_in_contract}</td>
                              </tr>
                            }

                            {apz.apz_heat.main_in_contract &&
                              <tr>
                                <td>Отопление по договору (Гкал/ч)</td>
                                <td>{apz.apz_heat.main_in_contract}</td>
                              </tr>
                            }

                            {apz.apz_heat.water_in_contract &&
                              <tr>
                                <td>Горячее водоснабжение по договору (ср/ч)</td>
                                <td>{apz.apz_heat.water_in_contract}</td>
                              </tr>
                            }

                            {apz.apz_heat.ven_in_contract &&
                              <tr>
                                <td>Вентиляция по договору (Гкал/ч)</td>
                                <td>{apz.apz_heat.ven_in_contract}</td>
                              </tr>
                            }

                            {apz.apz_heat.water_in_contract_max &&
                              <tr>
                                <td>Горячее водоснабжение по договору (макс/ч)</td>
                                <td>{apz.apz_heat.water_in_contract_max}</td>
                              </tr>
                            }
                          </tbody>
                        </table>

                        {apz.apz_heat.heatDistribution && apz.apz_heat.blocks &&
                          <div>
                            <div>Разделение нагрузки</div>
                            {apz.apz_heat.blocks.map(function(item, index) {
                              return(
                                <div key={index}>
                                  {apz.apz_heat.blocks.length > 1 &&
                                    <h5 className="block-title-2 mt-4 mb-3">Здание №{index + 1}</h5>
                                  }

                                  <table className="table table-bordered table-striped">
                                    <tbody>
                                      <tr>
                                        <td style={{width: '70%'}}>Отопление (Гкал/ч)</td>
                                        <td>{item.main}</td>
                                      </tr>
                                      <tr>
                                        <td>Вентиляция (Гкал/ч)</td>
                                        <td>{item.ventilation}</td>
                                      </tr>
                                      <tr>
                                        <td>Горячее водоснаб. (ср/ч)</td>
                                        <td>{item.water}</td>
                                      </tr>
                                      <tr>
                                        <td>Горячее водоснаб. (макс/ч)</td>
                                        <td>{item.water_max}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              );
                            })}
                          </div>
                        }
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                      </div>
                    </div>
                  </div>
                </div>
              }

              {apz.apz_electricity &&
                <div className="modal fade" id="electro_modal" tabIndex="-1" role="dialog" aria-hidden="true">
                  <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Электроснабжение</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <table className="table table-bordered table-striped">
                          <tbody>
                            <tr>
                              <td style={{width: '60%'}}>Требуемая мощность (кВт)</td>
                              <td>{apz.apz_electricity.required_power}</td>
                            </tr>
                            <tr>
                              <td>Характер нагрузки (фаза)</td>
                              <td>{apz.apz_electricity.phase}</td>
                            </tr>
                            <tr>
                              <td>Категория (кВт)</td>
                              <td>{apz.apz_electricity.safety_category}</td>
                            </tr>
                            <tr>
                              <td>Из указ. макс. нагрузки относ. к э-приемникам (кВА)</td>
                              <td>{apz.apz_electricity.max_load_device}</td>
                            </tr>
                            <tr>
                              <td>Сущ. макс. нагрузка (кВА)</td>
                              <td>{apz.apz_electricity.max_load}</td>
                            </tr>
                            <tr>
                              <td>Мощность трансформаторов (кВА)</td>
                              <td>{apz.apz_electricity.allowed_power}</td>
                            </tr>

                            {this.state.claimedCapacityJustification &&
                              <tr>
                                <td>Расчет-обоснование заявленной мощности</td>
                                <td><a className="text-info pointer" data-category="5" onClick={this.downloadFile.bind(this, this.state.claimedCapacityJustification.id, 5)}>Скачать</a>
                                  <div className="progress mb-2" data-category="5" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                  </div>
                                </td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                      </div>
                    </div>
                  </div>
                </div>
              }

              {apz.apz_gas &&
                <div className="modal fade" id="gas_modal" tabIndex="-1" role="dialog" aria-hidden="true">
                  <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Газоснабжение</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <table className="table table-bordered table-striped">
                          <tbody>
                            <tr>
                              <td style={{width: '60%'}}>Общ. потребность (м<sup>3</sup>/час)</td>
                              <td>{apz.apz_gas.general}</td>
                            </tr>
                            <tr>
                              <td>На приготов. пищи (м<sup>3</sup>/час)</td>
                              <td>{apz.apz_gas.cooking}</td>
                            </tr>
                            <tr>
                              <td>Отопление (м<sup>3</sup>/час)</td>
                              <td>{apz.apz_gas.heat}</td>
                            </tr>
                            <tr>
                              <td>Вентиляция (м<sup>3</sup>/час)</td>
                              <td>{apz.apz_gas.ventilation}</td>
                            </tr>
                            <tr>
                              <td>Кондиционирование (м<sup>3</sup>/час)</td>
                              <td>{apz.apz_gas.conditionaer}</td>
                            </tr>
                            <tr>
                              <td>Горячее водоснаб. (м<sup>3</sup>/час)</td>
                              <td>{apz.apz_gas.water}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                      </div>
                    </div>
                  </div>
                </div>
              }

              {apz.apz_phone &&
                <div className="modal fade" id="phone_modal" tabIndex="-1" role="dialog" aria-hidden="true">
                  <div className="modal-dialog" role="document" style={{maxWidth: '600px'}}>
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Телефонизация</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <table className="table table-bordered table-striped">
                          <tbody>
                            <tr>
                              <td style={{width: '60%'}}>Количество ОТА и услуг в разбивке физ.лиц и юр.лиц</td>
                              <td>{apz.apz_phone.service_num}</td>
                            </tr>
                            <tr>
                              <td>Телефонная емкость</td>
                              <td>{apz.apz_phone.capacity}</td>
                            </tr>
                            <tr>
                              <td>Планируемая телефонная канализация</td>
                              <td>{apz.apz_phone.sewage}</td>
                            </tr>
                            <tr>
                              <td>Пожелания заказчика (тип оборудования, тип кабеля и др.)</td>
                              <td>{apz.apz_phone.client_wishes}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                      </div>
                    </div>
                  </div>
                </div>
              }

              {apz.commission && (Object.keys(apz.commission).length > 0) &&
                <div>
                  <h5 className="block-title-2 mb-3">Ответы от служб</h5>
                  <CommissionAnswersList apz={apz} />
                </div>
              }

              {apz.apz_department_response &&
                <div>
                  <h5 className="block-title-2 mb-3">Ответ от АПЗ отдела</h5>
                  <table className="table table-bordered table-striped">
                    <tbody>
                      <tr>
                        <td style={{width: '22%'}}><b>Сформированный АПЗ</b></td>
                        <td><a className="text-info pointer" onClick={this.printApz.bind(this, apz.id, apz.project_name)}>Скачать</a></td>
                      </tr>
                      {this.state.reglamentFile &&
                        <tr>
                          <td style={{width: '22%'}}><b>Регламент</b></td>
                          <td><a className="text-info pointer" data-category="6" onClick={this.downloadFile.bind(this, this.state.reglamentFile.id, 6)}>Скачать</a>
                            <div className="progress mb-2" data-category="6" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                              <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                          </td>
                        </tr>}
                    </tbody>
                  </table>
                </div>
              }

              {this.state.showMap && <ShowMap coordinates={apz.project_address_coordinates} />}

              <button className="btn btn-raised btn-info" onClick={this.toggleMap.bind(this, !this.state.showMap)} style={{margin: '20px auto 10px'}}>
                {this.state.showMapText}
              </button>

              {this.state.engineerReturnedState &&
                <div className="alert alert-danger">
                  Комментарий инженера: {this.state.engineerReturnedState.comment}
                </div>
              }
              {this.state.apzReturnedState &&
                <div className="alert alert-danger">
                  Комментарий апз отдела: {this.state.apzReturnedState.comment}
                </div>
              }
              {apz.status_id === 1 &&
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td style={{width: '22%'}}><b>Мотивированный отказ</b></td>
                        {this.state.headResponseFile ?
                          <td><a className="text-info pointer" data-category="6" onClick={this.downloadFile.bind(this, this.state.headResponseFile.id, 6)}>Скачать</a>
                            <div className="progress mb-2" data-category="6" style={{height: '20px', display: 'none', marginTop:'5px'}}>
                              <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                          </td>
                        :
                          <td><a className="text-info pointer" onClick={this.printRegionAnswer.bind(this, apz.id)}>Скачать</a></td>
                        }
                    </tr>
                  </tbody>
                </table>
              }
              {this.state.backFromHead &&
                <div className="alert alert-danger">
                  Комментарий главного архитектора: {this.state.backFromHead.comment}
                </div>
              }
              <div className={this.state.showButtons ? '' : 'invisible'}>
                <div className="btn-group" role="group" aria-label="acceptOrDecline" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                  {!this.state.needSign ?
                    <div style={{margin: 'auto', display: 'table'}}>
                      <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.sendToApz.bind(this)}>Поставить подпись</button>
                      <button className="btn btn-raised btn-danger" data-toggle="modal" data-target="#ReturnApzForm">
                          Вернуть на доработку
                      </button>
                    </div>
                    :
                      <div>
                      { !this.state.xmlFile ?
                        <div id="MySignForm" style={{margin: 'auto', marginTop: '20px', display: 'table'}}>
                          <div>Выберите хранилище</div>

                          <div className="btn-group mb-2" role="group" style={{margin: 'auto', display: 'table'}}>
                            <button className="btn btn-raised" style={{marginRight: '5px'}} onClick={this.chooseFile.bind(this)}>файловое хранилище</button>
                            <button className="btn btn-raised" onClick={this.chooseStorage.bind(this, 'AKKaztokenStore')}>Kaztoken</button>
                          </div>

                          <div className="form-group">
                            <input className="form-control" placeholder="Путь к ключу" type="hidden" id="storagePath" />
                            <input className="form-control" placeholder="Пароль" id="inpPassword" type="password" />
                          </div>
                          {!this.state.loaderHiddenSign &&
                          <div style={{margin: '0 auto'}}>
                              <Loader type="Ball-Triangle" color="#46B3F2" height="70" width="70" />
                          </div>
                          }
                          {this.state.loaderHiddenSign &&
                          <div className="form-group">
                              <button className="btn btn-raised btn-success" type="button"
                                      onClick={this.signMessage.bind(this)}>Подписать
                              </button>
                              <button className="btn btn-primary" type="button" style={{marginLeft: '5px'}}
                                      onClick={this.hideSignBtns.bind(this)}>Назад
                              </button>
                          </div>
                          }
                        </div>
                        :
                          <div style={{paddingLeft:'5px', fontSize: '18px', textAlign:'center'}}>
                            <b>Выберите главного архитектора:</b>
                            <select id="gas_directors" style={{padding: '0px 4px', margin: '5px'}} value={this.state.apz_head_id} onChange={this.handleHeadIDChange.bind(this)}>
                              {this.state.apz_heads_id}
                            </select>
                            <div>
                              <button type="button" className="btn btn-raised btn-success" onClick={this.acceptDeclineApzForm.bind(this, apz.id, true, "")}>Отправить главному архитектору</button>
                            </div>
                          </div>
                      }
                    </div>
                  }
                  <div className="modal fade" id="ReturnApzForm" tabIndex="-1" role="dialog" aria-hidden="true">
                      <div className="modal-dialog" role="document">
                          <div className="modal-content">
                              <div className="modal-header">
                                  <h5 className="modal-title">Вернуть заявку на доработку</h5>
                                  <button type="button" id="uploadFileModalClose" className="close" data-dismiss="modal" aria-label="Close">
                                      <span aria-hidden="true">&times;</span>
                                  </button>
                              </div>
                              <div className="modal-body">
                                  <div className="form-group">
                                      <label htmlFor="docNumber">Комментарий</label>
                                      <input type="text" className="form-control" id="docNumber" placeholder="" value={this.state.description} onChange={this.onDescriptionChange} />
                                  </div>
                              </div>
                              <div className="modal-footer">
                                  <button type="button" className="btn btn-raised btn-success" style={{marginRight: '5px'}} onClick={this.acceptDeclineApzForm.bind(this, apz.id, false, this.state.description)}>Отправить</button>
                                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
              </div>

              {apz.state_history && apz.state_history.length > 0 &&
                <div>
                  <h5 className="block-title-2 mb-3 mt-3">Логи</h5>
                  <div className="border px-3 py-2">
                    {apz.state_history.map(function(state, index) {
                      return(
                        <div key={index}>
                          <p className="mb-0">{state.created_at}&emsp;{state.state.name} {state.receiver && '('+state.receiver+')'}</p>
                        </div>
                      );
                    })}
                  </div>
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
